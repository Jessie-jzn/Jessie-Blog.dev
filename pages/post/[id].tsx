import { GetStaticPaths, GetStaticProps } from 'next';
import getDataBaseList from '@/lib/notion/getDataBaseList';
import { NOTION_POST_ID } from '@/lib/constants';

const ENABLE_LEGACY_REDIRECT_LOG =
  process.env.LEGACY_POST_REDIRECT_LOG === 'true';

export const getStaticProps: GetStaticProps = async ({
  params,
}: any) => {
  const rawId = String(params?.id || '').trim();
  if (!rawId) {
    return { notFound: true };
  }

  const dbResult = await getDataBaseList({
    pageId: NOTION_POST_ID,
    from: 'post-legacy-redirect',
  });

  const normalizedRawId = rawId.replace(/-/g, '');
  const mappedPageId = dbResult.slugMap?.[rawId];

  const matchedPost = (dbResult.allPages || []).find((post) => {
    const normalizedPostId = String(post.id || '').replace(/-/g, '');
    const slug = String(post.slug || '');
    return (
      slug === rawId ||
      normalizedPostId === normalizedRawId ||
      (mappedPageId && post.id === mappedPageId)
    );
  });

  const category = String(matchedPost?.category || '').trim();
  if (!category) {
    if (ENABLE_LEGACY_REDIRECT_LOG) {
      console.info('[legacy-post-redirect] not found', { rawId });
    }
    return { notFound: true };
  }

  if (ENABLE_LEGACY_REDIRECT_LOG) {
    console.info('[legacy-post-redirect] hit', {
      from: `/post/${rawId}`,
      to: `/${category}/${rawId}`,
      postId: matchedPost?.id,
      slug: matchedPost?.slug,
    });
  }

  return {
    redirect: {
      destination: `/${encodeURIComponent(category)}/${encodeURIComponent(rawId)}`,
      permanent: true,
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // 旧路由只保留运行时按需生成，避免构建期为全部文章重复预渲染一次
    paths: [],
    fallback: 'blocking',
  };
};

export default function LegacyPostRouteRedirect() {
  return null;
}
