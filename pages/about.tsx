import { GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import { NOTION_ABOUT_ID } from "@/lib/constants";
import NotionPage from "@/components/Notion/NotionPage";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  const post = await notionService.getPage(NOTION_ABOUT_ID);

  return {
    props: {
      post,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 10,
  };
};
const About = ({ post }: any) => {
  return (
    <div className="pt-[190px]">
      <NotionPage recordMap={post} />
    </div>
  );
};
export default About;
