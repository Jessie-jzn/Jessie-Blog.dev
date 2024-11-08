import getDataBaseList from "@/lib/notion/getDataBaseList";
import getSinglePostData from "@/lib/notion/getSinglePostData";
import * as Types from "@/lib/type";

export async function getRelatedPosts(
  postId: string,
  databaseId: string,
  block?: any,
  schema?: any
): Promise<Types.PostData[]> {
  try {
    // 获取当前文章数据
    const postData = await getSinglePostData(postId, block, schema);
    if (!postData?.tags?.length) {
      return [];
    }

    const firstTag = postData.tags[0];
    
    // 获取数据库中的所有文章
    const { allPages } = await getDataBaseList({
      pageId: databaseId,
      from: "related-posts",
    });

    if (!allPages) {
      return [];
    }

    // 过滤相关文章
    return allPages
      .filter((post): post is Types.PostData => {
        return (
          post?.id !== postId && 
          post?.tags?.some((tag: string) => tag === firstTag)
        );
      })
      .slice(0, 5);
      
  } catch (error) {
    console.error("Error getting related posts:", error);
    return [];
  }
}
