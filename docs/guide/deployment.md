---
title:
  en: "Building & Deploying"
  zh-Hans: "构建与部署"
order: 7
---
::::: lang en

# Building & Deploying

The site is a static VitePress build — any static host works. This page covers
the build, the few things this theme needs from a host or a CI job, and a
pre-launch checklist.

## Build and preview

```sh
pnpm build     # → .vitepress/dist
pnpm preview   # serve the build locally
```

`.vitepress/dist` is what you deploy: plain HTML, CSS, JS, and assets, with no
server runtime.

> Restart `pnpm preview` after every rebuild. It snapshots the asset list at
> startup, so a re-hashed asset from a newer build will 404 in a preview server
> that is still running.

## Hosting requirements

| Requirement | Why |
| --- | --- |
| Static file serving | The build is entirely static |
| Files up to ~11 MB per asset | The Typst math compiler is the largest asset; the build already compresses it |
| Correct MIME types for `.wasm` / `.wasm.gz` | Typst math loads the compiler at runtime |

No Node runtime, no rewrite rules, no edge functions.

## Clean URLs

The demo site sets `cleanUrls: true`, so generated links are `/guide/getting-started`
rather than `/guide/getting-started.html`. The build still writes the `.html`
files, so:

- Existing `.html` links keep resolving directly.
- Suffix-free links rely on the host's extension fallback — every mainstream
  static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages, nginx with
  `try_files`) does this.
- Arriving on a `.html` URL rewrites the address bar to the clean form in place,
  with no navigation and no extra history entry.

Details and the host table: [`configuration/clean-urls.md`](../configuration/clean-urls.md).
Setting `cleanUrls: false` is fine too — the theme works either way.

## Deploying to a subpath

If the site is not at a domain root (GitHub Project Pages, for instance), set
VitePress's `base`:

```ts
export default defineConfigWithTheme<TerminalThemeConfig>({
  base: "/my-site/",
  // …
});
```

The theme's links, active-tab matching, and heading-anchor copying all honor
`base` — but your own content must too: write internal links site-absolutely
(`/posts`) and let VitePress resolve them, rather than hardcoding the prefix.

## Large assets: the Typst compiler

The Typst math compiler is a ~28 MB WebAssembly module — larger than several
hosts allow (Cloudflare Pages caps files at 25 MiB). The build handles this
without configuration: any bundled `.wasm` over 24 MiB is re-emitted gzipped as
`<name>.wasm.gz` (~10.7 MB), and the client decompresses it before initializing
the compiler.

Two consequences:

- Serve `.wasm.gz` as an opaque binary. If your host transparently decodes it,
  that still works — the client checks the actual bytes rather than trusting the
  extension.
- The dev server serves the raw `.wasm`; this only applies to builds.

If you don't use Typst math, nothing changes — the compiler is loaded lazily,
only on pages that contain Typst blocks.

## Continuous deployment

Two things this theme needs from a CI checkout:

1. **Full git history** (`fetch-depth: 0`) if you use the git-derived
   "Updated" date on articles. A shallow clone silently produces no timestamps.
2. **Submodules** (`submodules: recursive`) if your friend-link data comes from
   a generator repository.

