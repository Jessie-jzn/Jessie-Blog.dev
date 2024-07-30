import NotionService from './NotionServer';
import * as Types from '@/lib/type';

const notionService = new NotionService();

/**
 * 调用接口，失败时会重试指定次数
 * @param {PageParamsProp} params - 包含页面ID和请求来源的参数对象
 * @param {number} [retryAttempts=3] - 重试次数，默认值为3次
 * @returns {Promise<any | null>} - 返回页面数据或null（重试次数耗尽）
 */
const getPageWithRetry = async (
  { pageId, from }: Types.NotionPageParamsProp,
  retryAttempts: number = 3,
): Promise<any | null> => {
  if (retryAttempts > 0) {
    console.log(
      '[API-->>请求]',
      `from:${from}`,
      `id:${pageId}`,
      retryAttempts < 3 ? `剩余重试次数:${retryAttempts}` : '',
    );

    try {
      const start = Date.now();
      const pageData = await notionService.getPage(pageId);
      const end = Date.now();
      console.log('[API<<--响应]', `耗时:${end - start}ms - from:${from}`);
      return pageData;
    } catch (e) {
      console.warn('[API<<--异常]:', e);
      return await getPageWithRetry({ pageId, from }, retryAttempts - 1);
    }
  } else {
    console.error('[请求失败]:', `from:${from}`, `id:${pageId}`);
    return null;
  }
};

/**
 * 获取页面数据，并在失败时进行重试
 * @param {PageParamsProp} params - 包含页面ID和请求来源的参数对象
 * @returns {Promise<any | null>} - 返回页面数据或null（重试次数耗尽）
 */
export default async function getPage({
  pageId,
  from,
}: Types.NotionPageParamsProp): Promise<any | null> {
  return getPageWithRetry({ pageId, from });
}
