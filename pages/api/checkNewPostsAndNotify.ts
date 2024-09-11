import type { NextApiRequest, NextApiResponse } from 'next'
import mailchimp from '@mailchimp/mailchimp_marketing'
import getDataBaseList from '@/lib/notion/getDataBaseList'
import { NOTION_POST_ID, NOTION_NOTIFICATIONS_ID } from '@/lib/constants'
import nodemailer from 'nodemailer'
import { Client } from '@notionhq/client'

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
})

const notion = new Client({ auth: process.env.NOTION_API_KEY })

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secretKey = req.headers['x-secret-key']
  if (secretKey !== process.env.CRON_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const response = await getDataBaseList({
      pageId: NOTION_POST_ID,
      from: 'post-index',
    })

    const lastCheckDate = new Date(process.env.LAST_CHECK_DATE || '1970-01-01')
    const newPosts = response.allPages?.filter(post => new Date(post.publishDay) > lastCheckDate) || []

    const subscribersList = await mailchimp.lists.getListMembersInfo(process.env.MAILCHIMP_AUDIENCE_ID!)

    for (const member of subscribersList.members) {
      const userNotification = await getUserNotification(member.email_address)
      const lastNotifiedTime = userNotification ? new Date(userNotification.properties['Last Notified Time'].date.start) : new Date(0)

      const unnotifiedPosts = newPosts.filter(post => 
        new Date(post.publishDay) > lastNotifiedTime && 
        (!userNotification || !userNotification.properties['Notified Post IDs'].multi_select.map((item: { name: any }) => item.name).includes(post.id))
      )

      if (unnotifiedPosts.length > 0) {
        await sendNewPostsEmail(member.email_address, unnotifiedPosts)
        await updateUserNotification(member.email_address, unnotifiedPosts)
      }
    }

    process.env.LAST_CHECK_DATE = new Date().toISOString()

    res.status(200).json({ message: 'Check completed' })
  } catch (error: any) {
    console.error('Error checking new posts:', error)
    res.status(500).json({ error: error.message || error.toString() })
  }
}

async function getUserNotification(email: string) {
  const response = await notion.databases.query({
    database_id: NOTION_NOTIFICATIONS_ID,
    filter: {
      property: 'Email',
      rich_text: {
        equals: email
      }
    }
  })
  return response.results[0]
}

async function updateUserNotification(email: string, newPosts: any[]) {
  const existingNotification = await getUserNotification(email)
  const notifiedPostIds = newPosts.map(post => ({ name: post.id }))

  if (existingNotification) {
    await notion.pages.update({
      page_id: existingNotification.id,
      properties: {
        'Last Notified Time': { date: { start: new Date().toISOString() } },
        'Notified Post IDs': {
          multi_select: [
            ...existingNotification.properties['Notified Post IDs'].multi_select,
            ...notifiedPostIds
          ]
        }
      }
    })
  } else {
    await notion.pages.create({
      parent: { database_id: NOTION_NOTIFICATIONS_ID },
      properties: {
        'Email': { title: [{ text: { content: email } }] },
        'Last Notified Time': { date: { start: new Date().toISOString() } },
        'Notified Post IDs': { multi_select: notifiedPostIds }
      }
    })
  }
}

async function sendNewPostsEmail(email: string, newPosts: any[]) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'New Posts on Our Blog!',
    html: `
      <h1>New Posts on Our Blog</h1>
      <p>Check out our latest articles:</p>
      <ul>
        ${newPosts.map(post => `
          <li>
            <a href="${process.env.SITE_URL}/${post.category}/${post.id}">${post.title}</a>
          </li>
        `).join('')}
      </ul>
    `,
  }

  await transporter.sendMail(mailOptions)
}