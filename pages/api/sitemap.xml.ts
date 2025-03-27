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

    // 处理文章数据
    const posts =
      response?.allPages?.map((page) => ({
        ...page,
        tags: page.properties.Tags.select.options.map(
          (option: { text: { content: [{ text: { content: string } }] } }) =>
            option.text.content[0].text.content
        ),
        title: page.properties.Name.title[0].text.content[0].text.content,
        pageCover: page.properties.PageCover.files[0].file_url,
        pageCoverThumbnail: page.properties.PageCover.files[0].file_url,
      })) || [];

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
