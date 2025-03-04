import { NotionAPI } from "./NotionAPI";

export async function getDatabaseViews(databaseId: string) {
  const api = new NotionAPI();

  // 首先获取数据库页面数据
  const page = await api.getPageRaw(databaseId);
  const recordMap = page?.recordMap;

  if (!recordMap?.collection_view) {
    throw new Error("No collection views found");
  }

  // 提取所有视图信息
  const views = Object.entries(recordMap.collection_view).map(([id, view]) => ({
    id,
    name: view.value.name,
    type: view.value.type, // 'table', 'gallery', 'list', 'board', 'calendar'
  }));

  return views;
}
