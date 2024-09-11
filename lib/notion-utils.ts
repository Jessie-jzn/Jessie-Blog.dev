import SiteConfig from "@/site.config";
import { defaultMapImageUrl } from "react-notion-x";
import {
  parsePageId,
  uuidToId,
} from "notion-utils";
import { Block, ExtendedRecordMap, Decoration, DateFormat } from "notion-types";

/**
 * 映射图片 URL
 * @param {string} url - 原始图片 URL
 * @param {Block} block - 包含图片的 Notion 块
 * @returns {string} 映射后的图片 URL
 */
export const mapImageUrl = (url: string, block: Block) => {
  if (
    url === SiteConfig.defaultPageCover ||
    url === SiteConfig.defaultPageIcon
  ) {
    return url;
  }

  return defaultMapImageUrl(url, block);
};

/**
 * 创建 URL
 * @param path 路径
 * @param searchParams URL 搜索参数
 * @returns 完整的 URL 字符串
 */
const createUrl = (path: string, searchParams: URLSearchParams) => {
  return [path, searchParams.toString()].filter(Boolean).join("?");
};

/**
 * 将页面 ID 映射到相应的 URL。
 * @param recordMap 包含页面信息的记录映射。
 * @param searchParams 要附加到 URL 的搜索参数。
 * @returns 一个函数，该函数接受一个页面 ID 并返回其相应的 URL。
 */
export const mapPageUrl =
  (recordMap: ExtendedRecordMap, searchParams: URLSearchParams) =>
  (pageId = ""): string => {
    const pageUuid = parsePageId(pageId, { uuid: true });

    if (uuidToId(pageUuid) === SiteConfig.Notion_ROOT_PAGE_Id) {
      return createUrl("/", searchParams);
    } else {
      const canonicalPageId = getCanonicalPageId(pageUuid, recordMap);
      const block = recordMap.block[pageId]?.value;

      // 获取页面所属的数据库 ID
      const databaseId = block.parent_id;
      // 查找数据库对应的路由前缀
      const routePrefix = SiteConfig.databaseMapping[databaseId] || '';

      if (routePrefix) {
        return createUrl(`/${routePrefix}/post/${canonicalPageId}`, searchParams);
      } else {
        return createUrl(`/post/${canonicalPageId}`, searchParams);
      }
    }
  };

/**
 * 获取页面的规范 ID
 * @param pageId 页面 ID
 * @param recordMap 包含页面信息的记录映射
 * @returns 规范的页面 ID
 */
const getCanonicalPageId = (
  pageId: string,
  recordMap: ExtendedRecordMap
): string => {
  const cleanPageId = parsePageId(pageId, { uuid: false });
  if (!cleanPageId) {
    return pageId;
  }

  const canonicalPageId = getCanonicalPageIdImpl(pageId, recordMap);
  return canonicalPageId || cleanPageId;
};

/**
 * 获取页面的规范 ID 实现
 * @param pageId 页面 ID
 * @param recordMap 包含页面信息的记录映射
 * @param options 选项
 * @returns 规范的页面 ID 或 null
 */
