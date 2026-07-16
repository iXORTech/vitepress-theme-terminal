# Content Architecture — `src/` layout & page types

> **Binding design document.** Defines how site content is organized under `src/`
> (the VitePress `srcDir`) and how the theme renders each kind of page. The directory
> layout follows
> [`iXORTech/vitepress-theme-arch`](https://github.com/iXORTech/vitepress-theme-arch/tree/main/src).
> The **structure** here is binding; individual demo file names are illustrative.
> Task board: [`ARCH-001`](../../.agent/plan.md) establishes the layout and the
> page-type dispatch; the listing/route pages are filled in by `POST-001` (tags &
> categories) and `POST-002` (posts & series).

## 1. Why this exists

VitePress treats every Markdown file as a page and every theme as a single `Layout`.
A blog / personal site needs several *kinds* of page — a home page, standalone pages,
posts, series articles, and generated listing pages — each with different chrome
(shell-prompt cards, article meta, license & comment cards, index listings, series
navigation). This document fixes two things:

1. the **directory convention** that classifies a page by where it lives, and
2. the **page-type dispatch** in the layout that renders a dedicated Vue component
   per kind, so each type's chrome can be customized independently.

## 2. Directory layout

Normal, standalone pages sit **directly in `src/`** (flat, no `pages/` folder).
Articles are grouped into `posts/` and `series/`. Generated listing pages and their
dynamic routes have fixed paths. Static assets live in `public/`.

```
src/
├── index.md                 Home page — normal page, "home" variant (PAGE-001)
├── about.md                 About Me page (PAGE-003)
├── projects.md              Projects page (PAGE-002)
├── friends.md               Friends page (PAGE-004)
│
├── posts.md                 Post index (POST-001)
├── archives.md              All posts, by date (POST-001)
├── categories.md            Category index (POST-001)
├── tags.md                  Tag index (POST-001)
├── series.md                Series index (POST-002)
│
├── posts/                   Regular posts (POST-002)
│   └── <post>.md
├── series/                  Series articles (POST-002)
│   └── <series-name>/
│       ├── index.md         Series landing page (optional)
│       ├── <article>.md
│       └── series.yml       Per-series config — icon/title/description (localized)
│
├── categories/
│   ├── [name].md            Dynamic per-category listing (POST-001)
│   └── [name].paths.mjs     Build-time route loader
├── tags/
│   ├── [name].md            Dynamic per-tag listing (POST-001)
│   └── [name].paths.mjs
├── page/                    Post-list pagination — used in post index (POST-001 & POST-002)
│   ├── [num].md
│   └── [num].paths.mjs
│
└── public/                  Static assets, served at the site root
    └── images/…
```

Rationale for the flat placement of normal pages: it keeps their URLs clean
(`/about`, `/projects`) and lets the auto-discovery explorer (`explorer: "auto"`,
THEME-012) list them at the top level without a hand-written tree, while `posts/`
and `series/` stay clearly separated as article namespaces.

## 3. Page types

Every page resolves to exactly one type. The type is derived from the page's
location under `src/` plus a small amount of frontmatter, and it selects the Vue
component that renders the page body inside the shell viewport.

| Type | Source location | Detected by | Chrome |
| --- | --- | --- | --- |
| **Home** | `src/index.md` | `frontmatter.home` (root index) | Welcome card **with** shell prompt (PAGE-001); no article footer |
| **Normal page** | any `*.md` directly in `src/` that is not a listing page | default for top-level files | Plain content; optional grid/cards (PAGE-002/003/004); no license/comment cards |
| **Post** | `src/posts/**/*.md` | `posts/` prefix | Article meta (views/comments), license card, comment card |
| **Series article** | `src/series/<series>/**/*.md` | `series/` prefix | Post chrome **plus** series breadcrumb/navigation and the series' icon/title |
| **Listing page** | `archives.md`, `categories.md`, `tags.md`, `series.md`, and the `categories/[name]`, `tags/[name]`, `page/[num]` routes | fixed paths / dynamic route | Generated index listings (POST-001/POST-002); no article footer |
| **404** | the not-found page | `page.isNotFound` | Minimal not-found content |

Frontmatter escape hatches (already partly in place via the `isArticle` guard):
`article: false` opts a post out of article chrome, `license: false` /
`comments: false` drop the respective cards, and an explicit page-type override key
may force a type when path-based detection is not enough.

**Explorer visibility (ARCH-002).** A page may set `showInExplorer: false` in its
frontmatter to be omitted from the auto-discovered explorer tree (default `true` —
everything under `src/` is listed). A folder opts out — subtree included — via
`showInExplorer: false` in its source-local `explorer.json`. The page still builds
and stays reachable by URL; only the navigation tree is affected. Full semantics in
[`design-language.md`](design-language.md) §4 (file explorer, visibility toggle).

**Localized frontmatter (ARCH-003).** Every frontmatter field that is *displayed*
to the reader — `title`, `description`, the `series.yml` title/description
(POST-002) — accepts a per-language map (`{ en: …, zh-Hans: … }`) as well as a
plain string, resolved against the client-side UI language by the standard
fallback. The plain string remains the default form. Pattern and consumers in
[`design-language.md`](design-language.md) §9 (localized frontmatter fields).

The difference between a post index and an archive list is that the former is a more
visually rich landing page, showing recent posts with tags, categories, series, cover,
and similar elements shown. WHile, the archive list is a simple chronological timeline-style
list of all posts, with no extra chrome.

## 4. Page-type dispatch

The theme `Layout` is the single dispatcher. It classifies the active page with a
resolver (path prefix under `src/` → type, with the frontmatter escape hatches
above), then renders the matching page-type component in place of the current
inline content branch. Each type is its **own** Vue component
(e.g. `pages/HomePage.vue`, `pages/NormalPage.vue`, `pages/PostPage.vue`,
`pages/SeriesArticlePage.vue`, `pages/ListingPage.vue`, `pages/NotFoundPage.vue`),
so the layout for each kind can evolve independently without branching logic piling
up in `Layout.vue`. The shell chrome (tool bar, explorer, status bar, footer,
floating window) stays shared and wraps whichever page-type component is active.

This generalizes the current ad-hoc branching in `Layout.vue` — the placeholder
home branch and the `isArticle` guard that appends `ArticleMeta` / `ArticleLicense`
/ `ArticleComments` — into one explicit, extensible page-type layer.

> **Implemented (ARCH-001, 2026-07-14).** The resolver is
> `.vitepress/theme/utils/pageType.ts` `resolvePageType()`, called by `Layout.vue`
> to pick a `theme/pages/*Page.vue`. The explicit override key is frontmatter
> `pageType` (one of the six type names). `article: false` drops a post/series
> article to the normal type; `license: false` / `comments: false` still drop just
> the respective end-of-article cards within `PostPage`. The series-article banner
> is currently derived from the folder name — the `series.yml` icon/title chrome
> is completed by POST-002. `NotFoundPage` is client-rendered: VitePress emits a
> `404.html` with an empty app root that hydrates through the dispatch.

## 5. Series configuration

Each series folder under `src/series/` carries a config file (the reference uses
`index.mjs`; this theme uses a per-series **YAML** config, `series.yml`) providing
the series' **icon**, **title**, and **description**, each with localized versions
(`LocalizableText`, per the i18n rules). Series and the articles within a series
sort by an `order` attribute (default `0`, smaller = higher), falling back to
alphabetical. The exact schema and the archive-inclusion toggles are defined by
`POST-002`.

## 6. Static assets

Files under `src/public/` are copied to the site root unchanged (VitePress
convention) — favicons, fonts, and content images referenced with root-absolute
paths (`/images/…`). This matches the existing `src/public/images/` used by the
COMP-002 swiper demo.

## 7. Relationship to build tasks

| Concern | Task |
| --- | --- |
| Directory convention + page-type components + dispatch | `ARCH-001` |
| Tags, categories, archives, and their listing/route pages | `POST-001` |
| Posts, series, series config, archive-inclusion toggles | `POST-002` |
| Home / Projects / About / Friends normal pages | `PAGE-001`…`PAGE-004` |

> **Implemented (POST-001, 2026-07-14).** Posts under `src/posts/` declare
> `tags` / `categories` (a string or a list) in frontmatter; each becomes a link
> to `/tags/<slug>` or `/categories/<slug>` (slug = lowercased, accent-stripped,
> space-to-`-`). The build-time index is `.vitepress/theme/posts.data.mts`
> (a `createContentLoader('posts/**/*.md')`), with the aggregation helpers in
> `theme/posts.ts` shared by the dynamic-route `[name].paths.mjs` loaders. The
> post index paginates at `POSTS_PER_PAGE = 10`: **page 1 is `/posts`**, and
> `/page/<n>` covers pages 2…N. Series articles are intentionally excluded from
> these listings — whether they join is a POST-002 toggle. Labels are localized
> (`post.*`); the tag/category *names* are authored content and stay verbatim in
> slugs, URLs, and grouping — their *displayed* labels can localize through the
> dedicated `themeConfig.taxonomy` map (I18N-008,
> [`design-language.md`](design-language.md) §9, localizable taxonomy labels).
