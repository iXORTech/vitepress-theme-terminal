---
title:
  en: "Navigation & Chrome"
  zh-Hans: "导航与外壳界面"
order: 4
---
::::: lang en

# Navigation & Chrome

The shell around your content: the tool bar, the file explorer, the article
table of contents, the find palette, the status bar, and the settings window.
This page is about configuring and using them. What they look like and why is in
[`design/design-language.md`](../design/design-language.md) §4 and
[`design/ui-sketch.md`](../design/ui-sketch.md).

The frame is fixed: only the viewport panel scrolls, so the bars and panels stay
put while you read.

## Tool bar

The bar across the top holds the site title, the navigation tabs, and the action
icons. A built-in `~/home` tab and the search and color-mode controls are always
present; everything else is configuration.

```ts
toolbar: {
  nav: [
    {
      text: { en: "Guide", "zh-Hans": "指南" },
      link: "/guide/",
      icon: "fa-solid fa-book",
      items: [
        { text: "Getting Started", link: "/guide/getting-started", icon: "fa-solid fa-rocket" },
        { text: "Advanced", link: "/guide/advanced/", icon: "fa-solid fa-flask" },
      ],
    },
    { text: "Archives", link: "/archives", icon: "fa-solid fa-box-archive" },
  ],
  actions: [
    { icon: "fa-brands fa-github", link: "https://github.com/…", label: "GitHub" },
  ],
},
```

- A tab **highlights** when the current page matches its link — or any of its
  children's links.
- A tab with `items` opens a floating dropdown on hover or keyboard focus, and
  stays a link itself (so `link` is still required). Children are plain links;
  they don't nest further.
- `actions` are extra icon slots before the built-in controls — the extension
  point for social links and external tools, without touching a component.
- External links open in a new tab.

**Overflow.** When the bar can't show the title, tabs, and icons in full — a
narrow window, a long site title, a translated tab set — the nav and *all*
action icons move into a right-side drawer behind a `[⋮]` expander. Below
640 px this is always the case. Nothing to configure; it measures itself.

## File explorer

The left panel is a NeoVim-style file browser. Turn it on with either an
automatic tree or a hand-authored one:

```ts
explorer: "auto",
```

With `"auto"`, every Markdown page below `src/` appears: directories become
folders, each `index.md` becomes its folder's link, and labels come from
frontmatter. Unset (or an empty array) hides the explorer *and* its tool-bar
toggle entirely.

The per-page controls all live with the content, not in the site config:

| To… | Do this |
| --- | --- |
| Label a page | `title:` in its frontmatter (localizable) |
| Label a page in the tree only | `explorerTitle:` in its frontmatter |
| Label a folder without an `index.md` | `explorer.json` beside its children, with a `title` |
| Reorder siblings | `order:` (smaller sorts higher; negatives pin above the default `0`) |
| Hide a page | `showInExplorer: false` in its frontmatter |
| Hide a folder and everything under it | `"showInExplorer": false` in its `explorer.json` |

```json
{
  "title": { "en": "Advanced", "zh-Hans": "进阶" },
  "order": 1
}
```

Types and defaults for all of these:
[`configuration/frontmatter.md`](../configuration/frontmatter.md).

**Behavior.** First-level folders start expanded and deeper ones collapsed; the
route you're on temporarily reveals its ancestors; and any folder you toggle
yourself is remembered across reloads. Clicking a folder's *label* opens its
index page and expands it — clicking the chevron only toggles. The panel
retracts from the tool bar's `[=]` control, and its width is drag-adjustable
between 180 px and 420 px (arrow keys work when the handle has focus).

Below 640 px the explorer becomes an off-canvas drawer, dismissed by the close
button, the backdrop, `Esc`, or navigating. In paper mode it is not rendered at
all.

An explicit tree is still supported when you'd rather hand-author it:

```ts
explorer: [
  { text: "Guide", link: "/guide/", items: [
    { text: "Getting Started", link: "/guide/getting-started" },
  ] },
],
```

## Article table of contents

The right-hand "on this page" panel is built from the rendered headings and
follows the section you're reading. It is on by default:

```ts
toc: { enabled: true, minLevel: 2, maxLevel: 3, minHeadings: 2 },
```

It shows only on article pages that have at least `minHeadings` headings within
the level range, never in paper mode or print, and is hidden below 1024 px. The
`[«]` control retracts it to a reopen rail (remembered across reloads), and its
width drags between 160 px and 400 px.

Each heading also carries a `#` control that copies its absolute URL to the
clipboard and confirms with a transient toast.

## Find palette

Press `/` (or use the tool-bar magnifier) to open the search window: an input
pane over a results pane, `↑`/`↓` to move, `Enter` to open, `Esc` to close. The
palette *is* the search UI — it queries Algolia directly and renders results in
the theme's own window.

```ts
search: {
  algolia: {
    appId: "YOUR_APP_ID",
    apiKey: "YOUR_SEARCH_ONLY_API_KEY",
    indexName: "YOUR_INDEX",
  },
},
```

