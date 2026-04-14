/**
 * 将官方 API 返回的 `PageObjectResponse`（properties 为强类型结构）
 * 转换为站内 `Post` / getPageProperties 使用的松散对象，便于与 getAllCategories、列表卡片等复用。
 *
 * 字段名来源：`site.config` 中的 `NOTION_PROPERTY_NAME`（与 Notion 数据库列名一致）。
 * 若某列为空或未设置，这里给出与旧版解析尽量一致的默认值。
 */
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import SiteConfig from "@/site.config";
import { mapProperties } from "@/lib/notion/getPageProperties";
import { formatDate, formatTimestampToDate } from "@/lib/util";

function plainRichText(
  blocks: { plain_text: string }[] | null | undefined
): string {
  return (blocks ?? []).map((b) => b.plain_text).join("");
}

function convertToJSON(str: string): Record<string, unknown> {
  if (!str) return {};
  try {
    return JSON.parse(str.replace(/\s/g, ""));
  } catch {
    return {};
  }
}

/**
 * 将官方 `databases.query` 返回的页面对象转为与旧版 getPageProperties 接近的结构。
 */
export function mapOfficialDatabasePageToProperties(
  page: PageObjectResponse,
  tagOptions: { value: string; color: string }[]
): Record<string, unknown> {
  const N = SiteConfig.NOTION_PROPERTY_NAME;
  const p = page.properties;

  const getProp = (name: string) => p[name];

  const titleProp = getProp(N.title);
  const title =
    titleProp?.type === "title" ? plainRichText(titleProp.title) : "";

  const typeProp = getProp(N.type);
  const typeRaw =
    typeProp?.type === "select" ? typeProp.select?.name ?? "" : "";

  const statusProp = getProp(N.status);
  const statusRaw =
    statusProp?.type === "select" ? statusProp.select?.name ?? "" : "";

  const catProp = getProp(N.category);
  const catRaw =
    catProp?.type === "select" ? catProp.select?.name ?? "" : "";

  const tagsProp = getProp(N.tags);
  const tags: string[] =
    tagsProp?.type === "multi_select"
      ? tagsProp.multi_select.map((t: { name: string }) => t.name)
      : [];

  const dateProp = getProp(N.date);
  let date: { start_date?: string } | null = null;
  if (dateProp?.type === "date" && dateProp.date?.start) {
    date = { start_date: dateProp.date.start.split("T")[0] };
  }

  let slug = "";
  const slugProp = p.slug;
  if (slugProp?.type === "rich_text") {
    slug = plainRichText(slugProp.rich_text);
  } else if (slugProp?.type === "url") {
    slug = slugProp.url ?? "";
  }

  const summaryProp = getProp(N.summary);
  const summary =
    summaryProp?.type === "rich_text"
      ? plainRichText(summaryProp.rich_text)
      : "";

  const summarizeProp = getProp(N.summarize);
  const summarize =
    summarizeProp?.type === "rich_text"
      ? plainRichText(summarizeProp.rich_text)
      : "";

  const extProp = getProp(N.ext);
  const extStr =
    extProp?.type === "rich_text" ? plainRichText(extProp.rich_text) : "";

  const properties: Record<string, unknown> = {
    id: page.id,
    [N.title]: title,
    [N.type]: typeRaw ? [typeRaw] : [""],
    [N.status]: statusRaw ? [statusRaw] : [""],
    [N.category]: catRaw ? [catRaw] : [""],
    [N.tags]: tags,
    date,
    slug,
    [N.summary]: summary,
    [N.summarize]: summarize,
  };

  properties.type = (properties.type as string[])?.[0] ?? "";
  properties.status = (properties.status as string[])?.[0] ?? "";
  properties.category = (properties.category as string[])?.[0] ?? "";

  mapProperties(properties as Parameters<typeof mapProperties>[0]);

  const created = (page as { created_time?: string }).created_time;
  const lastEdited = page.last_edited_time;

  properties.publishDate = new Date(
    (date?.start_date as string) || created || Date.now()
  ).getTime();
  properties.publishDay = formatDate(
    new Date(properties.publishDate as number),
    SiteConfig.language
  );
  properties.lastEditedDate = formatTimestampToDate(lastEdited);
  properties.lastEditedDay = formatDate(
    new Date(lastEdited),
    SiteConfig.language
  );
  properties.fullWidth = false;

  const icon = page.icon;
  if (icon?.type === "emoji") {
    properties.pageIcon = icon.emoji;
  } else if (icon?.type === "external") {
    properties.pageIcon = icon.external.url;
  } else if (icon?.type === "file") {
    properties.pageIcon = icon.file.url;
  } else {
    properties.pageIcon = "";
  }

  const cover = page.cover;
  let coverUrl = "";
  if (cover?.type === "external") coverUrl = cover.external.url;
  else if (cover?.type === "file") coverUrl = cover.file.url;
  if (coverUrl.startsWith("/")) {
    coverUrl = SiteConfig.NOTION_HOST + coverUrl;
  }
  properties.pageCover = coverUrl;
  properties.pageCoverThumbnail = coverUrl;

  properties.ext = convertToJSON(extStr);
  properties.tagItems = (tags as string[]).map((tag) => ({
    name: tag,
    color: tagOptions.find((t) => t.value === tag)?.color || "",
  }));
  properties.slug = slug;

  return properties;
}
