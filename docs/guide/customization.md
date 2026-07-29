---
title:
  en: "Customization"
  zh-Hans: "自定义"
order: 6
---
::::: lang en

# Customization

How far you can take the theme without forking its intent: colors and modes,
fonts and icons, your own page views, the custom pre-footer section, friend-link
data, and the styling rules to work within.

## Color

**One color configures the theme.**

```ts
mainColor: "#80E0A7",
```

Every auxiliary tone — hover, dimmed text, subtle backgrounds, borders,
selection — is *derived* from it in SCSS. That is a hard rule, not a
convenience: [`design/color-system.md`](../design/color-system.md) §3. If you
need a variant, compute it from `--ct-main`; don't add a second configurable
color.

The value is written into `<head>` at build time as the `--ct-main` custom
property, so the first paint is already your color.

Body text stays neutral in every mode; the main color is for emphasis and
interaction — links, bold, headings, inline code, buttons, active states,
selection.

### The three color modes

| Mode | For | Default |
| --- | --- | --- |
| `dark` | The default terminal look | ✔ |
| `light` | Bright environments | |
| `paper` | Reading and printing — no explorer, no TOC, reduced chrome | Also applied automatically via `@media print` |

Readers cycle them from the tool bar; the choice is remembered and restored
before first paint. The status bar shows the active mode as an indicator only.
Base palettes come from IBM Carbon, and code blocks use Oxocarbon — dark and
light for the matching modes, a lighter variant for paper.

## Fonts and icons

Typefaces and icon fonts load as **stylesheets injected into `<head>`** — never
as npm packages. The one place they are declared is
[`.vitepress/theme/head.ts`](../../.vitepress/theme/head.ts):

| Resource | Source | Used for |
| --- | --- | --- |
| IBM Plex Sans / Serif / Mono | Google Fonts CSS | All UI and content text |
| IBM Plex Math | jsDelivr (`@ibm/plex-math`) | LaTeX (MathML) and Typst math |
| Font Awesome Free | cdnjs | General-purpose icons |
| Nerd Font Symbols | jsDelivr (`ryanoasis/nerd-fonts`) | TUI chrome only |

To self-host, change those URLs (and, if you self-host the Nerd Font, keep the
family name the runtime check expects). To change the *font stack*, edit
`styles/_fonts.scss`. Readers can additionally pick a content font family and
size in the settings window; that preference layers on top of your defaults.

The icon split is deliberate: Font Awesome for general icons anywhere, Nerd Font
strictly for TUI chrome (tool bar, status bar, explorer, callouts). Nerd Font
glyphs are gated behind a font-loaded check with a tofu-safe fallback, so a
blocked CDN degrades to plain markers instead of boxes. Rationale:
[`design/typography-and-icons.md`](../design/typography-and-icons.md).

## Styling rules

Three rules keep the theme coherent — follow them in anything you add:

1. **SCSS only.** All styling lives in `.scss` partials under
   `.vitepress/theme/styles/`, one per concern, imported by `main.scss`. Never
   a `<style>` block in a Vue SFC, never a plain `.css` file.
2. **Derive colors**, never hardcode a variant of the main color.
3. **Mobile is first-class.** Every interactive control is a ≥44 px touch target
   below 640 px, and no layout may overflow at 360 px.

To restyle an existing surface, edit its partial (`_toolbar.scss`,
`_explorer.scss`, `_posts.scss`, …). To style something new, add a partial and
`@use` it from `main.scss`.

## Authored page views

Pages that are mostly components rather than prose — About, Projects, a
portfolio — are written as **Vue views** under `.vitepress/theme/views/`, and
imported by a thin Markdown page. The `@` alias points at `.vitepress/theme`:

```md
---
title: About
---

<script setup>
import About from "@/views/About.vue";
</script>

<About />
```

The shipped `views/About.vue` and `views/Projects.vue` are language
dispatchers: they render `views/about/en.vue` or `views/about/zh-Hans.vue` for
the active UI language (matched by primary subtag, falling back to English), so
switching language re-renders in place. Single-language sites can skip the
dispatcher and author one component.

