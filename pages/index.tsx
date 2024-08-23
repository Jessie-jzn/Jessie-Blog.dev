import { GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import { NOTION_HOME_ID } from "@/lib/constants";
import NotionPage from "@/components/NotionPage";
import SiteConfig from "@/site.config";
import HomeLayout from "@/components/CustomLayout/HomeLayout";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { NOTION_POST_ID } from "@/lib/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  let posts;
  if (!SiteConfig.useCustomHomeLayout) {
    posts = await notionService.getPage(NOTION_HOME_ID);
  } else {
    const response = await getDataBaseList({
      pageId: NOTION_POST_ID,
      from: "home-index",
    });
    posts = response.allPages?.slice(0, 15) || [];
  }

  return {
    props: {
      posts,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 10,
  };
};
const Home = ({ posts }: any) => {
  return (
    <>
      {SiteConfig.useCustomHomeLayout ? (
        <HomeLayout posts={posts} />
      ) : (
        <NotionPage recordMap={posts} />
      )}
    </>
  );
};
export default Home;
