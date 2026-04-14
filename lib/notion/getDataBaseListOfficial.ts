/**
 * 使用官方 `databases.query` 拉取整个数据库的所有页面行，并映射为站内统一的 `Post` 结构。
 *
 * 流程概要：
 * 1. databases.retrieve —— 读取库属性定义，解析标签/分类的选项（颜色等），与旧版 schema 对齐；
 * 2. databases.query 分页（page_size=100）—— 拉取所有页面；
 * 3. mapOfficialDatabasePageToProperties —— 将每条 PageObjectResponse 转为与 getPageProperties 接近的字段；
 * 4. getAllCategories / getAllTagsList —— 与 legacy 共用，保证首页、标签页、分类页行为一致。
 *
 * 参数 `from` 保留仅为与 legacy 签名一致，便于日志；核心查询不依赖它。
 */
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import * as Types from "@/lib/type";
import type { GetDataBaseListResult } from "@/lib/type";
import { getNotionOfficialClient } from "@/lib/notion/notionOfficialClient";
import {
  getTagOptionsFromOfficialDatabase,
  getCategoryOptionsFromOfficialDatabase,
} from "@/lib/notion/officialDatabaseOptions";
import { mapOfficialDatabasePageToProperties } from "@/lib/notion/mapOfficialDatabasePage";
import { getAllCategories } from "@/lib/notion/getAllCategories";
import getAllTagsList from "@/lib/notion/getAllTagsList";

/** 与 getDataBaseListLegacy 中逻辑一致：取最近发布的 Post。`from` 不参与排序，仅保留参数对称。 */
function getLatestPosts({
  allPages = [],
  from,
  latestPostCount,
}: {
  allPages: Types.Post[];
  from: string;
  latestPostCount: number;
}) {
  return allPages
    .filter((page) => page.type === "Post" && page.status === "Published")
    .sort((a, b) => {
      const dateA = new Date(a.lastEditedDate ?? a.publishDate ?? 0).getTime();
      const dateB = new Date(b.lastEditedDate ?? b.publishDate ?? 0).getTime();
      return dateB - dateA;
    })
    .slice(0, latestPostCount);
}

export default async function getDataBaseListOfficial({
  databaseId,
  from,
  filter,
}: {
  databaseId: string;
  from: string;
  filter?: (post: Types.Post) => boolean;
}): Promise<GetDataBaseListResult> {
  const notion = getNotionOfficialClient();

  // 一次 retrieve：拿到属性名与 multi_select/select 的选项，供标签颜色、分类列表使用
  const db = await notion.databases.retrieve({
    database_id: databaseId,
  });

  const tagOptions = getTagOptionsFromOfficialDatabase(db);
  const categoryOptionList = getCategoryOptionsFromOfficialDatabase(db);

  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const r of res.results) {
      if ("properties" in r && r.object === "page") {
        pages.push(r as PageObjectResponse);
      }
    }
    cursor = res.has_more ? res.next_cursor ?? undefined : undefined;
  } while (cursor);

  const pageIds = pages.map((p) => p.id);
  const collectionData = pages.map((page) =>
    mapOfficialDatabasePageToProperties(page, tagOptions)
  ) as unknown as Types.Post[];

  let allPages = collectionData.filter((post) => {
    return post && (post.status === "Published" || post.status === "P");
  });

  if (filter) {
    allPages = allPages.filter(filter);
  }

  const categoryOptions = getAllCategories({
    allPages,
    categoryOptions: categoryOptionList as unknown as Types.Category[],
  });

  const tagOpts =
    getAllTagsList({
      allPages,
      tagOptions: tagOptions as unknown as Types.Tag[],
    }) || [];

  const latestPosts = getLatestPosts({
    allPages: allPages as Types.Post[],
    from,
    latestPostCount: 6,
  });

  const slugMap: Record<string, string> = {};
  for (const post of allPages) {
    if (post.slug) {
      slugMap[post.slug] = post.id;
    }
  }

  return {
    allPages,
    latestPosts,
    categoryMap: categoryOptions?.categoryMap,
    categoryList: categoryOptions?.categoryList,
    tagOptions: tagOpts,
    pageIds,
    slugMap,
  };
}
