import type { NextApiRequest, NextApiResponse } from 'next'
import mailchimp from '@mailchimp/mailchimp_marketing'

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, firstName, lastName } = req.body

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID!, {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    })

    return res.status(201).json({ error: '' })
  } catch (error: any) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
