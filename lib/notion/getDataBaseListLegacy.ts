/**
 * 使用非官方 Notion Web API（NotionAPI / www.notion.so/api/v3）拉取整页 recordMap，
 * 再解析 collection、逐条 block 得到文章列表。
 *
 * 保留原因：
 * - 作为官方 databases.query 不可用时的回退（未配置 NOTION_POST_DATABASE_ID、或 USE_OFFICIAL_NOTION_LIST=false）；
 * - 行为与改造前 getDataBaseList 完全一致，便于对比排查问题。
 *
 * 性能：比官方列表慢、流量大，生产环境建议配置好官方 Integration + database id 后走 getDataBaseListOfficial。
 */
import getPage from "./getPage";
import getAllPageIds from "./getAllPageIds";
import getBlockInBatches from "./getBlockInBatches";
import getPageProperties from "./getPageProperties";
import getAllTagsList from "./getAllTagsList";
import { idToUuid } from "@/lib/notion-utils";
import SiteConfig from "@/site.config";
import * as Types from "@/lib/type";
import type { GetDataBaseListResult } from "@/lib/type";
import { getAllCategories } from "./getAllCategories";
import {
  getTagOptions,
  getCategoryOptionsFromLegacySchema,
} from "./notionSchemaOptions";

interface GetLatestPostsParams {
  allPages: Types.Post[];
  from: string;
  latestPostCount: number;
}

/**
 * 取最新 N 篇 Post（已发布），按最后编辑时间倒序。
 */
function getLatestPosts({
  allPages = [],
  from,
  latestPostCount,
}: GetLatestPostsParams) {
  return allPages
    .filter((page) => page.type === "Post" && page.status === "Published")
    .sort((a, b) => {
      const dateA = new Date(a.lastEditedDate ?? a.publishDate ?? 0).getTime();
      const dateB = new Date(b.lastEditedDate ?? b.publishDate ?? 0).getTime();
      return dateB - dateA;
    })
    .slice(0, latestPostCount);
}

/**
 * 旧版实现：与原先 getDataBaseList 默认导出逻辑相同。
 */
export default async function getDataBaseListLegacy({
  pageId,
  from,
  filter,
}: Types.NotionPageParamsProp): Promise<GetDataBaseListResult> {
  console.log("[getDataBaseListLegacy]", pageId, from);

  let allPages: Types.Post[] = [];
  let categoryOptions: Record<string, Types.Category | unknown> = {
    categoryMap: {},
    categoryList: [],
  };
  let tagOptions: Types.Tag[] = [];
  let pageIds: string[] = [];

  const pageRecordMap = await getPage({ pageId, from });

  if (!pageRecordMap) {
    console.error("can`t get Notion Data ; Which id is: ", pageId);
    return {} as GetDataBaseListResult;
  }

  let normalizedPageId = idToUuid(pageId);
  let block = pageRecordMap.block || {};

  const rawMetadata = block[normalizedPageId]?.value;

  const collection =
    (Object.values(pageRecordMap.collection)[0] as { value?: unknown })?.value ||
    {};
  const collectionId = rawMetadata?.collection_id;
  const collectionQuery = pageRecordMap.collection_query;
  const collectionView = pageRecordMap.collection_view;
  /** 无 schema 时用空对象，避免 undefined 传入 getPageProperties（与旧行为一致） */
  const schema = ((collection as { schema?: Types.SchemaProp }).schema ??
    {}) as Types.SchemaProp;

  const viewIds = rawMetadata?.view_ids;
  const collectionData: Types.Post[] = [];
  pageIds = getAllPageIds(
    collectionQuery,
    collectionId,
    collectionView,
    viewIds
  );

  if (pageIds?.length === 0) {
    console.error(
      "获取到的文章列表为空，请检查notion模板",
      collectionQuery,
      collection,
      collectionView,
      viewIds,
      pageRecordMap
    );
  }

  const blockIdsNeedFetch: string[] = [];
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i];
    const value = block[id]?.value;
    if (!value) {
      blockIdsNeedFetch.push(id);
    }
  }
  const fetchedBlocks = await getBlockInBatches(blockIdsNeedFetch);
  block = Object.assign({}, block, fetchedBlocks);

  const slugMap: Record<string, string> = {};

  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i];
    const value = block[id]?.value || fetchedBlocks[id]?.value;
    const properties =
      (await getPageProperties(
        id,
        value,
        schema,
        getTagOptions(schema)
      )) || null;

    if (properties) {
      collectionData.push(properties as Types.Post);
      if (properties.slug) {
        slugMap[properties.slug] = id;
      }
    }
  }

  allPages = collectionData.filter((post) => {
    return post && (post.status === "Published" || post.status === "P");
  });

  if (filter) {
    allPages = allPages.filter(filter);
  }

  categoryOptions = getAllCategories({
    allPages,
    categoryOptions: getCategoryOptionsFromLegacySchema(schema),
  });

  tagOptions =
    getAllTagsList({
      allPages: allPages as unknown as readonly Types.Post[],
      /** schema 下拉的 option 与 Types.Tag 结构相近，与官方路径、旧版一样用断言对齐 */
      tagOptions: getTagOptions(schema) as unknown as Types.Tag[],
    }) || [];

  const latestPosts = getLatestPosts({
    allPages: allPages as Types.Post[],
    from,
    latestPostCount: 6,
  });

  return {
    allPages,
    latestPosts,
    categoryMap: categoryOptions?.categoryMap as
      | Record<string, Types.Category>
      | undefined,
    categoryList: categoryOptions?.categoryList as Types.Category[] | undefined,
    tagOptions,
    pageIds,
    slugMap,
  };
}
