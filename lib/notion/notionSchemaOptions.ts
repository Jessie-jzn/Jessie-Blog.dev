/**
 * 从「非官方 API」返回的 collection schema 中解析标签 / 分类的选项列表。
 *
 * 背景：
 * - 旧版列表拉取走 www.notion.so/api/v3，每条数据库行对应 block.value + schema；
 * - 单篇详情页里的 getSinglePostData / getPageProperties 仍依赖同一套 schema 来解析属性；
 * - 因此即使列表已改用官方 databases.query，详情页元数据仍需要本文件的 getTagOptions。
 *
 * 与 officialDatabaseOptions.ts 的区别：
 * - 本文件：输入为「内部 recordMap 里的 schema 对象」；
 * - officialDatabaseOptions：输入为官方 GetDatabaseResponse.properties。
 */
import SiteConfig from "@/site.config";
import * as Types from "@/lib/type";
import type { TagOption } from "@/lib/notion/getPageProperties";

/**
 * 从旧版 collection schema 中取出「标签」属性的 options 数组（含 name / color 等）。
 * 供 getPageProperties、getSinglePostData 在解析多选标签时使用。
 */
export const getTagOptions = (schema: Types.SchemaProp): TagOption[] => {
  if (!schema) return [];
  const tagSchema = Object.values(schema).find(
    (e) => e.name === SiteConfig.NOTION_PROPERTY_NAME.tags
  ) as { options?: TagOption[] } | undefined;

  return tagSchema?.options ?? [];
};

/**
 * 从旧版 collection schema 中取出「分类」属性的 options。
 * 仅被 getDataBaseListLegacy 使用（官方列表路径不需要）。
 */
export function getCategoryOptionsFromLegacySchema(
  schema: Types.SchemaProp
): Types.Category[] {
  if (!schema) return [];
  const categorySchema = Object.values(schema).find(
    (e) => e.name === SiteConfig.NOTION_PROPERTY_NAME.category
  ) as { options?: unknown[] } | undefined;
  return (categorySchema?.options || []) as Types.Category[];
}
