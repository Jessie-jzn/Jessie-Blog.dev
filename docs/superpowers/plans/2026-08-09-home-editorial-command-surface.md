# 首页 Editorial Command Surface 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改变首页数据、路由和业务行为的前提下，将首页改造成受 Linear 与 Raycast 启发、以连续内容层级取代 Card 堆叠的个人出版物首页。

**Architecture:** `pages/index.tsx` 继续负责数据注入与章节编排，`components/home/*` 只负责展示。建立一套首页连续表面、编号目录和重点文章布局；文章链接仍通过现有 `EditorialArticleCard` 与 Canonical Article URL 逻辑生成，不新增客户端请求或全局状态。

**Tech Stack:** Next.js 14 Pages Router、React 18、TypeScript、Tailwind CSS 3、Framer Motion、Node.js 内置 test runner。

## 全局约束

- 保留 `getStaticProps`、Notion 查询、文章筛选、ISR、SEO、i18n、路由、邮件主题和链接目标。
- 不新增 npm 依赖，不引入新的设计系统或远程字体。
- 仅使用现有薄荷绿色作为强调色；主要结构依赖留白、细线、编号和连续表面。
- 内容区域禁止重复大圆角 Card 堆叠；pill 仅用于小标签与交互控件。
- 保留亮色与暗色主题，交互文字达到 WCAG AA，对键盘焦点和 reduced motion 提供支持。
- 不覆盖工作区中与本次首页重设计无关的修改；每次提交只暂存任务列出的文件。
- 图片继续使用 `next/image` 或现有 `ArticleImage`；只有首屏资源使用 priority。

---

## 文件结构

- `pages/index.tsx`：保留数据与 SEO，调整首页章节结构和页面级背景节奏。
- `components/home/HomeHero.tsx`：非对称图片 Hero、身份内容和主题索引。
- `components/home/HomePageSection.tsx`：连续章节的语义包装、色调和边界规则。
- `components/home/HomePersonaStory.tsx`：编辑式个人宣言。
- `components/home/HomeContentWorlds.tsx`：编号内容目录。
- `components/home/GuidePostCards.tsx`：一篇重点 Article 加紧凑辅助 Article 的组合布局。
- `components/home/WhvGuideSection.tsx`：无 Emoji 的 WHV 流程轨道。
- `components/home/TravelGuideSection.tsx`：行内旅行编者注与文章组合。
- `components/home/HomeLandingSections.tsx`：技术与生活能力清单。
- `components/home/HomeProjectsPreview.tsx`：连续项目登记表。
- `components/home/HomeConsultCta.tsx`：最终高强调合作入口。
- `components/common/SectionHeader.tsx`：统一编号式章节标题和查看全部链接。
- `components/articles/EditorialArticleCardBody.tsx`：为首页文章组合提供无 Card 的 `lead` 与 `index` 变体，同时保留既有变体。
- `styles/globals.css`：首页容器、连续表面、焦点态和 motion-reduce 基础规则。
- `tests/ui/homeEditorialRedesign.test.ts`：首页结构、业务保留与 anti-card 约束测试。

---

### Task 1：建立首页重设计契约测试

**Files:**
- Create: `tests/ui/homeEditorialRedesign.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: 首页现有组件路径和 locale key。
- Produces: `npm run test:ui`，覆盖首页业务保留与新视觉结构的源码契约。

- [ ] **Step 1：编写会失败的首页契约测试**

```ts
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

test('guide collections expose lead and index article variants', () => {
  const guides = source('components/home/GuidePostCards.tsx');
  const article = source('components/articles/EditorialArticleCardBody.tsx');
  assert.match(guides, /variant='lead'/);
  assert.match(guides, /variant='index'/);
  assert.match(article, /"lead"/);
  assert.match(article, /"index"/);
});

