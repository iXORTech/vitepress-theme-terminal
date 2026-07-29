---
title:
  en: "Documentation"
  zh-Hans: "文档"
---
::::: lang en

# Documentation

Documentation of **VitePress Theme Terminal** for human developers and AI agents alike.

Everything lives in **`docs/` at the repository root** — that directory is the
documentation home, and the only place a document is ever edited.

The site publishes the **user-facing** part of it at `/docs/`: the index you are
reading, the guide, and the configuration reference. Those pages are generated
into `src/docs/` at build time (git-ignored, never hand-edited) by
`theme/vite/publishDocs.ts`. The **design records** under `docs/design/` are not
published — they are binding decision records written for contributors and
coding agents, and they stay in the repository.

One convention follows from that: links between documents are written
**repository-relative** (`../design/color-system.md`), so they work in an editor
and on the repository host. When a page is published, any link pointing outside
the published set — a design record, `AGENTS.md`, a source file — is rewritten
to a repository URL, so a reader on the site still lands on the real document.

## Index

### User guide — `guide/`

Start here if you are building a site with the theme. The guide is
task-oriented; the reference tables below it are lookup material.

| Document | Contents |
| --- | --- |
| [`guide/getting-started.md`](guide/getting-started.md) | Requirements, install, running the site, project layout, the five edits that make it yours, clearing out the demo |
| [`guide/writing-content.md`](guide/writing-content.md) | Page types, the frontmatter you use daily, code blocks, callouts, Markdown extensions, LaTeX & Typst math, images & galleries, Vue in Markdown |
| [`guide/blogging.md`](guide/blogging.md) | Posts, tags & categories, listing pages and generated routes, series, cover images, the end-of-article cards |
| [`guide/navigation.md`](guide/navigation.md) | Tool bar & submenus, file explorer, article TOC, find palette, status bar, settings, keyboard shortcuts, persisted preferences |
| [`guide/internationalization.md`](guide/internationalization.md) | Client-side language switching, language tags, localizable text, `::: lang` page bodies, taxonomy labels, overriding strings, adding a language |
| [`guide/customization.md`](guide/customization.md) | Main color & modes, fonts and icons, styling rules, authored page views, the pre-footer slot, friend-link data, branding constraints |
| [`guide/deployment.md`](guide/deployment.md) | Build & preview, hosting requirements, clean URLs, subpath deploys, the large Typst asset, CI checkout requirements, pre-launch checklist |

### Design decisions (binding) — `design/`

Repository-only: these records are not published on the site, so the links below
open them in the repository.

| Document | Contents |
| --- | --- |
| [`design/design-language.md`](design/design-language.md) | Identity, TUI/editor design language (NeoVim/LazyVim-inspired), no-branding rule, iconic components, modern finish, color-mode list, keyboard UX, mobile, i18n principles |
| [`design/color-system.md`](design/color-system.md) | Main color (`#80E0A7` default) and the derivation-only rule, IBM Carbon supporting palette, Oxocarbon code colors, the three color modes |
| [`design/typography-and-icons.md`](design/typography-and-icons.md) | IBM Plex family allocation, Font Awesome vs Nerd Font usage, stylesheet-based loading rule |
| [`design/ui-sketch.md`](design/ui-sketch.md) | ASCII wireframes: desktop layout, floating find window, mobile layout with explorer drawer, paper mode; region → spec → task map |
| [`design/content-architecture.md`](design/content-architecture.md) | `src/` directory layout (normal pages flat in `src/`, `posts/`, `series/`, listing & dynamic-route pages, `public/`) and the per-page-type Vue component dispatch; modeled on `vitepress-theme-arch` |
| [`design/friend-links.md`](design/friend-links.md) | Friends page (PAGE-004): external `linksData.mjs` data format (generator + git-submodule sync), data discovery/merging, i18n decisions, TUI page composition, `themeConfig.friends` |

### Configuration reference — `configuration/`

| Document | Contents |
| --- | --- |
| [`configuration/theme-config.md`](configuration/theme-config.md) | Every `themeConfig` option with type, default, and example; the localizable-text rule; what is deliberately configured elsewhere |
| [`configuration/frontmatter.md`](configuration/frontmatter.md) | Every frontmatter field the theme reads, plus the `explorer.json` and `series.yml` schemas |
| [`configuration/clean-urls.md`](configuration/clean-urls.md) | `cleanUrls` (THEME-030): suffix-free page URLs, what the option does and does not change, and why old `.html` links keep working |

### Process & agent files (outside `docs/`)

| File | Contents |
| --- | --- |
| [`AGENTS.md`](../AGENTS.md) | Agent instructions: session protocol, planning workflow, engineering conventions, compliance code. Single content source — `CLAUDE.md` and `.github/copilot-instructions.md` only point to it |
| [`.agent/plan.md`](../.agent/plan.md) | Task board: IDs, categories, dependencies, acceptance criteria |
| [`.agent/context-cache.md`](../.agent/context-cache.md) | Brief per-file summaries of the repository |

## Documentation rules

- Design documents are **binding**: change the document first, then the code.
- One home per piece of content — cross-link rather than duplicate.
- Readability is a first-class requirement, for documentation as much as for code.

:::::

::::: lang zh-Hans

# 文档

**VitePress Theme Terminal** 的文档，同时面向人类开发者与 AI 代理。

全部文档都位于**仓库根目录的 `docs/`** ——那里是文档之家，也是唯一会被编辑的地方。

