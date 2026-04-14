import { GetStaticPaths, GetStaticProps } from 'next';
import NotionService from '@/lib/notion/NotionServer';
import { NOTION_POST_ID } from '@/lib/constants';
import getDataBaseList from '@/lib/notion/getDataBaseList';

import React from 'react';
import { useRouter } from 'next/router';
import NotionPage from '@/components/Notion/NotionPage';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PostDetailLayout from '@/components/layouts/PostDetailLayout';

const notionService = new NotionService();

export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
}: any) => {
  const postId = params?.id as string;
  console.log("postId", postId);
  const post = await notionService.getPage(postId);

  return {
    props: {
      post: post ?? null,
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getDataBaseList({
    pageId: NOTION_POST_ID,
    from: 'post-id',
  });

  const paths = (posts.pageIds ?? []).map((post: any) => ({
    params: { id: post },
  }));

  return {
    paths,
    fallback: true,
  };
};

const PostDetail = ({ post }: any): React.JSX.Element => {
  const router = useRouter();

  if (router.isFallback || !post) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <NotionPage recordMap={post} />
    </>
  );
};

PostDetail.getLayout = (page: React.ReactElement) => {
  return <PostDetailLayout>{page}</PostDetailLayout>;
};

export default PostDetail;
