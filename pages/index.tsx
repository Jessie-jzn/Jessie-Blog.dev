import { GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import { NOTION_HOME_ID } from "@/lib/constants";
import NotionPage from "@/components/NotionPage";
import SiteConfig from "../site.config";
import HomeLayout from "@/components/HomeLayout";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  const post = await notionService.getPage(NOTION_HOME_ID);

  return {
    props: {
      post,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 10,
  };
};
const Home = ({ post }: any) => {
  return (
    <>
      {SiteConfig.useCustomHomeLayout ? (
        <HomeLayout />
      ) : (
        <NotionPage recordMap={post} />
      )}
    </>
  );
};
export default Home;