站点只发布其中**面向用户**的部分（`/docs/`）：你正在读的索引、使用指南与配置参考。
这些页面在构建时由 `theme/vite/publishDocs.ts` 生成到 `src/docs/`（已加入
gitignore，绝不手工编辑）。`docs/design/` 下的**设计决策记录**不会发布——它们是写给
贡献者与编码代理的、具有约束力的决策记录，只保留在仓库中。

由此引出一条约定：文档之间的链接一律按**仓库相对路径**书写
（`../design/color-system.md`），这样它们在编辑器里和代码托管平台上都有效；而在页面
被发布时，任何指向未发布内容的链接——设计记录、`AGENTS.md`、源码文件——都会被改写为
仓库地址，因此站点读者依然能抵达真正的文档。

## 索引

### 使用指南 —— `guide/`

如果你要用本主题搭建站点，请从这里开始。指南以任务为导向；其下的参考表格用于随时
查阅。

| 文档 | 内容 |
| --- | --- |
| [`guide/getting-started.md`](guide/getting-started.md) | 环境要求、安装、运行站点、项目结构、让站点变成你自己的五处改动、清理演示内容 |
| [`guide/writing-content.md`](guide/writing-content.md) | 页面类型、日常使用的 frontmatter、代码块、提示框、Markdown 扩展、LaTeX 与 Typst 公式、图片与相册、在 Markdown 中使用 Vue |
| [`guide/blogging.md`](guide/blogging.md) | 文章、标签与分类、列表页与生成路由、系列、封面图、文末卡片 |
| [`guide/navigation.md`](guide/navigation.md) | 工具栏与下拉子菜单、文件浏览器、文章目录、查找面板、状态栏、设置、键盘快捷键、被记住的偏好 |
| [`guide/internationalization.md`](guide/internationalization.md) | 客户端语言切换、语言标签、可本地化文本、`::: lang` 页面正文、分类法标签、覆盖界面字符串、新增语言 |
| [`guide/customization.md`](guide/customization.md) | 主色与配色模式、字体与图标、样式规则、手写页面视图、页脚上方插槽、友链数据、品牌约束 |
| [`guide/deployment.md`](guide/deployment.md) | 构建与预览、托管要求、简洁 URL、子路径部署、体积较大的 Typst 资源、CI 检出要求、上线前清单 |

### 设计决策（具有约束力）—— `design/`

仅存在于仓库中：这些记录不会发布到站点，因此下面的链接会在仓库中打开它们。

| 文档 | 内容 |
| --- | --- |
| [`design/design-language.md`](design/design-language.md) | 身份识别、TUI／编辑器设计语言（受 NeoVim/LazyVim 启发）、禁止第三方品牌规则、标志性组件、现代化质感、配色模式清单、键盘交互、移动端、i18n 原则 |
| [`design/color-system.md`](design/color-system.md) | 主色（默认 `#80E0A7`）与「只允许派生」规则、IBM Carbon 辅助色板、Oxocarbon 代码配色、三种配色模式 |
| [`design/typography-and-icons.md`](design/typography-and-icons.md) | IBM Plex 字族分配、Font Awesome 与 Nerd Font 的分工、基于样式表的加载规则 |
| [`design/ui-sketch.md`](design/ui-sketch.md) | ASCII 线框图：桌面布局、浮动查找窗口、带浏览器抽屉的移动端布局、纸张模式；区域 → 规范 → 任务对照表 |
| [`design/content-architecture.md`](design/content-architecture.md) | `src/` 目录结构（普通页面平铺在 `src/`，以及 `posts/`、`series/`、列表页与动态路由页、`public/`）与按页面类型分发的 Vue 组件；参考 `vitepress-theme-arch` |
| [`design/friend-links.md`](design/friend-links.md) | 友链页面（PAGE-004）：外部 `linksData.mjs` 数据格式（生成器 + git 子模块同步）、数据发现与合并、i18n 决策、TUI 页面构成、`themeConfig.friends` |

### 配置参考 —— `configuration/`

| 文档 | 内容 |
| --- | --- |
| [`configuration/theme-config.md`](configuration/theme-config.md) | 每一个 `themeConfig` 选项的类型、默认值与示例；可本地化文本规则；哪些配置有意放在别处 |
| [`configuration/frontmatter.md`](configuration/frontmatter.md) | 主题读取的每一个 frontmatter 字段，以及 `explorer.json` 与 `series.yml` 的结构 |
| [`configuration/clean-urls.md`](configuration/clean-urls.md) | `cleanUrls`（THEME-030）：无后缀页面 URL、该选项改变了什么、又没有改变什么，以及旧的 `.html` 链接为何仍然可用 |

### 流程与代理文件（位于 `docs/` 之外）

| 文件 | 内容 |
| --- | --- |
| [`AGENTS.md`](../AGENTS.md) | 代理指令：会话流程、规划工作流、工程约定、合规码。唯一的内容来源——`CLAUDE.md` 与 `.github/copilot-instructions.md` 只是指向它 |
| [`.agent/plan.md`](../.agent/plan.md) | 任务板：ID、类别、依赖、验收标准 |
| [`.agent/context-cache.md`](../.agent/context-cache.md) | 仓库内每个文件的简要说明 |

## 文档规则

- 设计文档具有**约束力**：先改文档，再改代码。
- 每一处内容只有一个归属地——交叉引用，而不是复制。
- 可读性是第一位的要求，对文档和对代码同样如此。

:::::
