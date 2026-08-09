# Home Editorial Command Surface Redesign

## Goal

Redesign the React home page as an editorial command surface inspired by Linear's hierarchy and Raycast's crisp interaction language. The result should feel like a personal publication rather than a SaaS dashboard: Jessie's identity and writing lead, while projects and collaboration remain supporting paths.

## Scope and Constraints

- Keep the existing `getStaticProps` flow, Notion queries, Article filtering, ISR, SEO, internationalization, routes, email actions, and link destinations unchanged.
- Make `pages/index.tsx` the composition point and update only the home-specific components and shared presentation tokens required by the redesign.
- Use the repository's existing Tailwind CSS 3 setup and existing dependencies. Do not introduce another component system.
- Preserve unrelated working-tree changes and avoid broad refactors.
- Keep all existing home content sections unless a presentational wrapper becomes redundant; no new claims, metrics, testimonials, or business behavior are introduced.

## Design Direction

The selected direction is **Editorial Command Surface**.

Design parameters are `DESIGN_VARIANCE: 6`, `MOTION_INTENSITY: 4`, and `VISUAL_DENSITY: 4`. The interface combines a disciplined, mostly monochrome editorial grid with Jessie's existing mint accent. Linear supplies the spacing, typography, separators, and calm hierarchy; Raycast supplies compact indexed rows, active states, and tactile controls.

The page must not use repeated floating Cards as its primary layout. Content groups are defined through whitespace, thin rules, columns, numbering, and controlled surface changes. Rounded containers are reserved for controls or a single genuinely elevated focal element.

## Page Composition

### 1. Identity Hero

The hero remains image-led but changes from a centered overlay stack to an asymmetric composition. The main identity statement, supporting copy, and two existing calls to action occupy the dominant left region. A compact content index or identity rail occupies the secondary region and points to the page's principal themes without adding new destinations.

The hero must fit in the initial viewport on common desktop sizes. Its overlay treatment should protect text contrast without hiding the photography. Motion is limited to a restrained entrance and must respect reduced-motion preferences.

### 2. Persona Statement

The persona copy becomes an editorial manifesto band with a narrow label column and a readable text column. It uses typography and rules rather than a container Card. The existing aside remains visually distinct through indentation or a single accent rule.

### 3. Content Worlds

AI and technology, WHV, travel, and life become an indexed directory rather than four equal Cards. Each destination is a full-width or two-column row with a sequence number, title, concise description, and directional affordance. Hover and focus states may shift the rule, accent, or background subtly, but the rows remain part of one continuous surface.

### 4. WHV Guide

The four journey stages become a compact horizontal process rail or segmented index using text and restrained iconography. Emoji are removed from the visible interface. Existing stage routes and bilingual labels stay unchanged.

WHV Articles use a hierarchy of one emphasized lead Article followed by denser supporting Articles. This avoids an equal-card wall and establishes a clear reading priority while preserving the same input data and canonical Article links.

### 5. Travel Guide

Travel follows the same Article system for consistency but may use a wider image-led lead item to preserve its photographic character. The introductory copy becomes an inline editorial note rather than a rounded muted Card.

### 6. Technology, Life, and Services

The existing text blocks become a structured capability ledger: headings, descriptions, and thin dividers in an asymmetric grid. The About link remains secondary. No service Card grid is introduced.

### 7. Projects

Projects become a numbered project register with role, title, and summary arranged in rows. The entire section uses one continuous bordered rhythm rather than three standalone Cards. The existing Projects route and project data remain unchanged.

### 8. Collaboration

The final call to action is the page's single high-emphasis surface. Its three collaboration paths are expressed as a divided list rather than Cards. The existing email action, disclosure copy, and visible email address remain intact. The CTA label and intent stay consistent with the hero contact action.

## Visual System

- Retain the existing cool neutral canvas and mint accent, with one accent family across light and dark themes.
- Use Outfit and the current font stack; do not add remote fonts.
- Increase contrast between display, section, body, and metadata type. Use tight tracking for major headings and compact uppercase labels only for navigational metadata.
- Prefer square or subtly rounded structural surfaces. Pills are limited to small status labels and controls.
- Prefer `border-t`, `border-b`, `divide-y`, grid lines, and negative space over shadows and floating panels.
- Use a consistent container width and a more deliberate section rhythm, with responsive reductions on small screens.
- All interactive elements receive visible focus, hover, and active states. Text and button contrast must meet WCAG AA.

## Responsive Behavior

- The hero collapses to a single readable column on mobile; the secondary index follows the main action rather than overlaying the image.
- Directory and project rows stack their metadata without changing reading order.
- Article layouts become one column on narrow screens, retaining the lead-versus-supporting hierarchy through image size and typography.
- WHV stages remain touch-friendly and may scroll horizontally only if four readable stages cannot fit without cramped labels.
- CTA controls remain single-line and at least 44 pixels high.

## Component Boundaries

- `pages/index.tsx` owns section order and top-level page rhythm.
- `HomeHero` owns the image, identity content, and hero-local navigation index.
- `HomePageSection` provides semantic section framing and tone without imposing a Card.
- `HomeContentWorlds`, `HomeProjectsPreview`, and `HomeConsultCta` each render one continuous indexed or divided surface.
- `WhvGuideSection` and `TravelGuideSection` retain their data contracts and delegate Article presentation to `GuidePostCards`, which may be renamed internally only if all existing imports remain safe.
- Shared changes outside `components/home` are limited to presentation primitives needed by multiple redesigned home sections.

## Data Flow and States

The page continues receiving `whvPosts` and `travelPosts` from `getStaticProps`. Components remain presentational and do not introduce new client-side fetching or global state. Existing empty behavior is preserved: Travel renders nothing without Articles, and Article collections render nothing when empty. The redesign must not manufacture placeholder content for production data.

Image loading keeps Next.js `Image`, appropriate responsive `sizes`, and priority only for above-the-fold imagery. Existing external image configuration remains unchanged.

## Verification

- Run TypeScript checking and the repository lint command.
- Run relevant existing tests and a production build where environment access permits.
- Inspect the home page at mobile, tablet, and desktop widths in both light and dark themes.
- Verify keyboard navigation, visible focus, CTA contrast, image legibility, reduced motion, and absence of horizontal overflow.
- Confirm all existing destinations, mail subjects, translations, SEO fields, Article filtering, and empty-data behavior remain unchanged.
- Review the final page specifically for repeated Card containers, mixed radius rules, excessive accent use, wrapped desktop CTAs, and duplicated CTA intent.

## Success Criteria

- The first viewport clearly communicates who Jessie is, what she writes about, and how to read or contact her.
- Major sections have distinct hierarchy without relying on stacked Cards.
- The page feels recognizably inspired by Linear and Raycast while remaining a photography-friendly personal publication.
- WHV and travel Articles expose an obvious lead story and scannable supporting choices.
- Light and dark themes remain coherent, responsive, accessible, and functionally equivalent to the current home page.
