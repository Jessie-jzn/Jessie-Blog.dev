# 保守清理无用代码实施计划

> **供执行代理使用：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`，逐项执行本计划。所有步骤使用复选框（`- [ ]`）跟踪。

**目标：** 在不改变现有功能、页面、接口、样式与集成行为的前提下，删除已确认无消费者的源码、静态资源和直接依赖。

**方案：** 以 Next.js 约定入口为根建立本地模块可达图，再用全仓字符串引用、动态导入、配置引用和测试引用交叉验证。源码、测试契约、静态资源与依赖分阶段清理，每阶段都运行类型检查和对应测试；用途不明确的候选项保留。

**技术栈：** Next.js 14 Pages Router、React 18、TypeScript 5、Tailwind CSS 3、Node.js Test Runner、npm/yarn 锁文件。

## 全局约束

- 不改变页面布局、文案、样式、URL、API 契约、SEO 输出或第三方集成行为。
- 不删除或重新设计功能，不调整目录结构，不做架构重构。
- 不升级依赖，不修改环境、部署、CI、数据库或迁移配置。
- Next.js 页面、API 路由、配置、全局样式、公共元数据和声明入口默认视为活跃。
- 用途不明确的候选项必须保留。
- 依赖变更必须同步 `package.json`、`package-lock.json` 和仓库现有的 `yarn.lock`。
- 不创建分支，不提交、不推送、不合并，也不部署。

---

## 文件变更结构

### 删除的旧组件与内部模块

- `components/CustomLayout/`：未被当前 `_app` 或页面使用的旧版布局及其卡片。
- `components/home/Carousel.tsx`、`GallerySection.tsx`、`HeroSection.tsx`、`RouteSection.tsx`、`TestimonialSection.tsx`：已由当前首页模块取代的旧区块。
- `components/Gallery.tsx`、`ResumeBox.tsx`、`SEOOptimizer.tsx`、`SectionFAQ.tsx`、`TranslateComponent.tsx`、`TypedEffect.tsx`：无运行时消费者的独立组件。
- `components/RelatedPosts/RelatedPosts.tsx`、`components/articles/LegacyEditorialArticleCard.tsx`：没有活跃渲染入口的旧卡片链。
- `components/ui/button.tsx`、`components/ui/dropdown-menu.tsx`、`lib/utils.ts`：仅形成内部孤立依赖链的 UI 原语。
- `context/LanguageContext.tsx`、`hooks/useLocalizedPosts.ts`、`hooks/useQiniuUrls.ts`：无消费者的状态与数据 Hook。
- `lib/baidu/baiduTranslate.ts`、`lib/baidu/clientTranslate.ts`、`lib/translationCache.ts`：无消费者的旧翻译客户端链；保留活跃的 `pages/api/translate.ts`。
- `lib/notion/getDataBaseViews.ts`、`lib/notion/getMenuList.ts`、`lib/notion/index.ts`：无消费者的 Notion 辅助入口，其中后两项为空文件。
- `utils/imageHelper.ts`、`utils/qiniu.ts`：无消费者的旧工具；保留活跃的 Qiniu API 路由。

### 删除的声明、样式与静态资源

- `types/html2pdf.d.ts`：对应实现已不被使用。
- `styles/tailwind.css`：未被 `_app` 或其他样式入口导入。
- `public/next.svg`、`public/vercel.svg`：脚手架遗留且无引用。

### 修改的测试和配置

- `tests/ui/designSystem.test.ts`：移除对已删除孤立组件和 UI 原语的源码读取及断言，仅保留活跃界面的设计契约。
- `tests/ui/editorialComponents.test.ts`：删除仅服务于旧卡片适配器的断言；保留规范 Article 路由与当前卡片契约。
- `pages/_app.tsx`：删除已废弃的 CustomLayout 注释导入。
- `next.config.js`：删除已废弃的编辑器转译注释和被注释掉的旧 rewrites 示例；保留活跃配置。
- `tailwind.config.ts`：只删除无效的旧注释配置，不改变生成的 Tailwind 配置。
- `site.config.ts`：仅在再次确认 `useCustomLayout` 无运行时或外部消费者后删除该孤立字段；无法确认则保留。

### 修改的依赖清单

- `package.json`
- `package-lock.json`
- `yarn.lock`

---

### Task 1：复核基线和删除清单

**文件：**

- 读取：`pages/**/*`
- 读取：`components/**/*`
- 读取：`hooks/**/*`
- 读取：`context/**/*`
- 读取：`lib/**/*`
- 读取：`utils/**/*`
- 读取：`public/**/*`
- 读取：`package.json`

**接口：**

- 输入：以 Pages Router 页面、API 路由、配置和测试为根的模块引用关系。
- 输出：仅包含“确认未使用”候选项的最终删除清单。

- [ ] **步骤 1：确认工作区只有本任务新增的规格与计划文档**

运行：

```bash
git status --short
```

预期：仅出现本任务的两个 `docs/superpowers` 文档；如出现其他改动，停止并避开用户改动。

- [ ] **步骤 2：运行完整本地测试基线**

运行：

```bash
npm run test:performance-fixes
node --experimental-strip-types --test tests/ui/*.test.ts
npx tsc --noEmit
```

预期：全部通过；Node 可能报告现有的 `MODULE_TYPELESS_PACKAGE_JSON` 性能警告，但不得有测试或类型错误。

- [ ] **步骤 3：逐项确认候选文件没有活跃引用**

运行：

```bash
rg -n "CustomLayout|GallerySection|HeroSection|RouteSection|TestimonialSection|LegacyEditorialArticleCard|ResumeBox|SEOOptimizer|SectionFAQ|TranslateComponent|TypedEffect|useLocalizedPosts|useQiniuUrls|LanguageContext|getDataBaseViews|getMenuList|translationCache|utils/imageHelper|utils/qiniu" --glob '!node_modules/**' --glob '!.next/**'
```

预期：只出现候选模块内部引用、待同步删除的测试读取、旧注释和历史设计文档引用；任何活跃页面、配置或模块引用都会把对应候选项移出删除清单。

- [ ] **步骤 4：确认框架与配置入口不在删除清单中**

人工核对：`pages`、`pages/api`、`pages/_app.tsx`、`pages/_document.tsx`、根目录配置、`styles/globals.css`、`styles/notion.css`、Markdown 样式、`global.d.ts` 和 `public/locales` 均保留。

---

### Task 2：删除确认未使用的源码链

**文件：**

- 删除：本计划“删除的旧组件与内部模块”列出的文件和目录。
- 修改：`tests/ui/designSystem.test.ts`
- 修改：`tests/ui/editorialComponents.test.ts`

**接口：**

- 输入：任务 1 确认后的删除清单。
- 输出：不再包含孤立源码链，且 UI 测试只检查活跃实现的代码库。

- [ ] **步骤 1：先更新设计系统测试契约**

从 `tests/ui/designSystem.test.ts` 删除以下源码读取变量及所有只针对它们的断言：

```text
button
resumeBox
sectionFaq
relatedPosts
translateComponent
```

保留针对当前页面、布局、导航、页脚、Newsletter、Notion 和 Markdown 样式的断言。若一个测试同时检查活跃与待删除组件，只移除待删除组件对应的断言，不删除整个测试。

- [ ] **步骤 2：更新旧卡片适配器测试契约**

从 `tests/ui/editorialComponents.test.ts` 删除 `resolveLegacyArticleAdapterHref` 导入和三个 `legacy card adapters` 测试。保留 `EditorialArticleCard` 使用 `canonicalArticlePath` 的现有测试。

- [ ] **步骤 3：删除任务 1 最终确认的孤立源码**

使用补丁删除“删除的旧组件与内部模块”中确认无消费者的文件。不要删除以下活跃替代实现：

```text
components/layouts/*
components/home/HomeLandingSections.tsx
components/home/HomeHero.tsx
components/home/TravelGuideSection.tsx
components/home/WhvGuideSection.tsx
components/articles/EditorialArticleCard.tsx
components/articles/EditorialArticleCardBody.tsx
components/articles/editorialArticleHref.ts
pages/api/translate.ts
pages/api/qiniu-url.ts
pages/api/qiniu-urls.ts
```

- [ ] **步骤 4：验证源码清理**

运行：

```bash
node --experimental-strip-types --test tests/ui/*.test.ts
npm run test:performance-fixes
npx tsc --noEmit
```

预期：全部通过，且不存在指向已删除文件的模块解析错误或测试读取错误。

---

### Task 3：删除无引用资源并清理废弃注释

**文件：**

- 删除：`types/html2pdf.d.ts`
- 删除：`styles/tailwind.css`
- 删除：`public/next.svg`
- 删除：`public/vercel.svg`
- 修改：`pages/_app.tsx`
- 修改：`next.config.js`
- 修改：`tailwind.config.ts`
- 条件修改：`site.config.ts`

**接口：**

- 输入：任务 2 清理后的活跃源码。
- 输出：没有脚手架资源和误导性旧实现注释，运行配置语义不变。

- [ ] **步骤 1：再次检查资源引用**

运行：

```bash
rg -n "html2pdf|styles/tailwind.css|next.svg|vercel.svg" --glob '!node_modules/**' --glob '!.next/**' --glob '!package-lock.json' --glob '!yarn.lock'
```

预期：仅命中待删除声明、依赖清单或历史文档；若命中活跃源码或配置，保留对应资源。

- [ ] **步骤 2：删除确认无引用的声明、样式和脚手架图片**

使用补丁删除 `types/html2pdf.d.ts`、`styles/tailwind.css`、`public/next.svg` 和 `public/vercel.svg`。

- [ ] **步骤 3：删除废弃注释代码**

删除：

- `pages/_app.tsx` 中注释掉的 CustomLayout 与 SiteConfig 导入。
- `next.config.js` 中注释掉的 `transpilePackages` 和旧 rewrites 返回示例。
- `tailwind.config.ts` 中旧断点和旧背景图片配置的注释代码。

保留解释当前行为、约束和兼容性原因的注释。

- [ ] **步骤 4：谨慎处理 `useCustomLayout`**

运行：

```bash
rg -n "useCustomLayout" --glob '!node_modules/**' --glob '!.next/**'
```

如果唯一命中是 `site.config.ts` 的字段定义，则删除该字段；如果存在任何源码、配置、脚本或外部约定线索，则保留。

- [ ] **步骤 5：验证资源与注释清理**

运行：

```bash
npx tsc --noEmit
npm run test:performance-fixes
node --experimental-strip-types --test tests/ui/*.test.ts
```

预期：全部通过。

---

### Task 4：移除确认未使用的直接依赖

**文件：**

- 修改：`package.json`
- 修改：`package-lock.json`
- 修改：`yarn.lock`

**接口：**

- 输入：任务 2 和任务 3 清理后的实际导入集合。
- 输出：三份依赖清单一致，不包含已确认无用的直接依赖，不升级其他包。

- [ ] **步骤 1：复核待移除依赖没有活跃导入或配置引用**

逐项复核以下候选：

```text
@radix-ui/react-dropdown-menu
@radix-ui/react-slot
@react-google-maps/api
@tailwindcss/line-clamp
@tanstack/react-virtual
@types/axios
@types/crypto-js
@types/highlight.js
@types/react-syntax-highlighter
@uiw/react-md-editor
class-variance-authority
clsx
crypto-js
css-loader
gh-pages
github-markdown-css
gsap
highlight.js
html2canvas
html2pdf.js
lucide-react
style-loader
swr
tailwind-merge
```

运行：

```bash
rg -n "@radix-ui/react-dropdown-menu|@radix-ui/react-slot|@react-google-maps/api|@tailwindcss/line-clamp|@tanstack/react-virtual|@uiw/react-md-editor|class-variance-authority|crypto-js|css-loader|gh-pages|github-markdown-css|gsap|highlight\\.js|html2canvas|html2pdf\\.js|lucide-react|style-loader|from ['\\\"]swr['\\\"]|tailwind-merge" --glob '!node_modules/**' --glob '!.next/**' --glob '!package.json' --glob '!package-lock.json' --glob '!yarn.lock' --glob '!docs/**'
```

预期：没有活跃源码或配置命中。`axios`、`qiniu`、`react-dom`、`i18next`、`react-i18next`、`sharp`、`raw-loader`、`next-sitemap`、`notion-utils` 及其相关类型不在本次删除清单中。

- [ ] **步骤 2：通过 npm 移除确认未使用的直接依赖**

运行：

```bash
npm uninstall @radix-ui/react-dropdown-menu @radix-ui/react-slot @react-google-maps/api @tailwindcss/line-clamp @tanstack/react-virtual @types/axios @types/crypto-js @types/highlight.js @types/react-syntax-highlighter @uiw/react-md-editor class-variance-authority clsx crypto-js css-loader gh-pages github-markdown-css gsap highlight.js html2canvas html2pdf.js lucide-react style-loader swr tailwind-merge
```

预期：只删除列出的直接依赖并更新 `package.json` 与 `package-lock.json`，不升级剩余依赖。

- [ ] **步骤 3：同步 Yarn 锁文件**

运行：

```bash
yarn install --mode=update-lockfile
```

如果当前 Yarn 版本不支持 `--mode=update-lockfile`，运行：

```bash
yarn install --ignore-scripts
```

预期：`yarn.lock` 与 `package.json` 一致，不执行项目生命周期脚本。若命令会批量升级无关解析版本，则停止并保留 `yarn.lock`，在交付报告中记录双锁文件风险。

- [ ] **步骤 4：检查依赖差异只包含预期删除**

运行：

```bash
git diff -- package.json package-lock.json yarn.lock
npm ls --depth=0
```

预期：顶层包只减少候选清单中的依赖；不得出现无关版本升级、缺失依赖或无效依赖。

---

### Task 5：最终验证与交付审计

**文件：**

- 检查：全部修改和删除的文件。

**接口：**

- 输入：任务 2 至任务 4 的组合结果。
- 输出：通过验证、可供用户审阅的保守清理变更。

- [ ] **步骤 1：运行全部自动化检查**

运行：

```bash
npx tsc --noEmit
npm run test:performance-fixes
node --experimental-strip-types --test tests/ui/*.test.ts
npm run build
```

预期：类型检查和测试全部通过；生产构建成功。若构建只因 Notion、网络或缺失环境变量失败，记录准确错误，不扩大修改范围。

- [ ] **步骤 2：检查遗留引用与格式错误**

运行：

```bash
git diff --check
rg -n "CustomLayout|LegacyEditorialArticleCard|ResumeBox|SEOOptimizer|SectionFAQ|TranslateComponent|TypedEffect|useLocalizedPosts|useQiniuUrls|LanguageContext|getDataBaseViews|getMenuList|translationCache" --glob '!node_modules/**' --glob '!.next/**' --glob '!docs/**'
```

预期：`git diff --check` 无输出；引用扫描不命中活跃代码。

- [ ] **步骤 3：审阅最终差异**

运行：

```bash
git status --short
git diff --stat
git diff -- package.json pages components hooks context lib utils tests next.config.js tailwind.config.ts site.config.ts
```

预期：差异只包含本计划列出的保守清理，不包含用户文件或无关重构。

- [ ] **步骤 4：整理中文交付报告**

报告必须列出：

- 删除与修改的文件。
- 移除的直接依赖。
- 保持不变的功能和接口。
- 每条验证命令及结果。
- 因用途不明确而保留的候选项。
- 环境受限检查和剩余风险。

不执行 Git 提交、推送或部署。
