import { GetStaticPaths, GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import { Post } from "@/lib/type";
// import * as API from '@/lib/api/guide';
import { NOTION_POST_ID } from "@/lib/constants";
import getDataBaseList from "@/lib/notion/getDataBaseList";

import React from "react";
import NotionPage from "@/components/Notion/NotionPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PostDetailLayout from "@/components/layouts/PostDetailLayout";

const notionService = new NotionService();

export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
}: any) => {
  const postId = params?.id as string;
  const post = await notionService.getPage(postId);

  return {
    props: {
      post: post,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 100,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getDataBaseList({
    pageId: NOTION_POST_ID,
    from: "post-id",
  });

  const paths = (posts.pageIds as any).map((post: any) => ({
    params: { id: post },
  }));

  return {
    paths,
    fallback: true,
  };
};

const PostDetail = ({ post }: any): React.JSX.Element => {
  return (
    <>
      {/* <div className="flex-auto mx-auto w-full  pt-[190px]"> */}
      <NotionPage recordMap={post} />
      {/* </div> */}
    </>
  );
};

PostDetail.getLayout = (page: React.ReactElement) => {
  return <PostDetailLayout>{page}</PostDetailLayout>;
};

export default PostDetail;