test('WHV process contains no emoji presentation', () => {
  const whv = source('components/home/WhvGuideSection.tsx');
  assert.doesNotMatch(whv, /✈️|🇦🇺|💼|💰/);
});
```

- [ ] **Step 2：加入统一 UI 测试脚本**

在 `package.json` 的 `scripts` 中加入：

```json
"test:ui": "node --experimental-strip-types --test tests/ui/*.test.ts"
```

- [ ] **Step 3：运行测试并确认新契约失败**

Run: `npm run test:ui`

Expected: 新测试在 `divide-y`、`lead`、`index` 或 Emoji 断言处 FAIL；既有 UI 测试继续执行。

- [ ] **Step 4：提交测试契约**

```bash
git add package.json tests/ui/homeEditorialRedesign.test.ts
git commit -m "test: define home editorial redesign contracts"
```

---

### Task 2：实现页面骨架、Hero 和内容目录

**Files:**
- Modify: `pages/index.tsx`
- Modify: `components/home/HomeHero.tsx`
- Modify: `components/home/HomePageSection.tsx`
- Modify: `components/home/HomePersonaStory.tsx`
- Modify: `components/home/HomeContentWorlds.tsx`
- Modify: `styles/globals.css`

**Interfaces:**
- Consumes: `HomeHeroProps { email: string }`、`landing.hero.*`、`landing.worlds.*`、`landing.persona.*`。
- Produces: 原签名不变的首页头部组件；`HomePageSection` 继续支持 `id`、`tone`、`className` 和 `aria-label`。

- [ ] **Step 1：添加页面结构契约测试**

在 `tests/ui/homeEditorialRedesign.test.ts` 增加：

```ts
test('hero is asymmetric and exposes a content index', () => {
  const hero = source('components/home/HomeHero.tsx');
  assert.match(hero, /lg:grid-cols-\[minmax\(0,1\.4fr\)_minmax\(16rem,0\.6fr\)\]/);
  assert.match(hero, /landing\.worlds\.items/);
  assert.match(hero, /motion-reduce:transition-none/);
});
```

- [ ] **Step 2：运行新增测试并确认失败**

Run: `npm run test:ui`

Expected: FAIL，提示缺少非对称 grid、主题索引或 reduced-motion 类。

- [ ] **Step 3：实现连续页面骨架与非对称 Hero**

实现要点：

```tsx
<section className='relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden border-b border-white/15'>
  <Image /* 保留现有 src、priority、sizes */ />
  <div className='absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-neutral-950/25' />
  <div className='site-container relative z-10 grid min-h-[calc(100dvh-4rem)] items-end gap-10 pb-12 pt-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)]'>
    {/* 原有标题、段落与两个 CTA */}
    <nav aria-label={t('landing.worlds.aria')} className='border-y border-white/20 divide-y divide-white/15'>
      {/* 从 worlds keys 输出编号主题链接 */}
    </nav>
  </div>
