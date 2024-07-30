type CollectionQuery = {
  [collectionId: string]: {
    [viewId: string]: {
      blockIds?: string[];
      collection_group_results?: {
        blockIds: string[];
      };
    };
  };
};

export default function getAllPageIds(
  collectionQuery: CollectionQuery,
  collectionId: string,
  collectionView: any,
  viewIds: string[],
): string[] {
  if (!collectionQuery || !collectionView) {
    return [];
  }

  let pageIds: string[] = [];

  // 优先按照第一个视图排序
  try {
    if (viewIds && viewIds.length > 0) {
      const ids =
        collectionQuery[collectionId]?.[viewIds[0]]?.collection_group_results
          ?.blockIds;
      if (ids) {
        pageIds.push(...ids);
      }
    }
  } catch (error) {
    console.error('Error fetching page IDs from collectionQuery:', error);
  }

  console.log('pageIds', pageIds);

  // 否则按照数据库原始排序
  if (
    pageIds.length === 0 &&
    collectionQuery &&
    Object.values(collectionQuery).length > 0
  ) {
    const pageSet = new Set<string>();
    Object.values(collectionQuery[collectionId]).forEach((view) => {
      view?.blockIds?.forEach((id) => pageSet.add(id)); // group视图
      view?.collection_group_results?.blockIds?.forEach((id) =>
        pageSet.add(id),
      ); // table视图
    });
    pageIds = Array.from(pageSet);
    // console.log('PageIds: 从collectionQuery获取', collectionQuery, pageIds.length)
  }

  return pageIds;
}
