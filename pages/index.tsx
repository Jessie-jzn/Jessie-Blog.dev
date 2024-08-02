import { GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import { NOTION_HOME_ID } from "@/lib/constants";
import NotionPage from "@/components/NotionPage";
const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async () => {
  const post = await notionService.getPage(NOTION_HOME_ID);

  return {
    props: {
      post,
    },
    revalidate: 10,
  };
};
const Home = ({ post }: any) => {
  return (
    <>
      <NotionPage recordMap={post} />
    </>
  );
};
export default Home;
