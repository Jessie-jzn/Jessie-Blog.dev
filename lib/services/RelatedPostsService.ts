/**
 * 相关文章：依赖 getDataBaseList 提供的 allPages（现已支持官方 databases.query）。
 * 直接从 allPages 中查找当前文章的 tags，按标签匹配推荐相关文章。
 * 不再依赖 getSinglePostData / block / schema，兼容官方 API 路径。
 */
import getDataBaseList from "@/lib/notion/getDataBaseList";
import * as Types from "@/lib/type";

export async function getRelatedPosts(
  postId: string,
  databaseId: string,
  _block?: any,
  _schema?: any
): Promise<Types.PostData[]> {
  try {
    const { allPages } = await getDataBaseList({
      pageId: databaseId,
      from: "related-posts",
    });

    if (!allPages?.length) {
      return [];
    }

    // 从 allPages 查找当前文章，取 tags
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
  } catch (error) {
    console.error("Error getting related posts:", error);
    return [];
  }
}