</section>
```

`HomePageSection` 使用 `border-b border-line` 和 tone 背景，不生成圆角容器；`HomePersonaStory` 使用窄编号栏与正文栏；`HomeContentWorlds` 改为 `divide-y divide-line border-y border-line` 的连续目录行。

- [ ] **Step 4：运行 UI 测试与格式检查**

Run: `npm run test:ui`

Expected: Hero 与内容目录契约 PASS；Guide、WHV 相关契约仍允许失败，等待后续任务。

- [ ] **Step 5：提交页面骨架**

```bash
git add pages/index.tsx components/home/HomeHero.tsx components/home/HomePageSection.tsx components/home/HomePersonaStory.tsx components/home/HomeContentWorlds.tsx styles/globals.css tests/ui/homeEditorialRedesign.test.ts
git commit -m "style: establish editorial home hierarchy"
```

---

### Task 3：实现重点 Article 与 WHV、旅行内容层级

**Files:**
- Modify: `components/articles/EditorialArticleCard.tsx`
- Modify: `components/articles/EditorialArticleCardBody.tsx`
- Modify: `components/home/GuidePostCards.tsx`
- Modify: `components/home/WhvGuideSection.tsx`
- Modify: `components/home/TravelGuideSection.tsx`
- Modify: `components/common/SectionHeader.tsx`
- Modify: `tests/ui/homeEditorialRedesign.test.ts`

**Interfaces:**
- Consumes: `Post` 与 `canonicalArticlePath(article)`。
- Produces: `EditorialArticleCardVariant = "row" | "feature" | "compact" | "lead" | "index"`；`GuidePostCards({ posts })` 的公开签名保持不变。

- [ ] **Step 1：补充文章链接和图片语义测试**

```ts
test('lead and index Articles keep canonical routing and responsive images', () => {
  const wrapper = source('components/articles/EditorialArticleCard.tsx');
  const body = source('components/articles/EditorialArticleCardBody.tsx');
  assert.match(wrapper, /canonicalArticlePath\(article\)/);
  assert.match(body, /sizes=/);
  assert.match(body, /articleImageSource\(article\)/);
  assert.match(body, /prefetch=\{false\}/);
});
```

- [ ] **Step 2：运行测试并确认失败**

Run: `npm run test:ui`

Expected: FAIL，提示缺少 `lead` 或 `index` 变体。

- [ ] **Step 3：实现 Article 新变体和组合布局**

`LeadArticle` 使用宽图、较大标题和摘要；`IndexArticle` 使用编号、元数据、标题与可选缩略图，不使用 `.editorial-card`。`GuidePostCards` 使用首项作为 lead，其余条目输出 index：

```tsx
const [lead, ...supporting] = posts;

