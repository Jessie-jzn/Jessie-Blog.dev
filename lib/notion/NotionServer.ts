import { NotionAPI } from './NotionAPI';
import { NOTION_TOKEN } from '@/lib/constants';
import { getBlockCollectionId } from '@/lib/notion-utils';
if (!NOTION_TOKEN) {
  throw new Error('NOTION_TOKEN is not defined');
}

class NotionServer {
  private static instance: NotionServer;
  private notionAPI: NotionAPI;
  constructor() {
    this.notionAPI = new NotionAPI({
      apiBaseUrl: process.env.NOTION_API_BASE_URL,
      authToken: process.env.NOTION_API_KEY,
      // 增加超时配置，防止 Notion 接口响应慢导致页面挂起
      gotOptions: {
        timeout: { request: 10000 },
      },
    });
  }
  public static getInstance(): NotionServer {
    if (!NotionServer.instance) {
      NotionServer.instance = new NotionServer();
    }
    return NotionServer.instance;
  }
  // constructor() {
  //   this.notionAPI = new NotionAPI({
  //     apiBaseUrl: process.env.NOTION_API_BASE_URL,
  //     authToken: process.env.NOTION_API_KEY || process.env.NOTION_API_KEY,
  //   });
  // }
  /**
   * 获取指定页面的内容
   * @param pageId - 页面 ID
   * @returns Promise<PageObjectResponse>
   */
  async getCollectionData(params: any) {
    try {
      params = {
        collectionId: params.collectionId,
        collectionViewId: params.collectionViewId,
        collectionView: params.collectionView,
      };
      const page = await this.notionAPI.getCollectionData(
        params.collectionId,
        params.collectionViewId,
        params.collectionView
      );

      return page;
    } catch (error: any) {
      console.error('Error fetching page:', error.body || error);
      throw new Error('Failed to fetch page');
    }
  }
  /**
   * 获取指定页面的内容
   * @param pageId - 页面 ID
   * @returns Promise<PageObjectResponse>
   */
  async getPage(pageId: string) {
    try {
      const page = await this.notionAPI.getPage(pageId);

      return page;
    } catch (error: any) {
      console.error('Error fetching page:', error.body || error);
      throw new Error('Failed to fetch page');
    }
  }
  /**
   * 在指定页面上查询
   * @param params
   * @returns
   */
  async searchPageByBlock(params: any) {
    try {
      const page = await this.notionAPI.search(params);

      return page;
    } catch (error: any) {
      console.error('Error fetching page:', error.body || error);
      throw new Error('Failed to fetch page');
    }
  }
  async getPageRaw(pageId: string) {
    try {
      const page = await this.notionAPI.getPageRaw(pageId);

      return page;
    } catch (error: any) {
      console.error('Error fetching page:', error.body || error);
      throw new Error('Failed to fetch page');
    }
  }
  async getBlocks(blockIds: string[], gotOptions?: any) {
    try {
      const page = await this.notionAPI.getBlocks(blockIds, gotOptions);

      return page;
    } catch (error: any) {
      console.error('Error fetching page:', error.body || error);
      throw new Error('Failed to fetch page');
    }
  }

  // /**
  //  * 获取带筛选和分类的数据库列表
  //  * @param databaseId - 数据库ID
  //  * @param viewId - 视图ID // 从 URL 中获取 viewId： https://www.notion.so/workspace/[database-id]?v=[view-id]，如果没有 v= 参数，说明是默认视图
  //  * @param filters - 筛选条件
  //  * @param groupBy - 分组字段
  //  * @param sorts - 排序条件
  //  */
  // async getFilteredDatabaseList({
  //   databaseId,
  //   viewId,
  //   filters = [],
  //   groupBy,
  //   sorts = [],
  //   limit = 100,
  // }: {
  //   databaseId: string;
  //   viewId: string;
  //   filters?: Array<{
  //     property: string;
  //     operator: string;
  //     value: any;
  //   }>;
  //   groupBy?: string;
  //   sorts?: Array<{
  //     property: string;
  //     direction: "ascending" | "descending";
  //   }>;
  //   limit?: number;
  // }) {
  //   try {
  //     // 1. 首先获取数据库的基本信息
  //     const pageData = await this.notionAPI.getPageRaw(databaseId);
  //     const block = Object.values(pageData.recordMap.block)[0]?.value;

