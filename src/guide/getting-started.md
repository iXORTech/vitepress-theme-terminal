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
