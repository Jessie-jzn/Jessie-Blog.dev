# Unified Modern Editorial UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify every Jessie Blog route around a clean white, modern editorial UI with consistent spacing, surfaces, typography, cards, filters, responsive behavior, and dark mode.

**Architecture:** Introduce semantic design tokens and a small set of shared presentation primitives, then migrate the site shell, repeated content components, route hubs, and Article chrome in that order. Preserve every route’s data flow and behavior; route-specific components consume shared CSS utilities and variants instead of carrying unrelated colors and geometry.

**Tech Stack:** Next.js 14 Pages Router, React 18, TypeScript, Tailwind CSS 3, CSS custom properties, Framer Motion, Node test runner.

## Global Constraints

- White is the primary canvas and `#F7F7F5` is the muted warm-gray surface.
- Jessie mint, based on `#62BFAD`, is the only common brand accent.
- Primary content maximum width is 1152px; reading content is limited to 720–760px.
- Page gutters are 16px mobile, 24px tablet, and 32px desktop.
- Standard cards use a 16px radius; feature cards use a 20–24px radius.
- Default cards use a thin border and no visible shadow; interactive elevation appears on hover or focus.
- Preserve Article data, Notion integration, Canonical Article URLs, routing, localization, analytics, and existing imagery.
- Keep dark mode, keyboard focus, touch targets, and `prefers-reduced-motion` support.
- Preserve and integrate existing uncommitted user changes; never replace entire modified files without reviewing their diffs.
- Do not add a UI framework, alter editorial taxonomy, or introduce unrelated refactors.

---

### Task 1: Establish the semantic design system

**Files:**
- Modify: `styles/globals.css`
- Modify: `tailwind.config.ts`
- Create: `tests/ui/designSystem.test.ts`

**Interfaces:**
- Consumes: Existing Tailwind `canvas`, `primary`, `dark`, and neutral color usage.
- Produces: CSS variables `--ui-canvas`, `--ui-surface`, `--ui-surface-muted`, `--ui-ink`, `--ui-ink-muted`, `--ui-line`, `--ui-accent`, `--ui-accent-soft`, and `--ui-accent-strong`; shared classes `.site-container`, `.site-section`, `.editorial-surface`, `.editorial-card`, `.editorial-tag`, `.editorial-filter`, and `.editorial-focus`.

- [ ] **Step 1: Write the failing design-token contract test**

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync("styles/globals.css", "utf8");

test("global UI tokens expose the editorial palette and spacing primitives", () => {
  for (const token of [
    "--ui-canvas",
    "--ui-surface",
    "--ui-surface-muted",
    "--ui-ink",
    "--ui-ink-muted",
    "--ui-line",
    "--ui-accent",
    "--ui-accent-soft",
    "--ui-accent-strong",
  ]) {
    assert.match(css, new RegExp(`${token}:`));
  }

  for (const utility of [
    ".site-container",
    ".site-section",
    ".editorial-surface",
    ".editorial-card",
    ".editorial-tag",
    ".editorial-filter",
    ".editorial-focus",
  ]) {
    assert.match(css, new RegExp(utility.replace(".", "\\.")));
  }
});
```

- [ ] **Step 2: Run the contract test and verify it fails**

Run: `node --experimental-strip-types --test tests/ui/designSystem.test.ts`

Expected: FAIL because the semantic tokens and shared utilities do not exist.

- [ ] **Step 3: Add light and dark semantic tokens**

Add the following foundation inside `styles/globals.css`, keeping the existing Notion variables:

```css
:root {
  --ui-canvas: #ffffff;
  --ui-surface: #ffffff;
  --ui-surface-muted: #f7f7f5;
  --ui-ink: #171717;
  --ui-ink-muted: #6b6b67;
  --ui-line: rgba(23, 23, 23, 0.09);
  --ui-accent: #62bfad;
  --ui-accent-soft: #eaf6f3;
  --ui-accent-strong: #347f72;
}