A GitHub Actions job, as a starting point:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0          # git-derived "Updated" dates
          submodules: recursive   # friend-link data
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      # → upload .vitepress/dist to your host
```

## Services to set up separately

Two features depend on infrastructure outside the site:

- **Search.** Point `themeConfig.search.algolia` at your DocSearch index. The
  crawler needs the *deployed* site, so the usual order is: deploy → apply for
  or configure DocSearch → add the keys → redeploy. Use the search-only key.
  Without keys the palette opens and says it isn't configured.
- **Comments.** Deploy a Waline server and set
  `themeConfig.comments.waline.serverURL`. Without it, no comment card and no
  view/comment counts render.

## Pre-launch checklist

- [ ] `title`, `description`, and `lang` set in the site config; `themeConfig.title`
      / `.description` set if you serve more than one language
- [ ] `mainColor` is yours
- [ ] `author` and `license` set — they drive the footer, prompts, and every
      article's license card
- [ ] Demo content removed from `src/`, demo entries removed from
      `.vitepress/config.mts`, `DemoLayout` swapped out in
      `.vitepress/theme/index.ts`
- [ ] `favicon.svg` replaced in `src/public/`
- [ ] Placeholder `footer.rss` and `comments.waline.serverURL` values replaced or
      removed
- [ ] `pnpm build` clean, then `pnpm preview` checked in dark, light, and paper
      modes and at a 360 px viewport
- [ ] Print one article (paper mode is the print stylesheet)

:::::

::::: lang zh-Hans

# 构建与部署

站点是一次静态的 VitePress 构建——任何静态托管都可以。本页讲构建过程、本主题对
托管或 CI 任务的少数几点要求，以及一份上线前清单。

## 构建与预览

```sh
pnpm build     # → .vitepress/dist
pnpm preview   # 在本地提供构建产物
```

`.vitepress/dist` 就是你要部署的东西：纯粹的 HTML、CSS、JS 与资源文件，不需要任何
服务端运行时。

> 每次重新构建后都要重启 `pnpm preview`。它在启动时对资源列表做了快照，因此新构建
> 中重新哈希过的资源在仍在运行的预览服务器上会返回 404。

## 托管要求

| 要求 | 原因 |
| --- | --- |
| 静态文件服务 | 构建产物完全是静态的 |
| 单个文件可达约 11 MB | Typst 数学编译器是最大的资源；构建已经把它压缩 |
| 正确的 `.wasm` / `.wasm.gz` MIME 类型 | Typst 公式在运行时加载编译器 |

不需要 Node 运行时，不需要重写规则，不需要边缘函数。

## 简洁 URL

演示站点设置了 `cleanUrls: true`，因此生成的链接是 `/guide/getting-started` 而不是
`/guide/getting-started.html`。构建仍会写出 `.html` 文件，因此：

- 已有的 `.html` 链接仍可直接访问。
- 无后缀链接依赖托管方的扩展名回退——所有主流静态托管（Cloudflare Pages、Netlify、
  Vercel、GitHub Pages，以及配置了 `try_files` 的 nginx）都支持。
- 从 `.html` URL 进入时，地址栏会就地改写为简洁形式，不发生跳转，也不新增历史记录。

详情与托管对照表见
[`configuration/clean-urls.md`](../configuration/clean-urls.md)。设为
`cleanUrls: false` 同样没问题——主题两种方式都能工作。

## 部署到子路径

如果站点不在域名根路径下（例如 GitHub 的项目页），请设置 VitePress 的 `base`：

```ts
export default defineConfigWithTheme<TerminalThemeConfig>({
  base: "/my-site/",
  // …
});
```

主题的链接、激活标签页匹配与标题锚点复制都会遵循 `base`——但你自己的内容也必须
如此：请用站点绝对路径书写内部链接（`/posts`）并交给 VitePress 解析，而不要把前缀
硬编码进去。

## 大体积资源：Typst 编译器

Typst 数学编译器是一个约 28 MB 的 WebAssembly 模块——超过了不少托管方的限制
（Cloudflare Pages 单文件上限为 25 MiB）。构建会自动处理，无需配置：任何超过 24 MiB
的打包 `.wasm` 都会以 gzip 重新产出为 `<name>.wasm.gz`（约 10.7 MB），客户端在初始化
编译器之前先解压。

由此有两点影响：

- 请把 `.wasm.gz` 当作不透明的二进制文件提供。即使你的托管方对它做了透明解码也没
  关系——客户端检查的是实际字节而不是文件扩展名。
- 开发服务器提供的是原始 `.wasm`；这一机制只作用于构建产物。

如果你不使用 Typst 公式，什么都不会改变——编译器是惰性加载的，只在包含 Typst 块的
页面上才会加载。

## 持续部署

本主题对 CI 检出有两点要求：

1. **完整的 git 历史**（`fetch-depth: 0`），如果你使用文章上由 git 推导的「更新
   时间」。浅克隆会悄无声息地得不到时间戳。
2. **子模块**（`submodules: recursive`），如果你的友链数据来自生成器仓库。

一个可作为起点的 GitHub Actions 任务：

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0          # 由 git 推导的「更新时间」
          submodules: recursive   # 友链数据
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      # → 把 .vitepress/dist 上传到你的托管方
```

## 需要单独准备的服务

有两项功能依赖站点之外的基础设施：

- **搜索。** 把 `themeConfig.search.algolia` 指向你的 DocSearch 索引。爬虫需要访问
  *已部署*的站点，因此通常的顺序是：先部署 → 申请或配置 DocSearch → 填入密钥 →
  再次部署。请使用仅搜索密钥。没有密钥时，查找面板依然会打开，只是提示尚未配置。
- **评论。** 部署一个 Waline 服务并设置
  `themeConfig.comments.waline.serverURL`。没有它时，评论卡片与浏览量／评论数都不会
  渲染。

## 上线前清单

- [ ] 站点配置中已设置 `title`、`description` 与 `lang`；如果提供多语言，还要设置
      `themeConfig.title` / `.description`
- [ ] `mainColor` 已换成你自己的颜色
- [ ] 已设置 `author` 与 `license`——它们驱动页脚、shell 提示符与每篇文章的许可卡片
- [ ] 已从 `src/` 移除演示内容，从 `.vitepress/config.mts` 移除演示条目，并在
      `.vitepress/theme/index.ts` 中替换掉 `DemoLayout`
- [ ] 已替换 `src/public/` 中的 `favicon.svg`
- [ ] 已替换或移除占位的 `footer.rss` 与 `comments.waline.serverURL`
- [ ] `pnpm build` 无报错，随后用 `pnpm preview` 在深色、浅色、纸张三种模式与 360 px
      视口下检查过
- [ ] 已打印过一篇文章试试（纸张模式就是打印样式）

:::::
