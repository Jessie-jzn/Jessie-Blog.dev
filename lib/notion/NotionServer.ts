import { NotionAPI } from "./NotionAPI";
import { NOTION_TOKEN } from "@/lib/constants";
import { getBlockCollectionId } from "@/lib/notion-utils";
if (!NOTION_TOKEN) {
  throw new Error("NOTION_TOKEN is not defined");
}

class NotionServer {
  private notionAPI: NotionAPI;

  constructor() {
    this.notionAPI = new NotionAPI({
      apiBaseUrl: process.env.NOTION_API_BASE_URL,
    });
  }
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
      console.error("Error fetching page:", error.body || error);
      throw new Error("Failed to fetch page");
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
      console.error("Error fetching page:", error.body || error);
      throw new Error("Failed to fetch page");
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
      console.error("Error fetching page:", error.body || error);
      throw new Error("Failed to fetch page");
    }
  }
  async getPageRaw(pageId: string) {
    try {
      const page = await this.notionAPI.getPageRaw(pageId);

      return page;
    } catch (error: any) {
      console.error("Error fetching page:", error.body || error);
      throw new Error("Failed to fetch page");
    }
  }
  async getBlocks(blockIds: string[], gotOptions?: any) {
    try {
      const page = await this.notionAPI.getBlocks(blockIds, gotOptions);

      return page;
    } catch (error: any) {
      console.error("Error fetching page:", error.body || error);
      throw new Error("Failed to fetch page");
    }
  }

  /**
   * 获取带筛选和分类的数据库列表
   * @param databaseId - 数据库ID
   * @param viewId - 视图ID // 从 URL 中获取 viewId： https://www.notion.so/workspace/[database-id]?v=[view-id]，如果没有 v= 参数，说明是默认视图
   * @param filters - 筛选条件
   * @param groupBy - 分组字段
   * @param sorts - 排序条件
   */
  async getFilteredDatabaseList({
    databaseId,
    viewId,
    filters = [],
    groupBy,
    sorts = [],
    limit = 100,
  }: {
    databaseId: string;
    viewId: string;
    filters?: Array<{
      property: string;
      operator: string;
      value: any;
    }>;
    groupBy?: string;
    sorts?: Array<{
      property: string;
      direction: "ascending" | "descending";
    }>;
    limit?: number;
  }) {
    try {
      // 1. 首先获取数据库的基本信息
      const pageData = await this.notionAPI.getPageRaw(databaseId);
      const block = Object.values(pageData.recordMap.block)[0]?.value;

      // 2. 获取 collectionId

      const collectionId = block?.collection_id;
      const collectionViewId = block?.view_ids?.[0]; // 默认拿第一个table视图的id
      if (!collectionId) {
        throw new Error("无法获取数据库信息");
      }
      console.log(
        "pageDatapageDatapageDatapageData",
        pageData.recordMap.collection_view[collectionViewId]?.value
      );
      console.log("blockblockblockblockblock", block);

      console.log("collectionIdcollectionIdcollectionId", collectionId);
      console.log(
        "collectionViewIdcollectionViewIdcollectionViewIdcollectionViewId",
        collectionViewId
      );
      // 3. 构建视图配置
      const collectionView = {
        ...pageData.recordMap.collection_view[collectionViewId]?.value,
        type: "table",
        format: {
          // 转换筛选条件格式
          property_filters: filters.map((filter) => ({
            filter: {
              filter: {
                operator: filter.operator,
                value: {
                  type: "exact",
                  value: filter.value,
                },
              },
              property: filter.property,
            },
          })),
          // 添加分组配置
          ...(groupBy && { collection_group_by: groupBy }),
        },
        // 添加排序配置
        query2: {
          sort: sorts,
        },
      };

      // 4. 获取集合数据
      const response = await this.notionAPI.getCollectionData(
        collectionId,
        collectionViewId,
        collectionView,
        {
          limit,
          loadContentCover: true,
        }
      );
      console.log("responseresponseresponse", response);

      // 5. 处理返回的数据
      const collection = Object.values(response.recordMap.collection)[0]?.value;
      const pages = Object.values(response.recordMap.block)
        .filter((block) => block.value.parent_id === databaseId)
        .map((block) => {
          const page = block.value;
          const properties = page.properties || {};

          // 将属性转换为更易用的格式
          const formattedProperties: Record<string, any> = {};
          Object.entries(properties).forEach(([key, value]) => {
            // 在collection.schema中查找属性的名称
            const propertySchema = Object.entries(collection.schema).find(
              ([_, schema]) => schema.id === key
            )?.[1];

            if (propertySchema) {
              // 使用属性的实际名称作为键
              formattedProperties[propertySchema.name] = value?.[0]?.[0];
            }
          });

          return {
            id: page.id,
            title: formattedProperties["标题"] || "无标题",
            properties: formattedProperties,
            created_time: page.created_time,
            last_edited_time: page.last_edited_time,
          };
        });

      return {
        pages,
        total: pages.length,
        collection,
      };
    } catch (error) {
      console.error("获取数据库列表失败:", error);
      throw error;
    }
  }

  /**
   * 处理集合数据
   * @param collectionData - 原始集合数据
   */
  private processCollectionData(collectionData: any) {
    // 提取记录
    const { recordMap } = collectionData;
    const entries = Object.values(recordMap.block)
      .filter(
        (block: any) => block.value.parent_id === collectionData.collection.id
      )
      .map((block: any) => {
        const value = block.value;
        return {
          id: value.id,
          title: value.properties?.title?.[0]?.[0] || "",
          // 根据你的数据结构添加其他字段
          category: value.properties?.category?.[0]?.[0] || "",
          tags: value.properties?.tags?.[0] || [],
          date: value.properties?.date?.[0]?.[1]?.[0]?.[1]?.start_date || "",
          // ... 其他属性
        };
      });

    return {
      entries,
      total: entries.length,
      // 如果有分组，处理分组数据
      groups:
        collectionData.result?.reducerResults?.collection_group_results
          ?.groupResults || [],
    };
  }
}
export default NotionServer;
