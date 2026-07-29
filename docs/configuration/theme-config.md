---
title:
  en: "themeConfig Reference"
  zh-Hans: "themeConfig 参考"
order: 1
---
::::: lang en

# `themeConfig` Reference

Every user-facing option of **VitePress Theme Terminal**, with its type, default,
and an example. This is the complete configuration surface: with very few
documented exceptions (listed at the end), nothing the theme lets you configure
lives anywhere else.

The schema itself is `TerminalThemeConfig` in
[`.vitepress/theme/config.ts`](../../.vitepress/theme/config.ts); the defaults
below are the `themeConfigDefaults` object in the same file. Every option is
optional — an unset option falls back to its default.

```ts
// .vitepress/config.mts
import { defineConfigWithTheme } from "vitepress";
import type { TerminalThemeConfig } from "./theme/config";

export const themeConfig: TerminalThemeConfig = {
  mainColor: "#80E0A7",
  // …
};

export default defineConfigWithTheme<TerminalThemeConfig>({
  themeConfig,
  // …
});
```

Export the object (rather than inlining it) — the build-time dynamic-route
loaders under `src/` import it to apply the same [`series`](#series) toggles the
components use.

## Localizable text

Any option documented as **`LocalizableText`** accepts either a plain string
(used for every language) or a per-language map keyed by BCP 47 tag:

```ts
title: "VitePress Theme Terminal"
title: { en: "VitePress Theme Terminal", "zh-Hans": "VitePress 终端主题" }
```

A map is resolved against the active UI language: exact tag → primary subtag
(`zh-CN` matches a `zh` entry) → `en` → first entry. See
[`guide/internationalization.md`](../guide/internationalization.md).

## Quick reference

| Option | Type | Default |
| --- | --- | --- |
| [`mainColor`](#maincolor) | `string` | `'#80E0A7'` |
| [`title`](#title) | `LocalizableText` | `''` (site config `title`) |
| [`description`](#description) | `LocalizableText` | `''` (site config `description`) |
| [`siteName`](#sitename) | `string` | `''` (normalized site title) |
| [`localeStrings`](#localestrings) | `Record<string, Partial<ThemeLocaleStrings>>` | `{}` |
| [`author`](#author) | `TerminalAuthorConfig` | `{ name: 'Admin', username: 'admin' }` |
| [`license`](#license) | `TerminalLicenseConfig` | CC BY-NC-SA 4.0 (see below) |
| [`toolbar`](#toolbar) | `TerminalToolbarConfig` | `{ nav: [], actions: [] }` |
| [`explorer`](#explorer) | `TerminalExplorerItem[] \| 'auto'` | `[]` (no explorer) |
| [`toc`](#toc) | `TerminalTocConfig` | `{ enabled: true, minLevel: 2, maxLevel: 3, minHeadings: 2 }` |
| [`footer`](#footer) | `TerminalFooterConfig` | `{ rss: '', social: [] }` |
| [`taxonomy`](#taxonomy) | `TerminalTaxonomyConfig` | `{ tags: {}, categories: {} }` |
| [`series`](#series) | `TerminalSeriesConfig` | all four toggles `false` |
| [`home`](#home) | `TerminalHomeConfig` | `{}` |
| [`friends`](#friends) | `TerminalFriendsConfig` | `{ showCount: true, showRandom: true, groups: {} }` |
| [`search`](#search) | `TerminalSearchConfig` | `{ provider: 'algolia', algolia: null }` |
| [`comments`](#comments) | `TerminalCommentsConfig` | `{ provider: 'waline', waline: null }` |

---

## `mainColor`

- **Type:** `string` (any CSS color; hex is conventional)
- **Default:** `'#80E0A7'`

The single configurable color of the theme. Every auxiliary tone — hover,
dimmed text, subtle backgrounds, borders, selection — is **derived** from it in
SCSS and is never configured separately (that rule is binding:
[`design/color-system.md`](../design/color-system.md) §2–3). The value is
written into `<head>` at build time as the `--ct-main` custom property, so
there is no flash of the default color.

```ts
mainColor: "#80E0A7",
```

## `title`

- **Type:** `LocalizableText`
- **Default:** `''` — falls back to the site config's `title`

The site title as shown in theme chrome and the browser tab. The site config's
`title` stays the server-rendered default; a per-language map here is applied
client-side when the UI language changes.

```ts
title: { en: "VitePress Theme Terminal", "zh-Hans": "VitePress 终端主题" },
```

## `description`

- **Type:** `LocalizableText`
- **Default:** `''` — falls back to the site config's `description`

Same rules as [`title`](#title); drives the home page tagline fallback and the
`meta[name=description]` tag on language switches.

```ts
description: {
  en: "A TUI-inspired VitePress Theme for Blog and Personal Website",
  "zh-Hans": "一个受 TUI 界面风格启发的 VitePress 博客与个人网站主题",
},
```

## `siteName`

- **Type:** `string`
- **Default:** `''` — the active site title, normalized automatically

The shell-safe host segment in card prompt decorations (`user@host:~$ …`). The
value is trimmed; blank or unset means "derive from the site title". It is
normalized like any prompt identifier: diacritics stripped, lowercased,
whitespace → `-`, anything outside `a-z 0-9 . _ -` dropped.

```ts
siteName: "vitepress-theme-terminal",
```

## `localeStrings`

- **Type:** `Record<string, Partial<ThemeLocaleStrings>>` — BCP 47 tag → partial
  string table
- **Default:** `{}`

Per-language overrides of the theme's own UI strings, applied on top of the
built-in tables (`en`, `zh-Hans`). A **complete** table under a new tag adds a
whole language to the switcher. The UI language is a client-side preference —
there are no `/<lang>/` URL trees.

```ts
localeStrings: {
  "zh-Hans": { "mode.paper": "阅读" },
  fr: { "lang.label": "Français", "mode.dark": "Sombre", /* … */ },
},
```

See [`guide/internationalization.md`](../guide/internationalization.md) for the
key list and what a complete table requires.

## `author`

- **Type:** `TerminalAuthorConfig`
- **Default:** `{ name: 'Admin', username: 'admin' }`

| Field | Type | Default |
| --- | --- | --- |
| `name` | `LocalizableText` | `'Admin'` |
| `username` | `string` | derived from `name` (`'user'` if nothing usable) |

The single source for the footer copyright, shell-prompt decorations, author
displays, and the license card. `username` is the shell-safe prompt identifier;
when unset it is derived from `name` with the normalization described under
[`siteName`](#sitename).

```ts
author: { name: "Ada Lovelace", username: "ada" },
```

## `license`

- **Type:** `TerminalLicenseConfig`
- **Default:**

  ```ts
  {
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    icons: [
      "fa-brands fa-creative-commons",
      "fa-brands fa-creative-commons-by",
      "fa-brands fa-creative-commons-nc",
      "fa-brands fa-creative-commons-sa",
    ],
  }
  ```

| Field | Type | Default |
| --- | --- | --- |
| `name` | `string` | `'CC BY-NC-SA 4.0'` |
| `url` | `string` | the CC deed URL **only while `name` is the default** |
| `icons` | `string[]` (Font Awesome class lists) | the four CC brand icons, same condition |

The content license, shown by the footer license cluster and the end-of-article
license card. **A custom `name` replaces the default as a whole:** the CC `url`
and `icons` are not inherited, so supply your own (an unset field then means
"none").

```ts
license: { name: "MIT", url: "https://opensource.org/license/mit/" },
```

This is the site-wide license. A single article can carry a different one — a
translation or a repost under someone else's terms — with a
[`license` object in its frontmatter](frontmatter.md#per-article-license),
which follows the same "replaces the default as a whole" rule.

## `toolbar`

- **Type:** `TerminalToolbarConfig`
- **Default:** `{ nav: [], actions: [] }`

The built-in `~/home` tab and the search / color-mode controls always render;
these entries add to them.

### `toolbar.nav`

- **Type:** `TerminalNavItem[]`
- **Default:** `[]`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `text` | `LocalizableText` | yes | Tab label |
| `link` | `string` | yes | Site-absolute path or external URL (opens in a new tab) |
| `icon` | `string` | no | Font Awesome class list, rendered before the label (decorative) |
| `items` | `TerminalNavChild[]` | no | Child links shown in a hover dropdown |

A `TerminalNavChild` is `{ text: LocalizableText, link: string, icon?: string }`
— pure links, one level only. A tab with `items` still needs its own `link`, and
highlights when either it or one of its children matches the current page.

### `toolbar.actions`

- **Type:** `TerminalToolbarAction[]`
- **Default:** `[]`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `icon` | `string` | yes | Font Awesome class list |
| `link` | `string` | yes | Site-absolute path or external URL |
| `label` | `LocalizableText` | no | Accessible name / tooltip; falls back to the URL |

Extra icon slots rendered **before** the built-in search and color-mode
controls — the extension point for important social links or external tools.

```ts
toolbar: {
  nav: [
    {
      text: { en: "Guide", "zh-Hans": "指南" },
      link: "/guide/",
      icon: "fa-solid fa-book",
      items: [
        {
          text: { en: "Getting Started", "zh-Hans": "快速开始" },
          link: "/guide/getting-started",
          icon: "fa-solid fa-rocket",
        },
      ],
    },
    { text: "Archives", link: "/archives", icon: "fa-solid fa-box-archive" },
  ],
  actions: [
    {
      icon: "fa-brands fa-github",
      link: "https://github.com/iXORTech/vitepress-theme-terminal",
      label: "GitHub",
    },
  ],
},
```

When the bar cannot show the title, tabs, and icons in full, the nav and *all*
action icons move into the `[⋮]` overflow drawer automatically — no
configuration needed.

## `explorer`

- **Type:** `TerminalExplorerItem[] | 'auto'`
- **Default:** `[]` — no explorer, and no tool-bar toggle

`'auto'` discovers every Markdown page below `src/`: directories become folders,
each `index.md` becomes its folder's link, labels come from frontmatter. An
explicit array is a hand-authored tree instead:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `text` | `LocalizableText` | yes | Row label |
| `link` | `string` | no | Site-absolute path or external URL; on a folder node this is its index page |
| `items` | `TerminalExplorerItem[]` | no | Child nodes — their presence makes the node a folder |

```ts
explorer: "auto",
```

```ts
explorer: [
  { text: { en: "Guide", "zh-Hans": "指南" }, link: "/guide/", items: [
    { text: "Getting Started", link: "/guide/getting-started" },
  ] },
],
```

Per-page and per-folder explorer metadata (labels, ordering, visibility) is
authored **beside the source pages**, not here — see
[`frontmatter.md`](frontmatter.md) and
[`guide/navigation.md`](../guide/navigation.md).

## `toc`

- **Type:** `TerminalTocConfig`
- **Default:** `{ enabled: true, minLevel: 2, maxLevel: 3, minHeadings: 2 }`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Master switch for the "on this page" panel |
| `minLevel` | `number` | `2` | Shallowest heading level, clamped to 1–6 |
| `maxLevel` | `number` | `3` | Deepest heading level, clamped to 1–6 |
| `minHeadings` | `number` | `2` | Headings required (within range) before the panel shows; rounded, minimum 1 |

A reversed `minLevel`/`maxLevel` pair is swapped rather than treated as empty.
The panel renders only on article pages, never in paper mode or print, and is
hidden below 1024 px.

```ts
toc: { enabled: true, minLevel: 2, maxLevel: 4, minHeadings: 3 },
```

## `footer`

- **Type:** `TerminalFooterConfig`
- **Default:** `{ rss: '', social: [] }`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `rss` | `string` | `''` | Feed URL; the RSS icon renders **only** when set |
| `social` | `TerminalSocialLink[]` | `[]` | Icons at the right of the copyright row |

A `TerminalSocialLink` is `{ icon: string, link: string, label?: LocalizableText }`
— `icon` is a Font Awesome class list, `label` is the accessible name and falls
back to the URL.

The copyright author and the license icons are **not** configured here; they
come from [`author`](#author) and [`license`](#license).

```ts
footer: {
  rss: "/feed.rss",
  social: [
    { icon: "fa-brands fa-github", link: "https://github.com/…", label: "GitHub" },
  ],
},
```

## `taxonomy`

- **Type:** `TerminalTaxonomyConfig`
- **Default:** `{ tags: {}, categories: {} }`

| Field | Type | Default |
| --- | --- | --- |
| `tags` | `Record<string, LocalizableText>` | `{}` |
| `categories` | `Record<string, LocalizableText>` | `{}` |

Display labels for taxonomy terms, keyed by the term name as authored in post
frontmatter (matched case-insensitively through its slug, so `Guides` and
`guides` share one entry). **Display-only:** slugs, `/tags/…` and
`/categories/…` URLs, and grouping identity always come from the authored name,
so routes never change with the language. A term without an entry renders
verbatim.

```ts
taxonomy: {
  tags: { theme: { en: "theme", "zh-Hans": "主题" } },
  categories: { Guides: { en: "Guides", "zh-Hans": "指南" } },
},
```

## `series`

- **Type:** `TerminalSeriesConfig`
- **Default:** every toggle `false`

| Field | Type | Default | Includes series articles in |
| --- | --- | --- | --- |
| `inPosts` | `boolean` | `false` | the post index and its pagination |
| `inArchives` | `boolean` | `false` | the archives timeline |
| `inCategories` | `boolean` | `false` | the category index and per-category pages |
| `inTags` | `boolean` | `false` | the tag index and per-tag pages |

Series articles always render on their own pages, on the series index, and in
their series' landing list; these toggles decide whether they *also* join the
general listings. An admitted article shows its series name before the title
(`Terminal Internals › Part 1`).

```ts
series: { inArchives: true, inCategories: true, inTags: true },
```

## `home`

- **Type:** `TerminalHomeConfig`
- **Default:** `{}` — the welcome card falls back to the site title/description

| Field | Type | Default |
| --- | --- | --- |
| `command` | `string` | `'whoami'` |
| `greeting` | `LocalizableText` | the localized site title |
| `tagline` | `LocalizableText` | the localized site description |
| `body` | `LocalizableText` | none (paragraph omitted) |
| `links` | `TerminalPageLink[]` | `[]` |

A `TerminalPageLink` is `{ text: LocalizableText, link: string, icon?: string }`
— rendered as call-to-action buttons; `icon` accepts a Font Awesome or Nerd Font
class list.

```ts
home: {
  command: "whoami",
  greeting: { en: "Hi, I'm the Terminal theme", "zh-Hans": "你好，我是终端主题" },
  links: [{ text: "Read the guide", link: "/guide/", icon: "fa-solid fa-book" }],
},
```

The Projects and About pages are **authored Vue views**, not configuration — see
[`guide/customization.md`](../guide/customization.md).

## `friends`

- **Type:** `TerminalFriendsConfig`
- **Default:** `{ showCount: true, showRandom: true, groups: {} }`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `showCount` | `boolean` | `true` | Per-group entry count in group headers |
| `showRandom` | `boolean` | `true` | The `[⇄ random]` control above the groups |
| `groups` | `Record<string, { name?: LocalizableText, desc?: LocalizableText }>` | `{}` | Display-label overrides keyed by group id |

The friend-link **data** is deliberately not configured here — it lives in
`linksData.mjs` modules under `.vitepress/theme/assets/`
([`design/friend-links.md`](../design/friend-links.md)). This block only holds
display options; `groups` localizes generated plain-string labels.

```ts
friends: {
  groups: {
    group2: {
      name: { en: "Group 2", "zh-Hans": "第二组" },
      desc: { en: "Localized via themeConfig.friends.groups.", "zh-Hans": "通过配置本地化。" },
    },
  },
},
```

## `search`

- **Type:** `TerminalSearchConfig`
- **Default:** `{ provider: 'algolia', algolia: null }`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `provider` | `'algolia'` | `'algolia'` | Reserved for future back-ends |
| `algolia` | `{ appId, apiKey, indexName }` | `null` | All three strings required |

The find palette (tool-bar magnifier or `/`) queries the index directly from the
browser and renders results in its own TUI window — the theme does not use
DocSearch's modal. **Use the search-only (public) API key, never an admin key.**
An incomplete credential set counts as unconfigured: the palette still opens and
shows a "not configured" notice.

```ts
search: {
  algolia: {
    appId: "YOUR_APP_ID",
    apiKey: "YOUR_SEARCH_ONLY_API_KEY",
    indexName: "YOUR_INDEX",
  },
},
```

## `comments`

- **Type:** `TerminalCommentsConfig`
- **Default:** `{ provider: 'waline', waline: null }`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `provider` | `'waline'` | `'waline'` | Reserved for future back-ends |
| `waline` | `{ serverURL: string }` | `null` | URL of your deployed Waline server |

With a server URL set, every article ends with a comment card and shows
view/comment counts near its title. A blank or absent URL counts as
unconfigured — neither the card nor the counts render. A page opts out with
`comments: false` in its frontmatter.

```ts
comments: { waline: { serverURL: "https://waline.example.com" } },
```

---

## What is configured elsewhere (and why)

The rule is that user-facing options live in `themeConfig`. Three surfaces are
documented exceptions, each because the data belongs *with the content*:

| Surface | Where it lives | Why |
| --- | --- | --- |
| Per-page metadata — titles, ordering, explorer visibility, taxonomy, covers | page frontmatter and adjacent `explorer.json` files ([`frontmatter.md`](frontmatter.md)) | It describes one page and must travel with it |
| Series metadata — icon, title, description, order | `src/series/<slug>/series.yml` ([`design/content-architecture.md`](../design/content-architecture.md) §5) | It describes one content folder |
| Friend-link data | `.vitepress/theme/assets/**/linksData.mjs` ([`design/friend-links.md`](../design/friend-links.md)) | It is generated/synced from an external repository |

Site-level VitePress options (`title`, `description`, `lang`, `cleanUrls`,
`lastUpdated`, …) remain plain VitePress configuration; see
[`clean-urls.md`](clean-urls.md) for the one whose behavior the theme depends on.

:::::

::::: lang zh-Hans

# `themeConfig` 参考

**VitePress Theme Terminal** 面向用户的全部选项，附类型、默认值与示例。这就是完整的
配置界面：除了文末列出的少数几处有据可查的例外，主题允许你配置的一切都不在别处。

结构定义本身是
[`.vitepress/theme/config.ts`](../../.vitepress/theme/config.ts) 中的
`TerminalThemeConfig`；下面的默认值就是同一文件中的 `themeConfigDefaults` 对象。
每个选项都是可选的——未设置的选项会回退到它的默认值。

```ts
// .vitepress/config.mts
import { defineConfigWithTheme } from "vitepress";
import type { TerminalThemeConfig } from "./theme/config";

export const themeConfig: TerminalThemeConfig = {
  mainColor: "#80E0A7",
  // …
};

export default defineConfigWithTheme<TerminalThemeConfig>({
  themeConfig,
  // …
});
```

请把这个对象导出（而不是内联写在配置里）——`src/` 下构建期的动态路由加载器会导入
它，以套用与组件相同的 [`series`](#series-zh) 开关。

## 可本地化文本 {#localizable-text-zh}

任何标注为 **`LocalizableText`** 的选项都接受两种写法：普通字符串（所有语言通用），
或以 BCP 47 标签为键的分语言映射：

```ts
title: "VitePress Theme Terminal"
title: { en: "VitePress Theme Terminal", "zh-Hans": "VitePress 终端主题" }
```

映射会按当前界面语言解析：精确标签 → 主语言子标签（`zh-CN` 匹配到 `zh` 条目）→
`en` → 第一个条目。详见
[`guide/internationalization.md`](../guide/internationalization.md)。

## 速查表 {#quick-reference-zh}

| 选项 | 类型 | 默认值 |
| --- | --- | --- |
| [`mainColor`](#maincolor-zh) | `string` | `'#80E0A7'` |
| [`title`](#title-zh) | `LocalizableText` | `''`（取站点配置的 `title`） |
| [`description`](#description-zh) | `LocalizableText` | `''`（取站点配置的 `description`） |
| [`siteName`](#sitename-zh) | `string` | `''`（规范化后的站点标题） |
| [`localeStrings`](#localestrings-zh) | `Record<string, Partial<ThemeLocaleStrings>>` | `{}` |
| [`author`](#author-zh) | `TerminalAuthorConfig` | `{ name: 'Admin', username: 'admin' }` |
| [`license`](#license-zh) | `TerminalLicenseConfig` | CC BY-NC-SA 4.0（见下） |
| [`toolbar`](#toolbar-zh) | `TerminalToolbarConfig` | `{ nav: [], actions: [] }` |
| [`explorer`](#explorer-zh) | `TerminalExplorerItem[] \| 'auto'` | `[]`（不显示文件浏览器） |
| [`toc`](#toc-zh) | `TerminalTocConfig` | `{ enabled: true, minLevel: 2, maxLevel: 3, minHeadings: 2 }` |
| [`footer`](#footer-zh) | `TerminalFooterConfig` | `{ rss: '', social: [] }` |
| [`taxonomy`](#taxonomy-zh) | `TerminalTaxonomyConfig` | `{ tags: {}, categories: {} }` |
| [`series`](#series-zh) | `TerminalSeriesConfig` | 四个开关均为 `false` |
| [`home`](#home-zh) | `TerminalHomeConfig` | `{}` |
| [`friends`](#friends-zh) | `TerminalFriendsConfig` | `{ showCount: true, showRandom: true, groups: {} }` |
| [`search`](#search-zh) | `TerminalSearchConfig` | `{ provider: 'algolia', algolia: null }` |
| [`comments`](#comments-zh) | `TerminalCommentsConfig` | `{ provider: 'waline', waline: null }` |

---

## `mainColor` {#maincolor-zh}

- **类型：** `string`（任意 CSS 颜色；惯例上写十六进制）
- **默认值：** `'#80E0A7'`

主题唯一可配置的颜色。所有辅助色调——悬停、暗淡文字、微弱背景、边框、选区——都在
SCSS 中由它**派生**，绝不单独配置（这是具有约束力的规则：
[`design/color-system.md`](../design/color-system.md) §2–3）。该值会在构建时写入
`<head>`，作为 `--ct-main` 自定义属性，因此不会先闪出默认颜色。

```ts
mainColor: "#80E0A7",
```

## `title` {#title-zh}

- **类型：** `LocalizableText`
- **默认值：** `''` —— 回退到站点配置的 `title`

在主题界面与浏览器标签页中显示的站点标题。站点配置的 `title` 仍是服务端渲染时的
默认值；这里的分语言映射会在界面语言变化时于客户端应用。

```ts
title: { en: "VitePress Theme Terminal", "zh-Hans": "VitePress 终端主题" },
```

## `description` {#description-zh}

- **类型：** `LocalizableText`
- **默认值：** `''` —— 回退到站点配置的 `description`

规则与 [`title`](#title-zh) 相同；它驱动首页副标题的回退值，并在语言切换时更新
`meta[name=description]`。

```ts
description: {
  en: "A TUI-inspired VitePress Theme for Blog and Personal Website",
  "zh-Hans": "一个受 TUI 界面风格启发的 VitePress 博客与个人网站主题",
},
```

## `siteName` {#sitename-zh}

- **类型：** `string`
- **默认值：** `''` —— 自动取当前站点标题并规范化

卡片提示符装饰（`user@host:~$ …`）中那段 shell 安全的主机名。该值会被去除首尾空白；
留空或不设置表示「由站点标题推导」。它会像任何提示符标识符一样被规范化：去掉变音
符号、转小写、空白变 `-`、丢弃 `a-z 0-9 . _ -` 之外的字符。

```ts
siteName: "vitepress-theme-terminal",
```

## `localeStrings` {#localestrings-zh}

- **类型：** `Record<string, Partial<ThemeLocaleStrings>>` —— BCP 47 标签 → 部分
  字符串表
- **默认值：** `{}`

按语言覆盖主题自己的界面字符串，叠加在内置表（`en`、`zh-Hans`）之上。在一个新标签
下提供**完整**的表，就等于为切换器新增了一整种语言。界面语言是客户端偏好——不存在
`/<lang>/` 形式的 URL 目录树。

```ts
localeStrings: {
  "zh-Hans": { "mode.paper": "阅读" },
  fr: { "lang.label": "Français", "mode.dark": "Sombre", /* … */ },
},
```

键的清单以及「完整的表」意味着什么，见
[`guide/internationalization.md`](../guide/internationalization.md)。

## `author` {#author-zh}

- **类型：** `TerminalAuthorConfig`
- **默认值：** `{ name: 'Admin', username: 'admin' }`

| 字段 | 类型 | 默认值 |
| --- | --- | --- |
| `name` | `LocalizableText` | `'Admin'` |
| `username` | `string` | 由 `name` 推导（无可用字符时为 `'user'`） |

页脚版权、shell 提示符装饰、作者信息展示与许可卡片的唯一来源。`username` 是提示符中
那个 shell 安全的标识符；未设置时会按 [`siteName`](#sitename-zh) 所述的规范化规则从
`name` 推导。

```ts
author: { name: "Ada Lovelace", username: "ada" },
```

## `license` {#license-zh}

- **类型：** `TerminalLicenseConfig`
- **默认值：**

  ```ts
  {
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    icons: [
      "fa-brands fa-creative-commons",
      "fa-brands fa-creative-commons-by",
      "fa-brands fa-creative-commons-nc",
      "fa-brands fa-creative-commons-sa",
    ],
  }
  ```

| 字段 | 类型 | 默认值 |
| --- | --- | --- |
| `name` | `string` | `'CC BY-NC-SA 4.0'` |
| `url` | `string` | CC 协议页面地址，**仅当 `name` 仍是默认值时** |
| `icons` | `string[]`（Font Awesome 类名） | 四个 CC 品牌图标，条件同上 |

内容许可协议，显示在页脚的许可图标组与文末的许可卡片中。**自定义的 `name` 会整体
替换默认值**：CC 的 `url` 与 `icons` 不会被继承，请自行提供（此时不设置即表示没有）。

```ts
license: { name: "MIT", url: "https://opensource.org/license/mit/" },
```

这是站点级的许可协议。单篇文章——译文，或以他人条款转载的内容——可以通过
[frontmatter 中的 `license` 对象](frontmatter.md#per-article-license-zh)
使用不同的协议，其「整体替换默认值」的规则与这里一致。

## `toolbar` {#toolbar-zh}

- **类型：** `TerminalToolbarConfig`
- **默认值：** `{ nav: [], actions: [] }`

内置的 `~/home` 标签页以及搜索、配色模式控件始终渲染；这里的条目是在它们之外追加的。

### `toolbar.nav` {#toolbar-nav-zh}

- **类型：** `TerminalNavItem[]`
- **默认值：** `[]`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `text` | `LocalizableText` | 是 | 标签页名称 |
| `link` | `string` | 是 | 站点绝对路径或外部 URL（外部链接在新标签页打开） |
| `icon` | `string` | 否 | Font Awesome 类名，渲染在名称之前（纯装饰） |
| `items` | `TerminalNavChild[]` | 否 | 悬停时展开的下拉子链接 |

`TerminalNavChild` 是 `{ text: LocalizableText, link: string, icon?: string }`
——纯链接，只有一层。带 `items` 的标签页仍需要自己的 `link`，并且在它自身或任一子项
匹配当前页面时高亮。

### `toolbar.actions` {#toolbar-actions-zh}

- **类型：** `TerminalToolbarAction[]`
- **默认值：** `[]`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `icon` | `string` | 是 | Font Awesome 类名 |
| `link` | `string` | 是 | 站点绝对路径或外部 URL |
| `label` | `LocalizableText` | 否 | 无障碍名称／悬停提示；未设置时回退为链接地址 |

渲染在内置搜索与配色模式控件**之前**的额外图标位——用于重要社交链接或外部工具的
扩展点，无需改动组件。

```ts
toolbar: {
  nav: [
    {
      text: { en: "Guide", "zh-Hans": "指南" },
      link: "/guide/",
      icon: "fa-solid fa-book",
      items: [
        {
          text: { en: "Getting Started", "zh-Hans": "快速开始" },
          link: "/guide/getting-started",
          icon: "fa-solid fa-rocket",
        },
      ],
    },
    { text: "Archives", link: "/archives", icon: "fa-solid fa-box-archive" },
  ],
  actions: [
    {
      icon: "fa-brands fa-github",
      link: "https://github.com/iXORTech/vitepress-theme-terminal",
      label: "GitHub",
    },
  ],
},
```

当横栏无法完整显示标题、标签页与图标时，导航与*全部*操作图标会自动移入 `[⋮]` 溢出
抽屉——无需任何配置。

## `explorer` {#explorer-zh}

- **类型：** `TerminalExplorerItem[] | 'auto'`
- **默认值：** `[]` —— 不显示文件浏览器，也不显示它的工具栏开关

`'auto'` 会自动发现 `src/` 下的每个 Markdown 页面：目录变成文件夹，各自的 `index.md`
成为该文件夹的链接，标签来自 frontmatter。显式数组则是手写的目录树：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `text` | `LocalizableText` | 是 | 行标签 |
| `link` | `string` | 否 | 站点绝对路径或外部 URL；在文件夹节点上即它的索引页 |
| `items` | `TerminalExplorerItem[]` | 否 | 子节点——存在即表示该节点是文件夹 |

```ts
explorer: "auto",
```

```ts
explorer: [
  { text: { en: "Guide", "zh-Hans": "指南" }, link: "/guide/", items: [
    { text: "Getting Started", link: "/guide/getting-started" },
  ] },
],
```

逐页与逐文件夹的浏览器元数据（标签、排序、可见性）**写在源文件旁边**，而不是这里
——见 [`frontmatter.md`](frontmatter.md) 与
[`guide/navigation.md`](../guide/navigation.md)。

## `toc` {#toc-zh}

- **类型：** `TerminalTocConfig`
- **默认值：** `{ enabled: true, minLevel: 2, maxLevel: 3, minHeadings: 2 }`

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 「本页内容」面板的总开关 |
| `minLevel` | `number` | `2` | 最浅的标题层级，会被限制在 1–6 |
| `maxLevel` | `number` | `3` | 最深的标题层级，会被限制在 1–6 |
| `minHeadings` | `number` | `2` | 面板出现所需的（范围内）标题数量；会取整，最小为 1 |

`minLevel` 与 `maxLevel` 写反时会被交换，而不是被当作空区间。面板只在文章类页面上
渲染，纸张模式与打印时从不渲染，1024 px 以下隐藏。

```ts
toc: { enabled: true, minLevel: 2, maxLevel: 4, minHeadings: 3 },
```

## `footer` {#footer-zh}

- **类型：** `TerminalFooterConfig`
- **默认值：** `{ rss: '', social: [] }`

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `rss` | `string` | `''` | 订阅源地址；**只有**设置后才渲染 RSS 图标 |
| `social` | `TerminalSocialLink[]` | `[]` | 版权行右侧的图标 |

`TerminalSocialLink` 是
`{ icon: string, link: string, label?: LocalizableText }` —— `icon` 是 Font
Awesome 类名，`label` 是无障碍名称，未设置时回退为链接地址。

版权中的作者与许可图标**不在这里**配置；它们来自 [`author`](#author-zh) 与
[`license`](#license-zh)。

```ts
footer: {
  rss: "/feed.rss",
  social: [
    { icon: "fa-brands fa-github", link: "https://github.com/…", label: "GitHub" },
  ],
},
```

## `taxonomy` {#taxonomy-zh}

- **类型：** `TerminalTaxonomyConfig`
- **默认值：** `{ tags: {}, categories: {} }`

| 字段 | 类型 | 默认值 |
| --- | --- | --- |
| `tags` | `Record<string, LocalizableText>` | `{}` |
| `categories` | `Record<string, LocalizableText>` | `{}` |

分类法术语的显示名，键是文章 frontmatter 中所写的术语名（通过 slug 做大小写不敏感的
匹配，因此 `Guides` 与 `guides` 共用一个条目）。**仅影响显示**：slug、`/tags/…` 与
`/categories/…` 的 URL 以及分组身份始终来自所写的名称，因此列表页的路由不会随语言
改变。没有条目的术语按原样显示。

```ts
taxonomy: {
  tags: { theme: { en: "theme", "zh-Hans": "主题" } },
  categories: { Guides: { en: "Guides", "zh-Hans": "指南" } },
},
```

## `series` {#series-zh}

- **类型：** `TerminalSeriesConfig`
- **默认值：** 所有开关均为 `false`

| 字段 | 类型 | 默认值 | 让系列文章进入 |
| --- | --- | --- | --- |
| `inPosts` | `boolean` | `false` | 文章索引及其分页 |
| `inArchives` | `boolean` | `false` | 归档时间线 |
| `inCategories` | `boolean` | `false` | 分类索引与各分类页 |
| `inTags` | `boolean` | `false` | 标签索引与各标签页 |

系列文章始终会渲染在自己的页面、系列索引以及所属系列的首页列表中；这些开关决定它们
是否*同时*进入通用列表。被纳入的文章会在标题前显示所属系列名
（`Terminal Internals › Part 1`）。

```ts
series: { inArchives: true, inCategories: true, inTags: true },
```

## `home` {#home-zh}

- **类型：** `TerminalHomeConfig`
- **默认值：** `{}` —— 欢迎卡片回退到站点标题／描述

| 字段 | 类型 | 默认值 |
| --- | --- | --- |
| `command` | `string` | `'whoami'` |
| `greeting` | `LocalizableText` | 本地化后的站点标题 |
| `tagline` | `LocalizableText` | 本地化后的站点描述 |
| `body` | `LocalizableText` | 无（不渲染该段落） |
| `links` | `TerminalPageLink[]` | `[]` |

`TerminalPageLink` 是 `{ text: LocalizableText, link: string, icon?: string }`
——渲染为行动按钮；`icon` 接受 Font Awesome 或 Nerd Font 类名。

```ts
home: {
  command: "whoami",
  greeting: { en: "Hi, I'm the Terminal theme", "zh-Hans": "你好，我是终端主题" },
  links: [{ text: "Read the guide", link: "/guide/", icon: "fa-solid fa-book" }],
},
```

项目页与关于页是**手写的 Vue 视图**，不通过配置——见
[`guide/customization.md`](../guide/customization.md)。

## `friends` {#friends-zh}

- **类型：** `TerminalFriendsConfig`
- **默认值：** `{ showCount: true, showRandom: true, groups: {} }`

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `showCount` | `boolean` | `true` | 在分组标题中显示条目数 |
| `showRandom` | `boolean` | `true` | 分组上方的 `[⇄ random]` 控件 |
| `groups` | `Record<string, { name?: LocalizableText, desc?: LocalizableText }>` | `{}` | 按分组 id 覆盖显示名 |

友链**数据**有意不在这里配置——它位于 `.vitepress/theme/assets/` 下的
`linksData.mjs` 数据模块中
（[`design/friend-links.md`](../design/friend-links.md)）。本节只承载显示选项；
`groups` 用于本地化生成数据中的纯字符串标签。

```ts
friends: {
  groups: {
    group2: {
      name: { en: "Group 2", "zh-Hans": "第二组" },
      desc: { en: "Localized via themeConfig.friends.groups.", "zh-Hans": "通过配置本地化。" },
    },
  },
},
```

## `search` {#search-zh}

- **类型：** `TerminalSearchConfig`
- **默认值：** `{ provider: 'algolia', algolia: null }`

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `provider` | `'algolia'` | `'algolia'` | 预留给将来的后端 |
| `algolia` | `{ appId, apiKey, indexName }` | `null` | 三个字符串缺一不可 |

查找面板（工具栏放大镜或 `/`）直接从浏览器查询索引，并在主题自己的 TUI 窗口中渲染
结果——主题不使用 DocSearch 的弹窗。**请使用仅搜索（search-only）的公开密钥，绝不要
使用 admin 密钥。** 凭据不完整视为未配置：面板依然会打开，并显示「尚未配置」的提示。

```ts
search: {
  algolia: {
    appId: "YOUR_APP_ID",
    apiKey: "YOUR_SEARCH_ONLY_API_KEY",
    indexName: "YOUR_INDEX",
  },
},
```

## `comments` {#comments-zh}

- **类型：** `TerminalCommentsConfig`
- **默认值：** `{ provider: 'waline', waline: null }`

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `provider` | `'waline'` | `'waline'` | 预留给将来的后端 |
| `waline` | `{ serverURL: string }` | `null` | 你部署的 Waline 服务地址 |

设置服务地址后，每篇文章末尾都会出现评论卡片，标题附近也会显示浏览量与评论数。地址
为空或缺失视为未配置——卡片与计数都不渲染。单个页面可用 frontmatter 中的
`comments: false` 退出。

```ts
comments: { waline: { serverURL: "https://waline.example.com" } },
```

---

## 哪些配置在别处（以及为什么） {#configured-elsewhere-zh}

规则是：面向用户的选项都放在 `themeConfig` 里。有三处是有据可查的例外，原因都是这些
数据应当*与内容放在一起*：

| 界面 | 位置 | 原因 |
| --- | --- | --- |
| 逐页元数据——标题、排序、浏览器可见性、分类法、封面 | 页面 frontmatter 与相邻的 `explorer.json` 文件（[`frontmatter.md`](frontmatter.md)） | 它描述的是某一个页面，必须与之同行 |
| 系列元数据——图标、标题、描述、顺序 | `src/series/<slug>/series.yml`（[`design/content-architecture.md`](../design/content-architecture.md) §5） | 它描述的是某一个内容文件夹 |
| 友链数据 | `.vitepress/theme/assets/**/linksData.mjs`（[`design/friend-links.md`](../design/friend-links.md)） | 它由外部仓库生成／同步而来 |

站点级的 VitePress 选项（`title`、`description`、`lang`、`cleanUrls`、
`lastUpdated` 等）仍属于普通的 VitePress 配置；其中主题依赖其行为的那一个，见
[`clean-urls.md`](clean-urls.md)。

:::::
