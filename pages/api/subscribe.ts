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
    const { email, firstName = "", lastName = "" } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is required." });
    }

    try {
      console.log("Request received:", { email, firstName, lastName });

      const response = await subscribeToMailchimpApi({
        email,
        first_name: firstName,
        last_name: lastName,
      });

      if (!response) {
        console.error("No response from Mailchimp API");
        throw new Error("Mailchimp API returned undefined response.");
      }

      // 解析 response body 并获取详细的错误信息
      const responseData = await response.json();

      if (!response.ok) {
        console.error("Mailchimp API error response:", responseData); // 打印详细的错误信息
        res.status(400).json({
          status: "error",
          message: "Subscription failed!",
          error: responseData.detail || "Unknown error",
        });
        return;
      }

      res
        .status(200)
        .json({ status: "success", message: "Subscription successful!" });
    } catch (error) {
      console.error("Error in handler:", error);
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
