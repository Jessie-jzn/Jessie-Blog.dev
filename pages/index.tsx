import { GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import { NOTION_HOME_ID } from "@/lib/constants";
import NotionPage from "@/components/Notion/NotionPage";
import SiteConfig from "@/site.config";
import HomeLayout from "@/components/CustomLayout/HomeLayout";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { NOTION_POST_ID, NOTION_POST_EN_ID } from "@/lib/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { baiduTranslate } from '@/lib/baidu/baiduTranslate';
import { useEffect } from "react";

const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  let posts;
  // 根据语言选择不同的 Notion ID
  const notionPostId = locale === "en" ? NOTION_POST_EN_ID : NOTION_POST_ID;

  if (!SiteConfig.useCustomHomeLayout) {
    posts = await notionService.getPage(NOTION_HOME_ID);
  } else {
    const response = await getDataBaseList({
      pageId: notionPostId,
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

  async function main() {
    try {
      const translatedText = await baiduTranslate('Hello, world!', 'en', 'zh');
      console.log('Translated text:', translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    }
  }
  useEffect(()=>{
    main();

  },[])
  
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
