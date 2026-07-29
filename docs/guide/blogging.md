---
title:
  en: "Posts, Taxonomy & Series"
  zh-Hans: "文章、分类与系列"
order: 3
---
::::: lang en

# Posts, Taxonomy & Series

Everything that makes the theme a blog: dated posts, tags and categories, the
listing pages that index them, and multi-part series.

## A post

A post is any Markdown file under `src/posts/`. Its frontmatter is what turns it
into an article rather than a page:

```yaml
---
title: Hello, Terminal
description: A first look at the theme.
date: 2026-07-28
tags: [theme, terminal]
categories: Guides
cover: /images/hello-terminal.svg
---

The body starts here.
```

You get, automatically: a byline with the date and taxonomy, the cover rendered
as a hero banner, an "on this page" panel once the article has enough headings,
a license card at the end, and — when a comment server is configured — a comment
card with view and comment counts.

Only `title` is really needed. Without a `date` the post sorts last and shows as
undated; without taxonomy it simply appears in no term listing. Individual
articles can drop the license or comment card with `license: false` /
`comments: false`, or leave the article chrome entirely with `article: false`.

Post ordering is by `date`, newest first, everywhere.

## Tags and categories

Declare terms as **plain names** in frontmatter — a single string or a list:

```yaml
tags: [theme, color]
categories: Design
```

Slugs and URLs derive from the authored name (`Design` → `/categories/design`),
so links are stable. To *display* a term differently — including per language —
map it site-wide in `themeConfig.taxonomy`; terms without an entry render
verbatim:

```ts
taxonomy: {
  tags: { theme: { en: "theme", "zh-Hans": "主题" } },
  categories: { Guides: { en: "Guides", "zh-Hans": "指南" } },
},
```

Categories and tags behave identically; use categories for a few broad buckets
and tags for everything else.

## Listing pages

Each listing is a one-line Markdown page placing a globally registered
component. The demo ships all of them; keep the ones you use.

| File | Component | Renders |
| --- | --- | --- |
| `src/posts.md` | `<PostsIndex />` | All posts, paginated (10 per page) |
| `src/archives.md` | `<ArchivesList />` | The full timeline, grouped by date |
| `src/categories.md` | `<CategoriesIndex />` | Every category with its post count |
| `src/tags.md` | `<TagsIndex />` | Every tag with its post count |
| `src/series.md` | `<SeriesIndex />` | Every series with icon, description, article count |

```md
---
title: Posts
---

<PostsIndex />
```

Three route families are **generated at build time** from a `.paths.mjs` loader
beside the template — leave these files in place if you want the routes:

| Template | Generates | Component |
| --- | --- | --- |
| `src/page/[num].md` | `/page/2` … `/page/N` (page 1 is `/posts`) | `<PostsIndex />` |
| `src/tags/[name].md` | `/tags/<slug>` per tag | `<TermPosts field="tags" />` |
| `src/categories/[name].md` | `/categories/<slug>` per category | `<TermPosts field="categories" />` |

The loaders import your `themeConfig`, so the generated routes and what the
components display always agree — which matters for the series toggles below.

### Pinning a post

`pinned: true` in a post's frontmatter lifts it above every unpinned post on
the posts index (and its pagination) and on the tag and category listings. Use
it for the one or two posts a new reader should see first — a "start here", a
changelog, a pinned announcement.

```yaml
---
title: Start Here
pinned: true
---
```

