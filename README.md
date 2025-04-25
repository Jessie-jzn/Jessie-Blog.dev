# Jessie's Blog

<p align="center"><i>A personal blog featuring technical articles, travel guides, and life reflections.
<br>
一个融合技术文章、旅行攻略和生活感悟的个人博客。</i></p>

<div align="center">
    <a href="https://github.com/Jessie-jzn/Next-Notion-Blog/stargazers"><img src="https://img.shields.io/github/stars/Jessie-jzn/Next-Notion-Blog" alt="Stars Badge"/></a>
    <a href="https://github.com/Jessie-jzn/Next-Notion-Blog/network/members"><img src="https://img.shields.io/github/forks/Jessie-jzn/Next-Notion-Blog" alt="Forks Badge"/></a>
    <a href="https://github.com/Jessie-jzn/Next-Notion-Blog/pulls"><img src="https://img.shields.io/github/issues-pr/Jessie-jzn/Next-Notion-Blog" alt="Pull Requests Badge"/></a>
    <a href="https://github.com/Jessie-jzn/Next-Notion-Blog/issues"><img src="https://img.shields.io/github/issues/Jessie-jzn/Next-Notion-Blog" alt="Issues Badge"/></a>
    <a href="https://github.com/Jessie-jzn/Next-Notion-Blog/graphs/contributors"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors/Jessie-jzn/Next-Notion-Blog?color=2b9348"></a>
    <a href="https://github.com/Jessie-jzn/Next-Notion-Blog/blob/master/LICENSE"><img src="https://img.shields.io/github/license/Jessie-jzn/Next-Notion-Blog?color=2b9348" alt="License Badge"/></a>
</div>

<p align="center">
    <a href="https://www.jessieontheroad.com/">Live Demo</a>
    ·
    <a href="https://github.com/Jessie-jzn/Jessie-Blog.dev/issues">Report Bug</a>
    ·
    <a href="https://github.com/Jessie-jzn/Jessie-Blog.dev/issues">Request Feature</a>
</p>

## 📸 Preview / 预览

<a href="https://www.jessieontheroad.com"><img src="https://github.com/Jessie-jzn/Jessie-Blog.dev/blob/main/public/images/website.png" alt="Blog Preview" /></a>

## ✨ Features / 特性

### Content Management / 内容管理

- 📝 Notion as CMS / 使用 Notion 作为内容管理系统
- 📚 Rich Text Support / 富文本支持
- 🏷️ Category & Tag System / 分类和标签系统
- 🔄 Real-time Content Updates / 实时内容更新

### User Experience / 用户体验

- 🌍 Multilingual Support (English & Chinese) / 多语言支持（英文和中文）
- 📱 Responsive Design / 响应式设计
- 🔍 Advanced Search / 高级搜索
- 📊 Reading Progress / 阅读进度

### Technical Features / 技术特性

- 🎨 Tailwind CSS for Styling / 使用 Tailwind CSS 构建界面
- 📊 Analytics Integration / 集成数据统计分析
- 🔍 SEO Optimized / SEO 优化
- 📧 Newsletter Subscription / 邮件订阅功能
- 🔒 Secure Authentication / 安全认证
- 支持导航栏的二级菜单渲染。
- Markdown 简历编辑器：
  - 支持主题切换（`tui` 和 `github`）。
  - 导出 PDF 功能，样式随主题动态更新。

## 🛠️ Tech Stack / 技术栈

### Frontend / 前端

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **UI Components:** [Headless UI](https://headlessui.com/)

### Backend / 后端

- **API:** [Notion API](https://developers.notion.com)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Database:** [Notion Database](https://www.notion.so/product/database)

### Deployment & Tools / 部署和工具

- **Hosting:** [Vercel](https://vercel.com/)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Version Control:** [Git](https://git-scm.com/)

[![Next][Next.js]][Next-url] [![MDX]][MDX-url] [![Vercel]][Vercel-url] [![React]][React-url] [![Typescript]][Typescript-url] [![Tailwind CSS]][Tailwind CSS-url]

## 🚀 Roadmap / 开发计划

### Completed / 已完成

- [x] Basic UI implementation / 基础 UI 实现
- [x] Notion API integration / Notion API 接入
- [x] Analytics integration / 数据统计集成
- [x] SEO optimization / SEO 优化
- [x] Environment separation / 环境区分
- [x] Newsletter subscription / 邮件订阅
- [x] Category and tag system / 分类和标签系统
- [x] Social sharing / 社交分享功能
- [x] Dark mode support / 深色模式支持
- [x] Performance optimization / 性能优化
- [x] Internationalization improvements / 国际化改进
- [x] Progressive Web App / 渐进式 Web 应用

### In Progress / 进行中

- [ ] Search and filter functionality / 搜索和过滤功能
- [ ] Photography section / 摄影版块
- [ ] Media optimization / 多媒体优化
- [ ] User authentication / 用户认证系统
- [ ] Comments system / 评论系统
- [ ] Content caching / 内容缓存

### Planned / 计划中

- [ ] Content recommendations / 内容推荐
- [ ] Newsletter customization / 邮件订阅定制
- [ ] API documentation / API 文档
- [ ] Mobile app / 移动应用

## 🏗️ Project Structure / 项目结构

```
jessie-blog.dev/
├── components/         # React components
├── lib/               # Utility functions and configurations
├── pages/             # Next.js pages
├── public/            # Static assets
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## 🚀 Getting Started / 快速开始

### Prerequisites / 前提条件

- Node.js 18.x or later
- npm or yarn
- Notion API key

### Installation / 安装

1. Clone the repository

```bash
git clone https://github.com/Jessie-jzn/Jessie-Blog.dev.git
cd Jessie-Blog.dev
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

## 🤝 Contributing / 贡献

Contributions are always welcome! / 欢迎贡献！

1. Fork the Project / 复刻项目
2. Create your Feature Branch / 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes / 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch / 推送到分支 (`git push origin feature/AmazingFeature`)
5. Open a Pull Request / 开启拉取请求

## 📝 License / 许可

Distributed under the MIT License. See `LICENSE` for more information.
<br>
基于 MIT 许可证开源。查看 `LICENSE` 获取更多信息。

## 📬 Contact / 联系

Jessie - znjessie858@gmail.com

Project Link / 项目链接: [https://github.com/Jessie-jzn/Jessie-Blog.dev](https://github.com/Jessie-jzn/Jessie-Blog.dev)

---

<p align="center">Copyright © 2024 - Jessie</p>

<!-- MARKDOWN LINKS & IMAGES -->

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Typescript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[Tailwind CSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind CSS-url]: https://tailwindcss.com/
[MDX]: https://img.shields.io/badge/MDX-000000?style=for-the-badge&logo=mdx&logoColor=white
[MDX-url]: https://mdxjs.com/
[React]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vercel]: https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com/
