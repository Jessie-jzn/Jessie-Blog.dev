import type { Post } from '@/lib/type';

type ArticleRouteSource = Pick<Post, 'id' | 'slug' | 'category' | 'title'>;

export interface CanonicalArticleRoute {
  path: string;
  category: string;
  reference: string;
}

export interface ResolvedArticleRoute<TArticle extends ArticleRouteSource> {
  article: TArticle;
  canonical: CanonicalArticleRoute;
  isCanonical: boolean;
}

const NOTION_PAGE_ID_PATTERN =
  /[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i;

function normalizePathSegment(value: string | undefined): string {
  return String(value || '')
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase();
}

function normalizeNotionPageId(value: string | undefined): string | null {
  const candidate = normalizePathSegment(value);
  const match = candidate.match(NOTION_PAGE_ID_PATTERN);
  return match ? match[0].replace(/-/g, '') : null;
}

function articleLabel(article: ArticleRouteSource): string {
  return article.title ? `"${article.title}" (${article.id})` : article.id;
}

export function canonicalArticleRoute(
  article: ArticleRouteSource
): CanonicalArticleRoute {
  const category = normalizePathSegment(article.category);
  if (!category) {
    throw new Error(
      `[article-route] Published Article ${articleLabel(article)} has no category`
    );
  }

  const slug = normalizePathSegment(article.slug);
  const pageId = normalizeNotionPageId(article.id);
  const reference = slug || pageId;

  if (!reference) {
    throw new Error(
      `[article-route] Published Article ${articleLabel(article)} has neither a slug nor a valid Notion page ID`
    );
  }

  return {
    category,
    reference,
    path: `/${encodeURIComponent(category)}/${encodeURIComponent(reference)}/`,
  };
}

export function canonicalArticlePath(article: ArticleRouteSource): string {
  return canonicalArticleRoute(article).path;
}

export function legacyArticlePath(pageId: string): string {
  const normalizedPageId = normalizeNotionPageId(pageId);
  if (!normalizedPageId) {
    throw new Error(`[article-route] Invalid legacy Notion page ID "${pageId}"`);
  }
  return `/post/${normalizedPageId}/`;
}

export function createArticleRouteCatalog<TArticle extends ArticleRouteSource>(
  articles: TArticle[]
) {
  const byReference = new Map<string, TArticle>();

  for (const article of articles) {
    const route = canonicalArticleRoute(article);
    const references = new Set([route.reference]);
    const pageId = normalizeNotionPageId(article.id);
    if (pageId) references.add(pageId);

    for (const reference of references) {
      const existing = byReference.get(reference);
      if (existing && existing.id !== article.id) {
        throw new Error(
          `[article-route] Duplicate site-wide Article reference "${reference}" between ${articleLabel(existing)} and ${articleLabel(article)}`
        );
      }
      byReference.set(reference, article);
    }
  }

  return {
    resolve(
      rawReference: string,
      rawCategory?: string
    ): ResolvedArticleRoute<TArticle> | null {
      const normalizedReference =
        normalizeNotionPageId(rawReference) ||
        normalizePathSegment(rawReference);
      const article = byReference.get(normalizedReference);
      if (!article) return null;

      const canonical = canonicalArticleRoute(article);
      const isCanonical =
        normalizePathSegment(rawCategory) === canonical.category &&
        normalizePathSegment(rawReference) === canonical.reference;

      return { article, canonical, isCanonical };
    },
  };
}

export function validateArticleRoutes(articles: ArticleRouteSource[]): void {
  createArticleRouteCatalog(articles);
}
