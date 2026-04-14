/**
 * 动态 sitemap API：文章列表来自 getDataBaseList（Post 已含 title/slug 等），勿再访问不存在的 page.properties。
 */
import { NextApiRequest, NextApiResponse } from "next";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { NOTION_POST_ID } from "@/lib/constants";
import { generateSitemapXML } from "@/lib/services/sitemapGenerator";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 获取所有文章
    const response = await getDataBaseList({
      pageId: NOTION_POST_ID,
      from: "sitemap",
    });

    // allPages 已是 getDataBaseList 映射后的 Post（title/tags/pageCover 等），无需再读 properties.*
    const posts = response?.allPages ?? [];

    // 生成站点地图
    const sitemap = generateSitemapXML(posts);

    // 设置正确的内容类型
    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=1200, stale-while-revalidate=600"
    );

    return res.status(200).send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).json({ error: "Error generating sitemap" });
  }
}
