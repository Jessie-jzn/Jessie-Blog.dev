import { LANG } from "./constants";
import SiteConfig from "../site.config";
import { defaultMapImageUrl } from "react-notion-x";
import {
  parsePageId,
  uuidToId,
  // getCanonicalPageId as getCanonicalPageIdImpl,
} from "notion-utils";
import { Block, ExtendedRecordMap } from "notion-types";

import * as Types from "./type";
/**
 * 格式化日期
 * @timestampString 2024-02-22T15:22:31
 * @returns 格式化后的日期字符串，例如：2024年02月22日
 */
export const formatTimestampToDate = (
  timestampString: number | string
): string => {
  if (!timestampString) return "";
  const timestamp = new Date(timestampString);
  const year = timestamp.getFullYear();
  const month =
    (timestamp.getMonth() + 1 < 10 ? "0" : "") + (timestamp.getMonth() + 1);
  const day = (timestamp.getDate() < 10 ? "0" : "") + timestamp.getDate();
  return `${year}年${month}月${day}日`;
};
/**
 * 格式化日期
 * @param date 日期字符串或日期对象
 * @param locale 本地化字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: string | Date,
  locale: string = "zh"
): string => {
  if (!date || !locale) return date ? date.toString() : "";

  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const res = d.toLocaleDateString(locale, options);

  // 如果格式是中文日期，则转为横杆
  const format =
    locale.slice(0, 2).toLowerCase() === "zh"
      ? res.replace("年", "-").replace("月", "-").replace("日", "")
      : res;

  return format;
};
/**
 * 深拷贝对象
 * 根据源对象类型深度复制，支持object和array
 * @param {*} obj
 * @returns
 */
export const deepClone = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    // If obj is an array, create a new array and deep clone each element
    return obj.map((item) => deepClone(item)) as unknown as T;
  } else if (obj && typeof obj === "object") {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value instanceof Date) {
          newObj[key] = new Date(value.getTime());
        } else {
          newObj[key] = deepClone(value);
        }
      }
    }
    return newObj as T;
  } else {
    return obj;
  }
};
/**
 * // 将从 Notion 数据库获取的结果格式化为表格样式
 * @param pages
 * @returns
 */
export const formatDatabase = (pages: any) => {
  return pages.map((page: any) => {
    // 提取 properties 的值
    const properties = page?.properties;

    // 遍历 properties 并提取每个属性的值
    const extractedProperties = Object.keys(properties).reduce((acc, key) => {
      const property = properties[key];

      let value;

      switch (property.type) {
        case "title":
          value = property.title[0]?.plain_text || "";
          break;
        case "rich_text":
          value = property.rich_text[0]?.plain_text || "";
          break;
        case "date":
          value = property.date?.start || "";
          break;
        case "multi_select":
          value = property.multi_select.map((tag: any) => tag.name);
          break;
        case "relation":
          value = property.relation.map((rel: any) => rel.id);
          break;
        case "checkbox":
          value = property.checkbox;
          break;
        case "created_time":
          value = formatDate(new Date(property.created_time).toString(), LANG);
          break;
        default:
          value = null;
      }
      // 处理key，只对包含空格的key用下划线连接
      const formattedKey = key.includes(" ")
        ? key.replace(/\s+/g, "_").toLowerCase()
        : key.toLowerCase();

      acc[formattedKey] = value;
      return acc;
    }, {} as { [key: string]: any });

    const cover = page?.cover?.external?.url || null;

    return {
      id: page.id,
      cover:
        cover ||
        "https://cdn.aglty.io/blog-starter-2021-template/posts/virtual-tour_20210331171226_0.jpg?format=auto&w=480",
      url: page.url,
      ...extractedProperties,
    };
  });
};
// http://localhost:3000/guild/b81da5f3315a4048a300488d38c2ed55
// http://localhost:3000/guide/b81da5f3-315a-4048-a300-488d38c2ed55
export const formatPostBlock = (blockMap: any, pageId: string) => {
  const postInfo = blockMap?.block?.[pageId].value;

  return {
    id: pageId,
    type: postInfo.type,
    category: "",
    tags: [],
    title: postInfo?.properties?.title?.[0]?.[0],
    status: "Published",
    createdTime: formatDate(new Date(postInfo.created_time).toString(), LANG),
    lastEditedDay: formatDate(
      new Date(postInfo?.last_edited_time).toString(),
      LANG
    ),
    fullWidth: postInfo?.fullWidth || false,
    date: {
      start_date: formatDate(
        new Date(postInfo?.last_edited_time).toString(),
        LANG
      ),
    },
    blockMap,
  };
};

