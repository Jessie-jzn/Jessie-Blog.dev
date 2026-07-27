import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync("styles/globals.css", "utf8");
const tailwindConfig = readFileSync("tailwind.config.ts", "utf8");
const baseLayout = readFileSync("components/layouts/BaseLayout.tsx", "utf8");
const homeLayout = readFileSync("components/layouts/HomeLayout.tsx", "utf8");
const postListLayout = readFileSync(
  "components/layouts/PostListLayout.tsx",
  "utf8",
);
const travelListLayout = readFileSync(
  "components/layouts/TravelListLayout.tsx",
  "utf8",
);
const navbar = readFileSync("components/Navbar.tsx", "utf8");
const footer = readFileSync("components/Footer.tsx", "utf8");
const button = readFileSync("components/ui/button.tsx", "utf8");
const technicalHub = readFileSync("pages/technical/index.tsx", "utf8");

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const ruleBody = (source: string, selector: string) => {
  const match = source.match(
    new RegExp(`${escapeRegExp(selector)}\\s*\\{([\\s\\S]*?)\\}`),
  );

  assert.ok(match, `Expected a ${selector} rule`);
  return match[1];
};

const ruleBodyContaining = (source: string, selector: string, content: string) => {
  const matches = source.matchAll(
    new RegExp(`${escapeRegExp(selector)}\\s*\\{([\\s\\S]*?)\\}`, "g"),
  );
  const body = Array.from(matches, (match) => match[1]).find((rule) =>
    rule.includes(content),
  );

  assert.ok(body, `Expected a ${selector} rule containing ${content}`);
  return body;
};

const mediaBody = (minWidth: string) => {
  const match = css.match(
    new RegExp(
      `@media\\s*\\(\\s*min-width\\s*:\\s*${escapeRegExp(minWidth)}\\s*\\)\\s*\\{((?:[^{}]|\\{[^{}]*\\})*)\\}`,
    ),
  );

  assert.ok(match, `Expected a min-width ${minWidth} media query`);
  return match[1];
};

const assertDeclaration = (body: string, property: string, value: string) => {
  assert.match(
    body,
    new RegExp(`${escapeRegExp(property)}\\s*:\\s*${escapeRegExp(value)}\\s*;`, "i"),
  );
};

test("global UI tokens use the editorial palette in their light and dark scopes", () => {
  const lightTokens = {
    "--ui-canvas": "#ffffff",
    "--ui-surface": "#ffffff",
    "--ui-surface-muted": "#f7f7f5",
    "--ui-ink": "#171717",
    "--ui-ink-muted": "#6b6b67",
    "--ui-line": "rgba(23, 23, 23, 0.09)",
    "--ui-accent": "#62bfad",
    "--ui-accent-soft": "#eaf6f3",
    "--ui-accent-strong": "#347f72",
  };
  const darkTokens = {
    "--ui-canvas": "#111210",
    "--ui-surface": "#181a18",
    "--ui-surface-muted": "#1d201e",
    "--ui-ink": "#f5f5f2",
    "--ui-ink-muted": "#a4a7a2",
    "--ui-line": "rgba(255, 255, 255, 0.1)",
    "--ui-accent-soft": "rgba(98, 191, 173, 0.14)",
    "--ui-accent-strong": "#82d2c3",
  };

  const root = ruleBodyContaining(css, ":root", "--notion-max-width");
  const dark = ruleBody(css, ".dark");

  for (const [token, value] of Object.entries(lightTokens)) {
    assertDeclaration(root, token, value);
  }

  for (const [token, value] of Object.entries(darkTokens)) {
    assertDeclaration(dark, token, value);
  }
});

test("shared editorial utilities preserve layout, borders, and focus contracts", () => {
  assertDeclaration(ruleBody(css, ".site-container"), "max-width", "72rem");
  assertDeclaration(ruleBody(css, ".site-container"), "padding-inline", "1rem");
  assertDeclaration(ruleBody(css, ".site-section"), "padding-block", "4rem");

  assertDeclaration(ruleBody(mediaBody("640px"), ".site-container"), "padding-inline", "1.5rem");
  assertDeclaration(ruleBody(mediaBody("768px"), ".site-section"), "padding-block", "6rem");
  assertDeclaration(ruleBody(mediaBody("1024px"), ".site-container"), "padding-inline", "2rem");

  for (const utility of [".editorial-surface", ".editorial-card"]) {
    assertDeclaration(ruleBody(css, utility), "border", "1px solid var(--ui-line)");
  }

  assert.match(
    css,
    /\.editorial-tag\s*,\s*\.editorial-filter\s*\{[^}]*border\s*:\s*1px\s+solid\s+var\(--ui-line\)\s*;/,
  );
  assertDeclaration(
    ruleBody(css, ".editorial-focus:focus-visible"),
    "outline",
    "2px solid var(--ui-accent)",
  );
});

test("Tailwind semantic colors reference the global UI tokens", () => {
  const colorMappings = {
    canvas: "--ui-canvas",
    surface: "--ui-surface",
    muted: "--ui-surface-muted",
    ink: "--ui-ink",
    subtle: "--ui-ink-muted",
    line: "--ui-line",
    primary: "--ui-accent",
    primarySoft: "--ui-accent-soft",
    primaryStrong: "--ui-accent-strong",
  };

  for (const [color, token] of Object.entries(colorMappings)) {
    assert.match(
      tailwindConfig,
      new RegExp(`${color}\\s*:\\s*["']var\\(${escapeRegExp(token)}\\)["']`),
    );
  }
});

test("shared layouts use the semantic canvas and container", () => {
  assert.match(baseLayout, /bg-canvas/);
  assert.match(postListLayout, /site-container/);
  assert.match(navbar, /site-container/);
  assert.match(footer, /bg-muted/);
});

test("shared shell controls preserve hero overlay props and use line borders", () => {
  assert.match(navbar, /isFull\?: boolean/);
  assert.match(navbar, /currentTheme\?: "light" \| "dark"/);
  assert.match(navbar, /const showSolidBg = !isFull \|\| scrolled/);
  assert.match(navbar, /currentTheme === "dark"/);
  assert.match(
    navbar,
    /const controlSurface = btnColor \?\? \(!showSolidBg \? overlayControlSurface : undefined\);/,
  );
  assert.match(homeLayout, /<Navbar isFull=\{true\} currentTheme="dark" \/>/);
  assert.match(travelListLayout, /<Navbar isFull=\{true\} currentTheme="dark" \/>/);
  assert.match(button, /default:\s*"border border-line bg-primary/);
  assert.match(button, /destructive:\s*"border border-line bg-red-700 text-white/);
});

test("primary hubs no longer use the legacy warm canvas or raw mint hex", () => {
  for (const file of [
    "pages/index.tsx",
    "pages/whv/index.tsx",
    "pages/travel/index.tsx",
    "pages/life/index.tsx",
    "pages/technical/index.tsx",
  ]) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /bg-canvas\/50|#4a9e8f|#62BFAD/);
  }
});

test("technical sidebar clears the shared navigation and sticky filter", () => {
  assert.match(
    technicalHub,
    /sticky top-14[^"]*py-3[^"]*sm:top-16/,
  );
  assert.match(technicalHub, /<div className="sticky top-36">/);
});
