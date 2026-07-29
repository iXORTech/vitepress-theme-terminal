---
title:
  en: "Demo"
  zh-Hans: "演示"
---

# Demo

A small playground for the **file explorer**. Nothing here documents the theme —
the real documentation lives at [`/docs/`](/docs/); these pages exist so the
explorer's behaviors can be seen working.

This is the **index page of the `demo/` folder**, which shows the
folder-with-index behavior (THEME-011):

- In the file explorer, `demo` is a folder node whose `link` points at this
  page. Clicking its **label** opened this page *and* expanded the folder;
  it never collapses it.
- The **chevron** in front of the folder is the pure expand/collapse toggle —
  it changes the tree without navigating anywhere.

::: tip
`demo` sits on the explorer's first layer, so it starts **expanded** by
default. The nested `advanced/` folder inside it starts **collapsed** — only
the first layer opens by default. Any toggle you make is remembered across
reloads.
:::

What each page below shows:

| Page | Demonstrates |
| --- | --- |
| [Pinned Page](/demo/pinned-page) | A negative `order`, pinning a file above an unnumbered folder |
| [Advanced](/demo/advanced/) | A nested folder that starts collapsed, with its own index |
| [Deep Dive](/demo/advanced/deep-dive) | A localized body (`::: lang`) and the accent-highlighted active row |
| Hidden Page | `showInExplorer: false` — absent from the tree, still served at `/demo/advanced/hidden-page` |
| Deep Dive 2 | An index-less folder labeled by its adjacent `explorer.json` |

How to configure any of it: [Navigation & Chrome](/docs/guide/navigation) and
the [frontmatter reference](/docs/configuration/frontmatter).
