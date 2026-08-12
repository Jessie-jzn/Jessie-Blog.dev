import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';

import SiteConfig from '../../site.config.ts';

const source = (path: string) => readFileSync(path, 'utf8');

const sourceWithoutObviousComments = (path: string) =>
  source(path)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

const sourcePathsUnder = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;

    if (entry.isDirectory()) return sourcePathsUnder(path);
    return /\.(?:js|jsx|ts|tsx)$/.test(entry.name) ? [path] : [];
  });

const componentBlock = (body: string, start: string, end: string) => {
  const match = body.match(new RegExp(`const ${start} =[\\s\\S]*?const ${end} =`));
  assert.ok(match, `Expected ${start} component block`);
  return match[0];
};

test('home keeps its data and business contracts', () => {
  const page = source('pages/index.tsx');
  assert.match(page, /getStaticProps/);
  assert.match(page, /revalidate: 10/);
  assert.match(page, /CommonSEO/);
  assert.match(page, /<HomeHero email=\{SiteConfig\.email\}/);
  assert.match(page, /<WhvGuideSection posts=\{whvPosts\}/);
  assert.match(page, /<TravelGuideSection[^>]*posts=\{travelPosts\}/);
  assert.match(page, /import HomeProjectsPreview/);
  assert.match(page, /<HomeProjectsPreview \/>/);
});

test('collaboration keeps the configured email and translated subject', () => {
  const cta = source('components/home/HomeConsultCta.tsx');
  assert.match(cta, /SiteConfig/);
  assert.match(cta, /mailto:\$\{email\}/);
  assert.match(cta, /landing\.cta\.mailSubject/);
  assert.match(cta, /landing\.cta\.primaryBtn/);
});

