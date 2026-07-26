# Article Navigation Performance Design

## Goal

Reduce the delay and browser errors observed when a reader opens an Article, while preserving the existing Canonical Article URL scheme, visual design, Notion publishing workflow, and ISR behavior.

## Current Symptoms and Evidence

- Cold navigation to an Article currently takes about 5–8 seconds in local measurements.
- Every cold Article route calls `getDataBaseList`, which retrieves the Notion database schema and every published database row before fetching the Article body.
- Next.js link prefetching can start several expensive Article data requests at once, increasing contention and causing Notion connection resets.
- `_app.tsx` emits analytics, advertising, Clarity, and custom scripts even when their public environment variables are absent. This produces invalid requests such as `/undefined/` and third-party configuration errors.
- `pages/tags/[tag].tsx` can serialize `filteredTag: undefined` and assumes `tagOptions` always exists, so a transient Notion failure can break a production build.

## Scope

This change will:

1. Add a reusable server-side cache boundary for the unfiltered Notion Article catalog.
2. Reuse the unfiltered result for filtered callers instead of making the filter function part of the network-cache identity.
3. Prevent eager Next.js prefetching on Article-card and Article-list links that can fan out expensive cold route requests.
4. Load optional third-party scripts only when their required environment values are valid.
5. Make tag routes return serializable fallback data when Notion is unavailable.
6. Add focused regression tests and verify the production build and browser navigation.

This change will not:

- Change Canonical Article URLs or redirects.
- Change page layout, copy, or styling.
- Add a required Redis, database, or hosted cache dependency.
- Rewrite the Notion Article-body renderer.
- Perform unrelated architecture refactors.

## Architecture

### Article catalog cache

`getDataBaseList` remains the single public facade for Article catalog reads. Its internal cache stores one unfiltered catalog promise per Notion source and API mode. Callers that provide a filter receive a derived result produced from the cached catalog.

The derived result must consistently recompute fields that depend on the filtered Article set: `allPages`, `latestPosts`, category aggregation, tag aggregation, page IDs, and the slug map. A filter function must never be used as a cache key because function stringification is not a stable data identity and currently prevents useful reuse.

The cache remains process-local and dependency-free. It deduplicates concurrent reads and warm reads in a Next.js server process. A rejected request is removed so the next request can retry. This deliberately avoids introducing external infrastructure; ISR continues to provide the deployment-level cache for rendered routes.

### Navigation request control

Article links rendered in dense lists, cards, sidebars, related-Article sections, and category pages will set `prefetch={false}`. Navigation links and lightweight static routes retain normal prefetch behavior.

This prevents a visible list from launching multiple full Article data requests in the background. The clicked Article is still fetched normally. This is request-load control, not a change to routing or user-visible behavior.

### Optional scripts

The app will treat Google Analytics, AdSense, Microsoft Clarity, and the custom script URL as optional integrations:

- Google Analytics loads and receives route-change events only when `NEXT_PUBLIC_GA_ID` is non-empty.
- AdSense markup and scripts load only when `NEXT_PUBLIC_ADSENSE_ID` is non-empty.
- Microsoft Clarity loads only when `NEXT_PUBLIC_CLARITY_ID` is non-empty.
- The custom script loads only when `NEXT_PUBLIC_CUSTOM_SCRIPT_URL` is a valid absolute `http:` or `https:` URL.
- No `<Script>` element without a source or executable content is emitted.

The existing explicitly configured fixed script URL is outside this fix and remains unchanged.

### Tag-route resilience

Tag route helpers will normalize a missing or malformed `tagOptions` value to an empty array. `getStaticProps` will always return a serializable `filteredTag` object, and `getStaticPaths` will return an empty path list rather than throw when the Notion catalog is temporarily unavailable. The existing `fallback: true` behavior remains.

## Data Flow

1. A category or list page renders Article links without eager prefetch.
2. The reader clicks one Article.
3. The Article route requests the catalog through `getDataBaseList`.
4. The facade reuses an in-flight or warm unfiltered catalog promise when available.
5. Route resolution and related-Article selection use that catalog.
6. The Article body is fetched from Notion once and returned through the existing ISR route.
7. Optional browser integrations load only when configured.

## Error Handling

- A failed catalog promise is evicted before the error is propagated, allowing later recovery.
- If the official Notion catalog request fails, the existing legacy fallback remains responsible for recovery.
- Invalid or missing public script configuration results in no script being rendered, not a malformed request.
- A failed tag catalog request produces an empty, renderable tag page instead of a serialization or build failure.
- Article-route behavior for an unresolved slug or page ID remains `notFound`.

## Testing

Focused automated tests will cover:

- Concurrent catalog calls share one underlying unfiltered request.
- Filtered catalog reads derive correct Article-dependent aggregates without a second network request.
- A rejected catalog request is evicted and can be retried.
- Missing and invalid public script values disable the matching integration.
- Valid public script values enable only the matching integration.
- Missing tag options and unknown tags produce serializable fallbacks.

Verification will include:

- The focused regression test command.
- Type checking or linting supported by the repository.
- A complete production build.
- Browser console inspection with optional environment values absent.
- A cold and warm click-through measurement on representative `/whv/` Article links, confirming that the page no longer launches a fan-out of prefetched Article requests.

## Success Criteria

- No `/undefined/`, `client=undefined`, or equivalent optional-integration errors appear in the tested browser session.
- A transient Notion list failure does not fail the tag-page build through `undefined` serialization.
- Opening a list page does not eagerly request every visible Article data route.
- Concurrent catalog consumers in one server process cause at most one underlying catalog fetch per Notion source and API mode.
- The production build completes successfully.
- Existing Canonical Article URLs, redirects, rendering, and related-Article output remain intact.
