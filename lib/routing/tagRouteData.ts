import type { Tag } from "../type.ts";

const emptyTag = (): Tag => ({
  id: "",
  name: "",
  value: "",
  color: "",
  count: 0,
  articles: [],
});

const normalizeTags = (tagOptions: unknown): Tag[] =>
  Array.isArray(tagOptions) ? (tagOptions as Tag[]) : [];

export function resolveTagRouteData(
  tagOptions: unknown,
  requestedTag: unknown
) {
  const tags = normalizeTags(tagOptions);
  const filteredTag =
    typeof requestedTag === "string"
      ? tags.find((tag) => tag.id === requestedTag)
      : undefined;

  return {
    tagOptions: tags,
    posts: filteredTag?.articles ?? [],
    filteredTag: filteredTag ?? emptyTag(),
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
