import assert from "node:assert/strict";
import test from "node:test";

import { createPromiseCache } from "../../lib/notion/promiseCache.ts";
import { getGlobalPromiseCache } from "../../lib/notion/promiseCache.ts";
import type { PromiseCache } from "../../lib/notion/promiseCache.ts";

test("deduplicates concurrent loads for the same key", async () => {
  const cache = createPromiseCache<string, number>();
  let calls = 0;

  const loader = async () => {
    calls += 1;
    return calls;
  };

  const [first, second] = await Promise.all([
    cache.getOrCreate("articles", loader),
    cache.getOrCreate("articles", loader),
  ]);

  assert.deepEqual([first, second], [1, 1]);
  assert.equal(calls, 1);
});

test("evicts a rejected load so a later call can retry", async () => {
  const cache = createPromiseCache<string, number>();
  let calls = 0;

  await assert.rejects(
    cache.getOrCreate("articles", async () => {
      calls += 1;
      throw new Error("temporary");
    }),
    /temporary/
  );

  const recovered = await cache.getOrCreate("articles", async () => {
    calls += 1;
    return 7;
  });

  assert.equal(recovered, 7);
  assert.equal(calls, 2);
});

test("reloads a settled value after its TTL expires", async () => {
  const cache = createPromiseCache<string, number>();
  let calls = 0;
  let now = 1_000;
  const options = { ttlMs: 300, now: () => now };

  const first = await cache.getOrCreate("articles", async () => ++calls, options);
  now = 1_299;
  const cached = await cache.getOrCreate("articles", async () => ++calls, options);
  now = 1_300;
  const refreshed = await cache.getOrCreate(
    "articles",
    async () => ++calls,
    options
  );

  assert.deepEqual([first, cached, refreshed], [1, 1, 2]);
  assert.equal(calls, 2);
});

test("continues sharing an in-flight load even when the TTL duration elapses", async () => {
  const cache = createPromiseCache<string, number>();
  let now = 1_000;
  let resolveLoad: ((value: number) => void) | undefined;
  const pending = new Promise<number>((resolve) => {
    resolveLoad = resolve;
  });

  const first = cache.getOrCreate("articles", () => pending, {
    ttlMs: 10,
    now: () => now,
  });
  now = 2_000;
  const second = cache.getOrCreate("articles", async () => 2, {
    ttlMs: 10,
    now: () => now,
  });
  resolveLoad?.(1);

  assert.deepEqual(await Promise.all([first, second]), [1, 1]);
});

test("shares a named cache across independently loaded server bundles", async () => {
  const namespace = `test-${Date.now()}-${Math.random()}`;
  const first = getGlobalPromiseCache<string, number>(namespace);
  const duplicateModule = await import(
    `../../lib/notion/promiseCache.ts?duplicate=${Date.now()}`
  );
  const second = duplicateModule.getGlobalPromiseCache(
    namespace
  ) as PromiseCache<string, number>;
  let calls = 0;

  const [firstValue, secondValue] = await Promise.all([
    first.getOrCreate("articles", async () => ++calls),
    second.getOrCreate("articles", async () => ++calls),
  ]);

  assert.deepEqual([firstValue, secondValue], [1, 1]);
  assert.equal(calls, 1);
});
