import type {
  Category,
  GetDataBaseListResult,
  Post,
  Tag,
} from "../type.ts";

const publicationTime = (post: Post) =>
  new Date(post.lastEditedDate ?? post.publishDate ?? 0).getTime();

export function requirePopulatedDataBaseListResult(
  result: GetDataBaseListResult
): GetDataBaseListResult {
  if (!Array.isArray(result.allPages)) {
    throw new Error(
      "[getDataBaseList] upstream response is missing Article catalog"
    );
  }
  return result;
}

export function deriveDataBaseListResult(
  base: GetDataBaseListResult,
  filter?: (post: Post) => boolean
): GetDataBaseListResult {
  if (!filter) {
    return base;
  }

  const allPages = (base.allPages ?? []).filter(filter);
  const categoryMap: Record<string, Category> = {};

  for (const option of base.categoryList ?? []) {
    const value = option.value ?? option.name ?? option.id;
    const articles = allPages.filter((post) => {
      if (post.type !== "Post") {
        return false;
      }
      const categories = Array.isArray(post.category)
        ? post.category
        : [post.category];
      return categories.includes(value);
    });

    if (articles.length) {
      categoryMap[value] = {
        ...option,
        name: option.name ?? value,
        value,
        count: articles.length,
        articles,
      };
    }
  }

  const tagOptions = (base.tagOptions ?? []).reduce<Tag[]>((tags, option) => {
    const value = option.value ?? option.name ?? option.id;
    const articles = allPages.filter((post) => post.tags.includes(value));
    if (articles.length) {
      tags.push({
        ...option,
        name: option.name ?? value,
        value,
        count: articles.length,
        articles,
      });
    }
    return tags;
  }, []);

  const slugMap: Record<string, string> = {};
  for (const post of allPages) {
    if (post.slug) {
      slugMap[post.slug] = post.id;
    }
  }

  return {
    ...base,
    allPages,
    latestPosts: allPages
      .filter(
        (post) => post.type === "Post" && post.status === "Published"
      )
      .sort((a, b) => publicationTime(b) - publicationTime(a))
      .slice(0, 6),
    categoryMap,
    categoryList: Object.values(categoryMap),
    tagOptions,
    pageIds: allPages.map((post) => post.id),
    slugMap,
  };
}
