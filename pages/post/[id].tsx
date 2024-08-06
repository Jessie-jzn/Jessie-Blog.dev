import { GetStaticPaths, GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import { Post } from "@/lib/type";
// import * as API from '@/lib/api/guide';
import { NOTION_POST_ID } from "@/lib/constants";
import getDataBaseList from "@/lib/notion/getDataBaseList";

import React from "react";
import NotionPage from "@/components/NotionPage";

const notionService = new NotionService();

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postId = params?.id as string;
  // console.log('idToUuid(postId)', idToUuid(postId));
  const post = await notionService.getPage(postId);

  return {
    props: {
      post: post,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  //   if (isDev) {
  //     return {
  //       paths: [],
  //       fallback: true,
  //     };
  //   }

  const posts = await getDataBaseList({
    pageId: NOTION_POST_ID,
    from: "post-id",
  });

  const paths = (posts.pageIds as any).map((post: any) => ({
    params: { id: post },
  }));

  console.log("pathspathspathspathspaths", paths);

  return {
    paths,
    fallback: true,
  };
};

const RenderPost = ({ post }: any): React.JSX.Element => {
  return (
    <div className="flex-auto mx-auto w-full">
      <NotionPage recordMap={post} />
    </div>
  );
};

export default RenderPost;