The archives are left strictly chronological on purpose: a pinned post leads
its own year there, not the page. Full reference:
[`pinned`](../configuration/frontmatter.md#pinned).

## Series

A series is a folder under `src/series/`. The folder name is the series' identity
and URL segment:

```
src/series/terminal-internals/
├── series.yml     # optional metadata
├── index.md       # the landing page
├── part-1.md
└── part-2.md
```

**`series.yml`** describes the series (every field optional):

```yaml
icon: nf-fa-terminal
title:
  en: Terminal Internals
  zh-Hans: 终端内幕
description:
  en: A short series on how the theme's shell is built.
order: 0
```

**`index.md`** is the landing page; place `<SeriesArticles />` to list the parts
automatically:

```md
---
title: Terminal Internals
---

<SeriesArticles />
```

**The articles** are ordinary post frontmatter plus an `order` (default `0`,
smaller sorts higher, ties alphabetical):

```yaml
---
title: "Part 1 — The Shell Frame"
date: 2026-07-15
order: 1
---
```

Every article in the folder shows a banner with the series icon, title, and
description, linking back to the landing page.

### Series in the general listings

Series articles stay **out** of the general post listings by default — a series
belongs to itself. Opt in per surface:

```ts
series: {
  inPosts: false,      // post index + pagination
  inArchives: true,    // archives timeline
  inCategories: true,  // category index + per-category pages
  inTags: true,        // tag index + per-tag pages
},
```

An admitted article shows its series name before the title
(`Terminal Internals › Part 1 — The Shell Frame`) so it stays recognizable among
regular posts.

## Cover images

A `cover` in frontmatter is used in two places, and adapts to each:

```yaml
---
cover: /images/hello-terminal.svg
---
```

- **In post-list cards** it is a full-height panel on the right, cropped to fit
  and fading into the card. Below 640 px it becomes a full-width strip on top.
- **On the article page** the header becomes a hero banner showing the image in
  full at its natural aspect ratio, fading into the surface only behind the
  byline.

Covers are lazy-loaded and excluded from the lightbox gallery. Posts without one
render exactly as before. Put the files in `src/public/` and reference them
site-absolutely.

## The end-of-article cards

Two cards close every article, both prompt-decorated:

- **License** — the article title, permalink, publish date, last-updated date,
  and author, with the license statement and its icons. Author and license come
  from `themeConfig.author` / `.license`; the "Updated" date comes from an
  explicit `updated` frontmatter value or, failing that, git (which needs
  `lastUpdated: true` in the site config — it is set in the demo).
- **Comments** — a Waline widget plus the view/comment counters shown near the
  title. It renders only once `themeConfig.comments.waline.serverURL` points at
  your deployed Waline server.

```ts
comments: { waline: { serverURL: "https://waline.example.com" } },
```

## Drafts

There is no draft flag. The conventional approach is a folder the explorer
hides, kept out of `src/posts/` so it never enters a listing — the demo does
this with `src/drafts/` and an `explorer.json` carrying
`"showInExplorer": false`. Note that such pages still build and remain reachable
by URL; delete or move them out of `src/` to keep them off the site entirely.

:::::

::::: lang zh-Hans

# 文章、分类法与系列

让主题成为一个博客的全部要素：带日期的文章、标签与分类、为它们建立索引的列表页，
以及多篇构成的系列。

## 一篇文章

文章就是 `src/posts/` 下的任意 Markdown 文件。真正让它成为「文章」而不是普通页面的
是它的 frontmatter：

```yaml
---
title: 你好，终端
description: 主题初识。
date: 2026-07-28
tags: [theme, terminal]
categories: Guides
cover: /images/hello-terminal.svg
---

正文从这里开始。
```

你会自动得到：带日期与分类法的署名行、以头图形式呈现的封面、当标题足够多时出现的
「本页内容」目录面板、文末的许可卡片，以及——在配置了评论服务器之后——带浏览量与
评论数的评论卡片。

其实只有 `title` 是真正必需的。没有 `date` 时文章排在最后并显示为未标注日期；没有
分类法时它只是不会出现在任何术语列表中。单篇文章可以用 `license: false` /
`comments: false` 去掉许可或评论卡片，或者用 `article: false` 完全退出文章外观。

文章排序在任何地方都按 `date` 由新到旧。

## 标签与分类

在 frontmatter 中以**原始名称**声明术语，单个字符串或数组均可：

```yaml
tags: [theme, color]
categories: Design
```

slug 与 URL 由所写的名称派生（`Design` → `/categories/design`），因此链接是稳定的。
若要以不同的方式*显示*某个术语——包括分语言显示——请在 `themeConfig.taxonomy` 中
全站映射；没有条目的术语按原样显示：

```ts
taxonomy: {
  tags: { theme: { en: "theme", "zh-Hans": "主题" } },
  categories: { Guides: { en: "Guides", "zh-Hans": "指南" } },
},
```

分类与标签的行为完全一致；建议用分类划分少数几个大类，其余交给标签。

## 列表页

每个列表页都是一个只有一行的 Markdown 页面，放置一个全局注册的组件。演示站点提供了
全部列表页；保留你要用的即可。

| 文件 | 组件 | 渲染内容 |
| --- | --- | --- |
| `src/posts.md` | `<PostsIndex />` | 全部文章，分页（每页 10 篇） |
| `src/archives.md` | `<ArchivesList />` | 完整时间线，按日期分组 |
| `src/categories.md` | `<CategoriesIndex />` | 每个分类及其文章数 |
| `src/tags.md` | `<TagsIndex />` | 每个标签及其文章数 |
| `src/series.md` | `<SeriesIndex />` | 每个系列的图标、描述与文章数 |

```md
---
title: Posts
---

<PostsIndex />
```

有三组路由是**在构建时生成**的，由模板旁边的 `.paths.mjs` 加载器产出——如果你需要
这些路由，请保留这些文件：

| 模板 | 生成 | 组件 |
| --- | --- | --- |
| `src/page/[num].md` | `/page/2` … `/page/N`（第 1 页是 `/posts`） | `<PostsIndex />` |
| `src/tags/[name].md` | 每个标签一个 `/tags/<slug>` | `<TermPosts field="tags" />` |
| `src/categories/[name].md` | 每个分类一个 `/categories/<slug>` | `<TermPosts field="categories" />` |

这些加载器会导入你的 `themeConfig`，因此生成的路由与组件展示的内容始终一致——这对
下面的系列开关尤其重要。

### 置顶文章

在文章 frontmatter 中写 `pinned: true`，即可让它排在文章索引页（及其分页）以及标签、
分类列表页上所有未置顶文章之前。适合用在你希望新读者第一眼看到的那一两篇——「从这里
开始」、更新日志、置顶公告等。

```yaml
---
title: 从这里开始
pinned: true
---
```

归档页刻意保持严格的时间顺序：置顶文章在那里只会排在自己所属年份的最前面，而不是整页
最前面。完整说明见 [`pinned`](../configuration/frontmatter.md#pinned-fm-zh)。

## 系列

一个系列就是 `src/series/` 下的一个文件夹。文件夹名即该系列的身份与 URL 片段：

```
src/series/terminal-internals/
├── series.yml     # 可选的元数据
├── index.md       # 系列首页
├── part-1.md
└── part-2.md
```

**`series.yml`** 描述这个系列（所有字段都可选）：

```yaml
icon: nf-fa-terminal
title:
  en: Terminal Internals
  zh-Hans: 终端内幕
description:
  en: A short series on how the theme's shell is built.
order: 0
```

**`index.md`** 是系列首页；放入 `<SeriesArticles />` 即可自动列出各篇：

```md
---
title: 终端内幕
---

<SeriesArticles />
```

**各篇文章**使用普通的文章 frontmatter，再加上一个 `order`（默认 `0`，数值越小越
靠前，相同时按字母序）：

```yaml
---
title: "第一篇 —— 外壳框架"
date: 2026-07-15
order: 1
---
```

该文件夹内的每篇文章都会显示一条横幅，其中有系列图标、标题与描述，并链接回系列
首页。

### 系列文章与通用列表

系列文章默认**不进入**通用文章列表——一个系列属于它自己。可以按列表逐项开启：

```ts
series: {
  inPosts: false,      // 文章索引 + 分页
  inArchives: true,    // 归档时间线
  inCategories: true,  // 分类索引 + 各分类页
  inTags: true,        // 标签索引 + 各标签页
},
```

被纳入的文章会在标题前显示所属系列名
（`Terminal Internals › Part 1 — The Shell Frame`），以便在普通文章中仍能被辨认。

## 封面图

frontmatter 中的 `cover` 会用在两处，并各自适配：

```yaml
---
cover: /images/hello-terminal.svg
---
```

- **在文章列表卡片中**，它是右侧的整高面板，按比例裁切并淡入卡片。在 640 px 以下
  变为顶部的整宽横条。
- **在文章页面上**，页头变成一张主视觉横幅，按图片原始比例完整显示，仅在署名行后方
  淡入背景。

封面图会延迟加载，并被排除在灯箱相册之外。没有封面的文章渲染方式与以前完全相同。
把文件放在 `src/public/` 中，并使用站点绝对路径引用。

## 文末的两张卡片

每篇文章都以两张带提示符装饰的卡片收尾：

- **许可卡片** —— 文章标题、永久链接、发布日期、最后更新日期与作者，以及许可声明
  及其图标。作者与许可来自 `themeConfig.author` / `.license`；「更新时间」取自
  frontmatter 中显式的 `updated`，若没有则取自 git（需要在站点配置中设置
  `lastUpdated: true`——演示站点已设置）。
- **评论卡片** —— Waline 组件，以及标题附近显示的浏览量／评论数。只有当
  `themeConfig.comments.waline.serverURL` 指向你部署的 Waline 服务时才会渲染。

```ts
comments: { waline: { serverURL: "https://waline.example.com" } },
```

## 草稿

主题没有草稿标记。惯常做法是放进一个被文件浏览器隐藏的文件夹，并保持在 `src/posts/`
之外，这样它永远不会进入任何列表——演示站点就是用 `src/drafts/` 加上一个带
`"showInExplorer": false` 的 `explorer.json` 做到的。请注意这类页面**仍会被构建**、
仍可通过 URL 访问；若要让它彻底不出现在站点上，请删除它或把它移出 `src/`。

:::::
