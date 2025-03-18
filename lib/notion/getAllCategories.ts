import { isIterable } from "@/lib/util";
import * as Types from "@/lib/type";

/**
 * 获取所有文章的分类
 * @param {Array} allPages - 所有页面的数组，包含文章和其他类型的页面。
 * @param {Array} categoryOptions - 用于筛选分类的可选列表，每个选项应包含 `id`、`value` 和 `color` 字段。
 * @param {number} sliceCount - 默认截取数量为12，若为0则返回全部分类信息，若大于0则返回指定数量的分类信息。
 * @returns {Promise<Array<{ id: string, name: string, color: string, count: number, articles: Array<any> }>>} - 返回一个分类对象数组，每个对象包含 `id`、`name`、`color`、`count` 和 `articles` 字段。
 */

// 提取所有文章的分类信息并构建分类到文章的映射

export function getAllCategories({
  allPages,
  categoryOptions,
}: {
  allPages: any[];
  categoryOptions: Types.Category[];
}) {
  // 仅筛选已发布的文章
  const allPosts = allPages.filter(
    (page) =>
      page.type === "Post" &&
      (page.status === "Published" || page.status === "P")
  );
  if (!allPosts || !categoryOptions) {
    // 按照数量排序并限制返回结果的数量
    return {
      categoryMap: {},
      categoryList: [],
    };
  }

  const categoryMap: Record<string, Types.Category> = {};

  // 预处理 categoryOptions 为一个 Map，提高查找效率
  const categoryMapLookup = new Map(categoryOptions.map((c) => [c.value, c]));

  allPosts.forEach((post) => {
    const categories = Array.isArray(post.category)
      ? post.category
      : [post.category];

    categories.forEach((categoryValue: string) => {
      const categoryOption = categoryMapLookup.get(categoryValue);
      if (!categoryOption) return;

      if (!categoryMap[categoryValue]) {
        categoryMap[categoryValue] = {
          count: 0,
          articles: [],
          id: categoryOption.id,
          name: categoryOption.value,
          color: categoryOption.color,
        };
      }

      categoryMap[categoryValue].count++;
      categoryMap[categoryValue].articles.push(post);
    });
  });

  const list: Types.Category[] = Object.values(categoryMap);

  // 按照数量排序并限制返回结果的数量
  return {
    categoryMap: categoryMap,
    categoryList: list,
  };
}
