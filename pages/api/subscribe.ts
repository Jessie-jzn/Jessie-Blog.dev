import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { subscribeToMailchimpApi } from "@/lib/mailchimp";

interface ApiResponse {
  status: "success" | "error";
  message: string;
  error?: string;
}

/**
 * 接受邮件订阅
 * @param {NextApiRequest} req
 * @param {NextApiResponse<ApiResponse>} res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === "POST") {
    const { email, firstName, lastName } = req.body;
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
    const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    if (!email) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is required." });
    }
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `api_key ${API_KEY}`,
      },
    };
    const data = {
      email_address: email,
      status: "subscribed",
    };

    try {
      //   const response = await subscribeToMailchimpApi({
      //     email,
      //     first_name: firstName,
      //     last_name: lastName,
      //   });
      const response = await axios.post(url, data, options);
      if (response.status == 200) {
        return res.status(201).json({
          message: "Awesome! You have successfully subscribed!",
          status: "success",
        });
      }
      debugger;

      if (!response) {
        throw new Error("Mailchimp API returned undefined response.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Mailchimp API error: ${errorData.detail || "Unknown error"}`
        );
      }

      res
        .status(200)
        .json({ status: "success", message: "Subscription successful!" });
    } catch (error) {
      console.error("Error subscribing to Mailchimp:", error);
      res.status(500).json({
        status: "error",
        message: "Subscription failed!",
        error: (error as Error).message,
      });
    }
  } else {
    res.status(405).json({ status: "error", message: "Method not allowed" });
  }
}