.dark {
  --ui-canvas: #111210;
  --ui-surface: #181a18;
  --ui-surface-muted: #1d201e;
  --ui-ink: #f5f5f2;
  --ui-ink-muted: #a4a7a2;
  --ui-line: rgba(255, 255, 255, 0.1);
  --ui-accent-soft: rgba(98, 191, 173, 0.14);
  --ui-accent-strong: #82d2c3;
}
```

Add the named utility classes through `@layer components`. Use `max-width: 72rem`, responsive gutters of `1rem`, `1.5rem`, and `2rem`, section padding of `4rem` then `6rem`, 1px borders using `--ui-line`, and focus rings using `--ui-accent`.

- [ ] **Step 4: Map Tailwind colors to the semantic variables**

Update `tailwind.config.ts` so `canvas`, `surface`, `muted`, `ink`, `subtle`, `line`, `primary`, `primarySoft`, and `primaryStrong` reference the CSS variables with `rgb()`-free direct values such as:

```ts
colors: {
  canvas: "var(--ui-canvas)",
  surface: "var(--ui-surface)",
  muted: "var(--ui-surface-muted)",
  ink: "var(--ui-ink)",
  subtle: "var(--ui-ink-muted)",
  line: "var(--ui-line)",
  primary: "var(--ui-accent)",
  primarySoft: "var(--ui-accent-soft)",
  primaryStrong: "var(--ui-accent-strong)",
  sky: colors.sky,
  gray: colors.neutral,
  dark: "#1A1B26",
  spotify: "#1DB954",
  coral: "#EF596F",
}
```

- [ ] **Step 5: Run the contract test**

Run: `node --experimental-strip-types --test tests/ui/designSystem.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit the design-system foundation**

```bash
git add styles/globals.css tailwind.config.ts tests/ui/designSystem.test.ts
git commit -m "style: add editorial design system"
```

---

### Task 2: Unify the site shell and shared controls

**Files:**
- Modify: `components/layouts/BaseLayout.tsx`
- Modify: `components/layouts/HomeLayout.tsx`
- Modify: `components/layouts/PostListLayout.tsx`
- Modify: `components/layouts/TravelListLayout.tsx`
- Modify: `components/Navbar.tsx`
- Modify: `components/NavMobile.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/ThemeSwitch.tsx`
- Modify: `components/LanguageSwitch.tsx`
- Modify: `components/ShareButtons.tsx`
- Modify: `components/BackToTop.tsx`
- Modify: `components/ui/button.tsx`
- Modify: `tests/ui/designSystem.test.ts`

**Interfaces:**
- Consumes: Task 1 semantic colors and `.site-container`, `.editorial-surface`, `.editorial-focus`.
- Produces: A common white page shell, 64px desktop / 56px mobile header offset, shared navigation active state, muted footer, and consistent icon/button controls.

- [ ] **Step 1: Extend the contract test for the shared shell**

Read the relevant component files and assert:

```ts
const baseLayout = readFileSync("components/layouts/BaseLayout.tsx", "utf8");
const postListLayout = readFileSync("components/layouts/PostListLayout.tsx", "utf8");
const navbar = readFileSync("components/Navbar.tsx", "utf8");
const footer = readFileSync("components/Footer.tsx", "utf8");

test("shared layouts use the semantic canvas and container", () => {
  assert.match(baseLayout, /bg-canvas/);
  assert.match(postListLayout, /site-container/);
  assert.match(navbar, /site-container/);
  assert.match(footer, /bg-muted/);
});
```

- [ ] **Step 2: Run the test and verify the new assertions fail**

Run: `node --experimental-strip-types --test tests/ui/designSystem.test.ts`

Expected: FAIL because the shell does not yet consistently use the shared container and muted footer.

- [ ] **Step 3: Normalize all layout wrappers**

Use `bg-canvas text-ink`, `site-container`, `pt-16 xs:pt-14`, and `pb-20 md:pb-24` consistently. Remove the `bg-canvas` meaning of warm gray by relying on Task 1’s white token. Preserve each layout’s existing `Navbar`, `Footer`, and children order.

