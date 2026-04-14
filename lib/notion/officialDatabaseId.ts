/**
 * 将业务里使用的「页面 ID」环境变量（NOTION_POST_ID 等）映射为官方 API 所需的 database_id。
 *
 * 为什么要分开两个 ID？
 * - `NOTION_POST_ID`：历史上指向「包含数据库的页面」或用于旧版 api/v3 的定位，代码里到处当 pageId 传；
 * - `NOTION_POST_DATABASE_ID`：官方 `databases.query` 需要的是「数据库」本身的 UUID。
 * 在 Notion 里二者可能相同也可能不同（全页数据库 vs 内嵌数据库），因此用本模块显式映射。
 *
 * 英文库 NOTION_POST_EN_ID：若与主库共用同一数据库，映射到同一个 NOTION_POST_DATABASE_ID。
 */
import {
  NOTION_GUIDE_DATABASE_ID,
  NOTION_POST_DATABASE_ID,
  NOTION_POST_ID,
  NOTION_POST_EN_ID,
  NOTION_GUIDE_ID,
} from "@/lib/constants";
import { parsePageId } from "@/lib/notion-utils";

/**
 * 规范化 env 中的 database id（支持带或不带连字符的 32 位 hex）。
 */
function normalizeDbId(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const uuid = parsePageId(raw, { uuid: true });
  return uuid || raw;
}

/**
 * 根据 getDataBaseList({ pageId }) 传入的 pageId，返回官方 Integration 可用的 database_id。
 * 若无法识别（未配置映射或 pageId 不匹配），返回 undefined，此时门面会回退到 legacy 列表。
 */
export function getOfficialDatabaseIdForPage(pageId: string): string | undefined {
  const norm = parsePageId(pageId, { uuid: true });
  if (!norm) return undefined;

  const postPage = NOTION_POST_ID
    ? parsePageId(NOTION_POST_ID, { uuid: true })
    : null;
  const postEnPage = NOTION_POST_EN_ID
    ? parsePageId(NOTION_POST_EN_ID, { uuid: true })
    : null;
  const guidePage = NOTION_GUIDE_ID
    ? parsePageId(NOTION_GUIDE_ID, { uuid: true })
    : null;

  if (postPage && norm === postPage) {
    return normalizeDbId(NOTION_POST_DATABASE_ID);
  }
  if (postEnPage && norm === postEnPage) {
    return normalizeDbId(NOTION_POST_DATABASE_ID);
  }
  if (guidePage && norm === guidePage) {
    return normalizeDbId(NOTION_GUIDE_DATABASE_ID);
  }
  return undefined;
}
