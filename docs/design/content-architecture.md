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

**Explorer ordering (ARCH-004).** An auto-discovered page or folder may set an
`order` (any finite number, smaller sorts higher, default `0`) to control its
position among its siblings — a page in frontmatter, a folder in its
`explorer.json` (which wins) or `index.md` frontmatter. Negatives pin an entry
above the unnumbered `0` siblings; equal orders keep the folders-first-then-name
fallback, so untouched trees are unchanged. Display-only. Full semantics in
[`design-language.md`](design-language.md) §4 (file explorer, sibling ordering).

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

> **Implemented (POST-002, 2026-07-16).** The `series.yml` schema (all fields
> optional, validated by `asLocalizableText()` so malformed values degrade to
> defaults):
>
> ```yaml
> icon: nf-fa-terminal          # Font Awesome or Nerd Font `nf-*` class
> title:                        # LocalizableText; default: the folder name
>   en: Terminal Internals
>   zh-Hans: 终端内幕
> description:                  # LocalizableText; default: none
>   en: A short series on how the theme's shell is built.
>   zh-Hans: 关于主题外壳如何构建的简短系列。
> order: 0                      # series-index position; smaller = higher
> ```
>
> The file is parsed at build time by `.vitepress/theme/series.data.mts`
> (js-yaml). `order` accepts any finite number (negative and fractional
> included; non-finite → the default `0`); ties sort alphabetically by the
> folder name. **Articles** inside a series sort by their own frontmatter
> `order` with the same semantics, ties alphabetical by URL. A series folder
> without a `series.yml` still works with folder-name defaults. Surfaces:
> `<SeriesIndex/>` renders the series index on `series.md` (icon · localized
> title/description · article count); `<SeriesArticles/>` on a series landing
> page lists that series' articles in reading order; the series-article banner
> (`SeriesArticlePage`) shows the icon, localized title, and description above
> every part. `nf-*` icons render through the theme's gated Nerd Font face
> (hidden, not tofu, when the font is unavailable).
>
> **Listing-inclusion toggles.** `themeConfig.series =
> { inPosts?, inArchives?, inCategories?, inTags? }` (all default `false`)
> decide whether series articles ALSO join the general post listings — the post
> index/pagination, the archives timeline, and the category/tag indexes and
> per-term pages. An admitted series article carries its localized series name
> before the title (`Series Name › Article Title`, prefix dimmed) in the
> archives rows and the per-term listing cards, where the card's series chip is
> then omitted; the series landing list keeps the bare titles plus the chip.
> Series landing pages (`series/<name>/index.md`) are
> navigational and never aggregated. The build-time dynamic-route loaders
> (`src/{tags,categories}/[name].paths.mjs`, `src/page/[num].paths.mjs`) import
> the site's `themeConfig` and apply the same filter, so generated routes always
> match what the components display.

## 5a. Cover images

> **Implemented (POST-003, 2026-07-16; seamless rework 2026-07-17).** A post or
> series article may declare an optional frontmatter `cover` (an image URL —
> root-absolute paths honor the site base, external URLs pass through). The
> cover integrates into its container rather than sitting beside it:
>
> - **Post-list cards** — a full-height image panel bleeding to the card's
>   right frame edges, cropped with `object-fit: cover` and faded into the
>   card surface by a left-edge gradient mask; on mobile it becomes a
>   full-width top strip fading downward into the card body.
> - **Article header** — the header becomes a framed hero banner showing the
>   **full, uncropped** cover at its natural aspect (full width, height auto,
>   so the banner is as tall as the image needs). The image renders at **full
>   opacity**; only its lower edge — the strip behind the overlaid byline
>   (date, categories, tags) — is masked, fading into the header surface so
>   the byline stays readable while the rest of the image stays vivid (the
>   fade starts higher on mobile, where the byline covers more of the frame).
>   Without a cover the header keeps its plain separator-rule look.
>
> Covers stay real `<img>` elements (alt = localized title), lazy-loaded
> (`loading="lazy"`, `decoding="async"`), and the layout degrades gracefully
> when no cover is present. Card covers are wrapped in the post link (a tap
> navigates); the article-header cover carries `data-no-lightbox`, so neither
> joins the COMP-002 lightbox gallery.

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
| Post/series-article cover images | `POST-003` |
| Home / Projects / About / Friends normal pages | `PAGE-001`…`PAGE-004` |

