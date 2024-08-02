import { ExtendedRecordMap } from "notion-types";
import SiteConfig from "@/site.config";
import { getSiteConfig } from "./get-config-value";
import {
  getCanonicalPageId as getCanonicalPageIdImpl,
  parsePageId,
} from "notion-utils";
// import { inversePageUrlOverrides } from "./config";

interface PageUrlOverridesMap {
  [key: string]: string;
}

interface PageUrlOverridesInverseMap {
  [pageId: string]: string;
}
/**
 * 获取规范页面ID
 *
 * 该函数用于获取Notion页面在应用中的规范（canonical）页面ID。它会根据页面ID和记录映射（record map）
 * 来确定最终的页面ID，并支持对某些页面进行URL重写。
 *
 * @param {string} pageId - Notion页面ID。
 * @param {ExtendedRecordMap} recordMap - 包含页面数据的记录映射。
 * @param {Object} options - 可选参数对象。
 * @param {boolean} [options.uuid=true] - 是否包含UUID。
 * @returns {string | null} - 返回规范页面ID或null（如果页面ID无效）。
 */
export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null {
  // 解析页面ID，忽略UUID
  const cleanPageId = parsePageId(pageId, { uuid: false });
  if (!cleanPageId) {
    return null; // 如果页面ID无效，返回null
  }

  // 检查是否存在页面ID的URL覆盖映射
  const override = inversePageUrlOverrides[cleanPageId];
  if (override) {
    return override; // 如果存在覆盖映射，则返回覆盖后的ID
  } else {
    // 否则调用默认实现获取规范页面ID
    return getCanonicalPageIdImpl(pageId, recordMap, { uuid });
  }
}

export const pageUrlOverrides = cleanPageUrlMap(
  getSiteConfig("pageUrlOverrides", {}) || {},
  { label: "pageUrlOverrides" }
);

export const inversePageUrlOverrides = invertPageUrlOverrides(pageUrlOverrides);

/**
 * 清理页面URL映射
 *
 * 该函数用于清理页面URL映射，确保每个页面ID和URI都是有效的。它会将相对路径URI转换为对象键，并使用解析后的UUID作为值。
 *
 * @param {PageUrlOverridesMap} pageUrlMap - 页面URL映射对象，键为URI，值为页面ID。
 * @param {Object} options - 可选参数对象。
 * @param {string} options.label - 用于错误消息中的标签。
 * @returns {PageUrlOverridesMap} - 返回清理后的页面URL映射对象。
 * @throws {Error} - 当页面ID或URI无效时抛出错误。
 */
function cleanPageUrlMap(
  pageUrlMap: PageUrlOverridesMap,
  { label }: { label: string }
): PageUrlOverridesMap {
  // 使用reduce遍历pageUrlMap，清理无效的URI和页面ID
  return Object.keys(pageUrlMap).reduce((acc, uri) => {
    const pageId = pageUrlMap[uri];
    const uuid = parsePageId(pageId, { uuid: false });

    // 检查页面ID是否有效
    if (!uuid) {
      throw new Error(`Invalid ${label} page id "${pageId}"`);
    }

    // 检查URI是否存在
    if (!uri) {
      throw new Error(`Missing ${label} value for page "${pageId}"`);
    }

    // 检查URI是否为相对路径
    if (!uri.startsWith("/")) {
      throw new Error(
        `Invalid ${label} value for page "${pageId}": value "${uri}" should be a relative URI that starts with "/"`
      );
    }

    // 移除URI的第一个斜杠，作为对象键
    const path = uri.slice(1);

    return {
      ...acc,
      [path]: uuid,
    };
  }, {} as PageUrlOverridesMap);
}

/**
 * 颠倒 pageUrlOverrides 对象的键值对
 * @param pageUrlOverrides - 原始的页面 URL 覆盖对象，键为 URI，值为页面 ID
 * @returns 一个新的对象，其中键为页面 ID，值为 URI
 */
function invertPageUrlOverrides(
  pageUrlOverrides: PageUrlOverridesMap
): PageUrlOverridesInverseMap {
  // 使用 reduce 方法遍历 pageUrlOverrides 对象的键
  return Object.keys(pageUrlOverrides).reduce((acc, uri) => {
    const pageId = pageUrlOverrides[uri];

    // 返回一个新的对象，其中键为页面 ID，值为 URI
    return {
      ...acc,
      [pageId]: uri,
    };
  }, {} as PageUrlOverridesInverseMap); // 初始值为空对象，并声明其类型为 PageUrlOverridesInverseMap
}