test('home uses indexed continuous surfaces instead of card grids', () => {
  const worlds = source('components/home/HomeContentWorlds.tsx');
  const projects = source('components/home/HomeProjectsPreview.tsx');
  const consultation = source('components/home/HomeConsultCta.tsx');
  assert.match(worlds, /divide-y/);
  assert.match(projects, /divide-y/);
  assert.match(consultation, /divide-y/);
  assert.match(projects, /PROJECTS\.map\(\(project, index\)/);
  assert.match(projects, /String\(index \+ 1\)\.padStart\(2, '0'\)/);
  assert.doesNotMatch(worlds, /grid[^"']*lg:grid-cols-4/);
  assert.doesNotMatch(projects, /md:grid-cols-3/);
  assert.doesNotMatch(consultation, /sm:grid-cols-3/);
});

test('project and About actions resolve to their shipped routes', () => {
  const services = source('components/home/HomeLandingSections.tsx');
  const preview = source('components/home/HomeProjectsPreview.tsx');
  const routePath = 'pages/projects/index.tsx';

  assert.match(services, /href='\/about'/);
  assert.match(preview, /href='\/projects'/);
  assert.ok(existsSync(routePath), 'Expected the /projects page to ship');

  const route = source(routePath);
  assert.match(route, /import \{ PROJECTS \} from ["']@\/lib\/projects["']/);
  assert.match(route, /PROJECTS\.map/);
  assert.match(route, /serverSideTranslations\([\s\S]*?["']common["']/);
});

test('project route locales provide every consumed bilingual key', () => {
  const expectedKeys = [
    'eyebrow',
    'title',
    'description',
    'experienceLabel',
    'experienceTitle',
    'experienceDescription',
    'viewProject',
    'viewRepository',
    'resume',
    'stackLabel',
    'status',
    'items',
  ];

  const projectIds = [
    'jessie-blog',
    'frontend-experience',
    'ai-exploration',
  ];

  const localeMessages = new Map<string, any>();

  for (const locale of ['en', 'zh']) {
    const messages = JSON.parse(source(`public/locales/${locale}/common.json`));
    localeMessages.set(locale, messages);
    assert.deepEqual(Object.keys(messages.projectsPage), expectedKeys);
    assert.deepEqual(Object.keys(messages.projectsPage.status), [
      'ongoing',
      'experience',
      'exploring',
    ]);
    assert.deepEqual(Object.keys(messages.projectsPage.items), projectIds);

    for (const id of projectIds) {
      assert.deepEqual(Object.keys(messages.projectsPage.items[id]), [
        'title',
        'summary',
        'role',
      ]);
      for (const value of Object.values(messages.projectsPage.items[id])) {
        assert.equal(typeof value, 'string');
        assert.notEqual(value, '');
      }
    }
  }

  const englishItems = localeMessages.get('en').projectsPage.items;
  const chineseItems = localeMessages.get('zh').projectsPage.items;
  assert.notEqual(
    localeMessages.get('zh').projectsPage.stackLabel,
    localeMessages.get('en').projectsPage.stackLabel,
  );
  for (const id of projectIds) {
    assert.notEqual(chineseItems[id].summary, englishItems[id].summary);
    assert.notEqual(chineseItems[id].role, englishItems[id].role);
  }
});

test('project records keep locale-neutral metadata and render common translations', () => {
  const records = source('lib/projects.ts');
  const preview = source('components/home/HomeProjectsPreview.tsx');
  const route = source('pages/projects/index.tsx');

  assert.doesNotMatch(records, /\b(?:title|summary|role):\s*string/);
  assert.doesNotMatch(records, /\b(?:title|summary|role):\s*["']/);
  assert.match(preview, /useTranslation\(\[['"]home['"],\s*['"]common['"]\]\)/);
  assert.match(route, /t\(["']projectsPage\.stackLabel["'],\s*\{\s*title\s*\}\)/);

  for (const field of ['title', 'summary', 'role']) {
    const key = `projectsPage\\.items\\.\\$\\{project\\.id\\}\\.${field}`;
    assert.match(preview, new RegExp(key));
    assert.match(route, new RegExp(key));
  }
});

test('capabilities use a continuous two-column ledger', () => {
  const services = source('components/home/HomeLandingSections.tsx');
  assert.match(services, /divide-y/);
  assert.match(services, /sm:grid-cols-\[/);
  assert.doesNotMatch(services, /space-y-8/);
});

test('end-section actions stay stable, focusable, and pressable', () => {
  for (const path of [
    'components/home/HomeLandingSections.tsx',
    'components/home/HomeProjectsPreview.tsx',
    'components/home/HomeConsultCta.tsx',
  ]) {
    const component = source(path);
    assert.match(component, /editorial-focus/);
    assert.match(component, /focus-visible:outline-ink/);
    assert.match(component, /min-h-11/);
    assert.match(component, /whitespace-nowrap/);
    assert.match(component, /active:translate-y-px/);
  }
});

test('collaboration is the only accent home section', () => {
  const homeSource = readdirSync('components/home')
    .filter((name) => name.endsWith('.tsx'))
    .map((name) => source(`components/home/${name}`))
    .join('\n');
  assert.equal(homeSource.match(/tone='accent'/g)?.length, 1);
  assert.match(source('components/home/HomeConsultCta.tsx'), /tone='accent'/);
});

test('Hero and closing email actions use the same label in every locale', () => {
  for (const locale of ['en', 'zh']) {
    const messages = JSON.parse(source(`public/locales/${locale}/home.json`));
    assert.equal(
      messages.landing.hero.primaryCta,
      messages.landing.cta.primaryBtn,
    );
  }
});

test('home copy starts from Jessie lived experience instead of brand language', () => {
  const zh = JSON.parse(source('public/locales/zh/home.json')).landing;
  const en = JSON.parse(source('public/locales/en/home.json')).landing;

  assert.match(zh.hero.headline.join('\n'), /澳洲打工度假/);
  assert.match([...zh.hero.headline, ...zh.hero.paragraphs].join('\n'), /辞职/);
  assert.match(zh.hero.paragraphs.join('\n'), /重新坐回电脑前/);
  assert.match(zh.cta.p2, /少让你绕一点路/);
  assert.doesNotMatch(zh.hero.paragraphs.join('\n'), /持续探索|希望这些真实记录/);

  assert.match(en.hero.headline.join('\n'), /working holiday/);
  assert.match([...en.hero.headline, ...en.hero.paragraphs].join('\n'), /quit my frontend job/);
  assert.match(en.hero.paragraphs.join('\n'), /back at my computer/);
  assert.doesNotMatch(en.hero.paragraphs.join('\n'), /personal publication|ongoing exploration/);
});

test('project preview omits its ruled surface when no projects exist', () => {
  const projects = source('components/home/HomeProjectsPreview.tsx');
  assert.match(
    projects,
    /PROJECTS\.length > 0 \? \(\s*<div className='mt-8 divide-y/,
  );
  assert.match(projects, /\) : null/);
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

test('website avatar displays and BlogSEO use the local avatar asset', () => {
  const runtimeDirectories = ['components', 'pages', 'lib', 'config']
    .filter(existsSync);
  const rootConfigs = readdirSync('.', { withFileTypes: true })
    .filter((entry) =>
      entry.isFile() && /(?:^|[.-])config\.(?:js|jsx|ts|tsx)$/.test(entry.name)
    )
    .map((entry) => entry.name);
  const runtimeSources = [
    ...new Set([
      ...rootConfigs,
      ...runtimeDirectories.flatMap(sourcePathsUnder),
    ]),
  ];
  const remoteAvatarReferences = runtimeSources.flatMap((path) =>
    [...sourceWithoutObviousComments(path).matchAll(
      /(?:(?:https?:)?\/\/[^\s'"`]*|\$\{[^}]+\})\/avatar\.(?:png|jpe?g|webp|avif)/gi,
    )]
      .map((match) => `${path}: ${match[0]}`),
  );

  assert.deepEqual(remoteAvatarReferences, []);
  assert.ok(existsSync('public/images/avatar.png'));
  assert.equal(SiteConfig.siteLogo, '/images/avatar.png');
  assert.equal(
    `${SiteConfig.siteUrl}${SiteConfig.siteLogo}`,
    'https://www.jessieontheroad.com/images/avatar.png',
  );
  assert.match(
    source('components/SEO.tsx'),
    /url: `\$\{SiteConfig\.siteUrl\}\$\{SiteConfig\.siteLogo\}`/,
  );

  for (const path of [
    'components/Navbar.tsx',
    'components/Sidebar.tsx',
    'pages/about/index.tsx',
    'pages/whv/index.tsx',
  ]) {
    assert.match(source(path), /src=['"]\/images\/avatar\.png['"]/);
  }
});

test('Hero preloads a bounded repository-owned background photograph', () => {
  const hero = source('components/home/HomeHero.tsx');
  const heroImage = hero.match(
    /<Image\s+src=['"]\/images\/home\/hero\.jpg['"][\s\S]*?\/>/,
  )?.[0];

  assert.ok(heroImage, 'Expected the local Hero background Image');
  assert.match(heroImage, /\sfill(?:\s|$)/);
  assert.match(heroImage, /\spriority(?:\s|$)/);
  assert.match(heroImage, /sizes=['"]100vw['"]/);

  const heroPath = 'public/images/home/hero.jpg';
  assert.ok(existsSync(heroPath));
  assert.ok(
    statSync(heroPath).size <= 500 * 1024,
    'Hero source must stay at or below 500 KiB while images.unoptimized is enabled',
  );
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
      (Object.values(landing.worlds.items) as Array<{ href: string }>).map(
        (item) => item.href
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

test('guide collection omits its index when the lead has no supporting Articles', () => {
  const guides = source('components/home/GuidePostCards.tsx');
  assert.match(guides, /const hasSupporting = supporting\.length > 0/);
  assert.match(guides, /hasSupporting \? \(/);
  assert.match(guides, /\) : null/);
});

test('guide collection does not stretch a single supporting Article', () => {
  const guides = source('components/home/GuidePostCards.tsx');
  assert.match(guides, /grid items-start gap-8/);
});

test('guide Article conversion preserves a full cover independently of its thumbnail', () => {
  const guides = source('components/home/GuidePostCards.tsx');
  assert.match(guides, /\| 'pageCover'/);
  assert.match(
    guides,
    /pageCover: post\.pageCover \|\| post\.pageCoverThumbnail \|\| ''/
  );
  assert.match(
    guides,
    /pageCoverThumbnail: post\.pageCoverThumbnail \|\| ''/
  );
});

test('lead and index Articles keep canonical routing and responsive images', () => {
  const wrapper = source('components/articles/EditorialArticleCard.tsx');
  const body = source('components/articles/EditorialArticleCardBody.tsx');
  const lead = componentBlock(body, 'LeadArticle', 'IndexArticle');
  const index = componentBlock(body, 'IndexArticle', 'EditorialArticleCardBody');

  assert.match(wrapper, /canonicalArticlePath\(article\)/);
  for (const variant of [lead, index]) {
    assert.match(variant, /<ArticleImage/);
    assert.match(variant, /sizes=/);
    assert.match(variant, /articleImageSource\(article\)/);
    assert.match(variant, /prefetch=\{false\}/);
    assert.match(variant, /<h3/);
    assert.doesNotMatch(variant, /<h2/);
  }
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