> **Friends page (PAGE-004).** `src/friends.md` is a normal page whose links
> are fed by external `linksData.mjs` data modules (hand-authored and/or a
> git-submodule-synced generator output) — the full data format, discovery,
> i18n, and composition spec is [`friend-links.md`](friend-links.md).

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

> **Implemented (PAGE-001/002/003, 2026-07-18; projects/About reworked to
> authored views the same day).**
>
> - **Home** (`src/index.md`, `home` page type → `pages/HomePage.vue`) renders
>   a single reusable `Card` **with** the shell prompt from `themeConfig.home`
>   (`command` default `whoami`; `greeting`/`tagline`/`body` LocalizableText,
>   falling back to the localized site title/description; `links`
>   call-to-action buttons). This one stays config-driven — it is a single
>   welcome card.
> - **Projects** (`src/projects.md`) and **About** (`src/about.md`) are normal
>   pages whose body is a hand-authored, per-language **Vue view** (§8),
>   following the reference theme's `views/About.vue` pattern rather than a
>   config schema — a personal projects/About page is rich, bespoke content.
>   Each `.md` imports its view via the `@` alias
>   (`import About from "@/views/About.vue"`) and renders it.
>
> Both authored views use the theme's `Card` component and the shared card grid
> (`.ct-cardgrid`): a `featured` grid item spans the full row and carries the
> shell prompt, the rest are plain grid cards (design-language.md §4, cards —
> "more featured content carries the extra decoration"). The grid collapses to
> one column on mobile; `nf-*` card icons are Nerd-Font-gated. Styles are in
> `.vitepress/theme/styles/_pages.scss` (never in an SFC `<style>` block —
> AGENTS.md §6.3).

## 8. Authored page views (`.vitepress/theme/views/`)

Some pages are not lists of data but bespoke, personal content — the projects
page and the About page (`PAGE-002`/`PAGE-003`). Rather than force that content
into a rigid `themeConfig` schema, the theme authors it as **Vue views**,
following the layout the reference theme
([`iXORTech/vitepress-theme-arch`](https://github.com/iXORTech/vitepress-theme-arch/blob/main/src/about.md))
uses for its About page:

- View components live under **`.vitepress/theme/views/`**, kept separate from
  the reusable `components/` (which hold shared building blocks like `Card.vue`)
  and from `pages/` (the six page-**type** dispatch components).
- The page's Markdown file imports its view in a `<script setup>` block and
  renders it — e.g. `src/about.md`:

  ```md
  <script setup>
  import About from "@/views/About.vue";
  </script>

  <About />
  ```

- The `@` alias resolves to `.vitepress/theme` (configured in
  `.vitepress/config.mts` under `vite.resolve.alias`), so content pages import
  theme code with a clean `@/…` path. The bare `@` alias only matches `@` and
  `@/…`, so scoped packages (`@waline/client`, …) are unaffected.
- Each view is a thin **language dispatcher** (`views/About.vue`,
  `views/Projects.vue`) that renders a hand-authored per-language content
  component (`views/about/en.vue`, `views/about/zh-Hans.vue`, and likewise for
  projects) chosen from the active UI language (`useThemeLocale().language`,
  matched by primary subtag with an English fallback). Because the language
  ref is reactive, switching the UI language re-renders the matching component
  **in place**, consistent with the rest of the theme's URL-free i18n (§9 of
  [`design-language.md`](design-language.md)).
- The authored components use the theme's `Card` component and the shared card
  grid (`.ct-cardgrid`, styles in `styles/_pages.scss`). The grid is a
  **6-column track** (the LCM of halves and thirds), so each item picks a
  fractional width with a span modifier on `.ct-cardgrid__item` —
  `--third` (1/3), `--half` (1/2), `--two-thirds` (2/3), or `--full` (whole
  row) — and any per-row mix that adds up works: `1/3 + 2/3`, `1/2 + 1/2`,
  `2/3 + 1/3`, or a single full-width card. Width and the shell prompt are
  orthogonal: the prompt is set per `Card` with `show-prompt` (a lead card is
  typically `--full` + a prompt). Below 640px the grid collapses to a single
  column. All styling stays in SCSS partials, never in SFC `<style>` blocks
  (AGENTS.md §6.3).

To adapt these pages, a site owner edits the per-language view files directly —
that authoring **is** the configuration surface for this kind of page.
