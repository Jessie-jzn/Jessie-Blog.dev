import { GetStaticPaths, GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import getSinglePostData from "@/lib/notion/getSinglePostData";
import React from "react";
import NotionPage from "@/components/Notion/NotionPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import * as Type from "@/lib/type";
import { ExtendedRecordMap } from "notion-types";
import { getRelatedPosts } from "@/lib/services/RelatedPostsService";
import { NOTION_POST_ID } from "@/lib/constants";
import GiscusComments from '@/components/GiscusComments'

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
  console.log("params", params);

  if (!params) {
    return { notFound: true };
  }

  try {
    const { id: slug } = params;

    const databaseId = NOTION_POST_ID; // 使用默认的 databaseId
    console.log("databaseId", databaseId);
    console.log("slug", slug);

    // 获取数据库和短链接映射
    const { slugMap } = await getDataBaseList({
      pageId: databaseId,
      from: "post-id",
    });

    console.log("slugMap:", slugMap); // 添加日志查看 slugMap

    let resolvedPostId = slug;

    // 如果是短链接，映射为实际的 postId
    resolvedPostId = slugMap?.[slug] ?? "";

    if (!resolvedPostId) {
      return { notFound: true }; // 如果找不到对应的 postId，则返回 404
    }

    // 查询实际的页面数据
    const recordMap = await notionService.getPage(resolvedPostId);
    if (!recordMap) {
      return { notFound: true };
    }

    const collection =
      (Object.values(recordMap.collection)[0] as any)?.value || {};
    const schema = collection?.schema;
    const block = recordMap.block[resolvedPostId]?.value;

    // 并行获取数据
    const [postData, relatedArticles] = await Promise.all([
      getSinglePostData(resolvedPostId, block, schema),
      getRelatedPosts(resolvedPostId, databaseId, block, schema),
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
    console.error("Error in getStaticProps:", error); // 打印详细错误信息
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { category: string; id: string } }[] = [];

  const databaseId = NOTION_POST_ID; // 使用默认的 databaseId
  const {
    pageIds = [],
    slugMap,
    categoryMap,
  } = await getDataBaseList({
    pageId: databaseId,
    from: "post-id",
  });

  // 为每个分类下的文章添加路径
  if (categoryMap) {
    Object.entries(categoryMap).forEach(([category, data]: [string, any]) => {
      const articles = data.articles || [];
      articles.forEach((article: any) => {
        // 如果文章有 slug，使用 slug 作为 id
        if (article.slug) {
          paths.push({
            params: { category, id: article.slug },
          });
        }
        // 同时添加文章 ID 作为备选路径
        paths.push({
          params: { category, id: article.id },
        });
      });
    });
  }

  // 为每个短链接添加路径
  if (slugMap) {
    Object.entries(slugMap).forEach(([slug, postId]: [string, string]) => {
      // 查找文章所属的分类
      const articleCategory =
        Object.entries(categoryMap || {}).find(([_, data]: [string, any]) =>
          data.articles?.some((article: any) => article.id === postId)
        )?.[0] || "default";

      paths.push({
        params: { category: articleCategory, id: slug },
      });
    });
  }

  // 为每个页面 ID 添加路径
  if (pageIds) {
    pageIds.forEach((postId: string) => {
      // 查找文章所属的分类
      const articleCategory =
        Object.entries(categoryMap || {}).find(([_, data]: [string, any]) =>
          data.articles?.some((article: any) => article.id === postId)
        )?.[0] || "default";

      paths.push({
        params: { category: articleCategory, id: postId },
      });
    });
  }

  return {
    paths,
    fallback: true, // 使用 true 以便支持增量静态生成
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
}) => {
  return (
    <div className="prose mx-auto">
      <NotionPage
        recordMap={recordMap}
        postData={postData}
        relatedPosts={relatedPosts}
      />
      <div className="mx-10 xs:mx-0 px-16 mb-10 xs:px-4">
        <GiscusComments />
      </div>
    </div>

  );
};

export default RenderPost;
