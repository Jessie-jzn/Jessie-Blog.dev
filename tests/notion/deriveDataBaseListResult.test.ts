import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveDataBaseListResult,
  requirePopulatedDataBaseListResult,
} from "../../lib/notion/deriveDataBaseListResult.ts";
import type { GetDataBaseListResult, Post } from "../../lib/type.ts";

const article = (
  id: string,
  category: string,
  tags: string[],
  lastEditedDate: string
): Post => ({
  id,
  title: id,
  type: "Post",
  status: "Published",
  category,
  tags,
  slug: `${id}-slug`,
  pageCover: "",
  pageCoverThumbnail: "",
  lastEditedDate,
});

test("rebuilds every article-dependent field for a filtered catalog", () => {
  const whv = article("whv-1", "whv", ["Australia"], "2026-07-20");
  const travel = article("travel-1", "travel", ["Japan"], "2026-07-21");
  const base: GetDataBaseListResult = {
    allPages: [whv, travel],
    latestPosts: [travel, whv],
    categoryList: [
      {
        id: "category-whv",
        name: "whv",
        value: "whv",
        color: "blue",
        count: 1,
        articles: [whv],
      },
      {
        id: "category-travel",
        name: "travel",
        value: "travel",
        color: "green",
        count: 1,
        articles: [travel],
      },
    ],
    tagOptions: [
      {
        id: "tag-australia",
        name: "Australia",
        value: "Australia",
        color: "yellow",
        count: 1,
        articles: [whv],
      },
      {
        id: "tag-japan",
        name: "Japan",
        value: "Japan",
        color: "red",
        count: 1,
        articles: [travel],
      },
    ],
    pageIds: [whv.id, travel.id],
    slugMap: {
      [whv.slug!]: whv.id,
      [travel.slug!]: travel.id,
    },
  };

  const result = deriveDataBaseListResult(
    base,
    (post) => post.category === "whv"
  );

  assert.deepEqual(result.allPages, [whv]);
  assert.deepEqual(result.latestPosts, [whv]);
  assert.deepEqual(result.pageIds, [whv.id]);
  assert.deepEqual(result.slugMap, { [whv.slug!]: whv.id });
  assert.deepEqual(Object.keys(result.categoryMap ?? {}), ["whv"]);
  assert.deepEqual(result.categoryList?.map(({ id, count }) => ({ id, count })), [
    { id: "category-whv", count: 1 },
  ]);
  assert.deepEqual(result.tagOptions?.map(({ id, count }) => ({ id, count })), [
    { id: "tag-australia", count: 1 },
  ]);
  assert.equal(base.allPages?.length, 2);
  assert.equal(base.tagOptions?.length, 2);
});

test("returns the base catalog when no filter is supplied", () => {
  const base: GetDataBaseListResult = { allPages: [] };
  assert.equal(deriveDataBaseListResult(base), base);
});

test("rejects a malformed upstream catalog but accepts a valid empty catalog", () => {
  assert.throws(
    () => requirePopulatedDataBaseListResult({}),
    /missing Article catalog/
  );

  const empty: GetDataBaseListResult = { allPages: [] };
  assert.equal(requirePopulatedDataBaseListResult(empty), empty);

  const populated: GetDataBaseListResult = {
    allPages: [article("article-1", "whv", [], "2026-07-20")],
  };
  assert.equal(requirePopulatedDataBaseListResult(populated), populated);
});

test("does not count non-Article content in category aggregates", () => {
  const whv = article("whv-1", "whv", [], "2026-07-20");
  const notice = {
    ...article("notice-1", "whv", [], "2026-07-21"),
    type: "Page",
  } as unknown as Post;
  const result = deriveDataBaseListResult(
    {
      allPages: [whv, notice],
      categoryList: [
        {
          id: "category-whv",
          name: "whv",
          value: "whv",
          color: "blue",
          count: 2,
          articles: [whv, notice],
        },
      ],
    },
    () => true
  );

  assert.equal(result.categoryMap?.whv.count, 1);
  assert.deepEqual(result.categoryMap?.whv.articles, [whv]);
});
