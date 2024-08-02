import { GetStaticProps } from "next";
// import NotionService from "@/lib/notion/NotionServer";
import { NOTION_POST_ID } from "@/lib/constants";
import NotionPage from "@/components/NotionPage";
import getPage from "@/lib/notion/getPage";
// const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async () => {
  const post = await getPage({
    pageId: NOTION_POST_ID,
    from: "post-index",
  });

  return {
    props: {
      post: post,
    },
    revalidate: 10,
  };
};
const Post = ({ post }: any) => {
  return (
    <>
      <NotionPage recordMap={post} />
    </>
  );
};
export default Post;
