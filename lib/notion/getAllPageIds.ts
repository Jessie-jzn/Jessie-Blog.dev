// 定义集合查询的类型
type CollectionQuery = {
  [collectionId: string]: {
    [viewId: string]: {
      blockIds?: string[]; // 可选的块 ID 数组
      collection_group_results?: {
        blockIds: string[]; // 集合组结果中的块 ID 数组
      };
    };
  };
};

/**
 * 从 Notion 的集合查询中获取所有相关的页面 ID
 * @param collectionQuery 一个对象，包含多个集合的查询结果，每个集合可能有多个视图。
 * @param collectionId 当前要查询的集合的 ID。
 * @param collectionView 当前集合的视图（虽然在这个函数中没有被直接使用）。
 * @param viewIds 一个字符串数组，包含当前集合的视图 ID。  
 * @returns 
 */
export default function getAllPageIds(
  collectionQuery: CollectionQuery, // 输入的集合查询对象
  collectionId: string, // 当前集合的 ID
  collectionView: any, // 当前集合视图（类型可以更具体）
  viewIds: string[] // 视图 ID 数组
): string[] {
  // 检查集合查询和集合视图是否存在
  if (!collectionQuery || !collectionView) {
    return []; // 如果没有集合查询或集合视图，返回空数组
  }

  let pageIds: string[] = []; // 存储页面 ID 的数组

  // 优先按照第一个视图排序
  try {
    if (viewIds && viewIds.length > 0) {
      const ids =
        collectionQuery[collectionId]?.[viewIds[0]]?.collection_group_results
          ?.blockIds; // 获取第一个视图的块 ID
      if (ids) {
        pageIds.push(...ids); // 将块 ID 添加到页面 ID 数组
      }
    }
  } catch (error) {
    console.error("Error fetching page IDs from collectionQuery:", error); // 捕获并记录错误
  }

  // 否则按照数据库原始排序
  if (
    pageIds.length === 0 && // 如果页面 ID 数组为空
    collectionQuery && // 确保集合查询存在
    Object.values(collectionQuery).length > 0 // 确保集合查询中有值
  ) {
    const pageSet = new Set<string>(); // 使用集合来存储唯一的页面 ID
    Object.values(collectionQuery[collectionId]).forEach((view) => {
      view?.blockIds?.forEach((id) => pageSet.add(id)); // 添加 group 视图的块 ID
      view?.collection_group_results?.blockIds?.forEach((id) =>
        pageSet.add(id)
      ); // 添加 table 视图的块 ID
    });
    pageIds = Array.from(pageSet); // 将集合转换为数组
    // console.log('PageIds: 从collectionQuery获取', collectionQuery, pageIds.length)
  }

  return pageIds; // 返回页面 ID 数组
}