Use the **search-only** key. Without complete credentials the palette still
opens and says search is not configured — nothing breaks.

## Status bar

The bottom bar shows, left to right: the page state chip (`HOME`, `READ`, or
`404`) and the current location with a blinking cursor; then, on the right, the
back-to-top button paired with reading progress, the language switcher, the
color-mode indicator, the settings gear, and a live clock. Below 640 px the path
and clock drop out and the remaining controls grow to full touch-target size.

Nothing here needs configuration; the mode indicator is an indicator only — the
control that *cycles* dark → light → paper lives in the tool bar.

## Settings window

The gear opens a two-pane floating window:

- **Fonts** — content font family (Default / Sans / Serif / Mono) and size
  (Small / Medium / Large).
- **Language** — switches the UI language in place.

Both persist, and the font choice is restored before first paint so there is no
flash. Floating windows are a single shared instance: opening one replaces
whatever was open, and any of them closes on the close control, a backdrop
click, or `Esc`. Below 640 px they present as a near-full-screen sheet.

## Keyboard

| Key | Does |
| --- | --- |
| `/` | Open the find palette (ignored while typing in an input) |
| `Esc` | Close the floating window, the explorer drawer, or the nav drawer |
| `↑` `↓` `Enter` | Move through and open search results |
| `←` `→` `Home` `End` | Resize a sidebar while its drag handle has focus |

## What gets remembered

Reader preferences are stored in `localStorage` under `ct-` keys, and the ones
that affect first paint are restored before it:

| Key | Holds |
| --- | --- |
| `ct-mode` | Color mode (`dark` default, `light`, `paper`) |
| `ct-lang` | UI language |
| `ct-font-family` / `ct-font-size` | Content font preferences |
| `ct-explorer` | Explorer retracted or not (desktop) |
| `ct-explorer-nodes` | Which folders are expanded |
| `ct-explorer-width` / `ct-toc-width` | Sidebar widths |
| `ct-toc` | TOC retracted or not (desktop) |

Clearing site data resets a reader to the defaults — dark mode, the site's
default language, an expanded shell.

:::::

::::: lang zh-Hans

# 导航与外壳界面

围绕内容的外壳：工具栏、文件浏览器、文章目录、查找面板、状态栏与设置窗口。本页讲
如何配置和使用它们；它们长什么样、为什么这么设计，见
[`design/design-language.md`](../design/design-language.md) §4 与
[`design/ui-sketch.md`](../design/ui-sketch.md)。

整个框架是固定的：只有视口面板滚动，因此阅读时各条栏与面板都停在原处。

## 工具栏

顶部横栏承载站点标题、导航标签页与操作图标。内置的 `~/home` 标签页以及搜索、配色
模式控件始终存在；其余都来自配置。

```ts
toolbar: {
  nav: [
    {
      text: { en: "Guide", "zh-Hans": "指南" },
      link: "/guide/",
      icon: "fa-solid fa-book",
      items: [
        { text: "Getting Started", link: "/guide/getting-started", icon: "fa-solid fa-rocket" },
        { text: "Advanced", link: "/guide/advanced/", icon: "fa-solid fa-flask" },
      ],
    },
    { text: "Archives", link: "/archives", icon: "fa-solid fa-box-archive" },
  ],
  actions: [
    { icon: "fa-brands fa-github", link: "https://github.com/…", label: "GitHub" },
  ],
},
```

- 当前页面与某个标签页的链接匹配时，该标签页会**高亮**——它的任意子链接匹配时也会。
- 带 `items` 的标签页在悬停或键盘聚焦时展开浮动下拉菜单，同时它本身仍是一个链接
  （所以 `link` 仍然必填）。子项都是纯链接，不会再嵌套一层。
- `actions` 是内置控件**之前**的额外图标位——用于社交链接和外部工具的扩展点，无需
  改动任何组件。
- 外部链接在新标签页中打开。

**溢出。** 当横栏放不下完整的标题、标签页与图标时——窗口太窄、站点标题太长、翻译
后的标签页变长——导航与*全部*操作图标会移入右侧、由 `[⋮]` 展开的抽屉。在 640 px
以下始终如此。无需配置，它会自己测量。

## 文件浏览器

左侧面板是 NeoVim 风格的文件浏览器。用自动生成或手写的树来启用它：

```ts
explorer: "auto",
```

设为 `"auto"` 时，`src/` 下的每个 Markdown 页面都会出现：目录变成文件夹，各自的
`index.md` 成为该文件夹的链接，标签来自 frontmatter。不设置（或设为空数组）会
**同时**隐藏文件浏览器与它的工具栏开关。

逐页的控制项都与内容放在一起，而不在站点配置里：

| 若要…… | 这样做 |
| --- | --- |
| 为页面命名 | 在其 frontmatter 中写 `title:`（可本地化） |
| 只改目录树中的名称 | 在其 frontmatter 中写 `explorerTitle:` |
| 为没有 `index.md` 的文件夹命名 | 在其子文件旁放一个带 `title` 的 `explorer.json` |
| 调整同级顺序 | `order:`（数值越小越靠前；负值可置于默认的 `0` 之上） |
| 隐藏某个页面 | 在其 frontmatter 中写 `showInExplorer: false` |
| 隐藏某个文件夹及其下所有内容 | 在其 `explorer.json` 中写 `"showInExplorer": false` |

