import assert from "node:assert/strict";
import test from "node:test";

import type { Post, Tag } from "../../lib/type.ts";

const fullArticle: Post = {
  id: "article-1",
  title: "A compact article",
  type: "Post",
  status: "Published",
  tags: ["Notion", "Performance"],
  summarize: "Summary",
  category: "technical-zh",
  publishDay: "2026-08-26",
  lastEditedDate: "2026-08-27",
  pageCover: "https://example.com/cover.jpg",
  pageCoverThumbnail: "https://example.com/thumbnail.jpg",
  slug: "compact-article",
  comment: "server-only comment",
  pageIcon: "heavy-icon",
  fullWidth: true,
  ext: { large: "payload" },
  tagItems: [{ id: "tag-1", name: "Notion" }],
};

const fullTag: Tag = {
  id: "Notion",
  name: "Notion",
  value: "Notion",
  color: "blue",
  count: 1,
  articles: [fullArticle],
};

test("projects list articles to the fields used by search, cards and routing", async () => {
  const module = await import("../../lib/routing/listPageData.ts").catch(
    () => ({}) as Record<string, unknown>,
  );

  assert.equal(typeof module.toPostListItem, "function");
  const toPostListItem = module.toPostListItem as (post: Post) => unknown;

  assert.deepEqual(toPostListItem(fullArticle), {
    id: "article-1",
    title: "A compact article",
    tags: ["Notion", "Performance"],
    summarize: "Summary",
    category: "technical-zh",
    publishDay: "2026-08-26",
    lastEditedDate: "2026-08-27",
    pageCover: "https://example.com/cover.jpg",
    pageCoverThumbnail: "https://example.com/thumbnail.jpg",
    slug: "compact-article",
  });
});

test("projects tag navigation without nested article arrays", async () => {
  const module = await import("../../lib/routing/listPageData.ts").catch(
    () => ({}) as Record<string, unknown>,
  );

  assert.equal(typeof module.toTagSummary, "function");
  const toTagSummary = module.toTagSummary as (tag: Tag) => unknown;

  assert.deepEqual(toTagSummary(fullTag), {
    id: "Notion",
    name: "Notion",
    value: "Notion",
    color: "blue",
    count: 1,
  });
});