return (
  <div className='grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]'>
    <EditorialArticleCard article={toArticle(lead)} variant='lead' priority />
    <div className='border-y border-line divide-y divide-line'>
      {supporting.map((post) => (
        <EditorialArticleCard key={post.id} article={toArticle(post)} variant='index' />
      ))}
    </div>
  </div>
);
```

- [ ] **Step 4：将 WHV 阶段改为文字流程轨道**

把 `whvSteps` 改为只包含 `title`、`link`、`desc`，用 `01–04` 序号、顶部分隔线和 focus/hover 状态代替 Emoji 与圆角 Card。保留中英文标题、描述和四个现有链接。

- [ ] **Step 5：将旅行介绍改为行内编者注**

使用 `border-l border-primary pl-5` 的正文注释，移除 `rounded-2xl bg-muted` 外观；保留 `intro` override 与空文章时 `return null`。

- [ ] **Step 6：运行 UI 测试**

Run: `npm run test:ui`

Expected: 所有 `homeEditorialRedesign` 测试 PASS。

- [ ] **Step 7：提交 Article 与指南布局**

```bash
git add components/articles/EditorialArticleCard.tsx components/articles/EditorialArticleCardBody.tsx components/home/GuidePostCards.tsx components/home/WhvGuideSection.tsx components/home/TravelGuideSection.tsx components/common/SectionHeader.tsx tests/ui/homeEditorialRedesign.test.ts
git commit -m "style: prioritize lead Articles on home"
```

---

### Task 4：实现能力、项目和合作区域

**Files:**
- Modify: `components/home/HomeLandingSections.tsx`
- Modify: `components/home/HomeProjectsPreview.tsx`
- Modify: `components/home/HomeConsultCta.tsx`
- Modify: `tests/ui/homeEditorialRedesign.test.ts`

**Interfaces:**
- Consumes: `landing.services.*`、`landing.projects.*`、`landing.cta.*`、`PROJECTS`、`SiteConfig.email`。
- Produces: 原组件签名与业务链接不变的连续 ledger/list 展示。

- [ ] **Step 1：补充合作业务保留测试**

```ts
test('collaboration keeps the configured email and translated subject', () => {
  const cta = source('components/home/HomeConsultCta.tsx');
  assert.match(cta, /SiteConfig/);
  assert.match(cta, /mailto:\$\{email\}/);
  assert.match(cta, /landing\.cta\.mailSubject/);
  assert.match(cta, /landing\.cta\.primaryBtn/);
});
```

- [ ] **Step 2：运行测试并确认当前结果**

Run: `npm run test:ui`

Expected: 邮件业务测试 PASS；连续列表测试在实现前保持 FAIL。

- [ ] **Step 3：实现三个连续内容区域**

`HomeLandingSections` 使用两列能力 ledger；`HomeProjectsPreview` 使用编号项目行；`HomeConsultCta` 使用深色或高对比 accent tone，并用 `divide-y` 输出三条合作路径。保留以下业务代码：

```tsx
href={`mailto:${email}?subject=${encodeURIComponent(
  t('landing.cta.mailSubject'),
)}`}
```

所有链接和按钮添加 `whitespace-nowrap`、`min-h-11`、可见 focus 和 `active:translate-y-px`。

- [ ] **Step 4：运行 UI 测试**

Run: `npm run test:ui`

Expected: PASS，且不再出现项目三 Card 网格、合作路径 Card 或内容世界四 Card 网格。

- [ ] **Step 5：提交末端章节**

```bash
git add components/home/HomeLandingSections.tsx components/home/HomeProjectsPreview.tsx components/home/HomeConsultCta.tsx tests/ui/homeEditorialRedesign.test.ts
git commit -m "style: reshape home projects and collaboration"
```

---

### Task 5：图片健康检查、响应式 QA 与最终验证

**Files:**
- Modify if required: `components/home/HomeHero.tsx`
- Modify if required: `next.config.js`
- Modify if required: `public/images/home/*`
- Modify if required: `tests/ui/homeEditorialRedesign.test.ts`

**Interfaces:**
- Consumes: Hero 图片 URL、Notion Article 图片、Next.js remote patterns。
- Produces: 首页无裂图，移动端、桌面、亮色和暗色视觉均通过验证。

- [ ] **Step 1：检查 Hero 图片可访问性**

Run: `curl -I --max-time 15 https://img.jessieontheroad.com/image4.jpg`

Expected: HTTP `200`，且 `content-type` 为 `image/*`。若失败，先检查仓库 `public/` 中可用摄影素材；没有合适本地素材时，搜索一张与 Jessie 旅行叙事匹配且许可清晰的图片，优先下载到 `public/images/home/hero.*`，再将 `HomeHero` 切换为本地静态路径，避免依赖不稳定的热链。

- [ ] **Step 2：检查 Article 图片降级行为**

Run: `npm test -- --runInBand`（若仓库没有默认 `test` 脚本，则运行 `npm run test:performance-fixes` 与 `npm run test:ui`）

Expected: 现有 `ArticleImage` 图片源与 fallback 测试 PASS；不得在 Article Card 内绕开 `ArticleImage`。

- [ ] **Step 3：运行静态验证**

Run: `npx tsc --noEmit`

Expected: exit code 0。

Run: `npm run lint`

Expected: exit code 0；若 Next 14 的 lint 命令不可用，记录工具限制并使用 `npx eslint` 对本任务文件执行等价检查。

Run: `npm run test:ui && npm run test:performance-fixes`

Expected: 所有测试 PASS。

- [ ] **Step 4：运行生产构建**

Run: `npm run build`

Expected: 编译与类型检查 PASS。若仅在 Notion 数据采集阶段因网络或凭据失败，单独记录该环境问题，不将其误报为 UI 编译失败。

- [ ] **Step 5：浏览器视觉检查**

启动 `npm run dev`，检查 `/` 的 390px、768px、1440px：

- Hero 首屏完整、CTA 不换行，照片与文字无冲突。
- 页面无横向滚动条，无连续等宽 Card 墙。
- WHV 流程可点击且无 Emoji。
- Lead Article 与辅助 Article 层级清楚，图片无裂图。
- 亮色与暗色主题只使用同一薄荷强调色。
- Tab 顺序合理，focus ring 可见，系统 reduced-motion 下无非必要位移动画。

- [ ] **Step 6：提交必要的 QA 修正**

```bash
git add components/home/HomeHero.tsx next.config.js public/images/home tests/ui/homeEditorialRedesign.test.ts
git commit -m "fix: harden home responsive media"
```

仅暂存实际发生修改的文件；若图片与 QA 均无需修正，则跳过本次提交。

