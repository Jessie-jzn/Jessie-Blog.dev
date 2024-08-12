/**
* 订阅邮件-服务端接口
* @param {*} email
* @returns
*/
export default function subscribeToMailchimpApi({ email, first_name = '', last_name = '' }) {
   
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

    if (!email || !listId || !apiKey) {
      return {}
    }
    const data = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: first_name,
        LNAME: last_name
      }
    }
    const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }
  