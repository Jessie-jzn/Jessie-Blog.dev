import type { NextApiRequest, NextApiResponse } from "next";
import { fetchMailchimpMemberCount } from "@/lib/mailchimpAudience";

type Body = { count: number | null; source: "mailchimp" | "none" };

/**
 * GET：返回 Mailchimp 列表当前订阅人数（需 MAILCHIMP_* 环境变量与订阅接口一致）。
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Body>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ count: null, source: "none" });
  }

  const count = await fetchMailchimpMemberCount();
  return res.status(200).json({
    count,
    source: count != null ? "mailchimp" : "none",
  });
}
