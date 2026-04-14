/**
 * 从官方 `databases.retrieve` 的响应里解析 multi_select / select 的选项列表，
 * 形状上对齐旧版 collection schema 里 options 数组，供 getAllTagsList / getAllCategories 使用。
 */
import type { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import SiteConfig from "@/site.config";

export function getTagOptionsFromOfficialDatabase(
  db: GetDatabaseResponse
): { id: string; value: string; color: string }[] {
  if (!("properties" in db) || !db.properties) return [];
  const name = SiteConfig.NOTION_PROPERTY_NAME.tags;
  for (const prop of Object.values(db.properties)) {
    const p = prop as { name?: string; type?: string; multi_select?: { options: Array<{ name: string; color: string }> } };
    if (p.name === name && p.type === "multi_select" && p.multi_select?.options) {
      return p.multi_select.options.map((o) => ({
        id: o.name,
        value: o.name,
        color: o.color,
      }));
    }
  }
  return [];
}

/** 与旧版 schema 里 category options 数组形态对齐，供 getAllCategories 使用 */
export function getCategoryOptionsFromOfficialDatabase(
  db: GetDatabaseResponse
): { id: string; value: string; color: string }[] {
  if (!("properties" in db) || !db.properties) return [];
  const name = SiteConfig.NOTION_PROPERTY_NAME.category;
  for (const prop of Object.values(db.properties)) {
    const p = prop as { name?: string; type?: string; select?: { options: Array<{ name: string; color: string }> } };
    if (p.name === name && p.type === "select" && p.select?.options) {
      return p.select.options.map((o) => ({
        id: o.name,
        value: o.name,
        color: o.color,
      }));
    }
  }
  return [];
}
