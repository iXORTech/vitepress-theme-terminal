# Guide

This is the **index page of the `guide/` folder** — a demo of the explorer's
folder-with-index behavior (THEME-011):

- In the file explorer, `guide` is a folder node whose `link` points at this
  page. Clicking its **label** opened this page *and* expanded the folder;
  it never collapses it.
- The **chevron** in front of the folder is the pure expand/collapse toggle —
  it changes the tree without navigating anywhere.

::: tip
`guide` sits on the explorer's first layer, so it starts **expanded** by
default. The nested `advanced/` folder inside it starts **collapsed** — only
the first layer opens by default. Any toggle you make is remembered across
reloads.
:::

Continue with [getting started](/guide/getting-started), or dive into the
[advanced](/guide/advanced/) section.
