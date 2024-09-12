import { GetStaticPaths, GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import React from "react";
import NotionPage from "@/components/Notion/NotionPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SiteConfig from "@/site.config";

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
  const paths = [];

  for (const [databaseId, routePrefix] of Object.entries(SiteConfig.databaseMapping)) {
    if (databaseId) {
      const posts = await getDataBaseList({
        pageId: databaseId,
        from: "post-id",
      });

      if (posts.pageIds) {
        paths.push(...posts.pageIds.map((postId: string) => ({
          params: { category: routePrefix, id: postId },
        })));
      }
    }
  }

  return {
    paths,
    fallback: true,
  };
};
// export async function getServerSideProps({ params, locale }) {
//   const notionAPI = new NotionAPI()
//   const pageData = await notionAPI.getPage(params.slug, 'zh') // 始终获取中文版本
//   return { props: { pageData } }
// }
const RenderPost = ({ post }: any): React.JSX.Element => {
  return (
    <>
      <div className="flex-auto mx-auto w-full pt-[190px]">
        <NotionPage recordMap={post} />
      </div>
    </>
  );
};

export default RenderPost;