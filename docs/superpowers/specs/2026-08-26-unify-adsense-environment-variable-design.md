# Unify AdSense Environment Variable

## Goal

Use one public environment variable for both the global Google AdSense loader and article ad units so the configured publisher ID is applied consistently.

## Design

`NEXT_PUBLIC_ADSENSE_ID` is the single source of truth. It contains the complete publisher ID, including the `ca-pub-` prefix.

- `pages/_app.tsx` continues to use `NEXT_PUBLIC_ADSENSE_ID` when generating the global AdSense script URL and account metadata.
- `lib/constants.ts` exposes the same value to the article ad component.
- `components/AdSense.tsx` passes the complete value directly to `data-ad-client` without adding a prefix.
- `.env` documents only `NEXT_PUBLIC_ADSENSE_ID`; `.env.local` renames the existing configured key while preserving its value.
- `ADSENSE_GOOGLE_SLOT_IN_ARTICLE` remains unchanged because it serves a separate ad-slot purpose.

## Loading Behavior

When `NEXT_PUBLIC_ADSENSE_ID` is configured, the application loads:

```text
https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=<NEXT_PUBLIC_ADSENSE_ID>
```

with `async` and `crossOrigin="anonymous"`. The article ad unit uses the same publisher ID in `data-ad-client`.

When the publisher ID is absent, the existing global integration guard continues to omit the loader script and account metadata.

## Testing

Add a regression test that verifies:

1. The global loader reads `NEXT_PUBLIC_ADSENSE_ID`.
2. The article ad unit reads the same environment variable.
3. The obsolete `ADSENSE_GOOGLE_ID` key is no longer referenced by application code or the tracked environment template.

Run the regression test, both existing test suites, and lint before completion.

## Scope

This change does not alter the AdSense publisher ID, article slot ID, script loading strategy, AMP script, or ad layout.
