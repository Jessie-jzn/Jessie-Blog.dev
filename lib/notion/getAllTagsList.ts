// import { siteConfig } from '../config';

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
  //   NOTION_CONFIG,
}: {
  allPages: any[];
  sliceCount?: number;
  tagOptions: { id: string; value: string; color: string }[];
}): { id: string; name: string; color: string; count: number }[] {
  // 筛选所有发布状态的文章
  const allPosts = allPages?.filter(
    (page) => page.type === 'Post' && page.status === 'Published',
  );

  if (!allPosts || !tagOptions) {
    return [];
  }

  // 获取所有文章的标签
  let tags = allPosts.map((p) => p.tags).flat();

  // 统计每个标签的数量
  const tagCountMap: { [key: string]: number } = {};
  tags.forEach((tag) => {
    if (tag in tagCountMap) {
      tagCountMap[tag]++;
    } else {
      tagCountMap[tag] = 1;
    }
  });

  const tagList: { id: string; name: string; color: string; count: number }[] =
    [];

  //   // 是否区分标签颜色
  //   const IS_TAG_COLOR_DISTINGUISHED = siteConfig(
  //     'IS_TAG_COLOR_DISTINGUISHED',
  //     false,
  //     NOTION_CONFIG,
  //   );
  //   // 是否按标签数量排序
  //   const TAG_SORT_BY_COUNT = siteConfig(
  //     'TAG_SORT_BY_COUNT',
  //     true,
  //     NOTION_CONFIG,
  //   );

  if (isIterable(tagOptions)) {
    // if (!IS_TAG_COLOR_DISTINGUISHED) {
    //   // 如果不区分颜色, 不同颜色相同名称的tag当做同一种tag
    //   const savedTagNames = new Set<string>();
    //   tagOptions.forEach((tagOption) => {
    //     if (!savedTagNames.has(tagOption.value)) {
    //       const count = tagCountMap[tagOption.value];
    //       if (count) {
    //         tagList.push({
    //           id: tagOption.id,
    //           name: tagOption.value,
    //           color: tagOption.color,
    //           count,
    //         });
    //       }
    //       savedTagNames.add(tagOption.value);
    //     }
    //   });
    // } else {
    tagOptions.forEach((tagOption) => {
      const count = tagCountMap[tagOption.value];
      if (count) {
        tagList.push({
          id: tagOption.id,
          name: tagOption.value,
          color: tagOption.color,
          count,
        });
      }
    });
    // }
  }

  //   // 按照数量排序
  //   if (TAG_SORT_BY_COUNT) {
  //     tagList.sort((a, b) => b.count - a.count);
  //   }

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
  return obj != null && typeof obj[Symbol.iterator] === 'function';
};