- [ ] **Step 4: Normalize navigation and footer**

Update desktop and mobile navigation to:

- Use a white/90 surface with `border-line`, blur, and no strong shadow.
- Remove scale-based active animations.
- Use `text-primaryStrong` plus a 2px underline or dot for the active route.
- Apply `editorial-focus` to links and icon controls.
- Use `site-container` for identical horizontal alignment.

Update the footer to `bg-muted`, `border-line`, `site-container`, and shared secondary text. Keep existing copy, links, localization, and newsletter behavior.

- [ ] **Step 5: Normalize control geometry**

Change theme, language, share, back-to-top, and `Button` styles to 40px minimum targets, 10–12px radius or pill shape, semantic colors, `border-line`, and `editorial-focus`. Keep all event handlers and component APIs unchanged.

- [ ] **Step 6: Run the UI contract and type check**

Run: `node --experimental-strip-types --test tests/ui/designSystem.test.ts`

Run: `npx tsc --noEmit`

Expected: Both commands PASS.

- [ ] **Step 7: Commit the shared shell**

```bash
git add components/layouts components/Navbar.tsx components/NavMobile.tsx components/Footer.tsx components/ThemeSwitch.tsx components/LanguageSwitch.tsx components/ShareButtons.tsx components/BackToTop.tsx components/ui/button.tsx tests/ui/designSystem.test.ts
git commit -m "style: unify site shell and controls"
```

---

### Task 3: Create reusable editorial headers, filters, and Article cards

**Files:**
- Create: `components/common/PageHeader.tsx`
- Create: `components/common/FilterPills.tsx`
- Create: `components/articles/EditorialArticleCard.tsx`
- Modify: `components/common/SectionHeader.tsx`
- Modify: `components/CustomLayout/CardChapterList.tsx`
- Modify: `components/CustomLayout/CardPost.tsx`
- Modify: `components/home/GuidePostCards.tsx`
- Create: `tests/ui/editorialComponents.test.ts`

**Interfaces:**
- Consumes: `Types.Post`, `ArticleImage`, `canonicalArticlePath`, semantic UI utilities from Task 1.
- Produces:
  - `PageHeader({ eyebrow?, title, description?, meta?, align? })`
  - `FilterPills<T extends { id: string; name: string }>({ items, activeId, onChange, ariaLabel })`
  - `EditorialArticleCard({ article, variant?: "row" | "feature" | "compact", priority? })`

- [ ] **Step 1: Write shared-component contract tests**

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("PageHeader exposes a semantic h1 and shared spacing", () => {
  const source = readFileSync("components/common/PageHeader.tsx", "utf8");
  assert.match(source, /<h1/);
  assert.match(source, /site-container/);
  assert.match(source, /title/);
  assert.match(source, /description/);
});

test("EditorialArticleCard preserves canonical routing and its three variants", () => {
  const source = readFileSync(
    "components/articles/EditorialArticleCard.tsx",
    "utf8"
  );
  assert.match(source, /canonicalArticlePath\\(article\\)/);
  assert.match(source, /prefetch=\\{false\\}/);
  assert.match(source, /"row"/);
  assert.match(source, /"feature"/);
  assert.match(source, /"compact"/);
});
```

- [ ] **Step 2: Run the component tests and verify they fail**

Run: `node --experimental-strip-types --test tests/ui/editorialComponents.test.ts`

Expected: FAIL because the shared components do not exist.

- [ ] **Step 3: Implement `PageHeader` and `FilterPills`**

`PageHeader` uses the shared container but accepts `align="left" | "center"` without changing content semantics. `FilterPills` renders a labelled `<nav>` and `<button type="button">` items, uses `aria-pressed`, scrolls horizontally on mobile, and calls `onChange(item)`.

- [ ] **Step 4: Implement `EditorialArticleCard`**

Support:

- `row`: responsive image beside title, metadata, summary, and tags.
- `feature`: image-led card with title below or on an accessible contrast overlay.
- `compact`: small thumbnail with title, summary, and date.

All variants must use `ArticleImage`, `canonicalArticlePath`, `prefetch={false}`, 16px standard radius, shared semantic colors, and motion that disables translation under reduced motion.

- [ ] **Step 5: Convert legacy card components into thin adapters**

Keep current props of `CardPost` and `CardChapterList`, transform them into a `Types.Post`-compatible object, and render the matching `EditorialArticleCard` variant. Update `GuidePostCards` and `SectionHeader` to use the same semantic classes without changing their public props.

- [ ] **Step 6: Run component tests and type check**

Run: `node --experimental-strip-types --test tests/ui/editorialComponents.test.ts tests/ui/designSystem.test.ts`

Run: `npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 7: Commit the shared editorial components**