```json
{
  "title": { "en": "Advanced", "zh-Hans": "进阶" },
  "order": 1
}
```

以上各项的类型与默认值见
[`configuration/frontmatter.md`](../configuration/frontmatter.md)。

**行为。** 第一层文件夹默认展开，更深层默认折叠；当前路由会临时展开其所有祖先；
而你自己切换过的文件夹会被记住并跨刷新保持。点击文件夹的*标签*会打开它的索引页并
展开它——点击箭头则只做展开／折叠。面板可由工具栏的 `[=]` 控件收起，宽度可在
180 px 到 420 px 之间拖动调整（拖拽手柄获得焦点后方向键同样有效）。

在 640 px 以下，文件浏览器变为屏外抽屉，可通过关闭按钮、背景遮罩、`Esc` 或页面跳转
关闭。纸张模式下完全不渲染。

如果你更愿意手写目录树，显式数组依然支持：

```ts
explorer: [
  { text: "Guide", link: "/guide/", items: [
    { text: "Getting Started", link: "/guide/getting-started" },
  ] },
],
```

## 文章目录

右侧的「本页内容」面板由渲染后的标题构建，并跟随你正在阅读的小节。它默认开启：

```ts
toc: { enabled: true, minLevel: 2, maxLevel: 3, minHeadings: 2 },
```

它只在文章类页面上显示，且该页在层级范围内至少有 `minHeadings` 个标题；纸张模式与
打印时从不显示，1024 px 以下也会隐藏。`[«]` 控件可把它收进一条可重新展开的侧边条
（跨刷新记住），宽度可在 160 px 到 400 px 之间拖动。

每个标题另有一个 `#` 控件，点击可将其绝对 URL 复制到剪贴板，并以短暂提示条确认。

## 查找面板

按 `/`（或点击工具栏的放大镜）打开搜索窗口：输入框窗格在上、结果窗格在下，`↑`/`↓`
移动，`Enter` 打开，`Esc` 关闭。这个面板**就是**搜索界面——它直接查询 Algolia，并
在主题自己的窗口中渲染结果。

```ts
search: {
  algolia: {
    appId: "YOUR_APP_ID",
    apiKey: "YOUR_SEARCH_ONLY_API_KEY",
    indexName: "YOUR_INDEX",
  },
},
```

请使用**仅搜索**（search-only）密钥。凭据不完整时，面板依然可以打开，只是提示搜索
尚未配置——不会出错。

## 状态栏

底部横栏从左到右显示：页面状态标记（`HOME`、`READ` 或 `404`）与带闪烁光标的当前
位置；右侧则是返回顶部按钮与阅读进度、语言切换、配色模式指示、设置齿轮，以及实时
时钟。在 640 px 以下，路径与时钟会隐去，其余控件放大到完整的触摸目标尺寸。

这里没有需要配置的内容；模式指示仅仅是指示——真正**循环切换**深色 → 浅色 → 纸张
的控件在工具栏中。

## 设置窗口

齿轮会打开一个双窗格浮动窗口：

- **字体** —— 正文字族（默认／无衬线／衬线／等宽）与字号（小／中／大）。
- **语言** —— 就地切换界面语言。

两者都会被记住，且字体选择在首次绘制前就已恢复，因此不会闪烁。浮动窗口只有一个共享
实例：打开一个就会替换掉当前打开的那个，任何一个都可通过关闭控件、点击背景或 `Esc`
关闭。在 640 px 以下，它们以接近全屏的面板呈现。

## 键盘

| 按键 | 作用 |
| --- | --- |
| `/` | 打开查找面板（在输入框中键入时忽略） |
| `Esc` | 关闭浮动窗口、文件浏览器抽屉或导航抽屉 |
| `↑` `↓` `Enter` | 在搜索结果中移动并打开 |
| `←` `→` `Home` `End` | 侧栏拖拽手柄获得焦点时调整其宽度 |

## 哪些偏好会被记住

读者的偏好保存在 `localStorage` 的 `ct-` 系列键中，其中影响首次绘制的那些会在绘制前
恢复：

| 键 | 保存内容 |
| --- | --- |
| `ct-mode` | 配色模式（默认 `dark`，另有 `light`、`paper`） |
| `ct-lang` | 界面语言 |
| `ct-font-family` / `ct-font-size` | 正文字体偏好 |
| `ct-explorer` | 文件浏览器是否收起（桌面端） |
| `ct-explorer-nodes` | 哪些文件夹处于展开状态 |
| `ct-explorer-width` / `ct-toc-width` | 侧栏宽度 |
| `ct-toc` | 目录是否收起（桌面端） |

清除站点数据会让读者回到默认状态——深色模式、站点默认语言、完全展开的外壳。

:::::
