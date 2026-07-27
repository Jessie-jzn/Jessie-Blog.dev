import { canonicalArticlePath } from "../../lib/routing/articleRoute.ts";
import type { Post } from "../../lib/type.ts";

type ArticleRouteFields = Pick<Post, "id" | "category" | "slug" | "title">;

const legacyPostFallback = (id: string) => {
  const normalizedId = id.trim();
  return normalizedId ? `/post/${encodeURIComponent(normalizedId)}` : "/post";
};

export function resolveLegacyArticleAdapterHref(article: ArticleRouteFields): string {
  try {
    return canonicalArticlePath(article);
  } catch {
    return legacyPostFallback(article.id);
  }
}
