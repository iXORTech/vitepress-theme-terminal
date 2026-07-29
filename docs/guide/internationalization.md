---
title:
  en: "Internationalization"
  zh-Hans: "国际化"
order: 5
---
::::: lang en

# Internationalization

The theme is multilingual without multiplying your URLs. The UI language is a
**client-side preference**, not a path segment: there is no `/en/`, no `/zh/`,
and switching language never navigates. One page has one URL in every language.

The design rationale is in
[`design/design-language.md`](../design/design-language.md) §9; this page is how
to use it.

## How a language is chosen

1. The site's `lang` (in `.vitepress/config.mts`) is the default and the
   language everything is server-rendered in.
2. A reader who switches language in the status bar or settings window has that
   choice stored (`ct-lang`) and applied on every later visit.
3. Switching updates the theme strings, localized config text, localized
   frontmatter, and per-language page bodies **in place**, along with
   `<html lang>`.

Built-in string tables ship for **English (`en`)** and **Simplified Chinese
(`zh-Hans`)**.

## Language tags

Use the **minimal canonical BCP 47 tag**: a language subtag, plus a script
subtag only where the script disambiguates. So `en`, not `en-US`; `zh-Hans`, not
`zh-CN`.

Region-tagged input still resolves: a site `lang` of `en-US` or a frontmatter
key of `zh-CN` matches by primary subtag. Canonical tags are what you should
*write*, not a constraint on what is accepted.

## Localizable text

Every user-facing text value in the configuration surface — and the displayed
frontmatter fields — accepts either form:

```ts
title: "VitePress Theme Terminal"                                    // all languages
title: { en: "VitePress Theme Terminal", "zh-Hans": "VitePress 终端主题" }
```

Maps resolve with one fallback chain everywhere:

**exact tag → primary subtag → `en` → first entry.**

So a `{ en, zh-Hans }` map serves a `zh-CN` reader Chinese, a `fr` reader
English, and a reader of any language something rather than nothing.

This applies to `themeConfig.title`, `.description`, author name, nav and action
labels, explorer labels, taxonomy labels, friend-group labels, home page copy —
and to the frontmatter `title`, `explorerTitle`, and `description`, plus
`explorer.json` and `series.yml` titles.

```yaml
---
title:
  en: Hello, Terminal
  zh-Hans: 你好，终端
description:
  en: A first look at the theme.
  zh-Hans: 主题初识。
---
```

Explorer labels, listing cards, the archives, the license card, and the browser
tab all re-resolve these in place when the reader switches.

## Per-language page bodies

For content, not just labels, wrap each language's body in a `::: lang` block:

```md
::: lang en
English body…
:::

::: lang zh-Hans
中文正文…
:::
```

- Content **outside** any block always shows — share code samples, images, and
  headings instead of duplicating them.
- Adjacent blocks form one group; exactly one is shown per group, chosen by the
  same fallback chain (exact → primary subtag → site default → first block).
- The site-default block is server-rendered visible, so there is no flash and
  the page still reads correctly with JavaScript off.

> **Marker length matters.** The closing marker is matched line by line —
> **including inside fenced code blocks**, which the container scanner does not
> skip. So if a language block contains a code sample whose lines start with
> colons (a callout, a swiper deck, another `::: lang` example), the wrapper
> needs *more* colons than any of them; otherwise the first such sample line
> closes the block early and the rest of the body escapes it, showing in every
> language. These documentation pages wrap their bodies in `::::: lang en` /
> `::::: lang zh-Hans` for exactly that reason.

## Taxonomy labels

Tags and categories are shared across posts, so their display labels live in the
site config rather than in any one post's frontmatter. Posts keep declaring
plain names:

```ts
taxonomy: {
  tags: { theme: { en: "theme", "zh-Hans": "主题" } },
  categories: { Guides: { en: "Guides", "zh-Hans": "指南" } },
},
```

Only the *label* switches. Slugs, `/tags/…` and `/categories/…` URLs, and
grouping identity always come from the authored name, so a link shared in one
language works in every other. Terms without an entry render verbatim.

## Overriding theme strings

The theme's own UI strings (`Copy`, `On this page`, `Search the site…`, callout
titles, …) resolve through the locale layer. Override any of them per language:

```ts
localeStrings: {
  "zh-Hans": { "mode.paper": "阅读" },
},
```

