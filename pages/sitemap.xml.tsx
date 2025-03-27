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
