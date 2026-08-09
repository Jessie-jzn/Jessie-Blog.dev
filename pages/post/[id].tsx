/**
 * 旧文章链接兼容路由：解析 Notion 文章库后将 /post/[id] 永久重定向至当前文章地址。
 */
import { GetServerSideProps } from 'next';
import getDataBaseList from '@/lib/notion/getDataBaseList';
import { NOTION_POST_ID } from '@/lib/constants';
import { createArticleRouteCatalog } from '@/lib/routing/articleRoute';

const ENABLE_LEGACY_REDIRECT_LOG =
  process.env.LEGACY_POST_REDIRECT_LOG === 'true';

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}: any) => {
  const rawId = String(params?.id || '').trim();
  if (!rawId) {
    return { notFound: true };
  }

  const dbResult = await getDataBaseList({
    pageId: NOTION_POST_ID,
    from: 'post-legacy-redirect',
  });

  const resolution = createArticleRouteCatalog(
    dbResult.allPages || []
  ).resolve(rawId);

  if (!resolution) {
    if (ENABLE_LEGACY_REDIRECT_LOG) {
      console.info('[legacy-post-redirect] not found', { rawId });
    }
    return { notFound: true };
  }

  const redirectQuery = new URLSearchParams();
  for (const [key, value] of Object.entries(query || {})) {
    if (key === 'id') continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item != null) redirectQuery.append(key, String(item));
    }
  }
  const queryString = redirectQuery.toString();
  const destination = `${resolution.canonical.path}${
    queryString ? `?${queryString}` : ''
  }`;

  if (ENABLE_LEGACY_REDIRECT_LOG) {
    console.info('[legacy-post-redirect] hit', {
      from: `/post/${rawId}`,
      to: destination,
      postId: resolution.article.id,
      slug: resolution.article.slug,
    });
  }

  return {
    redirect: {
      destination,
      permanent: true,
    },
  };
};

export default function LegacyPostRouteRedirect() {
  return null;
}
