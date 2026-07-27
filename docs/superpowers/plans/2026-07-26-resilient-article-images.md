# Resilient Article Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure every Article cover renders a local fallback when its Notion or remote source is empty, expired, unsafe, or unavailable.

**Architecture:** Centralize Article image URL normalization in a pure helper and browser failure handling in one `ArticleImage` component. Strengthen the existing image proxy with SSRF-safe URL validation and byte-level fallback responses, and add a finite TTL to the shared Notion catalog cache so temporary cover URLs refresh.

**Tech Stack:** Next.js 14 Pages Router, React 18, TypeScript 5.5, Node.js 22 test runner, `next/image`, `node-fetch`.

## Global Constraints

- Preserve existing Article layout, aspect ratio, image sizing, hover effects, and Notion publishing workflow.
- Apply the shared component only to Article covers; do not refactor unrelated logos, gallery images, or static artwork.
- Reject unsupported protocols, localhost, and private-network image targets.
- Use the existing `/images/default.jpg` as the only fallback image.
- Keep all existing uncommitted user changes intact.

---

### Task 1: Image source policy and safe proxy

**Files:**
- Create: `lib/images/articleImageSource.ts`
- Create: `tests/images/articleImageSource.test.ts`
- Modify: `pages/api/image-proxy.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `articleImageSource(value?: string | null): string`.
- Produces: `validateRemoteImageUrl(value: string): URL | null`.
- The proxy consumes `validateRemoteImageUrl` before making a network request.

- [ ] **Step 1: Write failing source-policy tests**

Cover empty strings, malformed strings, unsafe protocols, localhost/private targets, local paths, valid public HTTP(S) URLs, and already-proxied paths. Expected remote output is `/api/image-proxy?url=${encodeURIComponent(url)}`. Also assert that `public/images/default.jpg` exists.

- [ ] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/images/articleImageSource.test.ts`

Expected: FAIL because `articleImageSource.ts` does not exist.

- [ ] **Step 3: Implement the minimal source policy**

Use `new URL()` for absolute remote values. Permit only `http:` and `https:` and reject `localhost`, loopback, link-local, and RFC1918 IPv4 hosts. Preserve `/`-prefixed local paths and already proxied paths.

- [ ] **Step 4: Verify GREEN**

Run: `node --experimental-strip-types --test tests/images/articleImageSource.test.ts`

Expected: all image source policy tests pass.

- [ ] **Step 5: Harden the proxy**

Validate with `validateRemoteImageUrl`, retain the 10-second abort timeout, and clear the timer in `finally`. On success, forward image bytes and content type. Use a five-minute shared cache for Notion/S3 URLs and a one-day cache for other public images.

On validation or upstream failure, read `public/images/default.jpg` from the project root and return its bytes with `Content-Type: image/jpeg` and `Cache-Control: public, max-age=60, stale-while-revalidate=300`.

- [ ] **Step 6: Add the focused image test script**

Extend `test:performance-fixes` to include `tests/images/*.test.ts`.

- [ ] **Step 7: Run tests and TypeScript**

Run: `yarn test:performance-fixes && ./node_modules/.bin/tsc --noEmit --incremental false`

Expected: exit 0.

### Task 2: TTL-aware Notion catalog cache

**Files:**
- Modify: `lib/notion/promiseCache.ts`
- Modify: `lib/notion/getDataBaseList.ts`
- Modify: `tests/notion/promiseCache.test.ts`

**Interfaces:**
- `getOrCreate(key, loader, { ttlMs?, now? })` reloads an expired fulfilled value while preserving concurrent deduplication.
- `getDataBaseList` supplies the normalized `NOTION_DATABASE_LIST_CACHE_TTL_MS`, defaulting to 300000 milliseconds.

- [ ] **Step 1: Write a failing TTL test**

Use an injected `now()` value. Assert two calls before expiry share one load, then advance time beyond the TTL and assert the next call returns a newly loaded value.

- [ ] **Step 2: Verify RED**

Run: `node --experimental-strip-types --test tests/notion/promiseCache.test.ts`

Expected: FAIL because fulfilled entries do not expire.

- [ ] **Step 3: Implement TTL metadata**

Store `{ promise, expiresAt }` per key. An in-flight promise remains shared. A fulfilled entry is reused until `now() >= expiresAt`; expired entries are replaced. Rejections remain immediately evicted.

- [ ] **Step 4: Configure the Article catalog TTL**

Normalize `NOTION_DATABASE_LIST_CACHE_TTL_MS` to a finite positive number, otherwise use `300000`. Pass it to `getOrCreate`.

- [ ] **Step 5: Verify GREEN and regression safety**

Run: `yarn test:performance-fixes && ./node_modules/.bin/tsc --noEmit --incremental false`

Expected: all tests and TypeScript pass.

### Task 3: Shared Article image component and call-site migration

**Files:**
- Create: `components/ArticleImage.tsx`
- Modify: `components/CustomLayout/CardPost.tsx`
- Modify: `components/CustomLayout/CardChapterList.tsx`
- Modify: `components/home/GuidePostCards.tsx`
- Modify: `pages/whv/index.tsx`
- Modify: `pages/travel/index.tsx`
- Modify: `pages/life/index.tsx`

**Interfaces:**
- `ArticleImage` accepts `ImageProps` except `src`, plus `src?: string | null`.
- It normalizes the source and swaps once to `/images/default.jpg` on `onError`.

- [ ] **Step 1: Implement `ArticleImage` against the tested source policy**

Use React state and reset it when the input source changes. Preserve the caller’s error callback, but set the fallback before invoking it. Do not retry after the fallback is already active.

- [ ] **Step 2: Replace Article-cover `Image` usages**

Replace only the seven scoped Article-cover call sites. Preserve all existing props, classes, wrappers, and conditional rendering. Remove unused `next/image` imports.

- [ ] **Step 3: Inspect the migration invariant**

Run: `rg -n -C 3 "pageCover|pageCoverThumbnail" components pages --glob '*.tsx'`

Expected: scoped Article cover renderers use `ArticleImage`; metadata-only uses such as SEO remain unchanged.

- [ ] **Step 4: Run complete verification**

Run: `yarn test:performance-fixes && ./node_modules/.bin/tsc --noEmit --incremental false && yarn lint && yarn build`

Expected: tests, types, lint, and build exit 0.

- [ ] **Step 5: Verify runtime**

Restart `yarn dev`, confirm the server is ready on port 3001, and inspect `/whv/`, `/travel/`, `/life/`, and a representative Article page where browser access is permitted. Confirm failed remote covers render `/images/default.jpg` without a broken-image icon.
