import SiteConfig from "@/site.config";
import { defaultMapImageUrl } from "react-notion-x";
import { Block, ExtendedRecordMap, Decoration, FormattedDate } from "notion-types";

/**
 * 映射图片 URL
 * 如果 URL 是默认的页面封面或图标，则直接返回；否则使用 defaultMapImageUrl 处理
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
 * 将路径和搜索参数组合成完整的 URL
 * @param {string} path - 路径
 * @param {URLSearchParams} searchParams - URL 搜索参数
 * @returns {string} 完整的 URL 字符串
 */
const createUrl = (path: string, searchParams: URLSearchParams) => {
  return [path, searchParams.toString()].filter(Boolean).join("?");
};

/**
 * 将页面 ID 映射到相应的 URL
 * 根据页面 ID 和记录映射生成对应的 URL
 * @param {ExtendedRecordMap} recordMap - 包含页面信息的记录映射
 * @param {URLSearchParams} searchParams - 要附加到 URL 的搜索参数
 * @returns {Function} 一个函数，该函数接受一个页面 ID 并返回其相应的 URL
 */
export const mapPageUrl =
  (recordMap: ExtendedRecordMap, searchParams: URLSearchParams) =>
  (pageId = ""): string => {
    // 解析页面 ID，获取 UUID 格式
    const pageUuid = parsePageId(pageId, { uuid: true });

    // 如果是根页面，返回首页 URL
    if (pageUuid && uuidToId(pageUuid) === SiteConfig.Notion_ROOT_PAGE_Id) {
      return createUrl("/", searchParams);
    } else if (pageUuid) {
      // 获取规范的页面 ID
      const canonicalPageId = getCanonicalPageId(pageUuid, recordMap);
      const block = recordMap.block[pageId]?.value;

      // 获取页面所属的数据库 ID
      const databaseId = block?.parent_id;
      // 查找数据库对应的路由前缀
      const routePrefix = databaseId ? (SiteConfig.databaseMapping[databaseId] || '') : '';

      // 根据是否有路由前缀生成不同的 URL
      if (routePrefix) {
        return createUrl(`/${routePrefix}/post/${canonicalPageId}`, searchParams);
      } else {
        return createUrl(`/post/${canonicalPageId}`, searchParams);
      }
    }
    
    // 如果无法解析页面 ID，返回空字符串
    return '';
  };

/**
 * 获取页面的规范 ID
 * 尝试获取规范的页面 ID，如果失败则返回原始 ID
 * @param {string} pageId - 页面 ID
 * @param {ExtendedRecordMap} recordMap - 包含页面信息的记录映射
 * @returns {string} 规范的页面 ID
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
 * 尝试从页面属性或标题中获取规范的 ID
 * @param {string} pageId - 页面 ID
 * @param {ExtendedRecordMap} recordMap - 包含页面信息的记录映射
 * @param {Object} options - 选项
 * @param {boolean} options.uuid - 是否包含 UUID
 * @returns {string | null} 规范的页面 ID 或 null
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
 * 处理标题中的特殊字符和空格
 * @param {string | null | undefined} title - 标题字符串
 * @returns {string} 规范化后的标题字符串
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
 * 处理不同类型块的标题提取
 * @param {Block} block - Notion 块
 * @param {ExtendedRecordMap} recordMap - 包含页面信息的记录映射
 * @returns {string} 块的标题
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
 * 处理集合视图块的集合 ID 提取
 * @param {Block} block - Notion 块
 * @param {ExtendedRecordMap} recordMap - 包含页面信息的记录映射
 * @returns {string | null} 集合 ID 或 null
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
 * 处理装饰数组的文本提取
 * @param {Decoration[] | undefined} text - 装饰数组
 * @returns {string} 文本内容字符串
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
 * 从 Notion 块中提取特定属性的值
 * @param {string} propertyName - 属性名称
 * @param {Block} block - Notion 块
 * @param {ExtendedRecordMap} recordMap - 包含页面信息的记录映射
 * @returns {T | null} 属性值或 null
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
      return null;
    }

    const collection = recordMap.collection[block.parent_id]?.value;

    if (collection) {
      const propertyNameL = propertyName.toLowerCase();
      const propertyId = Object.keys(collection.schema).find(
        (key) => collection.schema[key]?.name?.toLowerCase() === propertyNameL
      );

      if (!propertyId) {
        return null;
      }

      const { type } = collection.schema[propertyId];
      const content = getTextContent(block.properties[propertyId]);

      // 根据属性类型处理不同的值
      switch (type) {
        case 'created_time':
          return block.created_time;
        case 'multi_select':
          return content.split(',');
        case 'date':
          // 处理日期类型的属性
          return handleDateProperty(block.properties[propertyId]);
        case 'checkbox':
          return content == 'Yes';
        case 'last_edited_time':
          return block.last_edited_time;
        default:
          return content;
      }
    }
  } catch {
    // 确保无论如何都不会因为意外的集合数据格式抛出错误
  }

  return null;
}

/**
 * 处理日期类型属性
 * @param {any} property - 日期属性
 * @returns {number | [number, number] | [number | null, number | null] | null} 处理后的日期值
 */