  //     // 2. 获取 collectionId

  //     const collectionId = block?.collection_id;
  //     const collectionViewId = block?.view_ids?.[0]; // 默认拿第一个table视图的id
  //     if (!collectionId) {
  //       throw new Error("无法获取数据库信息");
  //     }

  //     // 3. 构建视图配置
  //     // const collectionView = {
  //     //   ...pageData.recordMap.collection_view[collectionViewId]?.value,
  //     //   type: "table",
  //     //   format: {
  //     //     // 转换筛选条件格式
  //     //     property_filters: filters.map((filter) => ({
  //     //       filter: {
  //     //         filter: {
  //     //           operator: filter.operator,
  //     //           value: {
  //     //             type: "exact",
  //     //             value: filter.value,
  //     //           },
  //     //         },
  //     //         property: filter.property,
  //     //       },
  //     //     })),
  //     //     // 添加分组配置
  //     //     ...(groupBy && { collection_group_by: groupBy }),
  //     //   },
  //     //   // 添加排序配置
  //     //   query2: {
  //     //     sort: sorts,
  //     //   },
  //     // };

  //     const collectionView = {
  //       id: "2854f227-6e33-476a-b81b-80b1ec908031",
  //       version: 22,
  //       type: "table",
  //       format: {
  //         table_properties: [
  //           [Object],
  //           [Object],
  //           [Object],
  //           [Object],
  //           [Object],
  //           [Object],
  //           [Object],
  //           [Object],
  //           [Object],
  //           [Object],
  //         ],
  //         collection_peek_mode: "full_page",
  //         table_frozen_column_index: -1,
  //         table_subitem_toggle_column: "title",
  //         property: "tags",
  //         multi_select: {
  //           contains: "Notion",
  //         },
  //       },
  //       parent_id: "f8e57fe3-eba2-4a15-ae08-ab9071cb51ba",
  //       parent_table: "block",
  //       alive: true,
  //       page_sort: [
  //         "7aa5057b-de28-4701-ac83-51c0c3c1f7dd",
  //         "4b5b438b-9345-4e7c-a953-55ad20cf2ca1",
  //         "83b47629-2db3-49b4-b9b7-c33c0f838c7b",
  //         "dc94f3ab-b27d-4a1f-803b-5e350f5196f6",
  //         "733e6b9a-d06a-42b2-93fa-54d757fc3fb3",
  //         "1537a1cf-c7e9-4f82-965e-5500acaa9603",
  //         "d01396c7-ff6c-4959-8327-9521d18dd550",
  //         "b1fb78da-4caa-487e-817c-0f9261acf6aa",
  //         "3a3d8be0-7525-4a60-ae58-7488303f27bd",
  //         "4c24d804-b1dd-4ad8-b77a-ffb6f3b4a149",
  //         "fd98448e-ad66-4d49-a5e8-510d370619ac",
  //         "a1850b68-1d74-4efd-83fb-602103fe0d6b",
  //         "49cbb563-5ae3-40be-895f-6b3d85629339",
  //         "361b6493-98cb-4c13-80fe-564951875e93",
  //         "9bd548f2-7348-46de-8b17-660f1bab001c",
  //         "2ee43a2f-f7c0-451a-970d-409cd8478d80",
  //         "b627f639-abb6-4359-ad2a-e6153f514109",
  //         "ca2ec9ef-f72c-47a6-867b-e1e32c16416e",
  //         "81c3613a-563d-4ca3-93a7-d0d4685ba902",
  //         "2ad96c20-feaa-458a-80bd-18702ba88ebc",
  //         "80c3a906-187a-4d31-8b69-bea82d23a7c0",
  //         "2d2a4c03-556c-4fbb-b0cd-8165b35ec503",
  //         "e9b28610-eea9-4b3e-9b1a-9db5a311d635",
  //         "afa8373a-540e-4c72-ba34-22cb19524059",
  //         "9203ef40-f4d8-49fe-8251-501bb56c20eb",
  //         "8e3f8910-33a3-4508-ad75-6838c334aaaa",
  //         "14537ff3-d354-8010-83d0-f69cd8ee40f0",
  //         "0f86e0d5-a404-470d-9718-8ea0c4d8eec9",
  //         "3a9d7568-4eed-4a9c-8024-d78755d7c01f",
  //         "11d37ff3-d354-8052-a3ea-ee0c705c9a21",
  //         "11d37ff3-d354-8063-bc90-d1216e99dadb",
  //         "11d37ff3-d354-803f-8160-d43d4dbedb47",
  //         "17c37ff3-d354-80b3-8632-e500b666e6ac",
  //       ],
  //       query2: { sort: [[Object]] },
  //       space_id: "4f823732-8ccd-4587-af24-24d3e1443663",
  //     };

