/**
 * SSR sitemap 页面：数据源与 api/sitemap.xml 一致，使用 getDataBaseList 返回的 Post[]。
 */
import { GetServerSideProps } from "next";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { NOTION_POST_ID } from "@/lib/constants";
import { generateSitemapXML } from "@/lib/services/sitemapGenerator";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const response = await getDataBaseList({
      pageId: NOTION_POST_ID,
      from: "sitemap",
    });
    const posts = response?.allPages ?? [];
    const sitemap = generateSitemapXML(posts);

    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=1200, stale-while-revalidate=600"
    );
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return {
      notFound: true,
    };
  }
};

// 返回空组件
export default function Sitemap() {
  return null;
}
