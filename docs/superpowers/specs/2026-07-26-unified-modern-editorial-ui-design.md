# Unified Modern Editorial UI Design

## Goal

Unify Jessie Blog around a clean, white, modern editorial visual system with a restrained Instagram-inspired personality. The redesign should make every route feel like part of the same publication while preserving Article content, navigation, URLs, localization, and existing product behavior.

## Design Direction

The selected direction is **Light Editorial**:

- White is the primary canvas.
- A very light warm gray provides quiet section contrast.
- Mint green remains the single brand accent.
- Typography, whitespace, photography, and thin borders create hierarchy.
- Shadows are subtle and reserved for interactive elevation.
- The visual tone is contemporary and personal, but reading comfort takes priority over decorative collage effects.

The result should feel brighter and more consistent than the current warm-gray site, without becoming cold or generic.

## Scope

This change covers:

- The shared site shell: page canvas, navigation, mobile navigation, footer, and floating actions.
- Home, WHV, travel, life, technical, about, tag, Article-index, resume-tool, 404, and sitemap-facing page layouts.
- Article cards, guide cards, category filters, section headings, tags, buttons, sidebars, newsletter blocks, related Articles, and Article-detail chrome.
- Responsive spacing and typography across mobile, tablet, and desktop.
- Dark-mode equivalents for the unified tokens and components.

This change will not:

- Change Article data, Notion integration, Canonical Article URLs, routing, localization behavior, or analytics.
- Rewrite page copy or restructure editorial categories.
- Replace existing imagery solely for visual novelty.
- Introduce a new component library or a second styling system.
- Turn the site into a dense masonry feed or decorative scrapbook.

## Visual Foundation

### Color roles

Colors will be defined by semantic role so components do not carry unrelated one-off hex values.

- `canvas`: pure or near-white page background.
- `surface`: white cards and elevated controls.
- `surface-muted`: warm off-white section background, approximately `#F7F7F5`.
- `ink`: near-black primary text.
- `ink-muted`: neutral gray secondary text.
- `line`: low-contrast neutral border.
- `accent`: Jessie mint green, based on the current `#62BFAD`.
- `accent-soft`: pale mint background for selected filters and quiet callouts.
- `accent-strong`: darker mint for accessible text and hover states.

Large saturated color blocks will be removed. Accent color will primarily signal selection, links, and small editorial details.

### Spacing

The site will use one consistent spacing rhythm derived from 4px increments.

- Page gutters: 16px mobile, 24px tablet, 32px desktop.
- Primary content maximum width: 1152px.
- Reading-column maximum width: approximately 720–760px.
- Section spacing: 64px mobile and 88–96px desktop.
- Card padding: 20–24px mobile and 24–32px desktop.
- Repeated-item gaps: 16px mobile and 24px desktop.

Shared container and section utilities will replace page-specific combinations that currently create uneven left edges and vertical rhythm.

### Shape and elevation

- Standard controls and tags: 10–12px radius or pill shape where semantically appropriate.
- Standard cards: 16px radius.
- Feature cards and image-led editorial blocks: 20–24px radius.
- Default cards use a thin border with no visible shadow.
- Hovered interactive cards gain a small upward shift, stronger border, and soft shadow.
- Nested surfaces avoid stacking multiple rounded boxes without a clear hierarchy.

### Typography

The existing sans-serif direction remains, with a tighter and more deliberate hierarchy:

- Display headings use strong but not oversized weights and slightly tightened tracking.
- Page titles share one responsive scale.
- Section titles share one smaller responsive scale.
- Article-card titles use consistent line height and truncation behavior.
- Body and summary text prioritize 1.6–1.75 line height.
- Metadata, dates, and labels use a restrained small-text scale instead of many unrelated pixel sizes.

## Shared Structure

### Site shell

The default page background becomes white. The navigation remains sticky and uses a translucent white surface, a thin bottom border, and restrained blur. Active navigation uses the mint accent and a quiet indicator rather than scaling.

The footer uses the muted warm-gray surface to close the page. Its columns, social links, and newsletter elements share the same container alignment as the main content.

Floating share and utility controls will use the same surface, border, radius, icon size, and hover behavior as other controls.

### Page header

Content hubs use a reusable editorial page header:

- Optional eyebrow or badge.
- Consistent page-title scale.
- Short supporting description.
- Optional count or compact action.
- Predictable space before the first content section.

WHV may retain its roadmap as a distinctive feature, but its cards will use the shared surface, border, type, and spacing rules.

### Section header

Section headings use a shared component with title, optional description, and optional trailing action. Decorative lines and badges use the same accent treatment across the home page and content hubs.

### Filters and tags

Category navigation becomes a shared horizontal filter pattern:

