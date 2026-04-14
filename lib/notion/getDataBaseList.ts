/**
 * 文章数据库列表的统一入口（门面 / Facade）。
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ 默认路径：官方 Notion Integration（@notionhq/client）                      │
 * │   · databases.query 分页拉取数据库行，只请求元数据，比拉整页 recordMap 轻 │
 * │   · 需配置：NOTION_API_KEY（secret_ 或 ntn_ 等 Integration token）         │
 * │   · 需配置：NOTION_POST_DATABASE_ID / NOTION_GUIDE_DATABASE_ID（库本体 ID）│
 * │   · 需在 Notion 里把对应数据库共享给该 Integration                         │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ 回退路径：旧版 getDataBaseListLegacy（NotionAPI / api/v3）                 │
 * │   · 设置 USE_OFFICIAL_NOTION_LIST=false 可强制走旧版                       │
 * │   · 或未配置官方 database_id 时自动回退并打警告日志                       │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * 注意：单篇正文渲染（ExtendedRecordMap + react-notion-x）仍由 NotionServer.getPage 负责，
 * 不在本文件；官方 API 与 react-notion-x 的数据结构不同，列表与正文分层是刻意为之的「少改动」策略。
 */
import * as Types from "@/lib/type";
import type { GetDataBaseListResult } from "@/lib/type";
import getDataBaseListOfficial from "@/lib/notion/getDataBaseListOfficial";
import getDataBaseListLegacy from "@/lib/notion/getDataBaseListLegacy";
import { getOfficialDatabaseIdForPage } from "@/lib/notion/officialDatabaseId";

/** 重新导出，保持 getSinglePostData 等文件的 import 路径不变：`from "./getDataBaseList"` */
export { getTagOptions } from "./notionSchemaOptions";

/**
 * 是否尝试使用官方 `databases.query`。
 * - 未设置或任意非 `false` 的值：启用（在能解析出 database_id 的前提下）；
 * - `false`：始终使用旧版 api/v3 列表逻辑。
 */
function isOfficialListEnabled(): boolean {
  return process.env.USE_OFFICIAL_NOTION_LIST !== "false";
}

/**
 * 获取数据库中的文章列表、分类聚合、标签、slug 映射等。
 *
 * @param pageId - 与历史代码一致：一般为 `NOTION_POST_ID` / `NOTION_GUIDE_ID` 等「页面/数据源」标识；
 *                 官方路径下会通过 officialDatabaseId 映射到真正的 database_id。
 * @param from - 调用来源字符串，仅用于日志与排查。
 * @param filter - 可选，对解析后的 Post 数组再过滤。
 */
export default async function getDataBaseList(
  params: Types.NotionPageParamsProp
): Promise<GetDataBaseListResult> {
  const { pageId, from, filter } = params;

  const databaseId = getOfficialDatabaseIdForPage(pageId);

  if (isOfficialListEnabled() && databaseId) {
    try {
      console.log("[getDataBaseList] official notion databases.query", {
        pageId,
        databaseId,
        from,
      });
      return await getDataBaseListOfficial({
        databaseId,
        from,
        filter,
      });
    } catch (err) {
      console.error(
        "[getDataBaseList] 官方 API 拉取失败，回退到 legacy。错误：",
        err
      );
      return getDataBaseListLegacy(params);
    }
  }

  if (isOfficialListEnabled() && !databaseId) {
    console.warn(
      "[getDataBaseList] 未解析到官方 database_id（请检查 NOTION_POST_DATABASE_ID / NOTION_GUIDE_DATABASE_ID 与 NOTION_*_ID 是否匹配），使用 legacy 列表。"
    );
  }

  return getDataBaseListLegacy(params);
}