export const getEnv = (
  key: string,
  defaultValue?: string,
  env = process.env
): string => {
  const value = env[key];

  if (value !== undefined) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Config error: missing required env variable "${key}"`);
};

export const mapImageUrl = (url: string, block: Block) => {
  if (
    url === SiteConfig.defaultPageCover ||
    url === SiteConfig.defaultPageIcon
  ) {
    return url;
  }

  return defaultMapImageUrl(url, block);
};

const createUrl = (path: string, searchParams: URLSearchParams) => {
  return [path, searchParams.toString()].filter(Boolean).join("?");
};
/**
 * 将页面 ID 映射到相应的 URL。
 * @param site 站点配置。
 * @param recordMap 包含页面信息的记录映射。
 * @param searchParams 要附加到 URL 的搜索参数。
 * @returns 一个函数，该函数接受一个页面 ID 并返回其相应的 URL。
 */
export const mapPageUrl =
  (recordMap: ExtendedRecordMap, searchParams: URLSearchParams) =>
  (pageId = ""): string => {
    const pageUuid = parsePageId(pageId, { uuid: true }); // 将页面 ID 解析为 UUID 格式

    // 如果页面 ID 对应于根 Notion 页面，则返回根 URL
    return createUrl(
      `/${getCanonicalPageId(pageUuid, recordMap, { uuid: true })}`,
      searchParams
    );
    // if (uuidToId(pageUuid) === SiteConfig.rootNotionPageId) {
    //   return createUrl('/', searchParams);
    // } else {
    //   // 否则，返回页面的规范 URL
    //   return createUrl(
    //     `/${getCanonicalPageId(pageUuid, recordMap, { uuid: true })}`,
    //     searchParams,
    //   );
    // }
  };
// function invertPageUrlOverrides(
//   pageUrlOverrides: PageUrlOverridesMap,
// ): PageUrlOverridesInverseMap {
//   return Object.keys(pageUrlOverrides).reduce((acc, uri) => {
//     const pageId = pageUrlOverrides[uri];

//     return {
//       ...acc,
//       [pageId]: uri,
//     };
//   }, {});
// }
// export const pageUrlOverrides = cleanPageUrlMap(
//   getSiteConfig('pageUrlOverrides', {}) || {},
//   { label: 'pageUrlOverrides' }
// )
// export const inversePageUrlOverrides = invertPageUrlOverrides(pageUrlOverrides);
const getCanonicalPageId = (
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
) => {
  const cleanPageId = parsePageId(pageId, { uuid: false });
  if (!cleanPageId) {
    return null;
  }

  // const override = inversePageUrlOverrides[cleanPageId];
  // if (override) {
  //   return override;
  // } else {
  //   return getCanonicalPageIdImpl(pageId, recordMap, {
  //     uuid,
  //   });
  // // }
  // debugger;
  return getCanonicalPageIdImpl(pageId, recordMap);
};

export const getCanonicalPageIdImpl = (
  pageId: string,
  recordMap: ExtendedRecordMap
  // { uuid = true }: { uuid?: boolean } = {},
) => {
  if (!pageId || !recordMap) return null;

  const block = recordMap.block[pageId]?.value;

  if (block) {
    // const slug =
    //   (getPageProperty('slug', block, recordMap) as string | null) ||
    //   (getPageProperty('Slug', block, recordMap) as string | null) ||
    //   normalizeTitle(getBlockTitle(block, recordMap));

    // if (slug) {
    //   if (uuid) {
    //     return `guild/${id}`;
    //   } else {
    //     return slug;
    //   }
    // }
    return `post/${pageId}`;
  }

  // return id;
};
