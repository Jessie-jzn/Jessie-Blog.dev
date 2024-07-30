import NotionService from './NotionServer';

const notionService = new NotionService();

interface BlockFetchResponse {
  recordMap: {
    block: Record<string, any>;
  };
}

/**
 * 根据提供的 ids 批量抓取 blocks。
 * 在获取数据库文章列表时，超过一定数量的 block 会被丢弃，因此需要根据 pageId 批量抓取 block。
 * @param {string | string[]} ids - 需要抓取的 block 的 id 或 id 数组。
 * @param {number} [batchSize=100] - 每次批量抓取的数量，默认为 100。
 * @returns {Promise<Record<string, any>>} - 返回包含抓取到的 blocks 的对象。
 */
export const getBlockInBatches = async (
  ids: string | string[],
  batchSize: number = 100,
): Promise<Record<string, any>> => {
  // 如果 ids 不是数组，则将其转换为数组
  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  let fetchedBlocks: Record<string, any> = {};

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    console.log('[API-->>请求] Fetching missing blocks', batch, ids.length);
    const start = Date.now();
    const pageChunk: BlockFetchResponse = await notionService.getBlocks(batch);
    const end = Date.now();
    console.log(
      `[API<<--响应] 耗时:${end - start}ms Fetching missing blocks count:${ids.length}`,
    );

    fetchedBlocks = {
      ...fetchedBlocks,
      ...pageChunk.recordMap.block,
    };
  }

  return fetchedBlocks;
};
export default getBlockInBatches;