  //     console.log("collectionViewcollectionView", collectionView);
  //     debugger;

  //     // 4. 获取集合数据
  //     const response = await this.notionAPI.getCollectionData(
  //       collectionId,
  //       collectionViewId,
  //       collectionView,
  //       {
  //         limit,
  //         loadContentCover: true,
  //       }
  //     );
  //     console.log("responseresponseresponse", response);
  //     // 5. 处理返回的数据
  //     const collection = response?.recordMap?.collection ? Object.values(response.recordMap.collection)[0]?.value : null;
  //     const pages = response.recordMap.block ? Object.values(response.recordMap.block)
  //       .filter((block) => block.value.parent_id === databaseId)
  //       .map((block) => {
  //         const page = block.value;
  //         const properties = page.properties || {};

  //         // 将属性转换为更易用的格式
  //         const formattedProperties: Record<string, any> = {};
  //         Object.entries(properties).forEach(([key, value]) => {
  //           // 在collection.schema中查找属性的名称
  //           const propertySchema = collection?.schema?.find(
  //             (schema: any) => schema.id === key
  //           );

  //           if (propertySchema) {
  //             // 使用属性的实际名称作为键
  //             formattedProperties[propertySchema.name] = value?.[0]?.[0]?.text?.content?.text?.text;
  //           }
  //         });

  //         return {
  //           id: page.id,
  //           title: formattedProperties["标题"] || "无标题",
  //           properties: formattedProperties,
  //           created_time: page.created_time,
  //           last_edited_time: page.last_edited_time,
  //         };
  //       });
  //     console.log("pagespagespagespages", pages);
  //     return {
  //       pages,
  //       total: pages.length,
  //       collection,
  //     };
  //   } catch (error) {
  //     console.error("获取数据库列表失败:", error);
  //     throw error;
  //   }
  // }

  // /**
  //  * 处理集合数据
  //  * @param collectionData - 原始集合数据
  //  */
  // private processCollectionData(collectionData: any) {
  //   // 提取记录
  //   const { recordMap } = collectionData;
  //   const entries = Object.values(recordMap.block)
  //     .filter(
  //       (block: any) => block.value.parent_id === collectionData.collection.id
  //     )
  //     .map((block: any) => {
  //       const value = block.value;
  //       return {
  //         id: value.id,
  //         title: value.properties?.title?.[0]?.[0] || "",
  //         // 根据你的数据结构添加其他字段
  //         category: value.properties?.category?.[0]?.[0] || "",
  //         tags: value.properties?.tags?.[0] || [],
  //         date: value.properties?.date?.[0]?.[1]?.[0]?.[1]?.start_date || "",
  //         // ... 其他属性
  //       };
  //     });

  //   return {
  //     entries,
  //     total: entries.length,
  //     // 如果有分组，处理分组数据
  //     groups:
  //       collectionData.result?.reducerResults?.collection_group_results
  //         ?.groupResults || [],
  //   };
  // }
}
export default NotionServer;