export const getCanonicalPageIdImpl = (
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null => {
  if (!pageId || !recordMap) return null;

  const id = uuidToId(pageId);
  const block = recordMap.block[pageId]?.value;

  if (block) {
    const slug =
      (getPageProperty('slug', block, recordMap) as string | null) ||
      (getPageProperty('Slug', block, recordMap) as string | null) ||
      normalizeTitle(getBlockTitle(block, recordMap));

    if (slug) {
      if (uuid) {
        return `${slug}-${id}`;
      } else {
        return slug;
      }
    }
  }

  return id;
};

/**
 * 规范化标题
 * @param title 标题字符串
 * @returns 规范化后的标题字符串
 */
export const normalizeTitle = (title?: string | null): string => {
  return (title || '')
    .replace(/ /g, '-')
    .replace(
      /[^a-zA-Z0-9-\u4e00-\u9FFF\u3041-\u3096\u30A1-\u30FC\u3000-\u303F]/g,
      ''
    )
    .replace(/--/g, '-')
    .replace(/-$/, '')
    .replace(/-/, '')
    .trim()
    .toLowerCase()
}

/**
 * 获取块的标题
 * @param block Notion 块
 * @param recordMap 包含页面信息的记录映射
 * @returns 块的标题
 */
export function getBlockTitle(block: Block, recordMap: ExtendedRecordMap) {
  if (block.properties?.title) {
    return getTextContent(block.properties.title)
  }

  if (
    block.type === 'collection_view_page' ||
    block.type === 'collection_view'
  ) {
    const collectionId = getBlockCollectionId(block, recordMap)

    if (collectionId) {
      const collection = recordMap.collection[collectionId]?.value

      if (collection) {
        return getTextContent(collection.name)
      }
    }
  }

  return ''
}

/**
 * 获取块的集合 ID
 * @param block Notion 块
 * @param recordMap 包含页面信息的记录映射
 * @returns 集合 ID 或 null
 */
export function getBlockCollectionId(
  block: Block,
  recordMap: ExtendedRecordMap
): string | null {
  const collectionId =
    (block as any).collection_id ||
    (block as any).format?.collection_pointer?.id

  if (collectionId) {
    return collectionId
  }

  const collectionViewId = (block as any)?.view_ids?.[0]
  if (collectionViewId) {
    const collectionView = recordMap.collection_view?.[collectionViewId]?.value
    if (collectionView) {
      const collectionId = collectionView.format?.collection_pointer?.id
      return collectionId
    }
  }

  return null
}

/**
 * 获取文本内容
 * @param text 装饰数组
 * @returns 文本内容字符串
 */
export const getTextContent = (text?: Decoration[]): string => {
  if (!text) {
    return ''
  } else if (Array.isArray(text)) {
    return (
      text?.reduce(
        (prev, current) =>
          prev + (current[0] !== '⁍' && current[0] !== '‣' ? current[0] : ''),
        ''
      ) ?? ''
    )
  } else {
    return text
  }
}

/**
 * 获取页面属性
 * @param propertyName 属性名称
 * @param block Notion 块
 * @param recordMap 包含页面信息的记录映射
 * @returns 属性值
 */
export function getPageProperty<
  T = string | number | boolean | string[] | number[]
>(propertyName: string, block: Block, recordMap: ExtendedRecordMap): T
export function getPageProperty(
  propertyName: string,
  block: Block,
  recordMap: ExtendedRecordMap
) {
  try {
    if (!block.properties || !Object.keys(recordMap.collection)) {
      return null
    }

    const collection = recordMap.collection[block.parent_id]?.value

    if (collection) {
      const propertyNameL = propertyName.toLowerCase()
      const propertyId = Object.keys(collection.schema).find(
        (key) => collection.schema[key]?.name?.toLowerCase() === propertyNameL
      )

      if (!propertyId) {
        return null
      }

      const { type } = collection.schema[propertyId]
      const content = getTextContent(block.properties[propertyId])

      switch (type) {
        case 'created_time':
          return block.created_time

        case 'multi_select':
          return content.split(',')

        case 'date': {
          const property = block.properties[propertyId] as [['‣', [DateFormat]]]
          const formatDate = property[0][1][0][1]

          if (formatDate.type == 'datetime') {
            return new Date(
              `${formatDate.start_date} ${formatDate.start_time}`
            ).getTime()
          } else if (formatDate.type == 'date') {
            return new Date(formatDate.start_date).getTime()
          } else if (formatDate.type == 'datetimerange') {
            const { start_date, start_time, end_date, end_time } = formatDate
            const startTime = new Date(`${start_date} ${start_time}`).getTime()
            const endTime = new Date(`${end_date} ${end_time}`).getTime()
            return [startTime, endTime]
          } else if (formatDate.type === 'daterange') {
            const startTime = formatDate.start_date ? new Date(formatDate.start_date).getTime() : null
            const endTime = formatDate.end_date ? new Date(formatDate.end_date).getTime() : null
            return [startTime, endTime]
          } else {
            console.warn(`Unexpected date format type: ${formatDate.type}`)
            return null
          }
        }

        case 'checkbox':
          return content == 'Yes'

        case 'last_edited_time':
          return block.last_edited_time

        default:
          return content
      }
    }
  } catch {
    // 确保无论如何都不会因为意外的集合数据格式抛出错误
  }

  return null
}
  