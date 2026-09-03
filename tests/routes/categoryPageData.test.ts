import assert from "node:assert/strict";
import test from "node:test";
import {
  filterCategoryPosts,
  toCategoryPageData,
} from "../../lib/routing/categoryPageData.ts";

const posts = [
  {
    id: "post-1",
    title: "Performance guide",
    tags: ["Next.js", "Web"],
    summarize: "Keep pages fast.",
    category: "technical-en",
    publishDay: "2026-09-01",
    lastEditedDate: "2026-09-02",
    pageCover: "https://example.com/cover-1.jpg",
    pageCoverThumbnail: "https://example.com/thumb-1.jpg",
    slug: "performance-guide",
    ext: { recordMap: "must not reach the browser" },
  },
  {
    id: "post-2",
    title: "Notion guide",
    tags: ["Notion"],
    summarize: "Build a blog.",
    category: "technical-zh",
    publishDay: "2026-08-31",
    lastEditedDate: "2026-09-01",
    pageCover: "https://example.com/cover-2.jpg",
    pageCoverThumbnail: "https://example.com/thumb-2.jpg",
    slug: "notion-guide",
  },
];

test("creates one compact article catalog and tag summaries without nested articles", () => {
  const result = toCategoryPageData(posts, [
    {
      id: "tag-next",
      name: "Next.js",
      value: "Next.js",
      color: "blue",
      count: 1,
      articles: posts,
    },
  ]);

  assert.deepEqual(result.posts, [
    {
      id: "post-1",
      title: "Performance guide",
      tags: ["Next.js", "Web"],
      summarize: "Keep pages fast.",
      category: "technical-en",
      publishDay: "2026-09-01",
      lastEditedDate: "2026-09-02",
      pageCover: "https://example.com/cover-1.jpg",
      pageCoverThumbnail: "https://example.com/thumb-1.jpg",
      slug: "performance-guide",
    },
    {
      id: "post-2",
      title: "Notion guide",
      tags: ["Notion"],
      summarize: "Build a blog.",
      category: "technical-zh",
      publishDay: "2026-08-31",
      lastEditedDate: "2026-09-01",
      pageCover: "https://example.com/cover-2.jpg",
      pageCoverThumbnail: "https://example.com/thumb-2.jpg",
      slug: "notion-guide",
    },
  ]);
  assert.deepEqual(result.tagOptions, [
    {
      id: "tag-next",
      name: "Next.js",
      value: "Next.js",
      color: "blue",
      count: 1,
    },
  ]);
});

test("filters the shared compact catalog by the selected tag value", () => {
  const compactPosts = toCategoryPageData(posts, []).posts;

  assert.deepEqual(
    filterCategoryPosts(compactPosts, "Next.js").map((post) => post.id),
    ["post-1"],
  );
  assert.deepEqual(
    filterCategoryPosts(compactPosts, "Notion").map((post) => post.id),
    ["post-2"],
  );
  assert.deepEqual(
    filterCategoryPosts(compactPosts, "all").map((post) => post.id),
    ["post-1", "post-2"],
  );
});