function handleDateProperty(property: any) {
  const formatDate = property[0][1][0][1];
  switch (formatDate.type) {
    case 'datetime':
      return new Date(`${formatDate.start_date} ${formatDate.start_time}`).getTime();
    case 'date':
      return new Date(formatDate.start_date).getTime();
    case 'datetimerange':
      const { start_date, start_time, end_date, end_time } = formatDate;
      return [
        new Date(`${start_date} ${start_time}`).getTime(),
        new Date(`${end_date} ${end_time}`).getTime()
      ];
    case 'daterange':
      return [
        formatDate.start_date ? new Date(formatDate.start_date).getTime() : null,
        formatDate.end_date ? new Date(formatDate.end_date).getTime() : null
      ];
    default:
      console.warn(`Unexpected date format type: ${formatDate.type}`);
      return null;
  }
}

/**
 * 获取页面的内容块 ID
 * 递归获取页面的所有内容块 ID
 * @param {ExtendedRecordMap} recordMap - 包含页面信息的记录映射
 * @param {string} blockId - 可选的块 ID，默认为第一个块
 * @returns {string[]} 页面的所有内容块 ID 数组
 */
export const getPageContentBlockIds = (
  recordMap: ExtendedRecordMap,
  blockId?: string
): string[] => {
  const rootBlockId = blockId || Object.keys(recordMap.block)[0]
  const contentBlockIds = new Set<string>()
  
  function addContentBlocks(blockId: string) {
    if (contentBlockIds.has(blockId)) return
    contentBlockIds.add(blockId)
  
    const block = recordMap.block[blockId]?.value
    if (!block) return
  
    const { content, type, properties, format } = block
    if (properties) {
      for (const key of Object.keys(properties)) {
        const p = properties[key]
        p.map((d: any) => {
          const value = d?.[0]?.[1]?.[0]
          if (value?.[0] === 'p' && value[1]) {
            addContentBlocks(value[1])
          }
        })
  
        const value = p?.[0]?.[1]?.[0]
  
        if (value?.[0] === 'p' && value[1]) {
          addContentBlocks(value[1])
        }
      }
    }
  
    if (format) {
      const referenceId = format.transclusion_reference_pointer?.id
      if (referenceId) {
        addContentBlocks(referenceId)
      }
    }
  
    if (!content || !Array.isArray(content)) {
      return
    }
  
    if (blockId !== rootBlockId) {
      if (type === 'page' || type === 'collection_view_page') {
        return
      }
    }
  
    for (const blockId of content) {
      addContentBlocks(blockId)
    }
  }
  
  addContentBlocks(rootBlockId)
  return Array.from(contentBlockIds)
}

/**
 * 获取日期值
 * 从装饰数组中提取日期值
 * @param {any[]} prop - 装饰数组
 * @returns {FormattedDate | null} 格式化的日期对象或 null
 */
export const getDateValue = (prop: any[]): FormattedDate | null => {
  if (prop && Array.isArray(prop)) {
    if (prop[0] === 'd') {
      return prop[1]
    } else {
      for (const v of prop) {
        const value = getDateValue(v)
        if (value) {
          return value
        }
      }
    }
  }
  
  return null
}
/**
 * 解析页面 ID
 * 将输入的 ID 解析为 Notion 页面的标准 ID 格式
 * @param {string | null} id - 输入的页面 ID
 * @param {Object} options - 配置选项
 * @param {boolean} [options.uuid=true] - 是否返回 UUID 格式
 * @returns {string | null} 解析后的页面 ID，如果无法解析则返回 null
 */
export const parsePageId = (
  id: string | null = '',
  { uuid = true }: { uuid?: boolean } = {}
) => {
    console.log('id',id)
  // 如果输入为空，直接返回 null
  if (!id) {
    return null
  }

  // 移除 URL 中的查询参数
  id = id.split('?')[0]
  
  // 匹配 32 位十六进制字符串（不带连字符的 UUID）
  const match = id.match(/\b([a-f0-9]{32})\b/)

  if (match) {
    // 如果匹配成功，根据 uuid 选项决定是否转换为带连字符的 UUID 格式
    return uuid ? idToUuid(match[1]) : match[1]
  }
  console.log('match',match)

  // 匹配标准的 UUID 格式（带连字符）
  const match2 = id.match(/\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/)
  if (match2) {
    // 如果匹配成功，根据 uuid 选项决定是否保留连字符
    return uuid ? match2[1] : match2[1].replace(/-/g, '')
  }
  console.log('match2',match2)


  // 如果都不匹配，返回 null
  return null
}

/**
 * 将不带连字符的 ID 转换为 UUID 格式
 * @param {string} id - 输入的 32 位十六进制字符串
 * @returns {string} UUID 格式的字符串
 */
export const idToUuid = (id = ''): string => {
  // 如果输入不是 32 位，直接返回原字符串
//   if (id.length !== 32) {
//     return id;
//   }
  // 将 32 位字符串分割并用连字符连接，形成标准 UUID 格式
  return [
    id.slice(0, 8),
    id.slice(8, 12),
    id.slice(12, 16),
    id.slice(16, 20),
    id.slice(20)
  ].join('-');
}

/**
 * 将 UUID 格式转换为不带连字符的 ID
 * @param {string} uuid - UUID 格式的字符串
 * @returns {string} 不带连字符的 32 位十六进制字符串
 */
export const uuidToId = (uuid: string) => uuid.replace(/-/g, '')
