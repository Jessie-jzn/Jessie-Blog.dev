import { GetStaticPaths, GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import getSinglePostData from "@/lib/notion/getSinglePostData";
import React from "react";
import { useRouter } from "next/router";
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
    const databaseId = NOTION_POST_ID;

    // 拉取数据库列表：同时得到 slugMap、allPages 和 schema 相关数据
    const dbResult = await getDataBaseList({
      pageId: databaseId,
      from: "post-id",
    });
    const { slugMap, allPages = [] } = dbResult;

    // slug → 实际 pageId
    const resolvedPostId = slugMap?.[slug] ?? "";
    if (!resolvedPostId) {
      console.warn(`[getStaticProps] slug "${slug}" 未找到对应 pageId`);
      return { notFound: true };
    }

    // 查询页面正文（ExtendedRecordMap），供 react-notion-x 渲染
    const recordMap = await notionService.getPage(resolvedPostId);
    if (!recordMap) {
      return { notFound: true };
    }

    // ---- postData 获取策略 ----
    // 优先从 allPages 中按 id 查找（官方 API 已包含完整元数据），
    // 避免依赖 recordMap.collection（notion-compat 不返回 collection）。
    let postData: any = null;

    const matchedPost = allPages.find(
      (p) => p.id.replace(/-/g, "") === resolvedPostId.replace(/-/g, "")
    );

    if (matchedPost) {
      // allPages 里的 Post 已包含 title / tags / slug / category 等，直接用
      postData = {
        id: matchedPost.id,
        title: matchedPost.title ?? "",
        keywords: "",
        summarize: matchedPost.summarize ?? "",
        type: matchedPost.type === "Post" ? "Post" : "Page",
        status: matchedPost.status === "Published" ? "Published" : "Draft",
        tags: matchedPost.tags ?? [],
        category: matchedPost.category ?? "",
        comment: matchedPost.comment ?? "",
        publishDate: matchedPost.publishDate ?? 0,
        publishDay: matchedPost.publishDay ?? "",
        lastEditedDate: matchedPost.lastEditedDate ?? "",
        lastEditedDay: matchedPost.lastEditedDay ?? "",
        fullWidth: matchedPost.fullWidth ?? false,
        pageIcon: matchedPost.pageIcon ?? "",
        pageCover: matchedPost.pageCover ?? "",
        pageCoverThumbnail: matchedPost.pageCoverThumbnail ?? "",
        ext: matchedPost.ext ?? {},
        tagItems: (matchedPost.tagItems ?? []) as unknown as { name: string; color: string }[],
        slug: matchedPost.slug ?? "",
      };
    } else {
      // 兜底：如果 allPages 中找不到（理论上不应发生），尝试从 recordMap 解析
      const collection =
        (Object.values(recordMap.collection ?? {})[0] as any)?.value || {};
      const schema = collection?.schema;

      let block = recordMap.block[resolvedPostId]?.value;
      if (!block) {
        const normalized = resolvedPostId.replace(/-/g, "");
        for (const [key, entry] of Object.entries(recordMap.block)) {
          if (key.replace(/-/g, "") === normalized && (entry as any)?.value) {
            block = (entry as any).value;
            break;
          }
        }
      }

      if (block && schema) {
        postData = await getSinglePostData(resolvedPostId, block, schema);
      }
    }

    if (!postData) {
      console.warn(`[getStaticProps] 无法获取 postData, slug="${slug}"`);
      return { notFound: true };
    }

    // 获取相关文章
    const relatedArticles = await getRelatedPosts(
      resolvedPostId,
      databaseId,
      null,
      null
    );

    return {
      props: {
        recordMap,
        postData,
        relatedPosts: relatedArticles ?? [],
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
  const router = useRouter();

  if (router.isFallback || !recordMap) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

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
