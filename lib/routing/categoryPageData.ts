import {
  toPostListItems,
  toTagSummaries,
  type PostListItem,
  type TagSummary,
} from "./listPageData.ts";

export interface CategoryPageData {
  posts: PostListItem[];
  tagOptions: TagSummary[];
}

export function toCategoryPageData(
  posts: unknown,
  tagOptions: unknown,
): CategoryPageData {
  return {
    posts: toPostListItems(posts),
    tagOptions: toTagSummaries(tagOptions),
  };
}

export function filterCategoryPosts(
  posts: PostListItem[],
  tagValue: string,
): PostListItem[] {
  if (tagValue === "all") {
    return posts;
  }

  return posts.filter((post) => post.tags.includes(tagValue));
}
