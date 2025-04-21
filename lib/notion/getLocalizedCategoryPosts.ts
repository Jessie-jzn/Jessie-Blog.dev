//SSR用 getLocalizedCategoryPosts

import getDataBaseList from "@/lib/notion/getDataBaseList";
import { processTags } from "@/lib/util";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import * as Types from "@/lib/type";

// 定义文章的类型结构（可以根据实际字段拓展）
interface Post {
  id: string;
  title: string;
  category: string;
  tags?: string[];
  [key: string]: any;
}

// 标签选项类型（用于 tagOptions）
interface TagOption {
  label?: string;
  value?: string;
  count?: number;
}

// 函数参数类型定义
interface GetLocalizedCategoryPostsOptions {
  locale: string; // 当前页面语言，如 'en' 或 'zh'
  pageId: string; // Notion 数据源 ID
  from?: string; // 来源位置，用于缓存 key 区分（可选）
  categories: [string, string]; // 两种语言下的分类 key，例如 ['travel-en', 'travel-zh']
  translationNamespaces?: string[]; // 需要加载的翻译 namespace（默认为 ['common']）
  useCache?: boolean; // 是否使用内存缓存（默认 false）
}

// 简单内存缓存（生命周期内生效，适合开发和构建阶段）
const _cache = new Map<string, any>();

/**
 * 通用文章列表获取函数，支持中英分类自动切换、标签处理、本地缓存、i18n 翻译加载
 */
const getLocalizedCategoryPosts = async ({
  locale,
  pageId,
  from = "default",
  categories,
  translationNamespaces = ["common"],
  useCache = false,
}: GetLocalizedCategoryPostsOptions): Promise<{
  posts: Post[]; // 所有文章（主语言优先）
  tagOptions: TagOption[]; // 去重后的标签列表
  translations: any; // i18n 翻译内容
}> => {
  const [enCategory, zhCategory] = categories;

  // 根据当前语言设置主分类（primary）和次分类（secondary）
  const [primaryKey, secondaryKey] =
    locale === "en" ? [enCategory, zhCategory] : [zhCategory, enCategory];

  // 生成缓存 key，用于唯一标识一次请求
  const cacheKey = `${pageId}_${locale}_${from}_${categories.join("_")}`;
  if (useCache && _cache.has(cacheKey)) {
    // 若启用缓存且已有缓存结果，直接返回
    return _cache.get(cacheKey);
  }

  // 获取数据库中的文章列表（按分类筛选）
  const response = await getDataBaseList({
    pageId,
    from,
    filter: (post: Post) =>
      post.category === enCategory || post.category === zhCategory,
  });

  // 从返回结果中取出对应语言分类的文章列表
  const primaryPosts: Post[] =
    response.categoryMap?.[primaryKey]?.articles || [];
  const secondaryPosts: Post[] =
    response.categoryMap?.[secondaryKey]?.articles || [];

  // 合并文章列表，主语言在前
  const allPosts: Post[] = [...primaryPosts, ...secondaryPosts];

  // 处理标签映射，去重、计数等（返回 Map）
  const tagMap = processTags(response.tagOptions || []);
  // 转成数组用于前端展示（不需要额外处理 count 和 value）
  const uniqueTagOptions: Types.Tag[] = Array.from(tagMap.values());

  // 加载翻译内容（i18n）
  const translations = await serverSideTranslations(
    locale || "zh",
    translationNamespaces
  );

  // 构造最终结果对象
  const result = {
    posts: allPosts,
    tagOptions: uniqueTagOptions,
    translations,
  };

  // 如果启用缓存，存入缓存 Map
  if (useCache) {
    _cache.set(cacheKey, result);
  }

  return result;
};

export default getLocalizedCategoryPosts;
