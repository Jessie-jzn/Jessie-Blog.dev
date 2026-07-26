# Article Navigation Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove avoidable Article-navigation request fan-out and malformed optional scripts, make tag builds resilient, and reuse one Notion catalog request per server process.

**Architecture:** Keep `getDataBaseList` as the catalog facade, but separate promise deduplication and filtered-result derivation so every caller shares one unfiltered source read. Add small pure helpers for integration configuration and tag fallback behavior, then wire them into existing Next.js pages and disable eager prefetch only for Article links.

**Tech Stack:** Next.js 14 Pages Router, React 18, TypeScript 5.5, Node.js 22 built-in test runner, Notion API.

## Global Constraints

- Preserve the existing Canonical Article URL scheme and redirect behavior.
- Preserve page layout, copy, styling, the Notion publishing workflow, and ISR.
- Do not add Redis or another required hosted dependency.
- Do not rewrite the Notion Article-body renderer.
- Do not include unrelated refactors or overwrite existing uncommitted work.

---

### Task 1: Promise cache and catalog derivation

**Files:**
- Create: `lib/notion/promiseCache.ts`
- Create: `lib/notion/deriveDataBaseListResult.ts`
- Create: `tests/notion/promiseCache.test.ts`
- Create: `tests/notion/deriveDataBaseListResult.test.ts`
- Modify: `lib/notion/getDataBaseList.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `createPromiseCache<K, V>()` with `getOrCreate(key, loader)` and `clear()`.
- Produces: `deriveDataBaseListResult(base, filter)` returning a complete `GetDataBaseListResult`.
- `getDataBaseList(params)` consumes both helpers and keeps its public signature unchanged.

- [ ] **Step 1: Add a failing promise-cache test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { createPromiseCache } from "../../lib/notion/promiseCache.ts";

test("deduplicates concurrent loads and retries after rejection", async () => {
  const cache = createPromiseCache<string, number>();
  let calls = 0;
  const loader = async () => ++calls;
  const [first, second] = await Promise.all([
    cache.getOrCreate("articles", loader),
    cache.getOrCreate("articles", loader),
  ]);
  assert.deepEqual([first, second, calls], [1, 1, 1]);

  let rejectedCalls = 0;
  await assert.rejects(
    cache.getOrCreate("failed", async () => {
      rejectedCalls += 1;
      throw new Error("temporary");
    })
  );
  const recovered = await cache.getOrCreate("failed", async () => {
    rejectedCalls += 1;
    return 7;
  });
  assert.equal(recovered, 7);
  assert.equal(rejectedCalls, 2);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --experimental-strip-types --test tests/notion/promiseCache.test.ts`

Expected: FAIL because `lib/notion/promiseCache.ts` does not exist.

- [ ] **Step 3: Implement the minimal promise cache**

```ts
export function createPromiseCache<K, V>() {
  const values = new Map<K, Promise<V>>();
  return {
    getOrCreate(key: K, loader: () => Promise<V>): Promise<V> {
      const existing = values.get(key);
      if (existing) return existing;
      const pending = loader().catch((error) => {
        values.delete(key);
        throw error;
      });
      values.set(key, pending);
      return pending;
    },
    clear() {
      values.clear();
    },
  };
}
```

- [ ] **Step 4: Run the promise-cache test and verify GREEN**

Run: `node --experimental-strip-types --test tests/notion/promiseCache.test.ts`

Expected: PASS with 1 test and 0 failures.

- [ ] **Step 5: Add a failing filtered-result derivation test**

Create two published Articles with different categories and tags. Assert that filtering to one Article updates `allPages`, `latestPosts`, `categoryMap`, `categoryList`, `tagOptions`, `pageIds`, and `slugMap`, while leaving the unfiltered input unchanged.

Run: `node --experimental-strip-types --test tests/notion/deriveDataBaseListResult.test.ts`

Expected: FAIL because `deriveDataBaseListResult` does not exist.

