# Resilient Article Images Design

## Goal

Prevent broken Article cover images across list, card, sidebar, related-Article, and Article-detail surfaces while preserving the existing visual layouts and Notion publishing workflow.

## Root Cause

Article cover rendering currently has inconsistent failure handling:

- Several pages pass `pageCover` or `pageCoverThumbnail` directly to `next/image`.
- Empty cover values do not consistently fall back to a local image.
- Notion-hosted file covers can use temporary signed S3 URLs whose signatures expire.
- The server-side Article catalog cache can retain those temporary URLs beyond their useful lifetime.
- Only `CardPost` currently routes remote images through `/api/image-proxy`; other Article cover components bypass it.
- `/api/image-proxy` redirects on failure, but a redirect is less reliable for an image request than returning the fallback image bytes directly.

The result is that the same Article cover can work in one component and appear broken in another.

## Architecture

### Shared image URL policy

Create a pure image-source helper that accepts an optional image URL and returns one of:

- `/images/default.jpg` for an empty, malformed, or unsupported value.
- A local path unchanged.
- A stable `/api/image-proxy?url=...` path for allowed remote HTTP(S) images.

The helper must recognize an already proxied URL and avoid double wrapping it. It must not accept protocols such as `data:`, `javascript:`, or `file:`.

### Resilient Article image component

Create a focused `ArticleImage` component around `next/image`. It will:

- Normalize the initial source through the shared policy.
- Preserve the caller’s `alt`, `fill`, `sizes`, `priority`, and CSS classes.
- Switch to `/images/default.jpg` when the remote request raises an image error.
- Avoid an error loop if the fallback itself fails.

Only Article cover usages are in scope. Static site artwork, logos, gallery assets, and unrelated images remain unchanged.

### Image proxy behavior

Keep `/api/image-proxy` as the server boundary for remote Article images, but make its failure response deterministic:

- Validate that the requested URL is absolute HTTP(S).
- Keep the existing timeout and image content-type validation.
- On upstream failure, read and return the local default image with its real image content type rather than redirecting.
- Use a shorter cache lifetime for successful Notion signed URLs so an expired response is not treated as immutable for a year.
- Cache the local fallback briefly, allowing a later request to retry the upstream image.

No private network addresses or local file paths may be fetched by the proxy. Existing public image hosts used by the site remain supported.

### Catalog cache lifetime

The shared Notion Article catalog promise cache will support a finite TTL. The Article catalog will refresh periodically so newly signed Notion cover URLs replace expired ones. Concurrent refresh requests will still deduplicate to one underlying load, and rejected loads will still be evicted immediately.

The TTL will be configurable through `NOTION_DATABASE_LIST_CACHE_TTL_MS`, with a safe default of five minutes. A non-finite, zero, or negative value falls back to the default.

## Components in Scope

The shared `ArticleImage` component will replace direct Article-cover `Image` usage in:

- WHV Article lists.
- Travel Article lists and featured Article.
- Life Article lists.
- Home and custom Article cards.
- Guide Article cards.
- Article chapter cards.
- Article sidebars and related-Article cards where a cover is rendered.
- Article header/cover rendering when it consumes `postData.pageCover`.

Each replacement must preserve the existing aspect ratio, `fill` behavior, sizes, hover animation, and priority setting.

## Error Handling

- Missing image URL: render the local default immediately.
- Malformed or unsafe URL: render the local default immediately.
- Remote timeout, non-2xx response, or non-image response: proxy returns the local default bytes.
- Browser image decoding or rendering failure: `ArticleImage` swaps to the local default.
- Expired Notion signature: the proxy falls back for the current request; the catalog TTL allows a later render to obtain a fresh URL.
- Default image failure: stop retrying and leave the image element in its final state without an update loop.

## Testing

Automated tests will cover:

- Empty and malformed inputs normalize to the default image.
- Local paths remain local.
- Valid HTTP(S) remote images use the proxy exactly once.
- Already proxied images are not wrapped again.
- The promise cache reuses values before TTL expiry and reloads after expiry.
- Rejected promises remain immediately retryable.
- Proxy URL validation rejects unsafe protocols and private/local targets.

Verification will include:

- Focused image and cache regression tests.
- TypeScript checking.
- ESLint.
- A complete production build.
- Inspection of Article cover call sites to ensure they use the shared component.
- Local page verification where permitted by the browser security policy.

## Success Criteria

- Article-cover surfaces do not display the browser’s broken-image icon for empty or failed remote images.
- All remote Article covers follow one proxy and fallback policy.
- Notion signed cover URLs are refreshed after the configured catalog TTL.
- The image proxy cannot fetch unsupported protocols, local hosts, or private network addresses.
- Existing Article layouts and image sizing remain visually unchanged.
- Focused tests, TypeScript, lint, and production build pass.
