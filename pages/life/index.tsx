import { GetStaticProps } from 'next';
// import NotionService from "@/lib/notion/NotionServer";
import { NOTION_POST_ID } from '@/lib/constants';
import NotionPage from '@/components/Notion/NotionPage';
import getPage from '@/lib/notion/getPage';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  const post = await getPage({
    pageId: NOTION_POST_ID,
    from: 'post-index',
  });

  return {
    props: {
      post: post,
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 10,
  };
};
const Post = ({ post }: any) => {
  return (
    <div className='pt-[190px]'>
      <NotionPage recordMap={post} />
    </div>
  );
};
export default Post;