- [ ] **Step 6: Implement filtered-result derivation**

`deriveDataBaseListResult(base, filter)` must return `base` unchanged when `filter` is absent. When present, filter `base.allPages ?? []`, rebuild category and tag aggregates using the option metadata retained from the base result, select six most recently edited published Articles, and rebuild `pageIds` and `slugMap`.

If the current public result type does not retain raw category/tag option metadata, add optional internal fields to `GetDataBaseListResult` and populate them in both official and legacy loaders without exposing them to page props.

- [ ] **Step 7: Run both catalog tests and verify GREEN**

Run: `node --experimental-strip-types --test tests/notion/promiseCache.test.ts tests/notion/deriveDataBaseListResult.test.ts`

Expected: PASS with 0 failures.

- [ ] **Step 8: Rewire the facade**

Change the cache key to `{ pageId, databaseId, official }`, remove `filter` and `from` from its identity, call the underlying official/legacy loader without a filter, and apply `deriveDataBaseListResult` after awaiting the cached base promise.

- [ ] **Step 9: Add the focused test script**

Add to `package.json`:

```json
"test:performance-fixes": "node --experimental-strip-types --test tests/notion/*.test.ts tests/runtime/*.test.ts tests/routes/*.test.ts"
```

- [ ] **Step 10: Run the focused suite**

Run: `yarn test:performance-fixes`

Expected: PASS with 0 failures.

### Task 2: Optional integration configuration

**Files:**
- Create: `lib/runtime/publicIntegrations.ts`
- Create: `tests/runtime/publicIntegrations.test.ts`
- Modify: `pages/_app.tsx`

**Interfaces:**
- Produces: `getPublicIntegrations(env)` returning nullable `gaId`, `adsenseId`, `clarityId`, and `customScriptUrl`.
- `_app.tsx` consumes this normalized configuration to decide which scripts and route events exist.

- [ ] **Step 1: Add failing configuration tests**

Test that blank, whitespace-only, `"undefined"`, and non-HTTP custom URLs normalize to `null`. Test that a valid GA ID, AdSense ID, Clarity ID, and absolute HTTPS custom URL are retained.

Run: `node --experimental-strip-types --test tests/runtime/publicIntegrations.test.ts`

Expected: FAIL because `getPublicIntegrations` does not exist.

- [ ] **Step 2: Implement configuration normalization**

Use a private `nonEmpty(value)` helper and `new URL(value)` for the custom URL. Accept only `http:` and `https:` protocols. Return a stable object with nullable fields.

- [ ] **Step 3: Run the configuration tests and verify GREEN**

Run: `node --experimental-strip-types --test tests/runtime/publicIntegrations.test.ts`

Expected: PASS with 0 failures.

- [ ] **Step 4: Conditionally render and subscribe**

In `_app.tsx`, compute the normalized configuration once. Register the `routeChangeComplete` GA callback only when `gaId` exists and guard `window.gtag` before calling it. Conditionally render GA, AdSense, custom URL, and Clarity scripts. Remove the empty `<Script>` element and render the AdSense account meta only when configured.

- [ ] **Step 5: Run focused tests and lint**

Run: `yarn test:performance-fixes && yarn lint`

Expected: tests pass and lint exits with 0 errors.

### Task 3: Serializable tag-route fallback

**Files:**
- Create: `lib/routing/tagRouteData.ts`
- Create: `tests/routes/tagRouteData.test.ts`
- Modify: `pages/tags/[tag].tsx`

**Interfaces:**
- Produces: `resolveTagRouteData(tagOptions, requestedTag)` returning `{ tagOptions, posts, filteredTag }`.
- Produces: `createTagPaths(tagOptions)` returning `{ params: { tag: string } }[]`.

- [ ] **Step 1: Add failing fallback tests**

Assert that undefined tag options return empty arrays and a serializable empty tag object; an unknown tag does the same; and a known tag returns its Articles and encoded path.

Run: `node --experimental-strip-types --test tests/routes/tagRouteData.test.ts`

