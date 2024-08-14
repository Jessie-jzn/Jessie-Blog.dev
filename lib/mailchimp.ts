interface SubscribeToMailchimpApiParams {
  email: string;
  first_name?: string;
  last_name?: string;
}

interface SubscribeToNewsletterResponse {
  success: boolean;
  message: string;
}

/**
 * 订阅邮件 - 服务端接口
 * @param {SubscribeToMailchimpApiParams} params
 * @returns {Promise<Response | undefined>}
 */
export async function subscribeToMailchimpApi({
  email,
  first_name = "",
  last_name = "",
}: SubscribeToMailchimpApiParams): Promise<Response | undefined> {
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
  const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
  const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

  if (!email || !AUDIENCE_ID || !API_KEY) {
    console.error("Missing required fields: email, listId, or apiKey.");
    return undefined;
  }

  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: first_name,
      LNAME: last_name,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `apikey ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("responseresponseresponseresponse", response);
    debugger;

    if (!response.ok) {
      throw new Error(`Mailchimp API error: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error("Error subscribing to Mailchimp:", error);
    return undefined;
  }
}

/**
 * 客户端接口
 * @param {string} email
 * @param {string} [firstName]
 * @param {string} [lastName]
 * @returns {Promise<SubscribeToNewsletterResponse>}
 */
export async function subscribeToNewsletter(
  email: string,
  firstName: string = "",
  lastName: string = ""
): Promise<SubscribeToNewsletterResponse> {
  try {
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        // first_name: firstName,
        // last_name: lastName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Subscription failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, message: "Subscription successful!" };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return {
      success: false,
      message: "Subscription failed. Please try again.",
    };
  }
}