Inside a view, use the theme's `Card` and the shared card grid — a six-column
track with span modifiers you can mix per row:

```vue
<ul class="ct-cardgrid">
  <li class="ct-cardgrid__item ct-cardgrid__item--full">…</li>
  <li class="ct-cardgrid__item ct-cardgrid__item--two-thirds">…</li>
  <li class="ct-cardgrid__item ct-cardgrid__item--third">…</li>
</ul>
```

Modifiers: `--third`, `--half`, `--two-thirds`, `--full`. Below 640 px the grid
collapses to a single column. Card width and the shell prompt are independent —
any card can have either.

The full pattern, and why views live in the theme rather than in `src/`, is in
[`design/content-architecture.md`](../design/content-architecture.md) §8.

## The custom pre-footer section

The strip directly above the footer is a named layout slot you fill by wrapping
the theme's `Layout`:

```vue
<!-- .vitepress/theme/SiteLayout.vue -->
<script setup lang="ts">
import Layout from './Layout.vue'
import MySection from './components/MySection.vue'
</script>

<template>
  <Layout>
    <template #pre-footer>
      <MySection />
    </template>
  </Layout>
</template>
```

Then register the wrapper as the theme's Layout in
`.vitepress/theme/index.ts` (import `Layout.vue` directly, as above, rather than
the `Layout` re-export from `index.ts` — a wrapper living inside the theme would
otherwise import the module that imports it). Unfilled, the slot renders nothing — and when it is
filled, the footer automatically grows the subtler inner separator between your
section and the standard rows. The demo ships exactly this pattern as
`DemoLayout.vue` + `PreFooterDemo.vue`; replace or remove both.

## Friend links

The friends page reads **data modules**, not configuration: every
`linksData.mjs` under `.vitepress/theme/assets/` (at any depth) is picked up at
build time, so a generator repository can be added as a git submodule and
hand-authored entries can sit beside it.

```js
const linksData = [
  {
    group: "friends",
    groupName: { en: "Friends", "zh-Hans": "朋友们" },
    groupDesc: { en: "The people behind the links." },
    entries: [
      {
        title: "Qubik's Website",
        url: "https://qubik.top",
        description: { en: "The theme author's corner of the web." },
        avatar: "https://github.com/Qubik65536.png",
      },
    ],
  },
];

export default linksData;
```

Sources merge by `group` id: the first occurrence fixes the group's position,
labels come from the first source that provides them, and later sources append
their entries. Generated data uses plain strings; hand-authored files may use
per-language maps, and `themeConfig.friends.groups` can relabel a generated
group without touching the data. Entries without an avatar get a placeholder
glyph, and a broken avatar URL falls back to it too.

Format details and the generator workflow:
[`design/friend-links.md`](../design/friend-links.md).

## Favicon and site mark

The favicon is `src/public/favicon.svg`, referenced from `head.ts`. Replace the
file, or point the `<link>` at your own asset.

One constraint on the chrome itself: **no third-party branding** in the tool
bar, status bar, or window frames — no VitePress or Vue logos, no framework
wordmarks. The footer's "Powered by" line is the place for attribution. This is
a binding identity rule
([`design/design-language.md`](../design/design-language.md) §3), and the reason
the theme ships its own mark rather than borrowing one.

## Going further