Expected: FAIL because `tagRouteData.ts` does not exist.

- [ ] **Step 2: Implement the pure route helpers**

Normalize non-array inputs to `[]`. Return `filteredTag` as an object with stable empty values instead of `undefined`. Build paths only from tags with a non-empty string ID.

- [ ] **Step 3: Run route tests and verify GREEN**

Run: `node --experimental-strip-types --test tests/routes/tagRouteData.test.ts`

Expected: PASS with 0 failures.

- [ ] **Step 4: Wire helpers into the page**

Use `resolveTagRouteData` in both the successful and catch branches of `getStaticProps`. Wrap `getStaticPaths` in error handling and return `paths: []` with the existing `fallback: true` when the catalog is unavailable.

- [ ] **Step 5: Run focused tests**

Run: `yarn test:performance-fixes`

Expected: PASS with 0 failures.

### Task 4: Stop eager Article-route fan-out

**Files:**
- Modify: `components/CustomLayout/CardChapterList.tsx`
- Modify: `components/CustomLayout/CardPost.tsx`
- Modify: `components/Notion/NotionPageAside.tsx`
- Modify: `components/RelatedPosts/RelatedPosts.tsx`
- Modify: `components/home/GuidePostCards.tsx`
- Modify: `components/layouts/ListLayoutWithTags.tsx`
- Modify: `pages/life/index.tsx`
- Modify: `pages/travel/index.tsx`
- Modify: `pages/whv/index.tsx`

**Interfaces:**
- Consumes: existing `canonicalArticlePath(article)` links.
- Produces: the same hrefs with `prefetch={false}`.

- [ ] **Step 1: Inventory Canonical Article links**

Run: `rg -n "canonicalArticlePath|canonicalArticleRoute" components pages --glob '*.tsx'`

Expected: every Article list/card/detail recommendation link is identified; navigation and non-Article links are excluded.

- [ ] **Step 2: Disable eager prefetch on Article links**

Add `prefetch={false}` to each identified Next.js `<Link>` that targets a Canonical Article URL. Do not change href construction, labels, styles, or event handlers.

- [ ] **Step 3: Verify the source invariant**

Run: `rg -n -U "<Link(?:(?!</Link>).)*canonicalArticlePath" components pages --glob '*.tsx'`

Expected: review every match and confirm it contains `prefetch={false}`; if the regex engine cannot express the invariant reliably, inspect each match from Step 1 directly.

- [ ] **Step 4: Run lint and focused tests**

Run: `yarn lint && yarn test:performance-fixes`

Expected: both commands exit with 0 errors or failures.

### Task 5: Full verification and browser performance check

**Files:**
- Modify only files needed to fix failures introduced by Tasks 1–4.

**Interfaces:**
- Consumes: all deliverables from Tasks 1–4.
- Produces: fresh test, lint, build, console, and navigation timing evidence.

- [ ] **Step 1: Run the complete automated checks**

Run: `yarn test:performance-fixes && yarn lint && yarn build`

Expected: all commands exit 0; the build completes without tag serialization failures.

- [ ] **Step 2: Start or restart the local development server**

Run: `yarn dev`

Expected: Next.js reports the local service ready at `http://127.0.0.1:3001`.

- [ ] **Step 3: Inspect the browser console**

Open `/whv/`, clear the console, reload, and confirm there are no requests to `/undefined/`, no `client=undefined`, and no errors caused by absent optional integration configuration.

- [ ] **Step 4: Measure request fan-out and navigation**

Clear the network log, load `/whv/`, and confirm visible Article cards do not immediately request their `/_next/data/...` routes. Click representative Articles once cold and once warm, record the timings, and confirm the clicked Article renders at its unchanged Canonical Article URL.

- [ ] **Step 5: Review the final diff**

Run: `git diff --check && git status --short && git diff --stat`

Expected: no whitespace errors; only scoped performance/error fixes plus pre-existing user changes are present.
