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
const listLayoutWithTags = readFileSync(
  "components/layouts/ListLayoutWithTags.tsx",
  "utf8",
);
const resumeTool = readFileSync("pages/tools/resume/index.tsx", "utf8");
const resumeBox = readFileSync("components/ResumeBox.tsx", "utf8");
const notFoundPage = readFileSync("pages/404.tsx", "utf8");
const newsletterSubscribe = readFileSync(
  "components/NewsletterSubscribe.tsx",
  "utf8",
);
const sectionFaq = readFileSync("components/SectionFAQ.tsx", "utf8");
const postDetailLayout = readFileSync(
  "components/layouts/PostDetailLayout.tsx",
  "utf8",
);
const relatedPosts = readFileSync(
  "components/RelatedPosts/RelatedPosts.tsx",
  "utf8",
);
const notionPage = readFileSync("components/Notion/NotionPage.tsx", "utf8");
const notionPageHeader = readFileSync(
  "components/Notion/NotionPageHeader.tsx",
  "utf8",
);
const translateComponent = readFileSync(
  "components/TranslateComponent.tsx",
  "utf8",
);
const notionCss = readFileSync("styles/notion.css", "utf8");
const markdownTui = readFileSync("styles/markdown-tui.css", "utf8");
const markdownStyles = [
  readFileSync("styles/markdown.css", "utf8"),
  markdownTui,
  readFileSync("styles/markdown-github.css", "utf8"),
];
const englishCommon = JSON.parse(
  readFileSync("public/locales/en/common.json", "utf8"),
);
const chineseCommon = JSON.parse(
  readFileSync("public/locales/zh/common.json", "utf8"),
);

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

test("secondary routes use the shared container and semantic surfaces", () => {
  for (const source of [listLayoutWithTags, resumeTool, notFoundPage]) {
    assert.match(source, /site-container/);
    assert.match(source, /(?:bg-canvas|bg-surface|bg-muted|text-ink|text-subtle)/);
    assert.doesNotMatch(source, /\bshadow-(?:md|lg)\b/);
  }
});

test("secondary controls use bilingual copy and preserve the original resume UI", () => {
  for (const locale of [englishCommon, chineseCommon]) {
    assert.equal(typeof locale.articleList.all, "string");
    assert.equal(typeof locale.articleList.search, "string");
    assert.equal(typeof locale.articleList.browseByTag, "string");
    assert.equal(typeof locale.articleList.viewTag, "string");
    assert.equal(typeof locale.articleList.count, "string");
    assert.equal(typeof locale.articleList.empty, "string");
    assert.equal(typeof locale.faqSection.eyebrow, "string");
    assert.equal(typeof locale.faqSection.title, "string");
    assert.equal(typeof locale.emailAddress, "string");
  }

  assert.match(listLayoutWithTags, /useTranslation\("common"\)/);
  assert.doesNotMatch(
    listLayoutWithTags,
    /All Articles|Search articles|Browse articles by tag|View articles tagged|No articles found/,
  );
  assert.match(sectionFaq, /t\("faqSection\.eyebrow"\)/);
  assert.match(sectionFaq, /t\("faqSection\.title"\)/);
  assert.doesNotMatch(resumeTool, /resume-job-title|onClick=\{handleGenerate\}/);
});

test("final editorial cleanup uses Article terminology and supporting-card padding", () => {
  assert.equal(englishCommon.post, "Articles");
  assert.equal(englishCommon.lastPost, "Latest Articles");
  assert.equal(chineseCommon.post, "文章");
  assert.equal(chineseCommon.lastPost, "最新文章");
  assert.match(resumeBox, /rounded-2xl p-6 text-ink/);
  assert.doesNotMatch(resumeBox, /\bsm:p-8\b/);
});

test("newsletter email field has a localized accessible name", () => {
  assert.match(newsletterSubscribe, /<label[^>]*htmlFor=\{emailInputId\}/);
  assert.match(newsletterSubscribe, /id=\{emailInputId\}/);
  assert.match(newsletterSubscribe, /name="email"/);
  assert.match(newsletterSubscribe, /t\("emailAddress"\)/);
});

test("new Article support controls localize their accessible labels", () => {
  assert.deepEqual(englishCommon.articleControls, {
    breadcrumb: "Breadcrumb",
    translationInput: "Enter text to translate",
    translate: "Translate",
  });
  assert.deepEqual(chineseCommon.articleControls, {
    breadcrumb: "面包屑导航",
    translationInput: "输入要翻译的文字",
    translate: "翻译",
  });

  assert.match(notionPageHeader, /aria-label=\{t\("articleControls\.breadcrumb"\)\}/);
  assert.match(translateComponent, /useTranslation\(["']common["']\)/);
  assert.match(
    translateComponent,
    /aria-label=\{t\("articleControls\.translationInput"\)\}/,
  );
  assert.match(
    translateComponent,
    /placeholder=\{t\("articleControls\.translationInput"\)\}/,
  );
  assert.match(translateComponent, /\{t\("articleControls\.translate"\)\}/);
});

test("Article detail uses the shared reading column and editorial surfaces", () => {
  assert.match(postDetailLayout, /bg-canvas/);
  assert.match(postDetailLayout, /max-w-\[46rem\]/);
  assert.match(relatedPosts, /EditorialArticleCard/);
  assert.match(relatedPosts, /variant="compact"/);

  for (const token of [
    "var(--ui-accent-strong)",
    "var(--ui-line)",
    "var(--ui-surface)",
    "var(--ui-surface-muted)",
  ]) {
    assert.match(notionCss, new RegExp(escapeRegExp(token)));
  }
});

test("Article renderer styles stay scoped and use semantic content colors", () => {
  assert.match(notionCss, /\.notion-custom-container \.notion-link/);
  assert.match(notionCss, /\.notion-custom-container \.notion-code/);

  for (const source of markdownStyles) {
    assert.match(source, /\.markdown-body/);
    assert.match(source, /var\(--ui-ink\)/);
    assert.match(source, /var\(--ui-line\)/);
    assert.match(source, /var\(--ui-surface-muted\)/);
    assert.match(source, /border-radius:\s*1rem/);
  }
});

test("Article support blocks remain visible and readable in dark mode", () => {
  assert.match(
    notionPage,
    /<AdSense \/>[\s\S]*<NotionPageAside relatedPosts=\{relatedPosts\} \/>/,
  );
  assert.match(translateComponent, /bg-primaryStrong/);
  assert.match(translateComponent, /text-surface/);
  assert.match(
    markdownTui,
    /\.tuiCssForEditor \.markdown-body pre > code/,
  );
  assert.match(markdownTui, /background:\s*transparent/);
  assert.match(markdownTui, /color:\s*inherit/);
});
