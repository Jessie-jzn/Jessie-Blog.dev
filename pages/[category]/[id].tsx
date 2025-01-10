import { GetStaticPaths, GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import getSinglePostData from "@/lib/notion/getSinglePostData";
import React from "react";
import NotionPage from "@/components/Notion/NotionPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SiteConfig from "@/site.config";
import * as Type from "@/lib/type";
import { ExtendedRecordMap } from "notion-types";
import { getDatabaseId } from "@/lib/util";
import { getRelatedPosts } from "@/lib/services/RelatedPostsService";

const notionService = new NotionService();

interface StaticProps {
  params: {
    category: string;
    id: string;
  };
  locale: string;
}

export const getStaticProps: GetStaticProps<
  any,
  { category: string; id: string }
> = async ({ params, locale }) => {
  if (!params) {
    return { notFound: true };
  }
  try {
    const category = params.category;
    const postId = params.id;
    const databaseId = getDatabaseId(category);

    if (!databaseId) {
      return { notFound: true };
    }

    const recordMap = await notionService.getPage(postId);
    if (!recordMap) {
      return { notFound: true };
    }

    const collection =
      (Object.values(recordMap.collection)[0] as any)?.value || {};
    const schema = collection?.schema;
    const block = recordMap.block[postId]?.value;

    // 并行获取数据
    const [postData, relatedArticles] = await Promise.all([
      getSinglePostData(postId, block, schema),
      getRelatedPosts(postId, databaseId, block, schema),
    ]);

    if (!postData) {
      return { notFound: true };
    }

    return {
      props: {
        recordMap,
        postData,
        relatedPosts: relatedArticles,
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
      revalidate: 100,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];

  for (const [databaseId, routePrefix] of Object.entries(
    SiteConfig.databaseMapping
  )) {
    if (databaseId) {
      const response = await getDataBaseList({
        pageId: databaseId,
        from: "post-id",
      });

      if (response.pageIds) {
        paths.push(
          ...response.pageIds.map((postId: string) => ({
            params: { category: routePrefix, id: postId },
          }))
        );
      }
    }
  }

  return {
    paths,
    fallback: true,
  };
};

interface RenderPostProps {
  recordMap: ExtendedRecordMap;
  postData: Type.PostData;
  relatedPosts: Type.PostData[];
}

const RenderPost: React.FC<RenderPostProps> = ({
  recordMap,
  postData,
  relatedPosts,
}): React.JSX.Element => {
  return (
    <NotionPage
      recordMap={recordMap}
      postData={postData}
      relatedPosts={relatedPosts}
    />
  );
};

export default RenderPost;
