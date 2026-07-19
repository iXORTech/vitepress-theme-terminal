---
title:
  en: "Getting Started"
  zh-Hans: "快速上手"
order: -1
---

# Getting Started

A plain **leaf page** inside the `guide/` folder — in the explorer it renders
with a file glyph (Nerd Font, when the symbols font is available) and no
chevron, and this row is accent-highlighted while you read it.

## Configuring the explorer

The tree can be discovered automatically from `src/`:

```ts
explorer: "auto"
```

Every Markdown file below `src/` appears in the tree. A directory becomes a
folder, and its `index.md` is the folder's link. Use a localized frontmatter
`title` for a file label:

```yaml
---
title:
  en: "Getting Started"
  zh-Hans: "快速上手"
---
```

For an index-less folder, add an `explorer.json` file beside its Markdown
children. This is source metadata rather than site configuration:

```json
{
  "title": {
    "en": "advanced-2",
    "zh-Hans": "进阶-2"
  }
}
```

The JSON `title` overrides the folder name or index frontmatter title. Folder
expansion follows the depth default, active-route reveal, and persisted user
toggle rules. File labels should use frontmatter, so each page can keep its
localized title with its content.

A page can hide itself from the tree with frontmatter (it still builds and
stays reachable by URL):

```yaml
---
showInExplorer: false
---
```

A folder — with everything below it — is hidden the same way from its
`explorer.json`:

```json
{
  "showInExplorer": false
}
```

The default is always shown. This site hides `/guide/advanced/hidden-page`
(frontmatter) and the whole `drafts/` folder (JSON) as working examples.

### Ordering entries

By default siblings sort with folders first, then by name. Give a page or
folder an `order` to move it — any finite number, smaller sorts higher, the
default is `0`:

```yaml
---
order: -1
---
```

A negative value pins an entry **above** the unnumbered `0` siblings without
having to renumber them. A folder takes its `order` from its `explorer.json`
(which wins) or its `index.md` frontmatter:

```json
{ "order": 1 }
```

Entries with the same `order` keep the folders-first-then-name fallback, so
untouched trees look exactly as before. Non-numeric or non-finite values are
ignored. This site pins `guide/getting-started` above the `advanced` folder
(`order: -1`) and pushes the `advanced-2` folder below `deep-dive` (`order: 1`)
as working examples.

Explicit `explorer` arrays remain supported when a hand-authored tree is
preferred. Folder expansion follows the existing depth and persistence rules.

## Localizing page content

A page's body can switch with the site language — no `/<lang>/` URL. Wrap each
language's content in a `::: lang <tag>` block:

```markdown
::: lang en
English body…
:::

::: lang zh-Hans
中文正文…
:::
```

When the reader switches language in the status bar, the matching block is shown
in place (the same fallback the rest of the theme uses: exact tag → primary
subtag → site default → first block). Anything left **outside** a `::: lang`
block always shows, so shared code samples and images need not be duplicated.
The `guide/advanced/deep-dive` page is a working example.

## Localizing frontmatter

Displayed frontmatter fields — a page's `title`, a post's `description` — take
either a plain string or a per-language map:

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

The explorer label, post list cards, the archives, the license card's article
title, and the browser tab all resolve the map against the active UI language
and switch in place. The `posts/hello-terminal` post is a working example.

Tags and categories localize differently — a term is shared across posts, so
its display labels live in a dedicated site-config map instead of frontmatter
(posts keep declaring plain term names):

```ts
taxonomy: {
  tags: { theme: { en: "theme", "zh-Hans": "主题" } },
  categories: { Guides: { en: "Guides", "zh-Hans": "指南" } },
}
```

Only the displayed label switches: slugs and `/tags/…`, `/categories/…` URLs
always come from the authored names, so links never change with the language.
Terms without an entry render as written. This site localizes the `theme` and
`color` tags and the `Guides` and `Design` categories as working examples.

## Posts, series & covers

Regular posts live under `src/posts/`; a **series** is a folder under
`src/series/<series-name>/` whose articles share a landing page and a banner.
Each series folder may carry a `series.yml` describing it (every field is
optional):

```yaml
icon: nf-fa-terminal          # Font Awesome or Nerd Font `nf-*` class
title:
  en: Terminal Internals
  zh-Hans: 终端内幕
description:
  en: A short series on how the theme's shell is built.
order: 0                      # position on the series index; smaller = higher
```

The series index page (`series.md`) places `<SeriesIndex />` to list every
series with its icon, localized title/description, and article count. A series
landing page (`series/<name>/index.md`) places `<SeriesArticles />` to list its
articles automatically, sorted by their frontmatter `order` (default `0`,
smaller = higher, ties alphabetical). Every article in the series shows a
banner linking back to the landing page.

Series articles stay out of the general post listings unless opted in through
site-config toggles (this site opts them into the archives, categories, and
tags):

```ts
series: {
  inPosts: false,      // post index + pagination
  inArchives: true,    // archives timeline
  inCategories: true,  // category index + per-category pages
  inTags: true,        // tag index + per-tag pages
}
```

An admitted series article shows its series name before the title in those
listings — `Terminal Internals › Part 1 — The Shell Frame` — so it is
recognizable among regular posts.

A post or series article can also declare a **cover image** in frontmatter:

```yaml
---
cover: /images/demo-terminal-1.svg
---
```

The cover integrates seamlessly: in post-list cards it is a full-height image
panel on the right that fades into the card (a full-width top strip on
mobile), and on the article page the header becomes a hero banner showing the
full image at full opacity, fading into the surface only behind the byline.
Card covers are cropped to fit; the article-header image is shown in full.
Covers are lazy-loaded, and posts without a cover render exactly as before.
