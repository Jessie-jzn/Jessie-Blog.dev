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
  if (!params) {
    return { notFound: true };
  }

  try {
    const { id: rawId } = params;
    const databaseId = NOTION_POST_ID;

    const dbResult = await getDataBaseList({
      pageId: databaseId,
      from: "post-id",
    });
    const { slugMap, allPages = [] } = dbResult;

    // rawId 可能是 slug（短链接）也可能是原始 pageId
    // 优先从 slugMap 查找；找不到时把 rawId 本身当作 pageId
    let resolvedPostId = slugMap?.[rawId] ?? "";
    if (!resolvedPostId) {
      // rawId 就是 pageId 本身——在 allPages 里按 id 匹配确认它有效
      const normalizedRaw = rawId.replace(/-/g, "");
      const directMatch = allPages.find(
        (p) => p.id.replace(/-/g, "") === normalizedRaw
      );
      if (directMatch) {
        resolvedPostId = directMatch.id;
      } else {
        console.warn(`[getStaticProps] "${rawId}" 既不是有效 slug 也不是已知 pageId`);
        return { notFound: true };
      }
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
      console.warn(`[getStaticProps] 无法获取 postData, id="${rawId}"`);
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
  const databaseId = NOTION_POST_ID;
  const { categoryMap } = await getDataBaseList({
    pageId: databaseId,
    from: "post-id",
  });

  // 用 Set 去重，避免 slug 和 pageId 重复生成导致 build 时 API 调用翻倍
  const seen = new Set<string>();
  const paths: { params: { category: string; id: string } }[] = [];

  if (categoryMap) {
    Object.entries(categoryMap).forEach(([category, data]: [string, any]) => {
      const articles = data.articles || [];
      articles.forEach((article: any) => {
        // 有 slug 优先用 slug，否则用 pageId
        const id = article.slug || article.id;
        const key = `${category}/${id}`;
        if (!seen.has(key)) {
          seen.add(key);
          paths.push({ params: { category, id } });
        }
      });
    });
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
