/**
 * 文章详情动态路由：从 Notion 文章库静态生成分类文章页，并加载关联文章与评论。
 */
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
import BlogComments from '@/components/BlogComments';
import PostDetailLayout from '@/components/layouts/PostDetailLayout'
import {
  createArticleRouteCatalog,
} from '@/lib/routing/articleRoute';
import { preserveArticlePageOnTransientFailure } from '@/lib/routing/articlePageFailure';

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
    const { allPages = [] } = dbResult;
    const resolution = createArticleRouteCatalog(allPages).resolve(
      rawId,
      params.category
    );

    if (!resolution) {
      console.warn(`[getStaticProps] "${rawId}" 既不是有效 slug 也不是已知 pageId`);
      return { notFound: true };
    }

    if (!resolution.isCanonical) {
      return {
        redirect: {
          destination: resolution.canonical.path,
          permanent: true,
        },
      };
    }

    const resolvedPostId = resolution.article.id;

    // getPage 是唯一的网络请求，相关文章直接从 allPages 内存计算，无需并行
    const recordMap = await notionService.getPage(resolvedPostId);
    if (!recordMap) {
      throw new Error(`Notion returned no page data for "${rawId}"`);
    }

    const relatedArticles = getRelatedPosts(resolvedPostId, allPages);

    let postData: any = null;
    const matchedPost = resolution.article;

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
      throw new Error(`无法获取 postData, id="${rawId}"`);
    }

    return {
      props: {
        recordMap,
        postData,
        relatedPosts: relatedArticles ?? [],
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return preserveArticlePageOnTransientFailure(error);
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  // 正文逐篇调用 Notion。构建时批量生成会触发 API 限流，并把部分文章部署成 404。
  // 交给 blocking ISR 在首次访问时单篇生成，生成成功后由 Vercel 缓存。
  return {
    paths: [],
    fallback: 'blocking',
  };
};

interface RenderPostProps {
  recordMap: ExtendedRecordMap;
  postData: Type.PostData;
  relatedPosts: Type.Post[];
}

const RenderPost: React.FC<RenderPostProps> = ({
  recordMap,
  postData,
  relatedPosts,
}) => {
  return (
    <div className="w-full">
      <NotionPage
        recordMap={recordMap}
        postData={postData}
        relatedPosts={relatedPosts}
      />
      <div className="mt-12">
        <BlogComments
          pageId={postData.id.replace(/-/g, '')}
          pageTitle={postData.title || ''}
        />
      </div>
    </div>
  );
};

(RenderPost as any).getLayout = (page: React.ReactElement) => {
  return <PostDetailLayout>{page}</PostDetailLayout>;
};

export default RenderPost;
