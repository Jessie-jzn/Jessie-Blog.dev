import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { resolveLegacyArticleAdapterHref } from "../../components/articles/editorialArticleHref.ts";

const componentSource = (path: string) => {
  assert.ok(existsSync(path), `Expected ${path} to exist`);
  return readFileSync(path, "utf8");
};

test("PageHeader exposes a semantic h1 and shared spacing", () => {
  const source = componentSource("components/common/PageHeader.tsx");
  assert.match(source, /<h1/);
  assert.match(source, /site-container/);
  assert.match(source, /title/);
  assert.match(source, /description/);
});

test("FilterPills provides labelled, pressed filter controls", () => {
  const source = componentSource("components/common/FilterPills.tsx");
  assert.match(source, /<nav/);
  assert.match(source, /aria-label/);
  assert.match(source, /type="button"/);
  assert.match(source, /aria-pressed/);
  assert.match(source, /onChange\(item\)/);
});

test("EditorialArticleCard preserves canonical routing and its three variants", () => {
  const source = componentSource("components/articles/EditorialArticleCard.tsx");
  assert.match(source, /canonicalArticlePath\(article\)/);
  assert.match(source, /prefetch=\{false\}/);
  assert.match(source, /"row"/);
  assert.match(source, /"feature"/);
  assert.match(source, /"compact"/);
  assert.match(source, /ArticleImage/);
});

test("legacy card adapters keep canonical links when category and slug are available", () => {
  assert.equal(
    resolveLegacyArticleAdapterHref({
      id: "legacy-external-id",
      category: " Travel ",
      slug: " Coastal-Guide ",
      title: "Coastal guide",
    }),
    "/travel/coastal-guide/",
  );
});

test("legacy card adapters retain a non-Notion id when canonical data is incomplete", () => {
  assert.equal(
    resolveLegacyArticleAdapterHref({ id: "legacy/external-id", title: "Old card" }),
    "/post/legacy%2Fexternal-id",
  );
});

test("legacy card adapters fall back to the post index for an empty id", () => {
  assert.equal(resolveLegacyArticleAdapterHref({ id: "", title: "Untitled" }), "/post");
});
