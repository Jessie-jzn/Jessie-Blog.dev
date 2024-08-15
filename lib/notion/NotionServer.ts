import { NotionAPI } from "./NotionAPI";
import { NOTION_TOKEN } from "@/lib/constants";
if (!NOTION_TOKEN) {
  throw new Error("NOTION_TOKEN is not defined");
}

class NotionService {
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
}
export default NotionService;
