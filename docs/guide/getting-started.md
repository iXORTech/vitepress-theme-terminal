---
title:
  en: "Getting Started"
  zh-Hans: "快速开始"
order: 1
---
::::: lang en

# Getting Started

**VitePress Theme Terminal** is a VitePress theme that renders a blog or
personal site as a modern TUI/editor environment: a tool bar, a file explorer, a
scrolling viewport, a status bar, and floating utility windows.

This page takes you from a clone to a running site with your own identity on it.
The rest of the user documentation is indexed in
[`docs/index.md`](../index.md).

## Requirements

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 20 LTS or newer | What VitePress 2 expects |
| pnpm | any current release | The package manager this repo uses (`pnpm-lock.yaml`) |
| git | any | Optional but recommended — the "Updated" date on articles comes from git |

## Install

The theme ships **as this repository**: a VitePress site whose theme lives in
`.vitepress/theme/`, with a demo site in `src/` that exercises every feature.
Start from a clone:

```sh
git clone --recurse-submodules <repository-url> my-site
cd my-site
pnpm install
```

`--recurse-submodules` pulls the demo friend-links data submodule. If you
cloned without it and want the friends demo, run
`git submodule update --init --recursive`; if you don't, the friends page simply
shows the hand-authored entries.

## Run it

```sh
pnpm dev       # dev server with hot reload, http://localhost:5173
pnpm build     # production build into .vitepress/dist
pnpm preview   # serve the built site locally
```

Open the dev server and you should see the demo site: the shell frame, the
explorer on the left, and the welcome card in the viewport. Try `/` to open the
find palette, the gear in the status bar for settings, and the tool-bar icon
that cycles dark → light → paper.

## What is where

```
.vitepress/config.mts     site + theme configuration — the file you edit most
.vitepress/theme/         the theme implementation (components, styles, composables)
src/                      your content (VitePress `srcDir`)
src/public/               static assets served from the site root
docs/                     this documentation — the documentation home
src/docs/                 generated copy of the published docs (git-ignored)
```

The documentation is written once, in `docs/`. A build step
(`theme/vite/publishDocs.ts`) mirrors the user-facing part into `src/docs/` so
the site serves it at `/docs/`, and leaves the design records out of the
deployment. Drop that step from `.vitepress/config.mts` if you don't want the
theme's documentation on your own site.

Inside the theme, the parts a site owner touches most are
`.vitepress/theme/views/` (authored page views) and
`.vitepress/theme/assets/` (friend-link data). Everything else is theme
internals — see [`customization.md`](customization.md) before editing them.

## Make it yours

Five edits turn the demo into your site. All of them are in
`.vitepress/config.mts`.

**1. Site identity.** The VitePress-level `title`, `description`, and `lang` are
the server-rendered defaults; the `themeConfig` versions add per-language
values:

```ts
export const themeConfig: TerminalThemeConfig = {
  title: { en: "Ada's Notebook", "zh-Hans": "阿达的笔记" },
  description: { en: "Notes on machines that think." },
  siteName: "ada-notebook", // the host segment in shell prompts
};
```

**2. Your color.** One color configures the whole theme — every hover, border,
and dim tone is derived from it:

```ts
mainColor: "#80E0A7",
```

**3. Author & license.** These feed the footer copyright, the shell prompts, and
every article's license card:

```ts
author: { name: "Ada Lovelace", username: "ada" },
license: { name: "CC BY-NC-SA 4.0" },
```

**4. Navigation.** Tabs in the tool bar, and the explorer:

```ts
toolbar: {
  nav: [
    { text: "Posts", link: "/posts", icon: "fa-solid fa-feather" },
    { text: "About", link: "/about", icon: "fa-solid fa-user" },
  ],
},
explorer: "auto",   // discover every Markdown page under src/
```

**5. Footer.** Social icons and an optional feed:

```ts
footer: {
  social: [{ icon: "fa-brands fa-github", link: "https://github.com/…", label: "GitHub" }],
},
```

Every option, with types and defaults, is in
[`configuration/theme-config.md`](../configuration/theme-config.md).

## Write your first page

Content is plain Markdown under `src/`. A file at `src/notes/first.md` is served
at `/notes/first` and appears in the explorer automatically when
`explorer: "auto"` is set:

```yaml
---
title: My first note
---

# My first note

Hello from the terminal.
```

A **post** — with a date, taxonomy, byline, license card, and a place in the
listings — goes under `src/posts/` instead:

```yaml
---
title: Hello, Terminal
date: 2026-07-28
tags: [theme]
categories: Guides
---
```

See [`writing-content.md`](writing-content.md) for the Markdown features and
[`blogging.md`](blogging.md) for posts, series, and listing pages.

