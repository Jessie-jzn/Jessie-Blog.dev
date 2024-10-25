import getBlockInBatches from "./getBlockInBatches";
import getPageProperties from "./getPageProperties";
import { getTagOptions } from "./getDataBaseList";

/**
 * 通过 pageId 获取单篇文章内容
 * @param pageId - 当前文章的页面ID
 * @param block - 数据库块内容
 * @param schema - 数据库的 schema 定义
 * @returns {Promise<Object|null>} - 返回单篇文章的基础数据，若未找到则返回 null
 */
const getSinglePostData = async (pageId: string, block: any, schema: any) => {
  // 检查页面数据是否已存在于 block 中
  // let value = block[pageId]?.value;

  // 如果不存在，尝试抓取该页面的块数据
  if (!block) {
    const fetchedBlock = await getBlockInBatches([pageId]);
    block = fetchedBlock[pageId]?.value;

    // 如果依然无法获取数据，返回 null
    if (!block) {
      console.error(`无法获取页面 ID 为 "${pageId}" 的数据`);
      return null;
    }
  }

  // 获取页面的具体属性数据
  const properties = await getPageProperties(
    pageId,
    block,
    schema,
    getTagOptions(schema)
  );

  // 如果成功获取到属性，则返回该文章的基础数据
  if (properties) {
    return properties;
  } else {
    console.error(`页面 ID 为 "${pageId}" 的属性数据获取失败`);
    return null;
  }
};
export default getSinglePostData;
