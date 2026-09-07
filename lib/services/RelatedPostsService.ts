/**
 * 相关文章：直接从调用方传入的 allPages 中按标签匹配，不再重复调用 getDataBaseList。
 */
import type * as Types from "../type.ts";

export function getRelatedPosts(
  postId: string,
  allPages: Types.Post[],
): Types.Post[] {
  if (!allPages?.length) {
    return [];
  }

  const normalizedId = postId.replace(/-/g, "");
  const currentPost = allPages.find(
    (p) => p.id.replace(/-/g, "") === normalizedId
  );

  if (!currentPost?.tags?.length) {
    return [];
  }

  const firstTag = currentPost.tags[0];

  const related = allPages.filter(
    (post) =>
      post.id.replace(/-/g, "") !== normalizedId &&
      Boolean(post.tags?.some((tag: string) => tag === firstTag))
  );

  return related.slice(0, 10).map(
    (post): Types.Post => ({
      id: post.id,
      title: post.title,
      tags: post.tags ?? [],
      category: post.category ?? "",
      summarize: post.summarize ?? "",
      publishDate: post.publishDate ?? 0,
      publishDay: post.publishDay ?? "",
      lastEditedDate: post.lastEditedDate ?? "",
      lastEditedDay: post.lastEditedDay ?? "",
      pageCover: post.pageCover ?? "",
      pageCoverThumbnail: post.pageCoverThumbnail ?? "",
      slug: post.slug,
    })
  );
}
