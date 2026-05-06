import type { NextApiRequest, NextApiResponse } from "next";
import { getStatsRedis } from "@/lib/stats/redis";
import { normalizeStatsPostId } from "@/lib/stats/postId";
import { fetchMailchimpMemberCount } from "@/lib/mailchimpAudience";

type Body = {
  views: number;
  viewsEnabled: boolean;
  subscribers: number | null;
};

/**
 * GET ?postId=：一次返回「该文阅读量 + 全站订阅人数」（用于文章页）。
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Body | { error: string }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const postIdRaw =
    typeof req.query.postId === "string" ? req.query.postId : "";
  const postId = normalizeStatsPostId(postIdRaw);

  const redis = getStatsRedis();
  let views = 0;

  if (postId && redis) {
    const raw = await redis.get(`post:views:${postId}`);
    views =
      typeof raw === "number"
        ? raw
        : parseInt(String(raw ?? "0"), 10) || 0;
  }

  const subscribers = await fetchMailchimpMemberCount();

  return res.status(200).json({
    views,
    viewsEnabled: !!redis,
    subscribers,
  });
}