```bash
git add components/common components/articles components/CustomLayout/CardChapterList.tsx components/CustomLayout/CardPost.tsx components/home/GuidePostCards.tsx tests/ui
git commit -m "style: add shared editorial content components"
```

---

### Task 4: Migrate the home page and primary category hubs

**Files:**
- Modify: `pages/index.tsx`
- Modify: `pages/whv/index.tsx`
- Modify: `pages/travel/index.tsx`
- Modify: `pages/life/index.tsx`
- Modify: `pages/technical/index.tsx`
- Modify: `components/home/HomePageSection.tsx`
- Modify: `components/home/HomeHero.tsx`
- Modify: `components/home/HomeLandingSections.tsx`
- Modify: `components/home/HomePersonaStory.tsx`
- Modify: `components/home/HomeConsultCta.tsx`
- Modify: `components/home/RouteSection.tsx`
- Modify: `components/home/GallerySection.tsx`
- Modify: `components/home/TravelGuideSection.tsx`
- Modify: `components/home/WhvGuideSection.tsx`
- Modify: `tests/ui/designSystem.test.ts`

**Interfaces:**
- Consumes: `PageHeader`, `FilterPills`, `EditorialArticleCard`, `SectionHeader`, and Task 1 semantic utilities.
- Produces: A white editorial home canvas and consistent WHV, travel, life, and technical hubs.

- [ ] **Step 1: Add a route-style regression check**

Extend `tests/ui/designSystem.test.ts`:

```ts
test("primary hubs no longer use the legacy warm canvas or raw mint hex", () => {
  for (const file of [
    "pages/index.tsx",
    "pages/whv/index.tsx",
    "pages/travel/index.tsx",
    "pages/life/index.tsx",
    "pages/technical/index.tsx",
  ]) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /bg-canvas\\/50|#4a9e8f|#62BFAD/);
  }
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --experimental-strip-types --test tests/ui/designSystem.test.ts`

Expected: FAIL on the current route-specific raw colors.

- [ ] **Step 3: Migrate the home page**

Retain the photographic hero and existing content order. Change the page canvas to white, align every section to `site-container`, use 64/96px section spacing, replace heavy floating panel shadows with borders, and map all mint uses to `primary`, `primarySoft`, or `primaryStrong`. Preserve translations, links, animations, and image behavior.

- [ ] **Step 4: Migrate WHV and travel**

Use `PageHeader` for both hubs. Keep the WHV roadmap and travel feature image, but normalize surface, radius, border, section spacing, and Article-card variants. Use one shared category-filter treatment and remove strong negative margins unless required for the feature composition.

- [ ] **Step 5: Migrate life and technical**

Replace page-specific card markup with `EditorialArticleCard variant="row"` or `compact`. Replace the technical category implementation with `FilterPills`; retain the existing filter state and sidebar. Ensure the sticky filter offset matches the shared navigation height.

- [ ] **Step 6: Run UI tests and type check**

Run: `node --experimental-strip-types --test tests/ui/*.test.ts`

