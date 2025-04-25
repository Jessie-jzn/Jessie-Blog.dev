# Jessie Blog 改动日志

## [2025.04.25]

### 新增功能

- 支持导航栏的二级菜单渲染逻辑。
- 在 `/tools/resume` 页面实现了 Markdown 简历编辑器的主题切换功能。
  - 切换主题时，`renderHTML` 的样式动态更新。
  - 新增主题选择器，支持 `tui` 和 `github` 两种主题。
- 导出 PDF 功能支持根据当前主题动态加载样式。

### 修复问题

- 修复了 `theme` 类型不匹配导致的 TypeScript 报错。