- Neutral text and transparent background by default.
- Pale mint surface and darker accent text when selected.
- Consistent height, padding, focus ring, and horizontal scrolling on mobile.
- No scale animation that causes layout movement.

Article tags use a quieter neutral treatment and are visually distinct from interactive category filters.

## Content Components

### Article cards

All Article collections will use two related card families instead of separate visual inventions per page:

1. **Editorial row card** for category and index pages:
   - Thumbnail, metadata, title, summary, and tags.
   - Consistent image ratio and content padding.
   - Stacks vertically on small screens.

2. **Visual feature card** for home, travel highlights, and curated guides:
   - Larger image-led composition.
   - Minimal overlay only when text contrast requires it.
   - The same radius, border, title hierarchy, and hover motion as the row card.

Technical, life, travel, WHV, tag, related-Article, and sidebar implementations should reuse these foundations, with layout variants rather than unrelated styling.

### Sidebars and supporting blocks

Sidebars, newsletter forms, FAQs, related Articles, consultation calls to action, and profile blocks share:

- The same surface hierarchy.
- One border treatment.
- One card-radius scale.
- Matching internal padding.
- Consistent heading and supporting-text styles.

Promotional blocks may use `accent-soft`, but should not introduce new brand colors.

### Article detail

The Article reading experience will be visually aligned without altering the renderer:

- Header metadata and actions use the common type and spacing scale.
- The reading column remains calm and centered.
- Table of contents, aside, translation, sharing, engagement, comments, and related Articles use shared surfaces and borders.
- Markdown and Notion content receive aligned heading spacing, link color, blockquote styling, code-block radius, image radius, and horizontal-overflow behavior.

## Page-Specific Treatment

- **Home:** retains the strongest photographic and editorial personality, but all sections align to the shared container and spacing rhythm.
- **WHV:** keeps the staged roadmap and guide emphasis; removes inconsistent card treatments.
- **Travel:** remains image-forward, with consistent page header and card geometry.
- **Life:** uses the editorial row-card family rather than its current standalone styling.
- **Technical:** keeps category filtering and sidebar, but adopts the shared header, filter pills, content spacing, and cards.
- **About:** uses the same page shell and section rhythm while allowing personal imagery and biography content to remain distinctive.
- **Tags and Article index:** use the same hub header, filters, and Article card family.
- **Resume tool:** retains its task-specific interface while adopting the same canvas, controls, panels, and spacing tokens.
- **404:** uses the shared typography, surface, and primary action.

## Responsive Behavior

- Mobile content uses a single-column flow with 16px gutters.
- Horizontal filters scroll without visible scrollbars and maintain touch-sized targets.
- Article-card images move above text on narrow screens.
- Sidebars move below primary content or hide only when their information is duplicated elsewhere.
- Sticky elements account for the shared navigation height.
- Hover effects are enhancements; focus and touch states remain clear without hover.
- Motion respects `prefers-reduced-motion`.

## Dark Mode

Dark mode remains supported using semantic tokens:

- Near-black canvas and slightly lighter surfaces.
- Low-contrast light borders.
- Off-white primary text and neutral secondary text.
- The same mint accent, adjusted where necessary for contrast.

Component structure and spacing stay identical between modes. Dark mode should not retain legacy colors that no longer exist in light mode.

## Accessibility

- Text and controls meet WCAG AA contrast targets.
- All interactive elements have visible keyboard focus.
- Filter tabs and buttons retain appropriate semantics and touch target sizes.
- Color is not the sole indicator of active or selected state.
- Image overlays maintain readable contrast.
- Animation does not cause content reflow and can be reduced.

## Implementation Boundaries

The implementation should first establish semantic tokens and shared layout utilities, then update shared components, and finally migrate route-specific markup. Existing functionality and data flow remain intact.

Where duplicated card or header markup can safely share a component, it should be consolidated. Large unrelated refactors are excluded. Existing user changes in the working tree must be preserved and integrated rather than overwritten.

## Verification

Verification will include:

- Type checking and the repository's focused automated tests.
- A complete production build.
- Route-level review of home, WHV, travel, life, technical, about, tags, Article index, representative Article detail, resume tool, and 404.
- Mobile, tablet, and desktop checks for alignment, overflow, sticky offsets, and card stacking.
- Light- and dark-mode checks.
- Keyboard-focus and reduced-motion checks on shared interactive components.

## Success Criteria

- Every primary route visibly belongs to the same white, modern editorial system.
- Main content edges, section spacing, card gaps, radii, borders, and typography are consistent.
- Mint is the only brand accent used for common UI states.
- Category pages share recognizable page headers, filters, and Article-card patterns.
- No page retains a large warm-gray canvas or an unrelated saturated accent.
- Article reading and navigation behavior remain unchanged.
- The production build and existing focused tests pass.
