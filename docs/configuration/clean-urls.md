---
title:
  en: "Clean URLs"
  zh-Hans: "简洁 URL"
order: 3
---
::::: lang en

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

:::::

::::: lang zh-Hans

# 简洁 URL —— 不带 `.html` 后缀（THEME-030）

页面地址**不带** `.html` 后缀：写作 `/guide/getting-started`，而不是
`/guide/getting-started.html`。这是一个普通的 VitePress 站点选项，在
`.vitepress/config.mts` 中设置一次即可：

```ts
export default defineConfigWithTheme<TerminalThemeConfig>({
  cleanUrls: true,
  // …
})
```

## 它改变了什么

`cleanUrls` 是一个**链接生成**选项，而不是产物目录结构选项：

- VitePress 生成的每个链接都会去掉后缀——Markdown 链接（`[x](./other.md)` →
  `/other`）、客户端路由的跳转目标，以及 `createContentLoader` 数据中的 `url` 字段
  （主题的 `posts.data.mts` / `series.data.mts`，因而也包括由它们构建的每张文章
  卡片、分类法列表与系列链接）；
- 构建**仍会把 `<page>.html` 文件写入** `.vitepress/dist` ——
  `guide/getting-started.html`、`guide/index.html` 等等。无论该选项开启与否，目录
  结构完全相同。

主题本身不需要为此做任何调整。主题各界面自己书写的链接（工具栏的 `nav`、文件浏览器
目录树、`PostsIndex.vue` 中的分页）本来就不带扩展名，而当前页面匹配走的是
`theme/utils/pagePath.ts` 中的 `linkRelativePath()`，它会在比较前先去掉 `.html`
后缀——所以无论链接按哪种写法配置，都仍会正确高亮对应的标签页或行。

## `.html` URL 会被自动去掉（THEME-033）

读者仍然可能*进入*带后缀的形式——一个旧的外部链接、切换之前的书签，或者作者手写为
`./page.html` 的 Markdown 链接（VitePress 会原样保留显式的 `.html`）。此时提供的页面
本来就是对的，因此主题只是用 `history.replaceState` 把地址栏改写成简洁形式：

- **不跳转、不重载**——不会重新请求任何内容；
- **不新增历史记录**——「后退」仍回到原来的位置；
- 查询字符串与 `#hash` 都会保留，因此 `#slug` 深链依然会滚动到对应标题，从这类页面
  复制标题链接（THEME-028）得到的也是简洁 URL；
- `…/index.html` 会变成文件夹形式：`/guide/index.html` → `/guide/`，
  `/index.html` → `/`；
- 部署时的 `base` 前缀不受影响——只去掉后缀；
- 它在首次加载时执行，客户端跳转之后同样执行。

这一行为由该选项本身把关：当 `cleanUrls: false` 时，`/page.html` **才是**规范 URL，
去掉后缀反而会得到托管方可能无法提供的地址——所以什么都不会改写。实现见
`theme/composables/useCleanUrls.ts`，由 `Layout.vue` 调用一次。

## 旧链接依然有效

因为 `.html` 文件仍在磁盘上，指向 `/guide/getting-started.html` 的外部链接在任何静态
托管上都能直接访问（随后地址栏会如上就地整理）。而无后缀形式
`/guide/getting-started` 需要托管方在路径没有扩展名时尝试 `<path>.html` ——这正是
标准的「clean URLs」行为，本主题面向的每个部署目标都提供：

| 托管 | 行为 |
| --- | --- |
| Cloudflare Pages | 默认开启 |
| Netlify / Vercel | 默认开启 |
| GitHub Pages | 默认开启 |
| `pnpm preview` | 开启——VitePress 通过 sirv 提供 `dist`，其默认的 `extensions: ['html']` 会解析它 |
| `pnpm dev` | 开启——开发服务器两种形式都能解析 |

所以**两种形式都有效**，也不需要任何重定向规则。如果你部署到*不做*扩展名回退的
托管（例如没有 `try_files $uri $uri.html` 的裸 `nginx`），要么加上该规则，要么设置
`cleanUrls: false`——主题在两种设置下都能正常工作。

## 相关

- 站点配置参考：[VitePress `cleanUrls`](https://vitepress.dev/reference/site-config#cleanurls)
- 标题永久链接复制的，永远是读者当前所处的那种 URL 形式

:::::
