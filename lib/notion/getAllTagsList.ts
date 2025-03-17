import * as Types from "@/lib/type";
import { isIterable } from "@/lib/util";

/**
 * 获取所有文章的标签列表
 * @param allPages 所有页面
 * @param sliceCount 截取数量，默认为12，若为0则返回全部
 * @param tagOptions tags的下拉选项
 * @returns 标签列表
 */
export default function getAllTagsList({
  allPages,
  sliceCount = 0,
  tagOptions,
}: {
  allPages: ReadonlyArray<Types.Post>;
  sliceCount?: number;
  tagOptions: ReadonlyArray<Types.Tag>;
}): Types.Tag[] {
  // 筛选所有已发布文章
  const allPosts = allPages.filter(
    (page) =>
      page.type === "Post" &&
      (page.status === "Published" || page.status === "P")
  );

  if (allPosts.length === 0 || tagOptions.length === 0) return [];

  // 1️构建 tag 到文章的映射表（使用 Map 提高查询效率）
  const tagArticleMap = new Map<string, Types.Post[]>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      const articles = tagArticleMap.get(tag) ?? [];
      articles.push(post);
      tagArticleMap.set(tag, articles);
    });
  });

  // 2️ 仅遍历存在于 tagArticleMap 的标签，减少无效计算
  const tagList: Types.Tag[] = [];

  for (const tagOption of tagOptions) {
    const articles = tagArticleMap.get(tagOption.value);
    if (articles) {
      tagList.push({
        id: tagOption.id,
        name: tagOption.value,
        color: tagOption.color,
        count: articles.length,
        value: tagOption.value,
        articles,
      });
    }
  }

  // 3️返回截取后的标签列表
  return sliceCount > 0 ? tagList.slice(0, sliceCount) : tagList;
}
