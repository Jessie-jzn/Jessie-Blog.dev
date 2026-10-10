import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';

import SiteConfig from '../../site.config.ts';
import { OPEN_SOURCE_PROJECTS, OPEN_SOURCE_STARS_AS_OF } from '../../lib/home/openSourceProjects.ts';

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
  assert.match(page, /revalidate: 300/);
  assert.match(page, /CommonSEO/);
  assert.match(page, /<HomeHero email=\{SiteConfig\.email\}/);
  assert.match(page, /technicalPosts = selectTechnicalPosts\(posts\)/);
  assert.match(page, /<TechnicalGuideSection posts=\{technicalPosts\} \/>/);
  assert.match(page, /<WhvGuideSection posts=\{whvPosts\}/);
  assert.match(page, /<TravelGuideSection[^>]*posts=\{travelPosts\}/);
  assert.match(page, /import HomeProjectsPreview/);
  assert.match(page, /<HomeProjectsPreview \/>/);
});

test('home omits the removed landing capabilities section', () => {
  const page = source('pages/index.tsx');
  assert.doesNotMatch(page, /HomeLandingSections/);
  assert.equal(existsSync('components/home/HomeLandingSections.tsx'), false);

  for (const locale of ['en', 'zh']) {
    const landing = JSON.parse(
      source(`public/locales/${locale}/home.json`),
    ).landing;
    assert.equal(landing.services, undefined);
    assert.equal(landing.aria.services, undefined);
  }
});

test('home places a six-article technical section before WHV', () => {
  const page = source('pages/index.tsx');
  const technicalSectionPosition = page.indexOf(
    '<TechnicalGuideSection posts={technicalPosts} />',
  );
  const whvSectionPosition = page.indexOf(
    '<WhvGuideSection posts={whvPosts} />',
  );

  assert.ok(technicalSectionPosition >= 0);
  assert.ok(technicalSectionPosition < whvSectionPosition);

  const section = source('components/home/TechnicalGuideSection.tsx');
  assert.match(section, /if \(!posts\?\.length\) return null/);
  assert.match(section, /href='\/technical'/);
  assert.match(section, /<GuidePostCards posts=\{posts\} \/>/);

  for (const locale of ['en', 'zh']) {
    const landing = JSON.parse(
      source(`public/locales/${locale}/home.json`),
    ).landing;
    assert.equal(typeof landing.technicalSection.title, 'string');
    assert.equal(typeof landing.technicalSection.subtitle, 'string');
    assert.equal(typeof landing.aria.technical, 'string');
  }
});

test('only the above-the-fold Hero image is eagerly prioritized', () => {
  const hero = source('components/home/HomeHero.tsx');
  const guideCards = source('components/home/GuidePostCards.tsx');

  assert.match(hero, /priority/);
  assert.doesNotMatch(guideCards, /priority/);
});

test('collaboration keeps the configured email and translated subject', () => {
  const cta = source('components/home/HomeConsultCta.tsx');
  assert.match(cta, /SiteConfig/);
  assert.match(cta, /mailto:\$\{email\}/);
  assert.match(cta, /landing\.cta\.mailSubject/);
  assert.match(cta, /landing\.cta\.primaryBtn/);
});

test('home uses compact responsive topic and repository cards', () => {
  const worlds = source('components/home/HomeContentWorlds.tsx');
  const projects = source('components/home/HomeProjectsPreview.tsx');
  const consultation = source('components/home/HomeConsultCta.tsx');
  assert.match(worlds, /sm:grid-cols-2 lg:grid-cols-4/);
  assert.match(projects, /md:grid-cols-2/);
  assert.match(projects, /OPEN_SOURCE_PROJECTS\.map/);
  assert.match(consultation, /bg-primarySoft/);
});

test('homepage separates designed project visuals from real article covers', () => {
  const card = source('components/home/HomePostCard.tsx');
  assert.match(card, /post\.pageCoverThumbnail \|\| post\.pageCover/);
  assert.match(card, /canonicalArticlePath\(post\)/);
  assert.match(card, /post\.title/);
  assert.doesNotMatch(card, /project-.*\.webp/);

  const projects = source('components/home/HomeProjectsPreview.tsx');
  assert.match(projects, /src=\{project\.image\}/);
  assert.equal(new Set(OPEN_SOURCE_PROJECTS.map((p) => p.image)).size, 4);
  for (const project of OPEN_SOURCE_PROJECTS) {
    assert.ok(existsSync(`public${project.image}`));
  }
});

