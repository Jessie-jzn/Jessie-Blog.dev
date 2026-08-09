/**
 * 文章阅读量接口：在 Upstash Redis 中查询或累计指定文章的浏览次数。
 */
import type { NextApiRequest, NextApiResponse } from "next";
import { getStatsRedis } from "@/lib/stats/redis";
import { normalizeStatsPostId } from "@/lib/stats/postId";

type ResBody =
  | { views: number; enabled: boolean }
  | { error: string };

/**
 * POST：为文章记一次浏览（需在客户端用 sessionStorage 去重）。
 * GET：查询当前浏览量。
 * 依赖环境变量：UPSTASH_REDIS_REST_URL、UPSTASH_REDIS_REST_TOKEN（Upstash Redis）。
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResBody>
) {
  const redis = getStatsRedis();
  const enabled = !!redis;

  const postIdFromQuery =
    typeof req.query.postId === "string" ? req.query.postId : "";
  let postId = normalizeStatsPostId(postIdFromQuery);

  if (req.method === "POST") {
    const body = req.body as { postId?: string } | undefined;
    const fromBody = typeof body?.postId === "string" ? body.postId : "";
    postId = normalizeStatsPostId(fromBody || postIdFromQuery);
  }

  if (!postId) {
    return res.status(400).json({ error: "postId required" });
  }

  const key = `post:views:${postId}`;

  if (req.method === "GET") {
    if (!redis) {
      return res.status(200).json({ views: 0, enabled: false });
    }
    const raw = await redis.get(key);
    const views =
      typeof raw === "number"
        ? raw
        : parseInt(String(raw ?? "0"), 10) || 0;
    return res.status(200).json({ views, enabled: true });
  }

  if (req.method === "POST") {
    if (!redis) {
      return res.status(200).json({ views: 0, enabled: false });
    }
    const views = await redis.incr(key);
    return res.status(200).json({ views, enabled: true });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
