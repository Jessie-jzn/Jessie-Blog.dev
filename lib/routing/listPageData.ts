import type { Post, Tag } from "../type.ts";

export interface PostListItem {
  id: string;
  title: string;
  tags: string[];
  summarize: string;
  category: string;
  publishDay: string;
  lastEditedDate: string;
  pageCover: string;
  pageCoverThumbnail: string;
  slug: string;
}

export interface TagSummary {
  id: string;
  name: string;
  value: string;
  color: string;
  count: number;
}

export function toPostListItem(post: Post): PostListItem {
  return {
    id: String(post.id || ""),
    title: String(post.title || ""),
    tags: Array.isArray(post.tags) ? post.tags.map(String) : [],
    summarize: String(post.summarize || ""),
    category: String(post.category || ""),
    publishDay: String(post.publishDay || ""),
    lastEditedDate: String(post.lastEditedDate || ""),
    pageCover: String(post.pageCover || ""),
    pageCoverThumbnail: String(post.pageCoverThumbnail || ""),
    slug: String(post.slug || ""),
  };
}

export function toPostListItems(posts: unknown): PostListItem[] {
  return Array.isArray(posts) ? posts.map((post) => toPostListItem(post as Post)) : [];
}

export function toTagSummary(tag: Tag): TagSummary {
  return {
    id: String(tag.id || ""),
    name: String(tag.name || ""),
    value: String(tag.value || ""),
    color: String(tag.color || ""),
    count: Number.isFinite(tag.count) ? tag.count : 0,
  };
}

export function toTagSummaries(tags: unknown): TagSummary[] {
  return Array.isArray(tags) ? tags.map((tag) => toTagSummary(tag as Tag)) : [];
}
