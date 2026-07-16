---
title:
  en: "Getting Started"
  zh-Hans: "快速上手"
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
