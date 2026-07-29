---
title:
  en: "Frontmatter Reference"
  zh-Hans: "Frontmatter 参考"
order: 2
---
::::: lang en

# Frontmatter & Source-local Metadata Reference

Options that describe **one page or one folder** live with the content rather
than in `themeConfig` — page frontmatter, an adjacent `explorer.json`, or a
series' `series.yml`. This is the complete list of what the theme reads, with
types, defaults, and examples. Site-wide options are in
[`theme-config.md`](theme-config.md).

Fields marked **`LocalizableText`** take a plain string or a per-language map
(`{ en: "…", "zh-Hans": "…" }`), resolved against the active UI language.

## Quick reference

| Field | Type | Default | Applies to |
| --- | --- | --- | --- |
| [`title`](#title) | `LocalizableText` | the file/URL slug | any page |
| [`explorerTitle`](#explorertitle) | `LocalizableText` | `title` | any page |
| [`description`](#description) | `LocalizableText` | auto excerpt | posts, series articles |
| [`date`](#date) | date / string / number | none | posts, series articles |
| [`updated`](#updated--lastupdated) / `lastUpdated` | date / string / number | git timestamp | articles |
| [`tags`](#tags--categories) | `string \| string[]` | `[]` | posts, series articles |
| [`categories`](#tags--categories) | `string \| string[]` | `[]` | posts, series articles |
| [`cover`](#cover) | `string` | none | posts, series articles |
| [`order`](#order) | `number` | `0` | any page, series articles |
| [`pinned`](#pinned) | `boolean` | `false` | posts, series articles |
| [`showInExplorer`](#showinexplorer) | `boolean` | `true` | any page |
| [`home`](#home) | `boolean` | `false` | any page |
| [`pageType`](#pagetype) | page-type string | resolved from the path | any page |
| [`article`](#article) | `boolean` | `true` | posts, series articles |
| [`license`](#license--comments) | `boolean \| object` | `true` | articles |
| [`comments`](#license--comments) | `boolean` | `true` | articles |

---

## `title`

- **Type:** `LocalizableText`
- **Default:** the page's file/URL slug

The page title. It drives the explorer label, the browser tab, post-list cards,
the archives rows, and the license card's article title — all of which
re-resolve a map in place when the reader switches language.

```yaml
---
title:
  en: Hello, Terminal
  zh-Hans: 你好，终端
---
```

> A per-language map is resolved to the **build language** for the
> server-rendered `<head>`, then re-resolved client-side. That is handled for
> you; nothing extra to configure.

## `explorerTitle`

- **Type:** `LocalizableText`
- **Default:** falls back to [`title`](#title)

Overrides the explorer row label only, leaving the page's own title alone —
useful when a long article title needs a short tree label.

```yaml
---
title: "A Complete Tour of the Status Bar"
explorerTitle: "Status bar"
---
```

## `description`

- **Type:** `LocalizableText`
- **Default:** the automatic excerpt (the body above the first `---` separator)

The summary shown on post cards and in listings, and the page's meta
description.

```yaml
---
description:
  en: A first look at the theme.
  zh-Hans: 主题初识。
---
```

## `date`

- **Type:** a YAML date, an ISO string, or a millisecond timestamp
- **Default:** none — the post sorts last and shows as undated

The publish date. It orders every listing (newest first) and fills the license
card's "Published" row. Unzoned values are read as UTC and formatted in UTC for
the server render, then in the reader's timezone once hydrated.

```yaml
---
date: 2026-07-20
---
```

## `updated` / `lastUpdated`

- **Type:** a YAML date, an ISO string, or a millisecond timestamp
- **Default:** VitePress's git-derived timestamp (requires `lastUpdated: true`
  in the site config)

Explicit last-updated date for the license card's "Updated" row; either spelling
works, and an explicit value wins over the git timestamp. The row is omitted
when neither is available.

```yaml
---
updated: 2026-07-28
---
```

## `tags` / `categories`

- **Type:** `string` or `string[]`
- **Default:** `[]`

Taxonomy terms, authored as plain names — a single string is accepted as a
one-element list. Slugs and `/tags/…`, `/categories/…` URLs derive from these
names, so they never change with the UI language; display labels are localized
site-wide through [`themeConfig.taxonomy`](theme-config.md#taxonomy).

```yaml
---
tags: [theme, color]
categories: Design
---
```

## `cover`

- **Type:** `string` (site-absolute URL, typically under `src/public/`)
- **Default:** none

A cover image. In post-list cards it becomes a full-height panel on the right
that fades into the card (a full-width strip on top at mobile widths); on the
article page the header becomes a hero banner showing the image in full. Covers
are lazy-loaded, and pages without one render exactly as before.

```yaml
---
cover: /images/demo-terminal-1.svg
---
```

## `order`

- **Type:** `number` (any finite value — negatives and fractions included)
- **Default:** `0`

Two uses, both "smaller sorts higher":

- **In the explorer**, it orders a page or folder among its siblings. Ties keep
  the default folders-first-then-name sort, so untouched trees are unchanged. A
  negative value pins an entry above the unnumbered `0` siblings without
  renumbering them.
- **In a series**, it orders the articles on the landing page.

Non-numeric or non-finite values are ignored (treated as `0`).

```yaml
---
order: -1
---
```

A folder takes its `order` from its `explorer.json` (which wins) or its
`index.md` frontmatter.

## `pinned`

- **Type:** `boolean`
- **Default:** `false`

Pins a post to the top of the date-sorted listings: the posts index and its
`/page/<n>` pagination, and the per-tag and per-category listings. Pinned posts
keep their own date order among themselves, and everything below them is
unchanged.

```yaml
---
pinned: true
---
```

The **archives are the deliberate exception** — they stay strictly
chronological and keep their year headings, so a pinned post leads its own year
rather than the whole page. An archive that lied about dates would stop being
an archive.

Pinned posts are marked in listings with a labeled pin indicator. The field
does nothing on pages that are not posts or series articles.

## `showInExplorer`

- **Type:** `boolean`
- **Default:** `true`

`false` hides the page from the explorer tree. It still builds and stays
reachable by URL — this is a navigation filter, not a privacy control. On a
folder's `index.md` it drops just the folder link; to hide the whole subtree,
use the folder's `explorer.json`.

```yaml
---
showInExplorer: false
---
```

## `home`

- **Type:** `boolean`
- **Default:** `false`

Renders the page as the home page — the single welcome card configured by
[`themeConfig.home`](theme-config.md#home).

```yaml
---
home: true
title: home
---
```

## `pageType`

- **Type:** `'home' | 'normal' | 'post' | 'series' | 'listing' | 'notFound'`
- **Default:** resolved from the page's location under `src/`

The escape hatch for the automatic page-type dispatch — set it only when a page
must render as a type its path does not imply. Normal resolution order is:
not-found → this override → `home` → listing paths → [`article: false`](#article)
→ `series/` and `posts/` prefixes → normal. See
[`design/content-architecture.md`](../design/content-architecture.md) §3–4.

```yaml
---
pageType: listing
---
```

## `article`

- **Type:** `boolean`
- **Default:** `true`

`article: false` drops a page under `posts/` or `series/` out of the article
chrome entirely — it renders as a plain normal page (no byline, license card, or
comments).

```yaml
---
article: false
---
```

## `license` / `comments`

- **Type:** `boolean` (`license` also accepts an object)
- **Default:** `true`

Individually drop the end-of-article license card or comment card. `comments`
has no effect when no comment server is configured; the card is absent either
way.

```yaml
---
license: false
comments: false
---
```

### Per-article license

`license` may instead be an object, and the license card then shows that
license in place of
[`themeConfig.license`](theme-config.md#license) — for a translation, a repost,
or any article carried under terms that are not the site's own.

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `name` | `LocalizableText` | — | Required; without it the site license is used |
| `url` | `string` | none | Deed / full-text link; without it the name is plain text |
| `icons` | `string[]` | `[]` | Font Awesome class lists, e.g. `fa-brands fa-creative-commons` |

```yaml
---
license:
  name: CC BY-SA 4.0
  url: https://creativecommons.org/licenses/by-sa/4.0/
  icons:
    - fa-brands fa-creative-commons
    - fa-brands fa-creative-commons-by
    - fa-brands fa-creative-commons-sa
---
```

The object **replaces the site license as a whole** — it inherits neither the
default deed URL nor the default icons, the same rule
[`themeConfig.license`](theme-config.md#license) follows for a custom name. That
is deliberate: an article published under someone else's terms must not keep
the site's license branding by accident.

---

## `explorer.json` — folder metadata

An optional file placed **beside a folder's Markdown children** configures that
folder in the auto-discovered explorer, without requiring an `index.md` and
without touching the site config.

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `LocalizableText` | folder name, or the index page's title | Folder label |
| `showInExplorer` | `boolean` | `true` | `false` hides the folder **and everything below it** |
| `order` | `number` | `0` | Sibling order; wins over the `index.md` frontmatter `order` |

```json
{
  "title": { "en": "Advanced", "zh-Hans": "进阶" },
  "order": 1,
  "showInExplorer": true
}
```

## `series.yml` — series metadata

One optional file per series folder (`src/series/<slug>/series.yml`). Every
field is optional; the folder name is the series' identity and URL segment
regardless.

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `icon` | `LocalizableText` | none | Font Awesome or Nerd Font `nf-*` class list |
| `title` | `LocalizableText` | the folder name | Shown on the index and article banner |
| `description` | `LocalizableText` | none | Shown on the index and article banner |
| `order` | `number` | `0` | Position on the series index; ties sort alphabetically by slug |

```yaml
icon: nf-fa-terminal
title:
  en: Terminal Internals
  zh-Hans: 终端内幕
description:
  en: A short series on how the theme's shell is built.
order: 0
```

The full rationale for this layout is in
[`design/content-architecture.md`](../design/content-architecture.md) §5.

:::::

::::: lang zh-Hans

# Frontmatter 与源文件本地元数据参考

描述**单个页面或单个文件夹**的选项与内容放在一起，而不写在 `themeConfig` 里——它们
位于页面 frontmatter、相邻的 `explorer.json`，或系列的 `series.yml` 中。下面是主题会
读取的全部内容，附类型、默认值与示例。站点级选项见
[`theme-config.md`](theme-config.md)。

标注为 **`LocalizableText`** 的字段接受普通字符串或分语言映射
（`{ en: "…", "zh-Hans": "…" }`），并按当前界面语言解析。

## 速查表 {#quick-reference-fm-zh}

| 字段 | 类型 | 默认值 | 适用于 |
| --- | --- | --- | --- |
| [`title`](#title-fm-zh) | `LocalizableText` | 文件／URL 的 slug | 任意页面 |
| [`explorerTitle`](#explorertitle-fm-zh) | `LocalizableText` | 同 `title` | 任意页面 |
| [`description`](#description-fm-zh) | `LocalizableText` | 自动摘要 | 文章、系列文章 |
| [`date`](#date-fm-zh) | 日期／字符串／数字 | 无 | 文章、系列文章 |
| [`updated`](#updated-fm-zh) / `lastUpdated` | 日期／字符串／数字 | git 时间戳 | 文章类页面 |
| [`tags`](#tags-fm-zh) | `string \| string[]` | `[]` | 文章、系列文章 |
| [`categories`](#tags-fm-zh) | `string \| string[]` | `[]` | 文章、系列文章 |
| [`cover`](#cover-fm-zh) | `string` | 无 | 文章、系列文章 |
| [`order`](#order-fm-zh) | `number` | `0` | 任意页面、系列文章 |
| [`pinned`](#pinned-fm-zh) | `boolean` | `false` | 文章、系列文章 |
| [`showInExplorer`](#showinexplorer-fm-zh) | `boolean` | `true` | 任意页面 |
| [`home`](#home-fm-zh) | `boolean` | `false` | 任意页面 |
| [`pageType`](#pagetype-fm-zh) | 页面类型字符串 | 由路径推断 | 任意页面 |
| [`article`](#article-fm-zh) | `boolean` | `true` | 文章、系列文章 |
| [`license`](#license-fm-zh) | `boolean \| object` | `true` | 文章类页面 |
| [`comments`](#license-fm-zh) | `boolean` | `true` | 文章类页面 |

---

## `title` {#title-fm-zh}

- **类型：** `LocalizableText`
- **默认值：** 该页面文件／URL 的 slug

页面标题。它驱动文件浏览器标签、浏览器标签页、文章列表卡片、归档行以及许可卡片中的
文章标题——读者切换语言时，这些位置都会就地重新解析映射。

```yaml
---
title:
  en: Hello, Terminal
  zh-Hans: 你好，终端
---
```

> 分语言映射会先解析为**构建语言**用于服务端渲染的 `<head>`，随后在客户端重新解析。
> 这一切已经替你处理好了，无需额外配置。

## `explorerTitle` {#explorertitle-fm-zh}

- **类型：** `LocalizableText`
- **默认值：** 回退到 [`title`](#title-fm-zh)

只覆盖文件浏览器中的行标签，页面自身的标题保持不变——当一个很长的文章标题需要一个
简短的树内标签时很有用。

```yaml
---
title: "状态栏完全指南"
explorerTitle: "状态栏"
---
```

## `description` {#description-fm-zh}

- **类型：** `LocalizableText`
- **默认值：** 自动摘要（正文中第一个 `---` 分隔符之前的部分）

显示在文章卡片与各类列表中的摘要，同时作为页面的 meta description。

```yaml
---
description:
  en: A first look at the theme.
  zh-Hans: 主题初识。
---
```

## `date` {#date-fm-zh}

- **类型：** YAML 日期、ISO 字符串或毫秒时间戳
- **默认值：** 无——该文章排在最后并显示为未标注日期

发布日期。它决定所有列表的排序（由新到旧），并填入许可卡片的「发布」一行。不带时区
的值按 UTC 解读，服务端渲染时也按 UTC 格式化，hydration 之后改用读者所在时区。

```yaml
---
date: 2026-07-20
---
```

## `updated` / `lastUpdated` {#updated-fm-zh}

- **类型：** YAML 日期、ISO 字符串或毫秒时间戳
- **默认值：** VitePress 由 git 推导的时间戳（需要在站点配置中设置
  `lastUpdated: true`）

许可卡片「更新」一行使用的显式最后更新日期；两种写法都可以，且显式值优先于 git 时间
戳。两者都没有时，该行不显示。

```yaml
---
updated: 2026-07-28
---
```

## `tags` / `categories` {#tags-fm-zh}

- **类型：** `string` 或 `string[]`
- **默认值：** `[]`

分类法术语，写原始名称——单个字符串会被当作只有一个元素的数组。slug 与 `/tags/…`、
`/categories/…` 的 URL 都由这些名称派生，因此它们不会随界面语言改变；显示名通过
[`themeConfig.taxonomy`](theme-config.md#taxonomy-zh) 全站本地化。

```yaml
---
tags: [theme, color]
categories: Design
---
```

## `cover` {#cover-fm-zh}

- **类型：** `string`（站点绝对路径，通常放在 `src/public/` 下）
- **默认值：** 无

封面图。在文章列表卡片中，它是右侧的整高面板，按比例裁切并淡入卡片（640 px 以下变为
顶部的整宽横条）；在文章页面上，页头变成一张主视觉横幅，按原始比例完整显示。封面图
会延迟加载，没有封面的页面渲染方式与以前完全相同。

```yaml
---
cover: /images/demo-terminal-1.svg
---
```

## `order` {#order-fm-zh}

- **类型：** `number`（任意有限数值，含负数与小数）
- **默认值：** `0`

有两处用途，规则都是「数值越小越靠前」：

- **在文件浏览器中**，它决定一个页面或文件夹在同级中的顺序。数值相同时沿用默认的
  「文件夹优先、再按名称」排序，因此未做调整的目录树保持原样。负值可以把某项置于
  未编号的 `0` 同级之上，而不必重新编号。
- **在系列中**，它决定系列首页上各篇文章的顺序。

非数值或非有限值会被忽略（按 `0` 处理）。

```yaml
---
order: -1
---
```

文件夹的 `order` 取自它的 `explorer.json`（优先）或 `index.md` 的 frontmatter。

## `pinned` {#pinned-fm-zh}

- **类型：** `boolean`
- **默认值：** `false`

把文章置顶到按日期排序的列表最前面：文章索引页及其 `/page/<n>` 分页，以及各标签、
各分类的列表页。多篇置顶文章之间仍按各自的日期排序，其下的文章顺序完全不变。

```yaml
---
pinned: true
---
```

**归档页是刻意的例外**——它保持严格的时间顺序与年份分组，因此置顶文章只会排在它
所属年份的最前面，而不是整页最前面。一个在日期上撒谎的归档就不再是归档了。

置顶文章会在列表中显示一个带文字标签的图钉标记。该字段对非文章、非系列文章的页面
没有任何作用。

## `showInExplorer` {#showinexplorer-fm-zh}

- **类型：** `boolean`
- **默认值：** `true`

设为 `false` 会把页面从文件浏览器目录树中隐藏。页面仍会被构建、仍可通过 URL 访问
——这是导航过滤，不是访问控制。写在文件夹的 `index.md` 上时只去掉该文件夹的链接；
要隐藏整棵子树，请使用该文件夹的 `explorer.json`。

```yaml
---
showInExplorer: false
---
```

## `home` {#home-fm-zh}

- **类型：** `boolean`
- **默认值：** `false`

把页面渲染为首页——即由 [`themeConfig.home`](theme-config.md#home-zh) 配置的那张
欢迎卡片。

```yaml
---
home: true
title: home
---
```

## `pageType` {#pagetype-fm-zh}

- **类型：** `'home' | 'normal' | 'post' | 'series' | 'listing' | 'notFound'`
- **默认值：** 由页面在 `src/` 中的位置推断

页面类型自动分发机制的应急开关——只有当某个页面必须渲染成其路径无法体现的类型时才
设置它。正常的判定顺序是：404 → 本覆盖项 → `home` → 列表页路径 →
[`article: false`](#article-fm-zh) → `series/` 与 `posts/` 前缀 → 普通页面。详见
[`design/content-architecture.md`](../design/content-architecture.md) §3–4。

```yaml
---
pageType: listing
---
```

## `article` {#article-fm-zh}

- **类型：** `boolean`
- **默认值：** `true`

`article: false` 会让 `posts/` 或 `series/` 下的页面完全退出文章外观——它将作为普通
页面渲染（没有署名行、许可卡片或评论）。

```yaml
---
article: false
---
```

## `license` / `comments` {#license-fm-zh}

- **类型：** `boolean`（`license` 还接受对象）
- **默认值：** `true`

分别用于去掉文末的许可卡片或评论卡片。未配置评论服务器时 `comments` 没有实际影响
——那种情况下卡片本来就不存在。

```yaml
---
license: false
comments: false
---
```

### 单篇文章的许可协议 {#per-article-license-zh}

`license` 也可以写成一个对象，此时许可卡片会用它取代
[`themeConfig.license`](theme-config.md#license-zh) —— 适用于译文、转载，或任何以
非本站条款发布的文章。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `LocalizableText` | —— | 必填；缺失时回退到站点许可协议 |
| `url` | `string` | 无 | 协议原文／条款链接；不填则协议名为纯文本 |
| `icons` | `string[]` | `[]` | Font Awesome 类名，如 `fa-brands fa-creative-commons` |

```yaml
---
license:
  name: CC BY-SA 4.0
  url: https://creativecommons.org/licenses/by-sa/4.0/
  icons:
    - fa-brands fa-creative-commons
    - fa-brands fa-creative-commons-by
    - fa-brands fa-creative-commons-sa
---
```

这个对象会**整体取代**站点许可协议——既不会继承默认的协议链接，也不会继承默认图标，
与 [`themeConfig.license`](theme-config.md#license-zh) 对自定义协议名的规则一致。这是
刻意为之：以他人条款发布的文章绝不应该顺带保留本站的协议标识。

---

## `explorer.json` —— 文件夹元数据 {#explorer-json-zh}

一个可选文件，放在**某个文件夹的 Markdown 子文件旁边**，用于配置该文件夹在自动发现的
文件浏览器中的表现——既不需要 `index.md`，也不必改动站点配置。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `LocalizableText` | 文件夹名，或其索引页的标题 | 文件夹标签 |
| `showInExplorer` | `boolean` | `true` | `false` 会隐藏该文件夹**及其下所有内容** |
| `order` | `number` | `0` | 同级排序；优先于 `index.md` frontmatter 中的 `order` |

```json
{
  "title": { "en": "Advanced", "zh-Hans": "进阶" },
  "order": 1,
  "showInExplorer": true
}
```

## `series.yml` —— 系列元数据 {#series-yml-zh}

每个系列文件夹一个可选文件（`src/series/<slug>/series.yml`）。所有字段都可选；无论
如何，文件夹名都是该系列的身份与 URL 片段。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `icon` | `LocalizableText` | 无 | Font Awesome 或 Nerd Font 的 `nf-*` 类名 |
| `title` | `LocalizableText` | 文件夹名 | 显示在系列索引与文章横幅上 |
| `description` | `LocalizableText` | 无 | 显示在系列索引与文章横幅上 |
| `order` | `number` | `0` | 在系列索引上的位置；相同时按 slug 字母序 |

```yaml
icon: nf-fa-terminal
title:
  en: Terminal Internals
  zh-Hans: 终端内幕
description:
  en: A short series on how the theme's shell is built.
order: 0
```

这套布局的完整理由见
[`design/content-architecture.md`](../design/content-architecture.md) §5。

:::::
