import assert from "node:assert/strict";
import test from "node:test";

import { createPageRecordMapCache } from "../../lib/notion/pageRecordMapCache.ts";

test("caches a successful page record map by page id for the configured TTL", async () => {
  let calls = 0;
  let currentTime = 0;
  const cache = createPageRecordMapCache({
    ttlMs: 1_000,
    now: () => currentTime,
  });

  const load = async () => {
    calls += 1;
    return { block: { page: calls } };
  };

  const first = await cache.getOrCreate("page-id", load);
  const second = await cache.getOrCreate("page-id", load);

  assert.equal(calls, 1);
  assert.equal(second, first);

  currentTime = 1_000;
  const third = await cache.getOrCreate("page-id", load);

  assert.equal(calls, 2);
  assert.notEqual(third, first);
});

test("does not cache a failed page request", async () => {
  const cache = createPageRecordMapCache({ ttlMs: 1_000 });
  let calls = 0;

  await assert.rejects(() =>
    cache.getOrCreate("page-id", async () => {
      calls += 1;
      throw new Error("Notion unavailable");
    })
  );

  const result = await cache.getOrCreate("page-id", async () => {
    calls += 1;
    return { block: { page: "fresh" } };
  });

  assert.equal(calls, 2);
  assert.deepEqual(result, { block: { page: "fresh" } });
});
