/**
 * 官方 Notion JavaScript SDK 单例（@notionhq/client）。
 *
 * 用途：
 * - databases.query / databases.retrieve / pages.retrieve 等正式 REST API；
 * 与 `lib/notion/NotionAPI.ts`（www.notion.so/api/v3）完全独立。
 *
 * 鉴权：
 * - 使用 Integration 的 token（环境变量 NOTION_API_KEY，在 lib/constants 里导出为 NOTION_TOKEN）；
 * - 支持 `secret_...` 或 Notion 新版 `ntn_...` 等前缀，以你 Workspace 里 Integration 页面显示为准。
 *
 * 权限：
 * - 必须在 Notion 中将目标「数据库」页面连接到该 Integration（Share → Invite），
 *   否则 databases.query 会返回 403 / object_not_found。
 */
import { Client } from "@notionhq/client";
import { NOTION_TOKEN } from "@/lib/constants";

let client: Client | null = null;

/**
 * 懒初始化单例，避免在模块加载时因缺少环境变量而直接抛错（仅在首次调用时校验）。
 */
export function getNotionOfficialClient(): Client {
  if (!client) {
    if (!NOTION_TOKEN) {
      throw new Error(
        "NOTION_API_KEY is not set — 官方 API 需要 Notion Integration 的密钥"
      );
    }
    client = new Client({ auth: NOTION_TOKEN });
  }
  return client;
}
