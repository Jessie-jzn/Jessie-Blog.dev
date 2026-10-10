# Home Hero Motion Implementation Plan

**Goal:** Ship the approved typewriter headline and editorial cartoon portrait with breathing, blinking and subtle pointer response.

**Architecture:** Keep homepage copy, actions and data unchanged. Use a reusable CSS typewriter with reserved character widths; isolate portrait animation in a component with CSS modules, existing Framer Motion springs and visibility detection. Ship both transparent WebP frames locally.

**Tech Stack:** Next.js 14, React, CSS modules, existing Framer Motion.

## Constraints
- Preserve bilingual headings, reading/GitHub/email links and local .env changes.
- Reduced-motion users see complete static content immediately.
- Pause ongoing portrait animation when offscreen, when the tab is hidden,.
- Prioritize only the open-eye hero portrait. Keep both assets under 500 KiB each.
- No new runtime dependency; no publishing or Git push.

## Execution
- [x] Update existing hero asset regression coverage to expect the approved local cartoon frames and responsive image priority; run to observe the old photo contract fail.
- [x] Copy optimized approved WebP frames; add TypewriterText and HeroPortrait plus scoped CSS; connect HomeHero and translated pause/portrait labels.
- [x] Run UI tests, TypeScript and targeted lint. Inspect desktop/mobile rendering and reduced motion in a browser when available.

## Validation
31 targeted UI tests passed; TypeScript and targeted ESLint passed. Desktop and 390px mobile browser rendering, image loading and the initial pause/resume control were verified. Full UI suite: 54/55 pass; the pre-existing Article aside test expects variant="index" while the existing aside renders a title list. Reduced motion is implemented with CSS media rules and Framer Motion preference detection; browser preference emulation was unavailable.

## Follow-up
User requested removing the pause control and keeping all effects enabled by default. The control and its translations were removed; viewport, tab visibility and reduced-motion safeguards remain.
