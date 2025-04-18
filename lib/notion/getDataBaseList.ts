import getPage from "./getPage";
import getAllPageIds from "./getAllPageIds";
import getBlockInBatches from "./getBlockInBatches";
import getPageProperties from "./getPageProperties";
import getAllTagsList from "./getAllTagsList";
import { idToUuid } from "@/lib/notion-utils";
import SiteConfig from "@/site.config";
import * as Types from "@/lib/type";
import { getAllCategories } from "./getAllCategories";

/**
 * 获取数据库数据
 * @param pageId 页面ID
 * @param from 来源信息
 * @returns 返回包含所有页面、标签选项和页面ID的对象
 */
export default async function getDataBaseList({
  pageId,
  from,
  filter,
}: Types.NotionPageParamsProp) {
  console.log("[Fetching Data]", pageId, from);
  // 初始化 allPages、categoryOptions、tagOptions 和 pageIds
  let allPages = []; // 示例初始化
  let categoryOptions: Record<string, Types.Category | any> = {
    categoryMap: {}, // 示例初始化
    categoryList: [], // 示例初始化
  };
  let tagOptions = []; // 示例初始化
  let pageIds: string[] = []; // 示例初始化

  // 获取页面记录映射
  const pageRecordMap = await getPage({ pageId, from });

  // 如果无法获取页面记录，输出错误并返回空对象
  if (!pageRecordMap) {
    console.error("can`t get Notion Data ; Which id is: ", pageId);
    return {};
  }
  // 将页面ID转换为UUID格式
  pageId = idToUuid(pageId);
  let block = pageRecordMap.block || {};

  // console.log("pageRecordMap", pageRecordMap);
  // console.log("block", block);

  // 获取原始元数据
  const rawMetadata = block[pageId]?.value;
  // console.log("rawMetadata", rawMetadata);

  // Check Type Page-Database和Inline-Database
  // if (
  //   rawMetadata?.type !== 'collection_view_page' &&
  //   rawMetadata?.type !== 'collection_view'
  // ) {
  //   console.error(`pageId "${pageId}" is not a database`);
  //   return EmptyData(pageId);
  // }
  // 获取集合信息
  const collection =
    (Object.values(pageRecordMap.collection)[0] as any)?.value || {};
  const collectionId = rawMetadata?.collection_id;
  const collectionQuery = pageRecordMap.collection_query;
  const collectionView = pageRecordMap.collection_view;
  const schema = collection?.schema;

  // 获取视图ID和页面ID
  const viewIds = rawMetadata?.view_ids;
  const collectionData = [];
  pageIds = getAllPageIds(
    collectionQuery,
    collectionId,
    collectionView,
    viewIds
  );

  // 如果没有获取到页面ID，输出错误信息
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

  const slugMap: Record<string, string> = {}; // 新增 slug 映射

  // 获取每篇文章基础数据
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i];
    const value = block[id]?.value || fetchedBlocks[id]?.value;
    const properties =
      (await getPageProperties(id, value, schema, getTagOptions(schema))) ||
      null;

    if (properties) {
      collectionData.push(properties);
      // console.log("propertiespropertiespropertiesproperties", properties);
      // 如果存在 slug，则添加到映射中
      // console.log("properties.slug", properties.slug);
      if (properties.slug) {
        slugMap[properties.slug] = id;
      }
    }
  }

  // 文章计数
  let postCount = 0;

  // 查找所有的Post和Page
  allPages = collectionData.filter((post) => {
    if (
      post?.type === "Post" &&
      (post.status === "Published" || post.status === "P")
    ) {
      postCount++;
    }
    return post && (post.status === "Published" || post.status === "P");
  });

  // 应用传入的过滤器
  if (filter) {
    allPages = allPages.filter(filter);
  }

  // 所有分类
  categoryOptions = getAllCategories({
    allPages,
    categoryOptions: getCategoryOptions(schema),
  });

  // 所有标签
  tagOptions =
    getAllTagsList({
      allPages: allPages as unknown as readonly Types.Post[],
      tagOptions: getTagOptions(schema),
    }) || [];

  const latestPosts = getLatestPosts({
    allPages: allPages as Types.Post[],
    from,
    latestPostCount: 6,
  });

  // 返回包含所有页面、标签选项和页面ID的对象
  return {
    allPages,
    latestPosts,
    categoryMap: categoryOptions?.categoryMap,
    categoryList: categoryOptions?.categoryList,
    tagOptions,
    pageIds,
    slugMap, // 返回 slug 映射
  };
}

/**
 * 获取标签选项
 * @param schema
 * @returns {undefined}
 */
export const getTagOptions = (schema: Types.SchemaProp) => {
  if (!schema) return {};
  // 查找标签模式
  const tagSchema = Object.values(schema).find(
    (e) => e.name === SiteConfig.NOTION_PROPERTY_NAME.tags
  ) as any;

  return tagSchema?.options || [];
};

/**
 * 获取分类选项
 * @param schema
 * @returns {{}|*|*[]}
 */
function getCategoryOptions(schema: Types.SchemaProp) {
  if (!schema) return {};
  const categorySchema = Object.values(schema).find(
    (e) => e.name === SiteConfig.NOTION_PROPERTY_NAME.category
  ) as any;
  return categorySchema?.options || [];
}

/**
 * 获取最新文章，根据最后修改时间倒序排列
 * @param {Object} param0 - 参数对象
 * @param {Array} param0.allPages - 所有页面数据
 * @param {string} param0.from - 来源标识
 * @param {number} param0.latestPostCount - 最新文章数量
 * @returns {Array} - 最新文章列表
 */
interface GetLatestPostsParams {
  allPages: Types.Post[];
  from: string;
  latestPostCount: number;
}

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
