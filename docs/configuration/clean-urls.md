# Clean URLs — no `.html` suffix (THEME-030)

Pages are addressed **without** the `.html` suffix: `/guide/getting-started`,
not `/guide/getting-started.html`. This is a plain VitePress site option, set
once in `.vitepress/config.mts`:

```ts
export default defineConfigWithTheme<TerminalThemeConfig>({
  cleanUrls: true,
  // …
})
```

## What it changes

`cleanUrls` is a **link-generation** setting, not an output-layout one:

- every link VitePress generates drops the suffix — markdown links
  (`[x](./other.md)` → `/other`), the client router's navigation targets, and
  the `url` field of `createContentLoader` data (the theme's `posts.data.mts` /
  `series.data.mts`, and therefore every post card, taxonomy listing and series
  link built from them);
- the build **still writes `<page>.html` files** into `.vitepress/dist` —
  `guide/getting-started.html`, `guide/index.html`, and so on. The directory
  layout is identical with the option on or off.

The theme needs no adjustment for it. Links written by the theme's own surfaces
(the tool bar's `nav`, the explorer tree, the pagination in `PostsIndex.vue`)
are already extensionless, and active-page matching goes through
`linkRelativePath()` in `theme/utils/pagePath.ts`, which strips a `.html`
suffix before comparing — so a link configured either way still highlights the
right tab or row.

## A `.html` URL is stripped automatically (THEME-033)

A reader can still *arrive* on the suffixed form — an old external link, a
bookmark from before the switch, or a markdown link an author wrote literally as
`./page.html` (VitePress leaves an explicit `.html` alone). The page served is
already the right one, so the theme just rewrites the address bar to the clean
form with `history.replaceState`:

- **no navigation and no reload** — nothing is re-fetched;
- **no extra history entry** — Back goes where it went before;
- the query string and the `#hash` are preserved, so a `#slug` deep link still
  scrolls to its heading and a heading-link copy (THEME-028) from such a page
  yields the clean URL;
- `…/index.html` becomes the folder form: `/guide/index.html` → `/guide/`,
  `/index.html` → `/`;
- the deployed `base` prefix is untouched — only the suffix is removed;
- it runs on first load *and* after client-side navigation.

It is gated on this very option: with `cleanUrls: false`, `/page.html` **is**
the canonical URL, and stripping it would produce an address the host may not
serve — so nothing is rewritten. Implementation:
`theme/composables/useCleanUrls.ts`, called once from `Layout.vue`.

## Old links keep working

Because the `.html` files are still on disk, an external link to
`/guide/getting-started.html` resolves directly, on any static host (and the
address bar is then tidied up in place, above). The
suffix-free form `/guide/getting-started` needs the host to try `<path>.html`
when a path has no extension — the standard "clean URLs" behavior, which every
target this theme is deployed to provides:

| Host | Behavior |
| --- | --- |
| Cloudflare Pages | on by default |
| Netlify / Vercel | on by default |
| GitHub Pages | on by default |
| `pnpm preview` | on — VitePress serves `dist` through sirv, whose default `extensions: ['html']` resolves it |
| `pnpm dev` | on — the dev server resolves both forms |

So **both forms work**, and no redirect rules are needed. If you deploy to a
host that does *not* do extension fallback (a bare `nginx` without
`try_files $uri $uri.html`, say), either add that rule or set `cleanUrls: false`
— everything in the theme works under both settings.

## Related

- Site configuration reference: [VitePress `cleanUrls`](https://vitepress.dev/reference/site-config#cleanurls)
- Heading permalinks copy whatever URL form the reader is currently on
  (THEME-028, [`../design/design-language.md`](../design/design-language.md) §4).
