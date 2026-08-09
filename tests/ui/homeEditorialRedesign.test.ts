import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = (path: string) => readFileSync(path, 'utf8');

test('home keeps its data and business contracts', () => {
  const page = source('pages/index.tsx');
  assert.match(page, /getStaticProps/);
  assert.match(page, /revalidate: 10/);
  assert.match(page, /CommonSEO/);
  assert.match(page, /<HomeHero email=\{SiteConfig\.email\}/);
  assert.match(page, /<WhvGuideSection posts=\{whvPosts\}/);
  assert.match(page, /<TravelGuideSection[^>]*posts=\{travelPosts\}/s);
});

test('home uses indexed continuous surfaces instead of card grids', () => {
  const worlds = source('components/home/HomeContentWorlds.tsx');
  const projects = source('components/home/HomeProjectsPreview.tsx');
  const consultation = source('components/home/HomeConsultCta.tsx');
  assert.match(worlds, /divide-y/);
  assert.match(projects, /divide-y/);
  assert.match(consultation, /divide-y/);
  assert.doesNotMatch(worlds, /grid[^"']*lg:grid-cols-4/);
  assert.doesNotMatch(projects, /md:grid-cols-3/);
});

test('hero is asymmetric and exposes a content index', () => {
  const hero = source('components/home/HomeHero.tsx');
  assert.match(
    hero,
    /lg:grid-cols-\[minmax\(0,1\.4fr\)_minmax\(16rem,0\.6fr\)\]/
  );
  assert.match(hero, /landing\.worlds\.items/);
  assert.match(hero, /motion-reduce:transition-none/);
});

test('hero and content directory share a stable world index contract', () => {
  const hero = source('components/home/HomeHero.tsx');
  const worlds = source('components/home/HomeContentWorlds.tsx');
  const persona = source('components/home/HomePersonaStory.tsx');

  assert.match(worlds, /export const HOME_WORLD_KEYS/);
  assert.match(hero, /import \{ HOME_WORLD_KEYS \}/);
  assert.doesNotMatch(hero, /const worldKeys/);
  assert.match(hero, /key=\{`headline-\$\{i\}`\}/);
  assert.match(hero, /key=\{`paragraph-\$\{idx\}`\}/);
  assert.match(hero, /href='\/post'/);
  assert.match(persona, />\s*01\s*</);
  assert.doesNotMatch(persona, /landing\.persona\.sectionEyebrow/);
});

test('home locales provide the bilingual Article CTA and world directory', () => {
  const expectedLabels = {
    en: 'Read Articles',
    zh: '阅读文章',
  } as const;
  const expectedHrefs = ['/technical', '/whv', '/travel', '/life'];

  for (const locale of ['en', 'zh'] as const) {
    const messages = JSON.parse(
      source(`public/locales/${locale}/home.json`)
    );
    const landing = messages.landing;

    assert.equal(landing.hero.secondaryCta, expectedLabels[locale]);
    assert.deepEqual(Object.keys(landing.worlds.items), [
      'ai',
      'whv',
      'travel',
      'life',
    ]);
    assert.deepEqual(
      Object.values(landing.worlds.items).map(
        (item: { href: string }) => item.href
      ),
      expectedHrefs
    );
    assert.equal(typeof landing.worlds.aria, 'string');
  }
});

test('guide collections expose lead and index article variants', () => {
  const guides = source('components/home/GuidePostCards.tsx');
  const article = source('components/articles/EditorialArticleCardBody.tsx');
  assert.match(guides, /const \[lead, \.\.\.supporting\] = posts/);
  assert.match(guides, /variant='lead'/);
  assert.match(guides, /variant='index'/);
  assert.match(guides, /border-y border-line divide-y divide-line/);
  assert.doesNotMatch(guides, /xl:grid-cols-4/);
  assert.match(article, /"lead"/);
  assert.match(article, /"index"/);
});

test('lead and index Articles keep canonical routing and responsive images', () => {
  const wrapper = source('components/articles/EditorialArticleCard.tsx');
  const body = source('components/articles/EditorialArticleCardBody.tsx');
  assert.match(wrapper, /canonicalArticlePath\(article\)/);
  assert.match(body, /sizes=/);
  assert.match(body, /articleImageSource\(article\)/);
  assert.match(body, /prefetch=\{false\}/);
});

test('WHV process contains no emoji presentation', () => {
  const whv = source('components/home/WhvGuideSection.tsx');
  assert.doesNotMatch(whv, /✈️|🇦🇺|💼|💰/);
  for (const href of [
    '/tag/preparation',
    '/tag/landing',
    '/tag/jobs',
    '/tag/tax',
  ]) {
    assert.match(whv, new RegExp(href));
  }
  assert.match(whv, /\['Prep', 'Landing', 'Jobs', 'Exit'\]/);
  assert.match(whv, /\['Visa', 'Cards \/ TFN', 'Finding work', 'Tax \/ depart'\]/);
  assert.match(whv, /String\(i \+ 1\)\.padStart\(2, '0'\)/);
});

test('travel uses an inline editor note and keeps its empty collection guard', () => {
  const travel = source('components/home/TravelGuideSection.tsx');
  assert.match(travel, /if \(!posts\?\.length\) return null/);
  assert.match(travel, /intro \?\? defaultIntro/);
  assert.match(travel, /border-l border-primary pl-5/);
  assert.doesNotMatch(travel, /rounded-2xl border border-line bg-muted/);
});
