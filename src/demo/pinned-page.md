---
title:
  en: "Pinned Page"
  zh-Hans: "置顶页面"
order: -1
---

# Pinned Page

A leaf page in the `demo/` folder that carries `order: -1` in its frontmatter
(ARCH-004).

Siblings normally sort **folders first, then by name**, so this file would sit
*below* the `advanced/` folder. The negative order pins it above every
unnumbered sibling — without having to renumber any of them, since anything
without an `order` is `0`.

```yaml
---
order: -1
---
```

The same attribute works on a folder, through its `explorer.json` (which wins)
or its `index.md` frontmatter — the `advanced-2` folder in this tree uses
`{ "order": 1 }` to sit *below* its file sibling.

Its localized explorer label comes from this page's `title` map, like every
other page in the tree.

See [the frontmatter reference](/docs/configuration/frontmatter) for the exact
rules.
