/**
 * 相关文章：直接从调用方传入的 allPages 中按标签匹配，不再重复调用 getDataBaseList。
 */
import * as Types from "@/lib/type";

export function getRelatedPosts(
  postId: string,
  allPages: Types.Post[],
): Types.PostData[] {
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

  return related.slice(0, 5).map(
    (post): Types.PostData => ({
      id: post.id,
      keywords: "",
      summarize: post.summarize ?? "",
      type: post.type === "Post" ? "Post" : "Page",
      status: "Published",
      tags: post.tags ?? [],
      title: post.title,
      category: post.category ?? "",
      comment: post.comment ?? "",
      publishDate: post.publishDate ?? 0,
      publishDay: post.publishDay ?? "",
      lastEditedDate: post.lastEditedDate ?? "",
      lastEditedDay: post.lastEditedDay ?? "",
      fullWidth: post.fullWidth ?? false,
      pageIcon: post.pageIcon ?? "",
      pageCover: post.pageCover,
      pageCoverThumbnail: post.pageCoverThumbnail,
      ext: post.ext ?? {},
      tagItems:
        (post.tagItems as unknown as Types.PostData["tagItems"]) ?? [],
    })
  );
}