test('project actions resolve to their shipped route', () => {
  const preview = source('components/home/HomeProjectsPreview.tsx');
  const routePath = 'pages/projects/index.tsx';

  assert.match(preview, /href=\{GITHUB_PROFILE_URL\}/);
  assert.match(preview, /\$\{GITHUB_PROFILE_URL\}\/\$\{project\.repository\}/);
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
  assert.match(preview, /useTranslation\('home'\)/);
  assert.match(route, /t\(["']projectsPage\.stackLabel["'],\s*\{\s*title\s*\}\)/);

  for (const field of ['title', 'summary', 'role']) {
    const key = `projectsPage\\.items\\.\\$\\{project\\.id\\}\\.${field}`;
    assert.match(route, new RegExp(key));
  }
});

test('end-section actions stay stable, focusable, and pressable', () => {
  for (const path of [
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

test('collaboration keeps its mint panel within a neutral section', () => {
  const cta = source('components/home/HomeConsultCta.tsx');
  assert.match(cta, /bg-primarySoft/);
  assert.match(cta, /GITHUB_PROFILE_URL/);
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

  assert.match(zh.hero.headline.join("\n"), /Jessie/);
  assert.match(zh.hero.paragraphs.join('\n'), /上海/);
  assert.match(zh.hero.paragraphs.join('\n'), /AI/);
  assert.match(zh.hero.paragraphs.join('\n'), /生活/);
  assert.match(zh.cta.p2, /澳洲打工度假/);
  assert.doesNotMatch(zh.hero.paragraphs.join('\n'), /持续探索|希望这些真实记录/);

  assert.match(en.hero.paragraphs.join('\n'), /working holiday/);
  assert.match(en.hero.paragraphs.join('\n'), /AI development/);
  assert.match(en.hero.paragraphs.join('\n'), /Australia/);
  assert.doesNotMatch(en.hero.paragraphs.join('\n'), /personal publication|ongoing exploration/);
});

test('open-source selection includes ChainLens instead of the personal blog', () => {
  assert.deepEqual(OPEN_SOURCE_PROJECTS.map((project) => project.repository), [
    'Software-Designer-Exam-Guide', 'tickets-monitor', 'chainlens', 'whv_ai_map_marker',
  ]);
  assert.match(OPEN_SOURCE_STARS_AS_OF, /^\d{4}-\d{2}-\d{2}$/);
  for (const project of OPEN_SOURCE_PROJECTS) {
    assert.ok(Number.isInteger(project.stars) && project.stars >= 0);
    for (const locale of ['en', 'zh']) {
      const landing = JSON.parse(source(`public/locales/${locale}/home.json`)).landing;
      const copy = landing.openSource.items[project.id];
      assert.ok(copy.title.length && copy.description.length);
    }
  }
});

test('hero uses a light two-column composition and a GitHub action', () => {
  const hero = source('components/home/HomeHero.tsx');
  assert.match(
    hero,
    /md:grid-cols-2/
  );
  assert.match(hero, /GITHUB_PROFILE_URL/);
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
    'https://www.jessieonroad.com/images/avatar.png',
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
    /<Image\s+src=['"]\/images\/home\/editorial-desk\.webp['"][\s\S]*?\/>/,
  )?.[0];

  assert.ok(heroImage, 'Expected the local Hero background Image');
  assert.match(heroImage, /\sfill(?:\s|$)/);
  assert.match(heroImage, /\spriority(?:\s|$)/);
  assert.match(heroImage, /sizes=['"][^'"]*50vw[^'"]*['"]/);

  const heroPath = 'public/images/home/editorial-desk.webp';
  assert.ok(existsSync(heroPath));
  assert.ok(
    statSync(heroPath).size <= 500 * 1024,
    'Hero source must stay at or below 500 KiB while images.unoptimized is enabled',
  );
});

test('hero exposes real reading and email actions while topics retain their index', () => {
  const hero = source('components/home/HomeHero.tsx');
  const worlds = source('components/home/HomeContentWorlds.tsx');

  assert.match(worlds, /export const HOME_WORLD_KEYS/);
  assert.doesNotMatch(hero, /const worldKeys/);
  assert.match(hero, /key=\{`headline-\$\{i\}`\}/);
  assert.match(hero, /key=\{`paragraph-\$\{idx\}`\}/);
  assert.match(hero, /href='\/post'/);
});

test('home locales provide the bilingual Article CTA and world directory', () => {
  const expectedLabels = {
    en: 'Read the blog',
    zh: '看看文章',
  } as const;
  const expectedHrefs = ['/technical', '/whv', '/travel', '/projects'];

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
      'projects',
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

test('guide collections offer grid, feature and photo layouts', () => {
  const guides = source('components/home/GuidePostCards.tsx');
  const article = source('components/articles/EditorialArticleCardBody.tsx');
  assert.match(guides, /const \[lead, \.\.\.supporting\] = posts/);
  assert.match(guides, /variant='feature'/);
  assert.match(guides, /variant='photo'/);
  assert.match(guides, /lg:grid-cols-3/);
  assert.doesNotMatch(guides, /xl:grid-cols-4/);
  assert.match(article, /"lead"/);
  assert.match(article, /"index"/);
});

test('guide collection guards empty and single-article collections', () => {
  const guides = source('components/home/GuidePostCards.tsx');
  assert.match(guides, /if \(!posts\?\.length\) return null/);
  assert.match(guides, /supporting\.length \?/);
  assert.match(guides, /: null/);
});

test('guide collection does not stretch a single supporting Article', () => {
  const guides = source('components/home/GuidePostCards.tsx');
  assert.match(guides, /grid items-start gap-4/);
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
  assert.match(whv, /href='\/whv'/);
  assert.doesNotMatch(whv, /\/tag\//);
  assert.doesNotMatch(whv, /href=\{step\.link\}/);
  assert.match(whv, /\['Prep', 'Landing', 'Jobs', 'Exit'\]/);
  assert.match(whv, /\['Visa', 'Cards \/ TFN', 'Finding work', 'Tax \/ depart'\]/);
  assert.match(whv, /String\(i \+ 1\)\.padStart\(2, '0'\)/);
});

test('travel keeps its empty collection guard without an editorial intro', () => {
  const travel = source('components/home/TravelGuideSection.tsx');
  assert.match(travel, /if \(!posts\?\.length\) return null/);
  assert.match(travel, /<GuidePostCards posts=\{posts\} layout='photos' \/>/);
  assert.doesNotMatch(travel, /defaultIntro|introLine1|introLine2Before/);
  assert.doesNotMatch(travel, /rounded-2xl border border-line bg-muted/);
});