Anything beyond this means editing theme internals — components under
`.vitepress/theme/components/`, page types under `pages/`, behavior under
`composables/`. That is supported (it's your copy of the theme), but read the
design documents first: they are binding for the parts of the UI they cover, and
following them is what keeps a modified theme coherent.

:::::

::::: lang zh-Hans

# 自定义

在不背离主题设计意图的前提下，你能走多远：颜色与配色模式、字体与图标、你自己的页面
视图、页脚上方的自定义区域、友链数据，以及必须遵守的样式规则。

## 颜色

**一个颜色配置整个主题。**

```ts
mainColor: "#80E0A7",
```

每一种辅助色调——悬停、暗淡文字、微弱背景、边框、选区——都在 SCSS 中由它*派生*。
这是硬性规则，而非便利做法：
[`design/color-system.md`](../design/color-system.md) §3。如果你需要某个变体，请由
`--ct-main` 计算得出，而不要再引入第二个可配置颜色。

该值会在构建时写入 `<head>`，作为 `--ct-main` 自定义属性，因此首屏绘制出来的就已经
是你的颜色。

正文在任何模式下都保持中性色；主色用于强调与交互——链接、粗体、标题、行内代码、
按钮、激活态、选区。

### 三种配色模式

| 模式 | 适用场景 | 默认 |
| --- | --- | --- |
| `dark` | 默认的终端观感 | ✔ |
| `light` | 明亮环境 | |
| `paper` | 阅读与打印——没有文件浏览器、没有目录、界面元素精简 | 同时通过 `@media print` 自动应用 |

读者可以在工具栏中循环切换；选择会被记住，并在首次绘制前恢复。状态栏只把当前模式
显示为指示。基础色板来自 IBM Carbon，代码块使用 Oxocarbon——深色与浅色对应各自的
模式，纸张模式使用更浅的一套。

## 字体与图标

字体与图标字体都以**注入 `<head>` 的样式表**方式加载——绝不通过 npm 包。它们唯一
的声明位置是 [`.vitepress/theme/head.ts`](../../.vitepress/theme/head.ts)：

| 资源 | 来源 | 用途 |
| --- | --- | --- |
| IBM Plex Sans / Serif / Mono | Google Fonts CSS | 所有界面与正文文字 |
| IBM Plex Math | jsDelivr（`@ibm/plex-math`） | LaTeX（MathML）与 Typst 公式 |
| Font Awesome Free | cdnjs | 通用图标 |
| Nerd Font Symbols | jsDelivr（`ryanoasis/nerd-fonts`） | 仅用于 TUI 界面框架 |

若要自托管，请改这些 URL（如果自托管 Nerd Font，还要保持运行时检测所期望的字族
名）。若要改*字体栈*，请编辑 `styles/_fonts.scss`。读者还可以在设置窗口中选择正文
字族与字号；该偏好会叠加在你的默认值之上。

图标的分工是刻意的：Font Awesome 用于任何位置的通用图标，Nerd Font 严格限于 TUI
界面框架（工具栏、状态栏、文件浏览器、提示框）。Nerd Font 字形受一个「字体已加载」
检测控制，并有防豆腐块的回退方案，因此 CDN 被拦截时会降级为普通标记而不是方框。
理由见 [`design/typography-and-icons.md`](../design/typography-and-icons.md)。

## 样式规则

三条规则维系着主题的一致性——你新增的任何东西都请遵守：

1. **只用 SCSS。** 所有样式都写在 `.vitepress/theme/styles/` 下的 `.scss` 分部文件
   中，一个关注点一个文件，由 `main.scss` 引入。绝不在 Vue SFC 中写 `<style>` 块，
   也绝不使用纯 `.css` 文件。
2. **派生颜色**，绝不硬编码主色的变体。
3. **移动端重点适配** 在 640 px 以下，每个可交互控件都是 ≥44 px 的触摸目标；
   在 360 px 下任何布局都不得溢出。

要修改现有界面的样式，请编辑对应的分部文件（`_toolbar.scss`、`_explorer.scss`、
`_posts.scss` 等）。要为新东西写样式，请新增一个分部文件并在 `main.scss` 中
`@use` 它。

## 手写页面视图

主要由组件而非文字构成的页面——关于我、项目、作品集——写作
`.vitepress/theme/views/` 下的 **Vue 视图**，再由一个很薄的 Markdown 页面导入。
`@` 别名指向 `.vitepress/theme`：

```md
---
title: About
---

<script setup>
import About from "@/views/About.vue";
</script>

<About />
```

主题自带的 `views/About.vue` 与 `views/Projects.vue` 是语言分发器：它们按当前界面
语言渲染 `views/about/en.vue` 或 `views/about/zh-Hans.vue`（按主语言子标签匹配，
回退到英文），因此切换语言会就地重新渲染。单语言站点可以省去分发器，直接写一个
组件。

在视图内部，请使用主题的 `Card` 与共享的卡片栅格——一个六列轨道，跨列修饰类可以
逐行混用：

```vue
<ul class="ct-cardgrid">
  <li class="ct-cardgrid__item ct-cardgrid__item--full">…</li>
  <li class="ct-cardgrid__item ct-cardgrid__item--two-thirds">…</li>
  <li class="ct-cardgrid__item ct-cardgrid__item--third">…</li>
</ul>
```

修饰类有 `--third`、`--half`、`--two-thirds`、`--full`。在 640 px 以下栅格会收成
单列。卡片宽度与 shell 提示符互不相关——任何卡片都可以两者兼得或只取其一。

完整的模式，以及视图为何放在主题内而不是 `src/` 中，见
[`design/content-architecture.md`](../design/content-architecture.md) §8。

## 页脚上方的自定义区域

页脚正上方那一条是一个具名布局插槽，通过包装主题的 `Layout` 来填充：

```vue
<!-- .vitepress/theme/SiteLayout.vue -->
<script setup lang="ts">
import Layout from './Layout.vue'
import MySection from './components/MySection.vue'
</script>

<template>
  <Layout>
    <template #pre-footer>
      <MySection />
    </template>
  </Layout>
</template>
```

然后在 `.vitepress/theme/index.ts` 中把这个包装组件注册为主题的 Layout（像上面那样
直接 import `Layout.vue`，而不是 `index.ts` 中导出的 `Layout`——住在主题内部的包装
组件否则会导入那个正在导入它的模块）。插槽未填充时不渲染任何内容；一旦填充，页脚会
自动加上你的区域与标准页脚行之间那条更细的内分隔线。演示站点正是以
`DemoLayout.vue` + `PreFooterDemo.vue` 提供了这一模式；替换或删除它们即可。

## 友链

友链页面读取的是**数据模块**而非配置：`.vitepress/theme/assets/` 下任意层级的每个
`linksData.mjs` 都会在构建时被拾取，因此可以把生成器仓库作为 git 子模块加进来，并让
手写条目与它并存。

```js
const linksData = [
  {
    group: "friends",
    groupName: { en: "Friends", "zh-Hans": "朋友们" },
    groupDesc: { en: "The people behind the links." },
    entries: [
      {
        title: "Qubik's Website",
        url: "https://qubik.top",
        description: { en: "The theme author's corner of the web." },
        avatar: "https://github.com/Qubik65536.png",
      },
    ],
  },
];

export default linksData;
```

各数据源按 `group` id 合并：首次出现的位置决定该分组的位置，标签取自第一个提供它们
的数据源，之后的数据源追加自己的条目。生成的数据使用普通字符串；手写文件可以使用
分语言映射，而 `themeConfig.friends.groups` 可以在不改动数据的前提下为生成的分组
换名。没有头像的条目会显示占位图标，头像 URL 失效时也会回退到它。

数据格式细节与生成器工作流见
[`design/friend-links.md`](../design/friend-links.md)。

## 站点图标与标识

站点图标是 `src/public/favicon.svg`，在 `head.ts` 中引用。替换该文件，或把 `<link>`
指向你自己的资源即可。

对界面框架本身有一条约束：工具栏、状态栏与窗口框架中**不得出现第三方品牌**——没有
VitePress 或 Vue 的徽标，没有框架的文字标识。页脚的「Powered by」一行才是署名之处。
这是一条具有约束力的身份规则
（[`design/design-language.md`](../design/design-language.md) §3），也是主题自带
标识而不借用他人标识的原因。

## 再往前一步

超出以上范围就意味着改动主题内部实现——`.vitepress/theme/components/` 下的组件、
`pages/` 下的页面类型、`composables/` 下的行为。这是被支持的（这是你自己的一份主题
副本），但请先读设计文档：它们对所覆盖的界面部分具有约束力，遵循它们正是一个被改动
过的主题依然保持一致的原因。

:::::