The full key list is the English table,
[`.vitepress/theme/locales/en.ts`](../../.vitepress/theme/locales/en.ts) — keys
are dotted and grouped by surface (`mode.*`, `nav.*`, `explorer.*`, `search.*`,
`settings.*`, `status.*`, `footer.*`, `license.*`, `comments.*`, `post.*`,
`series.*`, `friends.*`, `callout.*`, `toc.*`, `anchor.*`, `code.*`,
`swiper.*`, `notFound.*`).

Some strings carry `{placeholders}` — `footer.copyright` has `{year}` and
`{author}`, `anchor.permalink` has `{title}`, `post.taggedWith` has `{term}`.
Keep them in your override.

## Adding a language

Add a table under a new tag in the same option — no component edits, no new
files:

```ts
localeStrings: {
  fr: {
    "lang.label": "Français",     // how it appears in the switcher
    "mode.dark": "Sombre",
    "toc.title": "Sur cette page",
    // …
  },
},
```

Any tag you add appears in the language switcher automatically. Two details:

- **`lang.label` is the switcher entry.** Without it the raw tag is shown.
- **English backfills.** Missing keys fall back to English rather than
  disappearing, so a partial table is usable from the first key — you can
  translate incrementally.

If you'd rather ship a complete built-in table, add a file beside
`locales/en.ts` and register it in `locales/index.ts`; the registry is the only
place that needs to know.

## Server rendering

The server-rendered HTML is always in the site's `lang`. That covers meta tags,
the initial paint, and search engines; the client then applies the reader's
preference. Two consequences worth knowing:

- A per-language frontmatter `description` is resolved to the build language for
  the `<meta>` tag, then re-resolved client-side.
- Build-time Markdown output (callout default titles) is generated in the build
  language and re-localized after hydration.

Neither needs configuration — but it's why the site `lang` should be the
language most of your readers arrive in.

:::::

::::: lang zh-Hans

# 国际化

本主题支持多语言，却不会让 URL 成倍增加。界面语言是一项**客户端偏好**，而不是路径
片段：没有 `/en/`，没有 `/zh/`，切换语言也从不跳转页面。同一个页面在任何语言下都
只有一个 URL。

设计层面的理由见
[`design/design-language.md`](../design/design-language.md) §9；本页讲怎么用。

## 语言是如何确定的

1. 站点的 `lang`（在 `.vitepress/config.mts` 中）既是默认语言，也是所有内容服务端
   渲染时使用的语言。
2. 读者在状态栏或设置窗口中切换语言后，选择会被保存（`ct-lang`），并在之后每次访问
   时应用。
3. 切换会**就地**更新界面字符串、配置中的可本地化文本、本地化的 frontmatter 与
   分语言的页面正文，同时更新 `<html lang>`。

主题内置了 **英语（`en`）** 与 **简体中文（`zh-Hans`）** 两套字符串表。

## 语言标签

请使用**最简规范的 BCP 47 标签**：语言子标签，仅在文字系统需要区分时加上文字子标签。
所以写 `en` 而不是 `en-US`，写 `zh-Hans` 而不是 `zh-CN`。

带地区的输入依然可以解析：站点 `lang` 写成 `en-US`、frontmatter 的键写成 `zh-CN`，
都会按主语言子标签匹配上。规范标签是*书写*时的建议，而不是对可接受输入的限制。

## 可本地化文本

配置界面中每一个面向用户的文本值——以及会显示出来的 frontmatter 字段——两种写法
都接受：

```ts
title: "VitePress Theme Terminal"                                    // 所有语言通用
title: { en: "VitePress Theme Terminal", "zh-Hans": "VitePress 终端主题" }
```

映射在任何地方都按同一条回退链解析：

**精确标签 → 主语言子标签 → `en` → 第一个条目。**

因此一个 `{ en, zh-Hans }` 映射会让 `zh-CN` 读者看到中文，让 `fr` 读者看到英文，也
让任何语言的读者至少看到点什么，而不是一片空白。

这适用于 `themeConfig.title`、`.description`、作者名、导航与操作图标的标签、文件
浏览器标签、分类法标签、友链分组标签、首页文案——也适用于 frontmatter 的 `title`、
`explorerTitle`、`description`，以及 `explorer.json` 和 `series.yml` 中的标题。

```yaml
---
title:
  en: Hello, Terminal
  zh-Hans: 你好，终端
description:
  en: A first look at the theme.
  zh-Hans: 主题初识。
---
```

