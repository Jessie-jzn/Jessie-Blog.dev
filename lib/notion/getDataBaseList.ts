import getPage from "./getPage";
import getAllPageIds from "./getAllPageIds";
import getBlockInBatches from "./getBlockInBatches";
import getPageProperties from "./getPageProperties";
import getAllTagsList from "./getAllTagsList";
import { idToUuid } from "notion-utils";
import SiteConfig from "../../site.config";

import * as Types from "@/lib/type";

/**
 * 获取数据库数据
 * @param param0
 * @returns
 */
export default async function getDataBaseList({
  pageId,
  from,
}: Types.NotionPageParamsProp) {
  console.log("[Fetching Data]", pageId, from);
  const pageRecordMap = await getPage({ pageId, from });

  if (!pageRecordMap) {
    console.error("can`t get Notion Data ; Which id is: ", pageId);
    return {};
  }

  pageId = idToUuid(pageId);
  let block = pageRecordMap.block || {};
  const rawMetadata = block[pageId]?.value;
  // Check Type Page-Database和Inline-Database
  // if (
  //   rawMetadata?.type !== 'collection_view_page' &&
  //   rawMetadata?.type !== 'collection_view'
  // ) {
  //   console.error(`pageId "${pageId}" is not a database`);
  //   return EmptyData(pageId);
  // }
  const collection =
    (Object.values(pageRecordMap.collection)[0] as any)?.value || {};
  const collectionId = rawMetadata?.collection_id;
  const collectionQuery = pageRecordMap.collection_query;
  const collectionView = pageRecordMap.collection_view;
  const schema = collection?.schema;

  const viewIds = rawMetadata?.view_ids;
  const collectionData = [];
  const pageIds = getAllPageIds(
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
  // 抓取主数据库最多抓取1000个blocks，溢出的数block这里统一抓取一遍
  const blockIdsNeedFetch = [];
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i];
    const value = block[id]?.value;
    if (!value) {
      blockIdsNeedFetch.push(id);
    }
  }
  const fetchedBlocks = await getBlockInBatches(blockIdsNeedFetch);
  block = Object.assign({}, block, fetchedBlocks);

  // 获取每篇文章基础数据
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i];
    const value = block[id]?.value || fetchedBlocks[id]?.value;
    const properties =
      (await getPageProperties(id, value, schema, getTagOptions(schema))) ||
      null;

    if (properties) {
      collectionData.push(properties);
    }
  }

  // 文章计数
  let postCount = 0;

  // 查找所有的Post和Page
  const allPages = collectionData.filter((post) => {
    if (
      post?.type === "Post" &&
      (post.status === "Published" || post.status === "P")
    ) {
      postCount++;
    }
    return post && (post.status === "Published" || post.status === "P");
  });

  // 所有标签
  const tagOptions =
    getAllTagsList({
      allPages,
      tagOptions: getTagOptions(schema),
    }) || [];

  return { allPages, tagOptions, pageIds };
}

/**
 * 获取标签选项
 * @param schema
 * @returns {undefined}
 */
const getTagOptions = (schema: Types.SchemaProp) => {
  if (!schema) return {};
  const tagSchema = Object.values(schema).find(
    (e) => e.name === SiteConfig.NOTION_PROPERTY_NAME.tags
  ) as any;

  return tagSchema?.options || [];
};
