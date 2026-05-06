import { Redis } from "@upstash/redis";

/** 懒加载；未配置环境变量时为 null（阅读量功能关闭，订阅人数仍可走 Mailchimp）。 */
let client: Redis | null | undefined;

export function getStatsRedis(): Redis | null {
  if (client !== undefined) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    client = null;
    return null;
  }
  client = new Redis({ url, token });
  return client;
}