读者切换语言时，文件浏览器标签、列表卡片、归档、许可卡片与浏览器标签页标题都会就地
重新解析这些映射。

## 分语言的页面正文

如果需要切换的是内容而不只是标签，请把每种语言的正文包进 `::: lang` 块：

```md
::: lang en
English body…
:::

::: lang zh-Hans
中文正文……
:::
```

- 位于任何块**之外**的内容始终显示——共用的代码示例、图片与标题不必重复书写。
- 相邻的块构成一组；每组只显示其中一个，由同一条回退链选择（精确标签 → 主语言
  子标签 → 站点默认 → 第一个块）。
- 站点默认语言的块在服务端渲染时即为可见状态，因此不会闪烁，关闭 JavaScript 时页面
  也依然可读。

> **标记长度很重要。** 结束标记是逐行匹配的——**包括围栏代码块内部的行**，容器扫描
> 并不会跳过它们。因此，如果某个语言块中包含以冒号开头的代码示例（提示框、swiper
> 卡片组，或另一个 `::: lang` 示例），外层包裹就需要比它们*更多*的冒号；否则第一个
> 这样的示例行就会提前结束该块，正文的其余部分会「逃」出块外，在所有语言下都显示。
> 本文档的各个页面正是出于这个原因使用 `::::: lang en` / `::::: lang zh-Hans`
> 包裹正文。

## 分类法标签

标签与分类是跨文章共享的，因此它们的显示名放在站点配置里，而不是某一篇文章的
frontmatter 中。文章仍然只声明原始名称：

```ts
taxonomy: {
  tags: { theme: { en: "theme", "zh-Hans": "主题" } },
  categories: { Guides: { en: "Guides", "zh-Hans": "指南" } },
},
```

切换的只是*显示名*。slug、`/tags/…` 与 `/categories/…` 的 URL 以及分组身份始终来自
所写的名称，因此用一种语言分享出去的链接在其他语言下同样有效。没有条目的术语按原样
显示。

## 覆盖主题自带的字符串

主题自己的界面文字（`Copy`、`On this page`、`Search the site…`、提示框标题等）都
经由本地化层解析。你可以按语言覆盖其中任意一条：

```ts
localeStrings: {
  "zh-Hans": { "mode.paper": "阅读" },
},
```

完整的键列表就是英文字符串表
[`.vitepress/theme/locales/en.ts`](../../.vitepress/theme/locales/en.ts) ——键名
以点分隔并按界面区域分组（`mode.*`、`nav.*`、`explorer.*`、`search.*`、
`settings.*`、`status.*`、`footer.*`、`license.*`、`comments.*`、`post.*`、
`series.*`、`friends.*`、`callout.*`、`toc.*`、`anchor.*`、`code.*`、`swiper.*`、
`notFound.*`）。

有些字符串带有 `{占位符}` —— `footer.copyright` 有 `{year}` 与 `{author}`，
`anchor.permalink` 有 `{title}`，`post.taggedWith` 有 `{term}`。覆盖时请保留它们。

## 新增一种语言

在同一个选项下，以新的标签为键添加一张表即可——不用改组件，也不用新增文件：

```ts
localeStrings: {
  fr: {
    "lang.label": "Français",     // 它在切换器中的显示名
    "mode.dark": "Sombre",
    "toc.title": "Sur cette page",
    // …
  },
},
```

你添加的任何标签都会自动出现在语言切换器中。有两点细节：

- **`lang.label` 就是切换器中的条目名。** 不写它就会直接显示原始标签。
- **英文会兜底。** 缺失的键会回退到英文而不是消失，所以从第一个键开始这张表就可用
  ——你可以逐步翻译。

如果你更想提供一整张内置字符串表，可以在 `locales/en.ts` 旁新增一个文件并在
`locales/index.ts` 中注册；注册表是唯一需要知道它的地方。

## 服务端渲染

服务端渲染出的 HTML 始终使用站点的 `lang`。这覆盖了 meta 标签、首屏绘制与搜索引擎；
随后客户端再应用读者的偏好。有两点值得知道：

- 分语言的 frontmatter `description` 会先按构建语言解析用于 `<meta>` 标签，之后在
  客户端重新解析。
- 构建期产生的 Markdown 输出（提示框的默认标题）以构建语言生成，并在 hydration 之后
  重新本地化。

两者都不需要配置——但这正是站点 `lang` 应当设为大多数读者到访时所用语言的原因。

:::::
