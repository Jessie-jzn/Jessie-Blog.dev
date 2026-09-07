import type { Tag } from "../type.ts";
import {
  toPostListItems,
  toTagSummaries,
  toTagSummary,
  type TagSummary,
} from "./listPageData.ts";
import { isLocalePost } from "./localizedPosts.ts";

const emptyTag = (): TagSummary => ({
  id: "",
  name: "",
  value: "",
  color: "",
  count: 0,
});

const normalizeTags = (tagOptions: unknown): Tag[] =>
  Array.isArray(tagOptions) ? (tagOptions as Tag[]) : [];

const localizeTags = (tags: Tag[], locale?: string): Tag[] => {
  if (!locale) {
    return tags;
  }

  return tags.flatMap((tag) => {
    const articles = tag.articles.filter((article) => isLocalePost(article, locale));
    return articles.length ? [{ ...tag, articles, count: articles.length }] : [];
  });
};

export function resolveTagRouteData(
  tagOptions: unknown,
  requestedTag: unknown,
  locale?: string
) {
  const tags = localizeTags(normalizeTags(tagOptions), locale);
  const filteredTag =
    typeof requestedTag === "string"
      ? tags.find((tag) => tag.id === requestedTag)
      : undefined;

  return {
    tagOptions: toTagSummaries(tags),
    posts: toPostListItems(filteredTag?.articles),
    filteredTag: filteredTag ? toTagSummary(filteredTag) : emptyTag(),
  };
}

export function createTagPaths(tagOptions: unknown) {
  return normalizeTags(tagOptions)
    .filter((tag) => typeof tag.id === "string" && tag.id.length > 0)
    .map((tag) => ({
      params: { tag: encodeURI(tag.id) },
    }));
}

export function activeTagIdFromPath(pathname: string | null | undefined) {
  const pathSegment =
    pathname
      ?.split("/tags/")[1]
      ?.split(/[?#]/)[0]
      ?.replace(/^\/+|\/+$/g, "") ?? "";

  try {
    return decodeURIComponent(pathSegment);
  } catch {
    return pathSegment;
  }
}
