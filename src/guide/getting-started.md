# Getting Started

A plain **leaf page** inside the `guide/` folder — in the explorer it renders
with a file glyph (Nerd Font, when the symbols font is available) and no
chevron, and this row is accent-highlighted while you read it.

## Configuring the explorer

The tree comes from `themeConfig.explorer` in `.vitepress/config.mts`:

```ts
explorer: [
  { text: "home", link: "/" },
  {
    text: "guide",
    link: "/guide/", // the folder's index page
    items: [
      { text: "getting-started", link: "/guide/getting-started" },
      // …
    ],
  },
]
```

- `text` is localizable — a string or a per-language map.
- A node with `items` is a folder; its optional `link` is its index page.
- `collapsed: true`/`false` overrides the depth default for one folder.
