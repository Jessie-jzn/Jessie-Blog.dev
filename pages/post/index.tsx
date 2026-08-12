/**
 * 文章聚合页：从 Notion 获取文章库页面记录并以可再生静态页面展示。
 */
import { GetStaticProps } from 'next';
// import NotionService from "@/lib/notion/NotionServer";
import { NOTION_POST_ID } from '@/lib/constants';
import NotionPage from '@/components/Notion/NotionPage';
import getPage from '@/lib/notion/getPage';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import PageHeader from '@/components/common/PageHeader';

// const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  const post = await getPage({
    pageId: NOTION_POST_ID,
    from: 'post-index',
  });

  return {
    props: {
      post: post,
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
    revalidate: 10,
  };
};
const Post = ({ post }: any) => {
  const { t } = useTranslation('common');

  return (
    <div className='min-h-[60vh] bg-canvas text-ink'>
      <PageHeader
        eyebrow={t('site.title')}
        title={t('post')}
        description={t('site.description')}
      />
      <NotionPage recordMap={post} />
    </div>
  );
};
export default Post;
