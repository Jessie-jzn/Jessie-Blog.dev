import * as Types from "@/lib/type";

/**
 * 获取所有文章的标签列表
 * @param allPages 所有页面
 * @param sliceCount 截取数量，默认为12，若为0则返回全部
 * @param tagOptions tags的下拉选项
 * @returns 标签列表
 */
export default function getAllTagsList({
  allPages: allPosts,
  tagOptions,
  sliceCount = 0,
}: {
  allPages: ReadonlyArray<Types.Post>;
  tagOptions: ReadonlyArray<Types.Tag>;
  sliceCount?: number;
}): Types.Tag[] {
  if (!allPosts.length || !tagOptions.length) return [];

  // 1️使用 Map 构建标签到文章的映射
  const tagArticleMap = new Map<string, Types.Post[]>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!tagArticleMap.has(tag)) {
        tagArticleMap.set(tag, []);
      }
      tagArticleMap.get(tag)!.push(post); // 使用 `!` 断言，确保一定存在
    });
  });

  // 2️ 直接使用 `reduce` 构建 `tagList`
  const tagList = tagOptions.reduce<Types.Tag[]>((list, tagOption) => {
    const articles = tagArticleMap.get(tagOption.value);
    if (articles) {
      list.push({
        id: tagOption.id,
        name: tagOption.value,
        color: tagOption.color,
        count: articles.length,
        value: tagOption.value,
        articles,
      });
    }
    return list;
  }, []);

  // 3️返回截取后的标签列表
  return sliceCount > 0 ? tagList.slice(0, sliceCount) : tagList;
}
