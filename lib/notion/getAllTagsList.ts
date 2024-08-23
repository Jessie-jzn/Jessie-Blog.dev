// import { siteConfig } from '../config';
import * as Types from "@/lib/type";

/**
 * 获取所有文章的标签
 * @param allPages 所有页面
 * @param sliceCount 截取数量，默认为12，若为0则返回全部
 * @param tagOptions tags的下拉选项
 * @param NOTION_CONFIG Notion配置
 * @returns 标签列表
 */
export default function getAllTagsList({
  allPages,
  sliceCount = 0,
  tagOptions,
}: //   NOTION_CONFIG,
{
  allPages: any[];
  sliceCount?: number;
  tagOptions: Types.Tag[];
}): Types.Tag[] {
  // 筛选所有发布状态的文章
  const allPosts = allPages.filter(
    (page) =>
      page.type === "Post" &&
      (page.status === "Published" || page.status === "P")
  );

  if (!allPosts || !tagOptions) {
    return [];
  }

  const tagArticleMap: { [key: string]: any[] } = {};
  allPosts.forEach((post) => {
    post.tags.forEach((tag: string) => {
      if (tagArticleMap[tag]) {
        tagArticleMap[tag].push(post);
      } else {
        tagArticleMap[tag] = [post];
      }
    });
  });
  const tagList: Types.Tag[] = [];

  if (isIterable(tagOptions)) {
    tagOptions.forEach((tagOption) => {
      const articles = tagArticleMap[tagOption.value] || [];
      const count = articles.length;
      if (count > 0) {
        tagList.push({
          id: tagOption.id,
          name: tagOption.value,
          color: tagOption.color,
          count,
          value: tagOption.value,
          articles,
        });
      }
    });
  }

  // 返回截取后的标签列表
  if (sliceCount && sliceCount > 0) {
    return tagList.slice(0, sliceCount);
  } else {
    return tagList;
  }
}

/**
 * 是否可迭代
 * @param {*} obj
 * @returns
 */
const isIterable = (obj: any) => {
  return obj != null && typeof obj[Symbol.iterator] === "function";
};