Run: `npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 7: Commit the primary route migration**

```bash
git add pages/index.tsx pages/whv/index.tsx pages/travel/index.tsx pages/life/index.tsx pages/technical/index.tsx components/home tests/ui/designSystem.test.ts
git commit -m "style: unify home and category hubs"
```

---

### Task 5: Migrate secondary routes, search, and supporting blocks

**Files:**
- Modify: `pages/about/index.tsx`
- Modify: `pages/post/index.tsx`
- Modify: `pages/tags/index.tsx`
- Modify: `pages/tags/[tag].tsx`
- Modify: `pages/tools/resume/index.tsx`
- Modify: `pages/404.tsx`
- Modify: `components/layouts/ListLayoutWithTags.tsx`
- Modify: `components/Sidebar.tsx`
- Modify: `components/NewsletterSubscribe.tsx`
- Modify: `components/SectionFAQ.tsx`
- Modify: `components/ResumeBox.tsx`
- Modify: `components/SEOOptimizer.tsx`
- Modify: `tests/ui/designSystem.test.ts`

**Interfaces:**
- Consumes: Shared shell, `PageHeader`, `FilterPills`, `EditorialArticleCard`, semantic forms and surfaces.
- Produces: Consistent secondary routes, tag navigation, search field, sidebar, calls to action, tool panels, and empty states.

- [ ] **Step 1: Add secondary-route style assertions**

Check that `ListLayoutWithTags`, resume, and 404 use `site-container`, semantic colors, and no `shadow-md`/`shadow-lg` default surfaces.

- [ ] **Step 2: Run the assertions and verify they fail**

Run: `node --experimental-strip-types --test tests/ui/designSystem.test.ts`

Expected: FAIL against the current legacy tag sidebar, resume panel, and error page.

- [ ] **Step 3: Migrate about, Article index, and tags**

Use `PageHeader`, shared section rhythm, `FilterPills`, and `EditorialArticleCard`. Keep search filtering, route links, counts, and empty-state behavior. Replace the permanent tag sidebar on small screens with the shared horizontally scrollable filters; retain an accessible desktop navigation where useful.

- [ ] **Step 4: Migrate resume and 404**

Keep resume generation and export behavior unchanged. Apply the shared canvas, surface, field, button, focus, and spacing styles. Give 404 the shared page title, supporting text, and primary return action.

- [ ] **Step 5: Migrate supporting blocks**

Update sidebar, newsletter, FAQ, resume box, and SEO optimizer to use the shared 16px surface card, `border-line`, 20–24px padding, semantic form controls, and mint action states. Do not alter network calls, form submission, or validation logic.

- [ ] **Step 6: Run UI tests and type check**

Run: `node --experimental-strip-types --test tests/ui/*.test.ts`

Run: `npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 7: Commit the secondary routes**

```bash
git add pages/about pages/post/index.tsx pages/tags pages/tools/resume pages/404.tsx components/layouts/ListLayoutWithTags.tsx components/Sidebar.tsx components/NewsletterSubscribe.tsx components/SectionFAQ.tsx components/ResumeBox.tsx components/SEOOptimizer.tsx tests/ui/designSystem.test.ts
git commit -m "style: unify secondary routes and supporting blocks"
```

---

### Task 6: Align Article detail and editorial content styles

**Files:**
- Modify: `pages/[category]/[id].tsx`
- Modify: `pages/post/[id].tsx`
- Modify: `components/layouts/PostDetailLayout.tsx`
- Modify: `components/Notion/NotionPage.tsx`
- Modify: `components/Notion/NotionPageHeader.tsx`
- Modify: `components/Notion/NotionPageAside.tsx`
- Modify: `components/RelatedPosts/RelatedPosts.tsx`
- Modify: `components/stats/PostEngagementBar.tsx`
- Modify: `components/TranslateComponent.tsx`
- Modify: `components/BlogComments.tsx`
- Modify: `styles/notion.css`
- Modify: `styles/markdown.css`
- Modify: `styles/markdown-tui.css`
- Modify: `styles/markdown-github.css`
- Modify: `tests/ui/designSystem.test.ts`

**Interfaces:**
- Consumes: Shared Article cards, shell, semantic tokens, and unchanged Notion/Markdown renderers.
- Produces: A centered 720–760px reading column plus consistent metadata, aside, engagement, translation, comments, related Articles, headings, links, images, quotes, and code blocks.

- [ ] **Step 1: Add Article-style contract assertions**

Assert that `PostDetailLayout` uses `bg-canvas`, that related Articles use the shared Article card, and that `styles/notion.css` references semantic variables for links, borders, and surfaces.

- [ ] **Step 2: Run the assertions and verify they fail**

Run: `node --experimental-strip-types --test tests/ui/designSystem.test.ts`

Expected: FAIL where legacy gray surfaces and shadows remain.

- [ ] **Step 3: Normalize Article layout and header chrome**

Preserve all route resolution and Article data. Set the reading column to `max-w-[46rem]`, align metadata/actions to the shared type scale, and apply consistent spacing between header, content, engagement, comments, and related Articles.

- [ ] **Step 4: Normalize Article supporting components**

Apply shared surfaces to the table of contents, translation, engagement, comments, and related Articles. Use compact or feature `EditorialArticleCard` variants as appropriate. Preserve component props, event handlers, and data fetching.

- [ ] **Step 5: Normalize Notion and Markdown content**

Use semantic variables for headings, links, borders, quotes, inline code, preformatted blocks, tables, and details. Set consistent heading margins, 16px image/code radius, responsive table overflow, and accessible link/focus treatment. Scope rules beneath existing renderer roots to prevent global leakage.

- [ ] **Step 6: Run all focused tests and type check**

Run: `npm run test:performance-fixes`

Run: `node --experimental-strip-types --test tests/ui/*.test.ts`

Run: `npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 7: Commit the Article-detail migration**

```bash
git add pages/'[category]' pages/post/'[id].tsx' components/layouts/PostDetailLayout.tsx components/Notion components/RelatedPosts components/stats components/TranslateComponent.tsx components/BlogComments.tsx styles tests/ui/designSystem.test.ts
git commit -m "style: align article reading experience"
```

---

### Task 7: Cross-route verification and final cleanup

**Files:**
- Modify only files that fail verification.

**Interfaces:**
- Consumes: Tasks 1–6.
- Produces: A buildable, responsive, accessible, visually unified site with no legacy shared UI palette.

- [ ] **Step 1: Scan for legacy shared styling**

Run:

```bash
rg -n "#62BFAD|#4a9e8f|#f8f5dc|#fffaeb|bg-canvas/50|shadow-(md|lg)" pages components --glob '*.{tsx,css}'
```

Expected: No common UI use remains. Image-overlay whites and intentionally documented compatibility styles may remain only after manual inspection.

- [ ] **Step 2: Run the complete automated verification**

Run: `npm run test:performance-fixes`

Run: `node --experimental-strip-types --test tests/ui/*.test.ts`

Run: `npx tsc --noEmit`

Run: `npm run build`

Expected: Every command PASS.

- [ ] **Step 3: Review representative routes**

Run the existing development server and inspect:

- `/`
- `/whv`
- `/travel`
- `/life`
- `/technical`
- `/about`
- `/tags`
- `/post`
- One representative Canonical Article URL
- `/tools/resume`
- `/404`

At 390px, 768px, and 1440px widths, confirm common left edges, gutters, section rhythm, card stacking, filter scrolling, sticky offsets, image cropping, and absence of horizontal overflow.

- [ ] **Step 4: Review interaction and accessibility states**

Confirm keyboard focus for navigation, filters, buttons, search, language/theme controls, and Article cards. Verify light/dark mode parity and reduced-motion behavior. Fix only concrete issues discovered.

- [ ] **Step 5: Re-run verification after fixes**

Run: `node --experimental-strip-types --test tests/ui/*.test.ts && npx tsc --noEmit && npm run build`

Expected: PASS with no new warnings caused by this change.

- [ ] **Step 6: Commit final cleanup**

```bash
git add pages components styles tests/ui tailwind.config.ts
git commit -m "style: finish unified editorial ui"
```