## Clear out the demo

The demo content is meant to be deleted. When you are ready:

1. **Content.** Remove the demo pages under `src/` you don't want —
   `markdown-examples.md`, `demo/`, `posts/`, `series/`, `drafts/`,
   `projects.md`, `about.md`, `friends.md`. Keep the listing pages you use
   (`posts.md`, `archives.md`, `categories.md`, `tags.md`, `series.md`) and
   their dynamic-route files under `src/categories/`, `src/tags/`, `src/page/`.
   The documentation (`docs/` and its generated `src/docs/` copy) is yours to
   keep or delete, as above.
2. **Demo pre-footer.** `.vitepress/theme/index.ts` registers `DemoLayout` (which
   fills the `pre-footer` slot with demo content). Swap it for the theme's own
   `Layout`, or for your own wrapper — see
   [`customization.md`](customization.md).
3. **Demo config.** Drop the demo `toolbar.nav` entries, `taxonomy` labels,
   `friends.groups`, `home` copy, and the placeholder `comments.waline.serverURL`
   / `footer.rss` values from `.vitepress/config.mts`.
4. **Friend links.** Replace `.vitepress/theme/assets/linksData.mjs` and, if you
   don't want it, remove the `generatedLinkData` submodule
   (`git submodule deinit` + the `.gitmodules` entry).

## Where next

| If you want to… | Read |
| --- | --- |
| Write pages and use every Markdown feature | [`writing-content.md`](writing-content.md) |
| Publish posts, tags, categories, and series | [`blogging.md`](blogging.md) |
| Configure the tool bar, explorer, TOC, and search | [`navigation.md`](navigation.md) |
| Offer your site in more than one language | [`internationalization.md`](internationalization.md) |
| Change colors, fonts, or add your own components | [`customization.md`](customization.md) |
| Ship it | [`deployment.md`](deployment.md) |
| Look up an option | [`configuration/theme-config.md`](../configuration/theme-config.md) · [`configuration/frontmatter.md`](../configuration/frontmatter.md) |

:::::

::::: lang zh-Hans

# 快速开始

**VitePress Theme Terminal** 是一个 VitePress 主题，它把博客或个人站点呈现为一个
现代的 TUI／编辑器环境：工具栏、文件浏览器、可滚动的视口、状态栏，以及浮动工具
窗口。

本页带你从克隆仓库走到一个带有你自己身份标识的站点。其余用户文档的索引在
[`docs/index.md`](../index.md)。

## 环境要求

| 工具 | 版本 | 说明 |
| --- | --- | --- |
| Node.js | 20 LTS 或更新 | VitePress 2 所要求的版本 |
| pnpm | 任意较新版本 | 本仓库使用的包管理器（`pnpm-lock.yaml`） |
| git | 任意 | 可选但推荐——文章的「更新时间」来自 git |

## 安装

主题**以本仓库的形式**发布：这是一个 VitePress 站点，主题位于
`.vitepress/theme/`，`src/` 中的演示站点覆盖了每一项功能。从克隆开始：

```sh
git clone --recurse-submodules <repository-url> my-site
cd my-site
pnpm install
```

`--recurse-submodules` 会拉取演示用的友链数据子模块。如果你克隆时没加这个参数，
又想要友链演示，可以执行 `git submodule update --init --recursive`；如果不需要，
友链页面就只显示手写的条目。

## 运行

```sh
pnpm dev       # 带热更新的开发服务器，http://localhost:5173
pnpm build     # 生产构建，输出到 .vitepress/dist
pnpm preview   # 在本地预览构建产物
```

打开开发服务器，你应该会看到演示站点：外壳框架、左侧的文件浏览器，以及视口中的
欢迎卡片。试试按 `/` 打开查找面板、点击状态栏的齿轮打开设置，以及工具栏中在
深色 → 浅色 → 纸张之间循环的图标。

## 目录结构

```
.vitepress/config.mts     站点与主题配置——你改得最多的文件
.vitepress/theme/         主题实现（组件、样式、组合式函数）
src/                      你的内容（VitePress 的 `srcDir`）
src/public/               静态资源，从站点根路径提供
docs/                     本文档——文档之家
src/docs/                 已发布文档的生成副本（已加入 gitignore）
```

文档只写一次，就写在 `docs/` 里。构建步骤（`theme/vite/publishDocs.ts`）会把其中
面向用户的部分镜像到 `src/docs/`，使站点在 `/docs/` 提供它，同时把设计记录排除在
部署之外。如果你不想让主题的文档出现在自己的站点上，从 `.vitepress/config.mts` 中
移除这一步即可。

