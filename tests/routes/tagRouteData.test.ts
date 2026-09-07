import assert from "node:assert/strict";
import test from "node:test";

import * as tagRouteData from "../../lib/routing/tagRouteData.ts";
import type { Post, Tag } from "../../lib/type.ts";

const { createTagPaths, resolveTagRouteData } = tagRouteData;

const article: Post = {
  id: "article-1",
  title: "Article",
  type: "Post",
  status: "Published",
  tags: ["Working Holiday"],
  pageCover: "",
  pageCoverThumbnail: "",
  comment: "must not reach page props",
  ext: { large: "payload" },
};

const tag: Tag = {
  id: "Working Holiday",
  name: "Working Holiday",
  value: "Working Holiday",
  color: "blue",
  count: 1,
  articles: [article],
};

const bilingualTag: Tag = {
  ...tag,
  count: 2,
  articles: [
    { ...article, id: "article-en", category: "travel-en" },
    { ...article, id: "article-zh", category: "travel-zh" },
  ],
};

const articleSummary = {
  id: "article-1",
  title: "Article",
  tags: ["Working Holiday"],
  summarize: "",
  category: "",
  publishDay: "",
  lastEditedDate: "",
  pageCover: "",
  pageCoverThumbnail: "",
  slug: "",
};

const tagSummary = {
  id: "Working Holiday",
  name: "Working Holiday",
  value: "Working Holiday",
  color: "blue",
  count: 1,
};

test("returns serializable empty data when tag options are missing", () => {
  const result = resolveTagRouteData(undefined, "missing");

  assert.deepEqual(result.tagOptions, []);
  assert.deepEqual(result.posts, []);
  assert.deepEqual(result.filteredTag, {
    id: "",
    name: "",
    value: "",
    color: "",
    count: 0,
  });
});

test("returns the matching tag and its articles", () => {
  const result = resolveTagRouteData([tag], "Working Holiday");

  assert.deepEqual(result.tagOptions, [tagSummary]);
  assert.deepEqual(result.filteredTag, tagSummary);
  assert.deepEqual(result.posts, [articleSummary]);
});

test("keeps only articles in the active language for a tag", () => {
  const result = resolveTagRouteData([bilingualTag], "Working Holiday", "en");

  assert.equal(result.filteredTag.count, 1);
  assert.deepEqual(result.posts.map((post) => post.id), ["article-en"]);
});

test("returns an empty serializable tag for an unknown id", () => {
  const result = resolveTagRouteData([tag], "Unknown");
  assert.deepEqual(result.tagOptions, [tagSummary]);
  assert.deepEqual(result.posts, []);
  assert.equal(result.filteredTag.id, "");
  assert.equal("articles" in result.filteredTag, false);
});

test("creates paths only for tags with non-empty ids", () => {
  assert.deepEqual(createTagPaths([tag, { ...tag, id: "" }]), [
    { params: { tag: "Working%20Holiday" } },
  ]);
  assert.deepEqual(createTagPaths(undefined), []);
});

test("normalizes decoded tag ids from paths with surrounding slashes", () => {
  assert.equal(typeof tagRouteData.activeTagIdFromPath, "function");
  const activeTagIdFromPath = tagRouteData.activeTagIdFromPath!;

  assert.equal(
    activeTagIdFromPath("/tags/Working%20Holiday/"),
    "Working Holiday",
  );
  assert.equal(activeTagIdFromPath("/tags//Working%20Holiday//"), "Working Holiday");
  assert.equal(activeTagIdFromPath("/tags/%E0%A4%A/"), "%E0%A4%A");
  assert.equal(activeTagIdFromPath(null), "");
});
