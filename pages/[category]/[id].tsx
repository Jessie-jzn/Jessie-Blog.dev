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
import PostDetailLayout from '@/components/layouts/PostDetailLayout'

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

    let resolvedPostId = slugMap?.[rawId] ?? "";
    if (!resolvedPostId) {
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

    // getPage 是唯一的网络请求，相关文章直接从 allPages 内存计算，无需并行
    const recordMap = await notionService.getPage(resolvedPostId);
    if (!recordMap) {
      return { notFound: true };
    }

    const relatedArticles = getRelatedPosts(resolvedPostId, allPages);

    let postData: any = null;
    const matchedPost = allPages.find(
      (p) => p.id.replace(/-/g, "") === resolvedPostId.replace(/-/g, "")
    );

    if (matchedPost) {
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
    fallback: 'blocking',
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

(RenderPost as any).getLayout = (page: React.ReactElement) => {
  return <PostDetailLayout>{page}</PostDetailLayout>;
};

export default RenderPost;