在主题内部，站点所有者最常改动的是 `.vitepress/theme/views/`（手写页面视图）和
`.vitepress/theme/assets/`（友链数据）。其余都是主题内部实现——改动前请先读
[`customization.md`](customization.md)。

## 让它成为你的站点

五处改动就能把演示变成你的站点，全部位于 `.vitepress/config.mts`。

**1. 站点身份。** VitePress 层的 `title`、`description` 与 `lang` 是服务端渲染时
的默认值；`themeConfig` 中的同名选项则补充分语言的值：

```ts
export const themeConfig: TerminalThemeConfig = {
  title: { en: "Ada's Notebook", "zh-Hans": "阿达的笔记" },
  description: { en: "Notes on machines that think." },
  siteName: "ada-notebook", // shell 提示符中的主机名片段
};
```

**2. 你的颜色。** 一个颜色配置整个主题——每一种悬停、边框与暗淡色调都由它派生：

```ts
mainColor: "#80E0A7",
```

**3. 作者与许可协议。** 它们供给页脚版权、shell 提示符，以及每篇文章的许可卡片：

```ts
author: { name: "Ada Lovelace", username: "ada" },
license: { name: "CC BY-NC-SA 4.0" },
```

**4. 导航。** 工具栏中的标签页，以及文件浏览器：

```ts
toolbar: {
  nav: [
    { text: "Posts", link: "/posts", icon: "fa-solid fa-feather" },
    { text: "About", link: "/about", icon: "fa-solid fa-user" },
  ],
},
explorer: "auto",   // 自动发现 src/ 下的每个 Markdown 页面
```

**5. 页脚。** 社交图标与可选的订阅源：

```ts
footer: {
  social: [{ icon: "fa-brands fa-github", link: "https://github.com/…", label: "GitHub" }],
},
```

每个选项的类型与默认值都在
[`configuration/theme-config.md`](../configuration/theme-config.md)。

## 写下第一个页面

内容就是 `src/` 下的普通 Markdown。`src/notes/first.md` 会以 `/notes/first` 提供
服务；只要设置了 `explorer: "auto"`，它就会自动出现在文件浏览器中：

```yaml
---
title: 我的第一篇笔记
---

# 我的第一篇笔记

来自终端的问候。
```

**文章**——带日期、分类法、署名行、许可卡片，并会进入各类列表——则放在
`src/posts/` 下：

```yaml
---
title: 你好，终端
date: 2026-07-28
tags: [theme]
categories: Guides
---
```

Markdown 功能见 [`writing-content.md`](writing-content.md)；文章、系列与列表页见
[`blogging.md`](blogging.md)。

## 清理演示内容

演示内容本来就是给你删的。准备好之后：

1. **内容。** 删除 `src/` 下你不需要的演示页面——`markdown-examples.md`、
   `demo/`、`posts/`、`series/`、`drafts/`、`projects.md`、`about.md`、
   `friends.md`。保留你要用的列表页（`posts.md`、`archives.md`、
   `categories.md`、`tags.md`、`series.md`）以及 `src/categories/`、`src/tags/`、
   `src/page/` 下的动态路由文件。文档（`docs/` 及其生成的 `src/docs/` 副本）如上所述，去留由你。
2. **演示用的页脚上方区域。** `.vitepress/theme/index.ts` 注册的是 `DemoLayout`
   （它用演示内容填充 `pre-footer` 插槽）。把它换成主题自带的 `Layout`，或换成你
   自己的包装组件——见 [`customization.md`](customization.md)。
3. **演示配置。** 从 `.vitepress/config.mts` 中删掉演示用的 `toolbar.nav` 条目、
   `taxonomy` 标签、`friends.groups`、`home` 文案，以及占位的
   `comments.waline.serverURL` 与 `footer.rss`。
4. **友链。** 替换 `.vitepress/theme/assets/linksData.mjs`；如果不需要，再移除
   `generatedLinkData` 子模块（`git submodule deinit` 加上删除 `.gitmodules` 中的
   条目）。

## 接下来读什么

| 如果你想…… | 就读 |
| --- | --- |
| 撰写页面并用上全部 Markdown 功能 | [`writing-content.md`](writing-content.md) |
| 发布文章、标签、分类与系列 | [`blogging.md`](blogging.md) |
| 配置工具栏、文件浏览器、目录与搜索 | [`navigation.md`](navigation.md) |
| 用多种语言提供站点 | [`internationalization.md`](internationalization.md) |
| 改变颜色、字体，或加入自己的组件 | [`customization.md`](customization.md) |
| 把站点发布上线 | [`deployment.md`](deployment.md) |
| 查阅某个选项 | [`configuration/theme-config.md`](../configuration/theme-config.md) · [`configuration/frontmatter.md`](../configuration/frontmatter.md) |

:::::
