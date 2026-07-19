# Context Cache

Brief per-file summaries of the repository — purpose plus the essentials, 1–3 lines
each. **Update whenever a file is added, meaningfully changed, or removed** (rule:
[`AGENTS.md`](../AGENTS.md) §5). Last updated: 2026-07-18 (**ARCH-004 landed**
— explorer sibling ordering for auto-discovery: an `order` attribute (any
finite number, smaller = higher, default `0`, negatives/fractions honored,
non-finite → `0`) on a page's frontmatter or a folder's `explorer.json`
(wins) / `index.md` frontmatter reorders auto-discovered siblings, with the
folders-first-then-natural-name comparison kept as the tie-break so
unconfigured trees are unchanged. `useExplorer.ts` now sorts each level with
`siblingComparator(directorySegments)` → `branchOrder()` (`explorer.json` →
page frontmatter → `0`, filtered by `toFiniteOrder()`); `compareBranches`
renamed `compareBranchNames`; new `order?: number` on `ExplorerJsonConfig`.
Display-only (URLs/discovery/routes untouched), SSR + client identical,
explicit `themeConfig.explorer` arrays bypass it. Demo: `guide/getting-started`
frontmatter `order:-1` (above the `advanced` folder) + `advanced-2`
`explorer.json` `order:1` (below `deep-dive`). Docs: design-language.md §4
sibling ordering, content-architecture.md §3, guide/getting-started.md. Build
green; headless-verified both demo cases + unchanged name order elsewhere.)
Earlier same day (**PAGE-004 landed**
— friends page implemented per the binding spec `docs/design/friend-links.md`
(written + confirmed the same day). Data: external
`blog-friend-links-data-generator` format — `linksData.mjs` array of
`{ group, groupName, groupDesc, entries: [{ title, url, description?,
avatar?, screenshot? (reserved) }] }` (entry field is `title` — the generator
design-doc's `name` sample is outdated; the real issue template uses `title`).
New framework-free `theme/friends.ts`: `mergeFriendSources()` — validation via
`asLocalizableText()` with skip warnings; depth-then-path source ordering;
same-`group`-id merge (first occurrence fixes position, labels from the first
source that PROVIDES them, later sources append entries). New
`components/FriendLinks.vue` (registered globally, placed by new
`src/friends.md`): module-scope eager glob `../assets/**/linksData.mjs` → SSR
HTML, no client fetch; group label resolution `themeConfig.friends.groups`
override → data label → id verbatim (reactive on language); `[⇄ random]`
control (`window.open` `_blank,noopener`); avatar `<img>` hides on `@error`,
revealing the placeholder glyph behind (no-avatar entries render glyph only).
Config: `TerminalFriendsConfig = { showCount?, showRandom?, groups? }`
(defaults true/true/{}) in config.ts; new `friends.random`/`friends.empty`
strings (en + zh-Hans). Styles: new `_friends.scss` under `.ct-content`
(auto-fill minmax(15rem,1fr) grid, single column ≤640px, derived-accent
hover). Demo: `data`-branch submodule `theme/assets/generatedLinkData` (in
`.gitmodules`) + hand-authored `theme/assets/linksData.mjs` (localized
`friends` group, no-avatar entry, unlabeled `group1` merging into the
generated group) + config.mts `friends.groups` override localizing generated
`group2` + Friends nav tab; `src/friends.md` authors intro/apply sections in
`::: lang` blocks (duplicate explicit `{#apply}` ids across lang blocks break
the VitePress build — dropped). The submodule's avatar URL 404s, organically
exercising the error fallback. Gotcha: a JSDoc comment containing the literal
glob `assets/**/…` terminates the block comment at `*/` — reworded in
config.ts. Verified headless 17/17 (merge order/counts, empty-group header,
override labels, avatar vs placeholder, noopener, random via `window.open`
stub — a real popup follows redirects off-site, zh-Hans in-place
re-localization, 360px single-column no-overflow) + dark/light/mobile
screenshots.) Earlier same day (**PAGE-001/002/003
landed, then projects/About reworked to authored views** — user asked to
match the reference theme's `views/About.vue` pattern and not dump everything
into `components/`).
PAGE-001 (unchanged): `HomePage.vue` renders a single reusable `Card` **with**
`show-prompt` from config-driven `themeConfig.home` (`TerminalHomeConfig` +
`TerminalPageLink`, default `{}`) — greeting/tagline fall back to the localized
site title/description, command default `whoami`, plus CTA `links`.
PAGE-002/003 (authored views): new `.vitepress/theme/views/` dir holds thin
language-dispatcher views `About.vue`/`Projects.vue` (pick
`views/{about,projects}/{en,zh-Hans}.vue` by `useThemeLocale().language`,
primary-subtag match, en fallback → re-renders in place on switch); the
per-language sub-views are hand-authored content using `Card` + the shared
**fractional** `.ct-cardgrid` — a 6-col track with span modifiers
`--third`/`--half`/`--two-thirds`/`--full`, mixable per row (`1/3+2/3`,
`1/2+1/2`, `2/3+1/3`, full); width and the prompt (`show-prompt`,
`whoami`/`open`) are orthogonal. `src/about.md`/`src/projects.md` are
normal pages importing the view via `<script setup> import … from
"@/views/…"` — the new `@` alias → `.vitepress/theme`, added to `config.mts`
`vite.resolve.alias` (bare `@` matches only `@`/`@/…`, so scoped pkgs safe).
Removed the interim config-driven approach: `themeConfig.projects`/`.about`
schemas (`TerminalProjectItem`/`TerminalAboutBlock`/`TerminalAboutEntry`/
`TerminalAboutConfig`), `components/{ProjectsPage,AboutPage}.vue` + their
`index.ts` registration, the `page.*` locale keys, and the projects/about demo
config — but kept the demo Projects/About nav tabs. Styles: `styles/_pages.scss`
(grid + home/project/about card classes + NF gate), `@use "pages"` in
main.scss. Docs: content-architecture.md §7 rewrite + new §8 (authored views &
`@` alias), design-language.md §4 cards note. Build green; verified headless —
home prompt, featured full-width + prompt vs plain grid cards, live in-place
`项目`/`关于` on the status-bar language toggle, single-column mobile grid, no
overflow.) Earlier 2026-07-17 (**POST-003 header
cover full opacity except behind byline**: removed the blanket `opacity:0.3`
on the article-header cover — the full uncropped image now renders at FULL
opacity, and only its bottom strip behind the byline is dimmed by the mask
fading it into `--ct-surface` (desktop `#000 65%→transparent 92%`; mobile is
a higher-starting mask `#000 45%→transparent 82%`, replacing the old mobile
opacity override). Cards untouched. Screenshot-reviewed + headless.) Earlier
same day (**POST-003 cover
header shown in full**: the article-header cover is no longer cropped — the
image is normal-flow `width:100%;height:auto` (dropped `object-fit:cover`/
absolute), rendering whole at its natural aspect and driving the banner
height (8rem floor); the byline is now `position:absolute` bottom overlaying
the image's faded bottom edge. Post-CARD covers unchanged (still cropped
full-height right panels). Screenshot-reviewed dark/light/mobile + 13/13
headless.) Earlier
same day (**POST-003 seamless
cover rework**: covers integrate into their containers instead of sitting
beside the text — post-card covers are full-height right panels bled to the
frame edges (negative margins, `overflow:hidden` crop) fading into the card
via a left-edge mask (mobile: full-width top strip fading downward); the
article header with a cover becomes a framed hero banner — image absolute,
opacity 0.3, masked out toward the bottom where the byline pins (mobile
opacity 0.18); no cover = unchanged layouts; templates untouched (lazy img,
alt, link wrap / `data-no-lightbox`). Screenshot-reviewed + 13/13 headless.)
Earlier same day (**POST-002/003
follow-ups**: covers enlarged — post-card cover 11rem → 15rem, article-header
cover 18rem → 22rem basis (shrinkable) — and series articles admitted to a
general listing now carry their localized series name before the title:
archives rows get a dim `.ct-archives__series` prefix (`Series ›`), per-term
cards get it via `PostList`'s new `seriesInTitle` prop (set by `TermPosts`;
the meta-row chip is suppressed there — the series landing keeps bare titles
+ chip). Shared `seriesDisplayTitle()` resolver in `posts.ts`. Demo: part-1
gained `Design`/`tui`/`terminal` frontmatter and the config now opts series
into categories + tags too (posts index still excludes them). Docs:
content-architecture.md §5 note, guide toggles section. Verified headless
incl. zh-Hans prefix re-localization and mobile overflow.) Earlier 2026-07-16
(**POST-002 + POST-003
landed**: posts & series + cover images. POST-002: `series.yml` finalized
(optional `icon` FA/`nf-*` class, LocalizableText `title`/`description`,
finite `order`), parsed by new `theme/series.data.mts` (js-yaml devDep) →
sorted `SeriesEntry[]`; `posts.data.mts` now globs `series/**/*.md` too
(entries carry `series` slug/`order`/`cover`; landing index pages dropped);
`themeConfig.series = { inPosts, inArchives, inCategories, inTags }` (default
all false) gates series articles per listing surface via the shared
`filterListablePosts()` — applied in the 5 listing components AND the three
`.paths.mjs` route loaders (importing the now-exported site `themeConfig`).
New `<SeriesIndex/>` (series.md) + `<SeriesArticles/>` (landing, order-sorted)
components; `SeriesArticlePage` banner upgraded to yml icon/title/description;
`PostList` cards gained a series chip; gated `.ct-series-icon` (nf-* hidden
without the font). New `series.indexTitle/.articleCount/.empty` strings.
POST-003: frontmatter `cover` → right-side thumbnail in post cards (11rem,
16/10, link-wrapped = no lightbox) and the article header (18rem, 16/9,
`data-no-lightbox`); ≤640px column-reverse = cover on top full-width; lazy +
async decode; graceful without. Demo: covers on hello-terminal/tui-design/
part-1, series into archives only, Series nav child. Docs:
content-architecture.md §5/§5a/§7, guide/getting-started.md. Verified
headless 40/40 + order-flip rebuild.) Earlier same day (**THEME-020 landed**:
tool-bar nav submenus — `TerminalNavItem.items?: TerminalNavChild[]`
(`{ text, link, icon? }`, parent tab keeps its required `link`); `ToolBar.vue`
wraps tabs in `.ct-toolbar__navitem` and drops a `.ct-toolbar__submenu` TUI
floating panel (border/radius/surface/small shadow, z-30) of child rows on
`:hover`/`:focus-within` — closes when the pointer leaves both tab and panel;
parent active on own OR child link; caret marker; flat tabs unchanged; mobile
tabline stays hidden. Demo: `guide` tab → Getting Started + Advanced. Docs:
design-language.md §4 nav-submenu note (+ `icon` field catch-up), ui-sketch.md
§1 sketch. Verified headless 21/21 + dark/light screenshots.) Same day
(**I18N-008 landed**,
same day as ARCH-002/003: localizable taxonomy term labels via the dedicated
`themeConfig.taxonomy = { tags?, categories? }` maps (authored term name →
LocalizableText; matched case-insensitively through the slug). Display-only —
slugs/URLs/grouping stay authored; unconfigured terms verbatim. Framework-free
`termLabel()` in `theme/posts.ts` + new `useTaxonomy()` composable
(`tagLabel`/`categoryLabel`) consumed by `PostTaxonomy`, `TagsIndex`,
`CategoriesIndex`, and the `TermPosts` heading; demo config localizes
`theme`/`color` tags + `Guides`/`Design` categories. Docs: design-language.md
§9 localizable taxonomy labels, content-architecture.md §7 note,
guide/getting-started.md. Verified headless 15/15.) Same day (**ARCH-002 + ARCH-003
landed**: explorer visibility toggle + localized frontmatter fields. ARCH-002:
auto-discovery filters pages with frontmatter `showInExplorer: false` (a hidden
folder `index.md` drops just the folder link) and prunes subtrees whose
`explorer.json` sets `showInExplorer: false`; page/branch stays reachable by URL;
demos `src/guide/advanced/hidden-page.md` + `src/drafts/`. ARCH-003:
`asLocalizableText()` moved from `useExplorer` into `theme/locales/index.ts` as
the shared untyped-metadata validator; `PostEntry.title`/`.excerpt` are
`LocalizableText` resolved by `PostList`/`ArchivesList`; `ArticleLicense` +
`useSiteText` tab title resolve a localized frontmatter `title` map; new
node-side `theme/pageData.ts` `createPageDataTransformer(lang)` wired as
`transformPageData` in config.mts — VitePress escapes `pageData.description`
into the SSR `<meta>`, so a raw map must resolve to the build language or the
build crashes; demo `posts/hello-terminal.md` localized title/description.
Docs: design-language.md §4 visibility toggle + §9 localized frontmatter
fields, content-architecture.md §3 notes, guide/getting-started.md. Build
green; verified headless 20/20.) Earlier 2026-07-14 (**ARCH-001 + POST-001
landed**: page-type architecture + tags/categories. `theme/utils/pageType.ts`
`resolvePageType()` maps every page (from its `src/` path + frontmatter escape
hatches) to one of six types, each a `theme/pages/*Page.vue`
(Home/Normal/Post/SeriesArticle/Listing/NotFound); `Layout.vue` renders
`<component :is=pageComponent>`, folding away the old home placeholder +
`isArticle` branching (PostPage now owns ArticleMeta/License/Comments + the
POST-001 byline; SeriesArticlePage reuses PostPage under a series breadcrumb;
NotFoundPage is client-rendered). POST-001: posts under `src/posts/` declare
`tags`/`categories`; `theme/posts.ts` helpers + `theme/posts.data.mts` content
loader feed the listing components (`PostsIndex` w/ `/page/[num]` pagination,
`ArchivesList`, `CategoriesIndex`, `TagsIndex`, `TermPosts`, shared
`PostList`/`PostTaxonomy`, registered globally in `index.ts`) and the dynamic
routes `src/{categories,tags}/[name].{md,paths.mjs}` + `src/page/[num].*`; listing
pages `src/{posts,archives,categories,tags,series}.md`; demo `src/posts/*` (5) +
`src/series/terminal-internals/` (index + 2 parts + structural `series.yml`).
New `post.*`/`series.label`/`notFound.*` locale keys; `styles/_posts.scss`;
explorer now skips dynamic-route templates (`[` in path). Existing guide/demo
pages became normal pages (no article cards — by design). Build green,
headless-verified 9/10 (the 1 miss was an over-strict URL-string assertion —
navigation confirmed correct). Earlier 2026-07-14 (ARCH-001 planning:
extracted the `src/` refactoring out of POST-002 into a new **ARCH-001** task —
content architecture (`src/` layout modeled on `vitepress-theme-arch/src` + per-
page-type Vue components) recorded in new binding doc
`docs/design/content-architecture.md` (indexed in `docs/README.md` + `AGENTS.md`
§1); POST-001/POST-002/PAGE-001–004 deps rethreaded onto ARCH-001; POST-002 slimmed
to posts/series behavior. Earlier 2026-07-13: CONF-003 added the
configurable `themeConfig.siteName` shell-host override with automatic normalized
title fallback; COMP-003/005 follow-ups:
license card gained a **last-updated** row (`license.updated` — explicit
frontmatter `updated`/`lastUpdated`, else VitePress git `page.lastUpdated`,
`lastUpdated: true` now set in config.mts) beside the release date;
`formatDate` accepts any date shape (bare `YYYY-MM-DD`, full ISO datetime with
offset, YAML `Date`, numeric timestamp), treats unzoned strings as UTC, and
formats in UTC for SSR/initial hydration before switching to the reader's
current browser timezone (so a date can cross a local calendar boundary); and
a decorative **CC watermark**
(`.ct-license__watermark`) — now a mask-scaled `<span>` (top/bottom insets →
height = the card's native height, CC SVG `mask` + mode-tinted
`background-color`, rotated CCW, right-cropped by the card's `overflow:hidden`),
gated on `isCreativeCommons`, content lifted above via `z-index`, and never
affecting the card's own size. Third follow-up: `_license.scss` /
`_comments.scss` are now scoped under `.ct-content` so their card-title rules
out-specify the generic `.ct-content h2` typography — the article-heading top
margin was opening a large gap above each card's title. Earlier same day: COMP-003/004
article footer components — every article (a content page that is not the home
or 404 page, opt out via `article`/`license`/`comments: false` frontmatter)
ends with two prompt cards: `ArticleLicense.vue` (COMP-003, prompt `license` —
title · localized publish date from frontmatter `date` (SSR UTC, then reader
timezone) · permalink ·
author, + license statement/CC icons, all from CONF-002) and
`ArticleComments.vue` (COMP-004, prompt `comments`) with `ArticleMeta.vue`
view/comment counters in the title section. `useWaline()` lazy-loads
`@waline/client` client-side to mount the widget into `.ct-comments__waline`
and fill the counters (`pageviewCount`/`commentCount`), re-mount per nav,
re-localize on language switch (Waline tables mapped from theme tags,
`zh-Hans`→`zh-CN`), dark tracks `data-ct-mode`. `themeConfig.comments.waline.serverURL`
resolves via `resolveComments()`/`isCommentsConfigured()` (blank → unconfigured
= nothing rendered). New `license.*`/`comments.*` locale keys; styles in
`_license.scss` + `_comments.scss` (Waline vendor CSS via `@waline/client/style`
+ accent reconcile + meta strip); `@waline/client` devDep; demo
`markdown-examples.md` gained a `date`. Verified headless. Earlier: COMP-002 fixes:
deck arrows moved OUTSIDE the images — `.ct-swiper` is now a flex row of
prev button · `.ct-swiper__deck.swiper` · next button (vendor navigation CSS
dropped) — and `useViewportScroll` resets the panel only on a real
`relativePath` change, so closing the lightbox / same-page re-renders keep
the reading position. Earlier: deck prev/next arrow buttons —
Navigation module on container-emitted
`<button>`s, TUI `❮`/`❯` chevrons (vendor SVG suppressed), localized
`swiper.prev`/`swiper.next` — and native image drag disabled on slides so
mouse swipes work. Earlier same day: COMP-002 image
containers — Fancybox enlarge-on-click gallery over all `.ct-content` images
(`useLightbox`, `data-fancybox="ct-gallery"`, vendor l10n mapped from theme
tags) + `:::: swiper`/`::: swiper-slide-no-shadow` cards-effect decks
(`theme/markdown/swiper.ts` + `useSwipers`, shadowless slides); vendor CSS via
`_lightbox.scss`/`_swiper.scss`; `@fancyapps/ui` pinned ^5 (GPLv3/commercial
dual license — v6 is commercial-only) + `swiper` ^14; demo SVGs in
`src/public/images/`, demo section in `markdown-examples.md`. Earlier same
day: THEME-005 tool-bar
configurability — `themeConfig.toolbar = { nav?, actions? }` (`TerminalNavItem`
`{ text, link }` tabs after the built-in `~/home`, active via the shared
`linkRelativePath`; `TerminalToolbarAction` `{ icon, link, label? }` extra
Font Awesome icon slots before the built-in search + mode controls); the
active-matcher/external-link helpers extracted to `utils/pagePath.ts`
(`isExternalLink`/`linkRelativePath`) and shared with `ExplorerTree.vue`;
`_toolbar.scss` action rule now covers `<a>` slots (inline-flex, no underline);
demo config adds a `guide` tab + GitHub action icon; docs in design-language.md §4
(tool bar note) + ui-sketch.md §1. Earlier: SEARCH-001/002 find
palette — `themeConfig.search.algolia` DocSearch keys + `resolveSearch()`/
`isSearchConfigured()` (SEARCH-001; decision: the palette queries Algolia
directly and IS the search UI — no `@docsearch/*`, no DocSearch modal); the real
two-pane find palette (`useSearch` + `utils/algolia.ts` REST query,
`SearchPalette`/`SearchResults`, `_search.scss`) opens from the tool-bar
magnifier and `/`, replacing the retired THEME-003 demo (four components,
`useWindowDemo.ts`, button, `~` shortcut, `window.demo*`/`window.search*`
strings all removed); new `search.*` locale keys. 2026-07-13 follow-up: floating
window panes are `flex: 0 0 auto` with `:last-child` `flex: 1 1 auto` so the
results pane scrolls without shrinking/overlapping the search input box.
Earlier: I18N-007
localized page content — `::: lang <tag>` markdown container
(`theme/markdown/localized-content.ts`) → `<div class="ct-lang"
data-ct-lang>`; site-default block visible / rest `hidden` at build;
`useLocalizedContent()` reveals one block per adjacent-sibling group via the
shared fallback on mount/nav/language switch; `.ct-lang` is layout-neutral
(`display: contents`) in `_content.scss`; `deep-dive.md` ships en + zh-Hans
bodies; documented in design-language.md §9 + guide/getting-started.md. Earlier
same day: THEME-019 status-bar rework — live state chip (HOME/READ/404, `--notfound` error tint), blinking
`.ct-statusbar__cursor` block trailing the location (in a `.ct-statusbar__path`
wrapper, underscore style), a live `HH:MM:SS` clock (`useClock`, SSR-safe) at the far right, and
the settings gear moved out of the tool bar into the status bar; new
`status.home/.notFound/.clock` strings. Earlier same day: STYLE-004 code-block
cards — markdown fence wrapper `.ct-code` + title bar (file name · language ·
text `[copy]`), Shiki untouched, `[name]` info-string bracket, `useCodeCopy`
copy + label re-localization; THEME-007 settings panel — prompt-less two-pane
floating utility (Fonts family/size + Language) from the tool-bar gear, font
prefs persisted + restored pre-paint via `data-ct-font-*`, `useFontSettings`,
`--ct-content-font`/`-font-size`. Earlier same day: THEME-006 fully-custom
pre-footer section — `.ct-footer-region` wrapper with the edge-to-edge full
separator, the `pre-footer` layout slot, and a subtler inset inner separator
when the slot is filled; `Layout` now exported for wrapper use, plus a temporary
`DemoLayout`/`PreFooterDemo` example filling the slot; THEME-003 shared
floating utility window + temporary `~`/tool-bar demo; THEME-016 optional
title icons; THEME-017 TUI chrome rework — framed panes with border titles,
text-based `[✕]` close, two-pane demo; THEME-018 `/` search-shaped demo —
input + results panes). Earlier: 2026-07-10 (FIX-002 progressive
prompt overflow; FIX-001 argument spacing; COMP-001 Oxocarbon prompt styling and softer card
shadow; DEMO-002 override demo;
COMP-001 current-page prompt path default; DEMO-002 card demo; COMP-001 reusable card component; THEME-015 removal of
explicit folder collapsed configuration; THEME-014 transient route-aware
explorer expansion; FONT-003 reliable Nerd
Font readiness; THEME-013 source-local JSON folder metadata and index-less
advanced-2 explorer node; THEME-012/I18N-006
auto-discovered explorer pages with localized frontmatter labels;
THEME-011 nvim-style explorer rework: NF folder/file icons, depth defaults +
persisted node states, folder-index click, guide demo pages; earlier same day
THEME-002 file
explorer, THEME-004 in-viewport
footer). Earlier: 2026-07-09 (CONF-002 author &
license system; I18N-005 canonical
locale tags: zh-CN → zh-Hans, site lang en-US → en; THEME-001 TUI shell:
tool bar / viewport / status bar; THEME-008 fixed shell frame with
viewport-contained scrolling; THEME-009 back-to-top button; THEME-010 statusline
separators, mode indicator + tool-bar switcher; earlier same day:
FONT-002/004 icon systems and jsDelivr Nerd Font loading,
MD-003 nerd-font callout glyphs, STYLE-006 neutral body text, MD-001 plugin
suite, MD-002 callouts + left-bar revision; 2026-07-08: INFRA-001, CONF-001,
STYLE-001/002/003/005, FONT-001, I18N-001/002/003/004).

## Root

- `package.json` — pnpm project; devDeps: `vitepress 2.0.0-alpha.18`, `vue ^3.5.39`,
  `sass ^1.101.0` (INFRA-001), the MD-001 markdown-it suite (emoji, sub, sup,
  ins, mark, footnote, deflist, abbr, container; mathjax3 pinned ^4 — v5 emits
  inline <style> per formula, which breaks Vue template compilation), and the
  COMP-002 image libraries: `@fancyapps/ui` pinned `^5.0.36` (the last
  GPLv3/commercial dual-licensed line — v6 moved to commercial-only) +
  `swiper ^14`, the COMP-004 comment client `@waline/client ^3.15.2`
  (lazy-loaded client-side), and `js-yaml` + `@types/js-yaml` (POST-002 —
  node-side `series.yml` parsing in `series.data.mts`). Scripts
  `dev`/`build`/`preview` run vitepress on the project root (`srcDir` set in config).
- `pnpm-lock.yaml` — pnpm lockfile.
- `.gitignore` — node/logs/dist/editor ignores plus `.vitepress/dist` and
  `.vitepress/cache`; ignores `themeConfig.mjs` **except**
  `.vitepress/theme/assets/themeConfig.mjs` (reserved path from the upstream template).
- `.gitmodules` — git submodules (PAGE-004): `.vitepress/theme/assets/generatedLinkData`
  → `iXORTech/blog-friend-links-data-generator-demo`, branch `data` (the demo
  friend-links data consumed by the friends page).
- `AGENTS.md` — single source of agent instructions: session protocol, plan &
  context-cache rules, compliance code, engineering conventions (hard rules), repo map;
  §1 table indexes the binding design docs incl. `docs/design/friend-links.md`.
- `CLAUDE.md` — pure pointer to `AGENTS.md` (read by Claude Code). No content.

## .claude/

- `skills/verify/SKILL.md` — repo verification recipe for coding agents: build +
  `pnpm preview` (must be RESTARTED after each rebuild — sirv snapshots the
  asset list, so re-hashed assets 404), drive the rendered site headless
  (temp-dir playwright, system Chromium fallback), and the UI flows worth
  exercising (modes, language, shell chrome, mobile, print, Nerd Font gating).

## .github/

- `copilot-instructions.md` — pure pointer to `AGENTS.md` (read by GitHub Copilot). No
  content.

## .agent/

- `plan.md` — task board: tasks with `TYPE-###` IDs, categories, dependencies,
  acceptance criteria. DOC-001/003/005/006, INFRA-001, CONF-001/002,
  STYLE-001/002/003/005,
  FONT-001/002, I18N-001/002/003/004/005, MD-001/002/003, STYLE-006, DEMO-002,
  THEME-001/008/009/010 done (THEME-001 retired the I18N-002 temporary switcher;
  THEME-008 = fixed shell frame rework; THEME-009 = back-to-top button;
  THEME-010 = statusline separators + mode switcher moved to tool bar, which
  pre-satisfies that part of THEME-005; CONF-002 = author & license config layer —
  COMP-001/COMP-003 consume it for prompts and the license card; THEME-004 =
  in-viewport
  footer + THEME-002 = file-explorer sidebar + THEME-011 = nvim-style explorer
  rework, THEME-012 auto-discovered source explorer and I18N-006 localized
  labels done 2026-07-10; CONF-003 = configurable normalized site name for card
  prompt hosts done 2026-07-13; THEME-003 = shared floating utility window (+
  temporary demo, retired by SEARCH-002), THEME-016 = optional title icons,
  THEME-017 = TUI chrome rework (framed panes, border titles, text `[✕]`),
  and THEME-018 = `/` search-shaped input+results demo done 2026-07-12;
  THEME-006 = fully-custom `pre-footer` slot section with the full + inner
  footer separators done 2026-07-12; STYLE-004 = code-block cards (title bar +
  COPY) and THEME-007 = settings panel (fonts + language) done 2026-07-12;
  SEARCH-001 (Algolia DocSearch config keys + decision: the palette is the
  search UI) and SEARCH-002 (real find palette — input + results panes wired to
  Algolia, replacing the THEME-003 demo) done 2026-07-12.
  COMP-002 image containers (Fancybox lightbox gallery + `:::: swiper` cards
  decks) done 2026-07-13.
  ARCH-002 (explorer `showInExplorer` visibility toggle) and ARCH-003
  (localized frontmatter fields + `transformPageData` SSR resolution) done
  2026-07-16, plus I18N-008 (localizable taxonomy labels) and THEME-020
  (tool-bar nav hover submenus — `TerminalNavItem.items` child links in a
  floating TUI dropdown) same day.
  ARCH-004 (done 2026-07-18): explorer sibling ordering via an
  `order` attribute in frontmatter / `explorer.json` — any finite number incl.
  negatives (pin above the `0` defaults) and fractions; non-finite → `0`; ties
  keeping today's folders-first name sort. `useExplorer.ts`
  `siblingComparator`/`branchOrder`/`toFiniteOrder`; JSON order wins over
  index frontmatter; display-only, SSR + client identical; explicit arrays
  bypass it. Demo: `guide/getting-started` `order:-1`, `advanced-2`
  `explorer.json` `order:1`.
  POST-002 (posts & series: series.yml schema + loader, order sorting,
  `themeConfig.series` listing toggles) and POST-003 (frontmatter cover
  images in cards + article header) done 2026-07-16.
  PAGE-001/002/003 (home welcome card + projects/about card grids, all
  config-driven via `themeConfig.home`/`.projects`/`.about`) done 2026-07-18.
  PAGE-004 (friends page: `theme/friends.ts` merge layer + global
  `FriendLinks.vue` fed by `assets/**/linksData.mjs` modules incl. the
  generator submodule, per `docs/design/friend-links.md`) done 2026-07-18.
  Roadmap: DEMO-001 markdown demo pages,
  DOC-002/004 documentation, MOBILE-001 pass. I18N-001 includes
  a shipped Chinese (Simplified) locale.
- `context-cache.md` — this file.

## docs/

- `README.md` — documentation index (design docs, process files) plus documentation
  rules; clarifies `docs/` is repo documentation, not site content.
- `design/design-language.md` — binding: identity, NeoVim/LazyVim-inspired TUI design
  language, hard no-branding rule, iconic components table (tool bar, status bar,
  explorer, floating windows), tool-bar spec (§4, THEME-001/005/010/020:
  `toolbar.nav` tabs `{ text, link, icon?, items? }` + `toolbar.actions` icon
  slots; the THEME-020 nav-submenu note — child links `{ text, link, icon? }`
  in a hover/focus-within TUI floating dropdown that closes when the pointer
  leaves tab + panel, parent active on own or child link, desktop-only),
  fixed shell frame — page never scrolls, content
  scrolls inside the viewport panel and clips at its edges (§5, THEME-008),
  file-explorer spec + THEME-002/011 implemented note (§4: `themeConfig.explorer`
  tree `{ text, link?, items? }`, folder `link` = its index page
  (label click navigates and route awareness expands transiently; chevron pure
  toggle); depth default =
  first layer open / deeper collapsed, toggles remembered in
  `ct-explorer-nodes`; NF chevron + folder/file icon row with plain-marker
  fallback; tool-bar `[=]` toggle,
  `ct-explorer` persistence, ≤640px drawer, paper mode = not rendered),
  auto-discovery from `src/**/*.md` via `themeConfig.explorer: "auto"` with
  optional source-local `explorer.json` folder metadata (THEME-012/013/I18N-006);
  active-route ancestor folders expand transiently without storage writes
  (THEME-014),
  floating-windows spec + THEME-003/016/017 implemented note (§4: one shared
  `FloatingWindow.vue` instance driven by the `useFloatingWindow()` singleton,
  utility = `{ id, label(), panes: [{ title(), icon?, component }] }` — framed
  panes whose titles (+ decorative FA icon) sit on the top border line, text
  `[x]` close on the first pane, hidden by default / opened programmatically,
  dialog semantics + focus
  handling, dismissed via `[✕]` / backdrop / `Esc`, ≤640px sheet with the
  last pane growing; two temporary demos until SEARCH-002 — `~`/tool-bar
  description demo and the `/` search-shaped input+results demo),
  footer spec (custom Vue section on top · separator ·
  copyright/social · powered-by/RSS/license rows; RSS + icons configurable;
  author/license from CONF-002; attribution row lighter on desktop; THEME-004
  implemented note: `themeConfig.footer` shape, placeholder strings,
  color-mix-derived lighter tone, mobile stack order), author &
  license system spec (§4: `author.name`/`author.username` + normalization rule,
  `license` default CC BY-NC-SA 4.0, custom name drops CC url/icons), cards &
  shell-prompt decoration (explicit `showPrompt`; prompt user = normalized author
  username; configured `themeConfig.siteName` host is normalized for prompts and
  falls back to the active site title; path defaults to the
  current page location; host/path/command/args remain overridable; prompt marks
  featured content; constrained prompts progressively hide host, reduce the path
  to its last section, and apply an end ellipsis; code blocks are card-style
  windows with a file/lang title bar + COPY button, no prompt), explorer retractable
  on desktop & absent in paper mode,
  modern finish, mode list, keyboard/mobile/i18n principles; §9: hard rule — no
  `/<lang>/` URL trees, UI language is a client-side preference (`ct-lang`);
  LocalizableText pattern for all config text (I18N-004); optional per-language
  page bodies via `::: lang <tag>` blocks that switch client-side with the
  default block SSR-visible (I18N-007); I18N-001/003
  implementation notes (tables, resolution order, `useThemeLocale()`); the
  auto-discovery contract (THEME-012/I18N-006) for `explorer: "auto"`, folder
  indexes, deterministic ordering, and localized frontmatter/config labels;
  §4 visibility toggle (ARCH-002: frontmatter `showInExplorer: false` = page
  hidden, folder `index.md` loses just its link; `explorer.json`
  `showInExplorer: false` = subtree pruned; URLs unaffected; explicit trees
  untouched); §9 localized frontmatter fields (ARCH-003: displayed frontmatter
  — `title`, `description`, series metadata — accepts per-language maps
  validated by `asLocalizableText()`, SSR head resolved to the build language
  via `transformPageData`, client re-resolves in place); §9 localizable
  taxonomy labels (I18N-008: `themeConfig.taxonomy` term-name → LocalizableText
  maps, display-only — slugs/URLs/grouping stay authored, unconfigured terms
  verbatim).
- `design/color-system.md` — binding: main color (default `#80E0A7`, `themeConfig`)
  is an ACCENT for emphasis/links/bold/headings — body text is neutral Carbon in all
  modes (2026-07-09 decision, §2/§6); hard rule that all auxiliary colors derive
  from it; IBM Carbon supporting palette; Oxocarbon (nvim dark/light, vscode PRINT
  for paper) for code and shell prompts; §8 implementation reference (`--ct-`
  tokens, head-injected main color, `data-ct-mode` + `ct-mode` storage, callout
  colors, three-theme shiki, and mode-aware prompt roles).
- `design/typography-and-icons.md` — binding: IBM Plex allocation (Sans = UI/body,
  Serif = paper-mode body, Mono = code + TUI chrome); Font Awesome for most icons, Nerd
  Font only in TUI chrome incl. callout chrome (title glyphs + details chevron, MD-003);
  hard rule: load via stylesheets injected in `<head>` from VitePress config, no npm
  font/icon packages. FONT-001 note: Google Fonts CSS2, weights 400/600/700 (+italic
  400), stacks in `_tokens.scss`. FONT-002/004 note: FA `all.min.css` (cdnjs) +
  generated symbols-only Nerd Font CSS from jsDelivr's `ryanoasis/nerd-fonts`
  master branch plus a working `SymbolsNerdFont-Regular.ttf` face under the
  `NerdFontsSymbols Nerd Font Terminal` alias (`--ct-font-nerd`); PUA glyphs
  gated behind `html[data-ct-nerdfont]` (useNerdFont) after the external
  stylesheet has loaded (FONT-003) — safe fallback: no icon / plain `❯` chevron.
- `design/ui-sketch.md` — ASCII wireframes (structure binding, details illustrative):
  desktop shell (tool bar / explorer + viewport / status bar; §1 also sketches
  the THEME-020 nav-submenu dropdown — caret `▾` tab + floating child-row
  panel), floating find
  palette as stacked framed panes — border titles + text `[x]` close
  (§2, reworked THEME-017; the generic window shell is landed, find content =
  SEARCH-002),
  mobile layout with explorer drawer, paper mode (keeps minimal tool/status bars,
  hides explorer/utility panels), in-viewport footer (attribution row lighter on
  desktop), card component with explicit `showPrompt`, configurable `siteName` host
  with normalized-title fallback, and code-block variant with file/lang/COPY title
  bar (§6); legend of placeholder
  glyphs and a region → spec → build-task map.
- `design/content-architecture.md` — binding (ARCH-001): the `src/` content layout
  modeled on `iXORTech/vitepress-theme-arch/src` — normal/standalone pages (home
  `index.md`, `about`, `projects`, `friends`) sit **directly in `src/`** (no `pages/`
  folder); regular posts under `src/posts/`, series articles under
  `src/series/<name>/` (each with a localized `series.yml` icon/title/description),
  static assets under `src/public/`; listing/dynamic-route pages `archives.md`,
  `categories.md` + `categories/[name]`, `tags.md` + `tags/[name]`, `series.md`,
  optional `page/[num]` pagination. Defines the six **page types** (home / normal
  page / post / series article / listing / 404), detected by `src/` path prefix +
  frontmatter escape hatches (`article`/`license`/`comments: false`), each rendered
  by a dedicated `pages/*Page.vue` component via a single page-type dispatch in the
  theme `Layout` (generalizing the current home placeholder + `isArticle` branching).
  Structure binding; demo file names illustrative. Behavior split across
  ARCH-001 (structure + dispatch), POST-001 (tags/categories/listings), POST-002
  (posts/series). §3 also records the ARCH-002 `showInExplorer` escape hatch
  and the ARCH-003 localized-frontmatter pattern (both pointing to
  design-language.md for full semantics); the §7 POST-001 note points to the
  I18N-008 `themeConfig.taxonomy` display labels (names stay verbatim in
  slugs/URLs/grouping). §5 carries the POST-002 implemented note — the final
  `series.yml` schema (optional icon/title/description LocalizableText +
  finite `order`; articles sort by their own frontmatter `order`, ties
  alphabetical) and the `themeConfig.series` listing-inclusion toggles
  (all-false defaults; route loaders apply the same filter; admitted articles
  carry a dim series-name prefix before their title in archives/per-term
  listings, chip suppressed there); §5a the POST-003
  cover-image note (frontmatter `cover`, desktop-right/mobile-top, lazy,
  fixed aspect, lightbox-excluded); §7 note points to `friend-links.md` for the
  PAGE-004 friends page.
- `design/friend-links.md` — binding (PAGE-004, implemented 2026-07-18 — §9
  implemented note):
  friends page — external `blog-friend-links-data-generator` `linksData.mjs`
  format (group/entry arrays; entry `title`/`url` required, `screenshot`
  reserved), eager SSR-safe glob of `theme/assets/**/linksData.mjs` with
  deterministic ordering + `group`-id merging, i18n (data verbatim /
  LocalizableText in hand-authored files / `themeConfig.friends.groups`
  overrides; reference's localized-file scheme not followed), TUI composition
  (`<FriendLinks />`, group headers, auto-fill link-card grid, random control),
  `themeConfig.friends` surface, demo submodule at
  `theme/assets/generatedLinkData` (`data` branch).

## .vitepress/

- `config.mts` — site config via `defineConfigWithTheme<TerminalThemeConfig>`:
  `srcDir: "src"`; `vite.resolve.alias` maps `@` →
  `fileURLToPath(new URL("./theme", …))` so content `.md` files import authored
  views cleanly (`@/views/About.vue`, PAGE-002/003) — bare `@` only matches
  `@`/`@/…`, scoped pkgs unaffected; title, description; **exported**
  `themeConfig` const (the
  `.paths.mjs` route loaders import it to apply the POST-002 series toggles)
  with commented option
  examples including the shell-prompt `siteName` override; `head:
  themeHead(themeConfig)` (fonts + main color + mode restore);
  `markdown.theme` = three oxocarbon shiki themes (`{ light, dark, paper }` — extra
  `paper` key is forwarded to shiki and loaded lazily as a raw object); `lang:
  "en"` as the default UI language (minimal canonical tag, I18N-005; no
  VitePress `locales` — I18N-003);
  `themeConfig` demos per-language `title`/`description` maps, an MIT
  `license` (exercises the footer's icon-less text fallback), a `footer`
  block (GitHub social icon; demo `rss: "/feed.rss"` — feed not actually
  generated yet), a `toolbar` block (THEME-005: `guide`/`posts`/`tags`/`archives`
  nav tabs — the last three surface the POST-001 listing pages — +
  a GitHub action icon; the `guide` tab carries THEME-020 submenu `items`:
  Getting Started + Advanced child links with icons; the `posts` tab's items
  include Categories/Tags/Series; demo also adds `projects`/`about`/`friends`
  nav tabs
  surfacing the PAGE-002/003/004 pages), a `home` demo block (PAGE-001: localized
  welcome with command/greeting/tagline/body/links — projects/About are
  authored views, not config), a `friends` block (PAGE-004: display options
  only — the link data lives in `theme/assets/**/linksData.mjs`; demo
  `groups.group2` override localizes a generated plain-string group label),
  a `taxonomy` block (I18N-008: zh-Hans labels for the
  `theme`/`color` tags + `Guides`/`Design` categories),
  a `series` block (POST-002: `inArchives`/`inCategories`/`inTags: true` —
  the demo series joins those listings with the series-name title prefix
  while `/posts` stays regular-only; `inPosts` commented),
  and `explorer: "auto"` to discover every Markdown page under `src/`;
  index-less folder metadata is read from adjacent `explorer.json` files;
  a commented `search.algolia` example documents the SEARCH-001 keys (demo
  ships unconfigured → the palette shows its notice); a commented
  `comments.waline.serverURL` example documents COMP-004 (demo ships
  unconfigured → no comment card/counts); `lastUpdated: true` (git-derived
  per-page timestamp feeding the license card's "Updated" row, COMP-003);
  `transformPageData: createPageDataTransformer(lang)` (ARCH-003 — resolves
  localized frontmatter maps for the SSR head); `markdown.math: true`
  (mathjax3) + `markdown.config: createMarkdownConfig(lang)` (MD-001/002).
- `theme/assets/generatedLinkData/` — git submodule (PAGE-004 demo):
  `iXORTech/blog-friend-links-data-generator-demo` `data` branch;
  `output/linksData.{json,mjs}` is generated friend-links data picked up by
  the `FriendLinks.vue` glob. Content managed upstream via GitHub Issues —
  never edited here. (Its one avatar URL 404s, organically demoing the
  placeholder fallback.)
- `theme/assets/linksData.mjs` — PAGE-004 hand-authored demo friend-links
  data (generator format + LocalizableText, friend-links.md §2/§4): a
  localized `friends` group (working GitHub avatar entry + a no-avatar
  entry) and an unlabeled `group1` whose entry merges into the generated
  submodule group (inheriting its labels).
- `theme/head.ts` — node-side `themeHead(themeConfig)`: IBM Plex Google-Fonts-CSS2
  `<link>`s + preconnects (FONT-001), icon stylesheet `<link>`s (FONT-002/004:
  Font Awesome 6 `all.min.css` from cdnjs + generated Nerd Font CSS from
  jsDelivr's `ryanoasis/nerd-fonts@master`),
  inline `:root{--ct-main:…}` style from the resolved config (STYLE-001), inline
  pre-paint script restoring `ct-mode` from localStorage onto `data-ct-mode` with
  dark default (STYLE-002) AND the font preferences `ct-font-family`/`ct-font-size`
  onto `data-ct-font-*` (THEME-007) — attributes set only for a non-default choice,
  so no flash/reflow.
- `theme/pageData.ts` — node-side ARCH-003 `createPageDataTransformer(lang)`,
  wired as `transformPageData` in `config.mts`: resolves a localized
  frontmatter `description` map to the build language's string (VitePress
  escapes `pageData.description` straight into the SSR `<meta>` — a raw map
  crashes the build) and backfills `pageData.title` from a `title` map when a
  page has no body h1. The raw maps stay in `pageData.frontmatter` for
  client-side re-resolution.
- `theme/markdown/index.ts` — node-side `createMarkdownConfig(lang)` → the
  `markdown.config` hook: wires the MD-001 plugin suite (emoji `full` preset, sub,
  sup, ins, mark, footnote, deflist, abbr) then `calloutsPlugin` and
  `swiperPlugin` (COMP-002). Math goes through
  VitePress's `markdown.math: true` (markdown-it-mathjax3) instead. Then
  `localizedContentPlugin(md, lang)` (I18N-007) and `codeBlockCardsPlugin(md,
  lang)` last (STYLE-004).
- `theme/markdown/localized-content.ts` — I18N-007 per-language content:
  registers a `::: lang <tag>` markdown-it-container → `<div class="ct-lang"
  data-ct-lang="<tag>">`. The block whose tag matches the build `lang`
  (exact or primary subtag) is emitted visible; every other block gets `hidden`
  (flash-free, JS-off-safe SSR). Client `useLocalizedContent` re-resolves with
  the full fallback and switches on language change.
- `theme/markdown/codeblock.ts` — STYLE-004 code-block cards: wraps VitePress's
  Shiki `fence` output in a `.ct-code` card + `.ct-code__titlebar` (file name ·
  language · text `[copy]` button). Reads `token.info` BEFORE delegating (VitePress
  strips the `[title]` bracket in its own rule); language = leading word, file
  name = `[...]` group. COPY label emitted in the build `lang`, tagged
  `data-ct-code-copy-label` for client re-localization (useCodeCopy). Highlighting
  untouched inside the card.
- `theme/markdown/swiper.ts` — COMP-002 image-slider containers: registers
  `:::: swiper` (→ a `.ct-swiper` flex row: `.ct-swiper__nav--prev` button ·
  `.ct-swiper__deck.swiper > .swiper-wrapper` · `.ct-swiper__nav--next`
  button, arrows beside the card stack) and
  `::: swiper-slide-no-shadow` (→ `.ct-swiper__slide.swiper-slide`) via
  markdown-it-container; emits inert static markup that `useSwipers()`
  upgrades client-side — Swiper itself never runs at build/SSR time.
- `theme/markdown/callouts.ts` — MD-002 containers: overrides VitePress's built-in
  info/tip/warning/danger/details renderer rules and registers note/caution/important
  fresh; emits `.ct-callout .ct-callout--<kind>` cards with `.ct-callout__title`
  (details → `<details>/<summary>`); default titles from the locale table for the
  build `lang`, tagged `data-ct-callout-title` for client re-localization; custom
  titles render inline markdown untagged. Aliases: note→info, caution→danger.
- `theme/shiki/oxocarbon.ts` — builds `oxocarbon-dark`/`oxocarbon-light` shiki themes
  from the oxocarbon.nvim palettes (treesitter groups transcribed to TextMate scopes;
  MIT attribution in header) and re-exports the vendored paper theme.
- `theme/shiki/oxocarbon-paper.json` — vendored `PRINT.json` from
  nyoom-engineering/oxocarbon-vscode (MIT), renamed `oxocarbon-paper`; grayscale
  ink-on-white print palette used for paper mode.
- `theme/config.ts` — CONF-001 configuration surface, framework-free (importable from
  the Node-side config): `TerminalThemeConfig` schema (`mainColor` default `#80E0A7`;
  `title`/`description` as `LocalizableText` falling back to the site config values;
  `localeStrings?: LocaleOverrides` — per-language map `{ tag: partial table }` that
  can also add whole languages; feature toggles land here), `themeConfigDefaults`,
  `resolveThemeConfig()` (per-option fallback, survives explicit `undefined`);
  `siteName` is a trimmed shell-host override with an empty default for Card's
  automatic title normalization.
  CONF-002: `author` (`name` LocalizableText + shell-safe `username`, derived via
  exported `normalizeUsername()` when unset, fallback `user`); the shared
  `normalizeShellIdentifier()` helper also normalizes the site-title host used by
  COMP-001. `license`
  (default CC BY-NC-SA 4.0 + deed URL + FA CC icons; a custom `name` drops the CC
  url/icons — bring your own); single source for footer/prompt/license-card
  consumers (THEME-004, COMP-001, COMP-003). THEME-004: `footer`
  (`rss` feed URL, default `''`; `social: TerminalSocialLink[]` — FA `icon` +
  `link` + optional LocalizableText `label`). THEME-005/020: `toolbar?:
  TerminalToolbarConfig` — `{ nav?: TerminalNavItem[] ({ text, link, icon?,
  items? } — `items?: TerminalNavChild[]` `{ text, link, icon? }` child links
  for the hover dropdown submenu, THEME-020),
  actions?: TerminalToolbarAction[] ({ icon FA classes, link, label? }) }`,
  resolved to `Required<>` with `[]`/`[]` defaults (built-in home tab +
  search/mode controls always render). THEME-002/011/012:
  `explorer: TerminalExplorerItem[] | "auto"` — explicit tree or automatic
  discovery of `src/**/*.md`; explicit nodes retain `{ text, link?, items? }`,
  while source-local `explorer.json` files can provide localized folder labels;
  default `[]` = no explorer rendered. I18N-008: `taxonomy:
  TerminalTaxonomyConfig` — `{ tags?, categories? }` maps of authored term
  name → LocalizableText display label (display-only; slugs/URLs stay
  authored), resolved to `{ tags: {}, categories: {} }` defaults.
  POST-002: `series: TerminalSeriesConfig` — `{ inPosts?, inArchives?,
  inCategories?, inTags? }` listing-inclusion toggles for series articles,
  resolved to `Required<>` with all-`false` defaults (series stay out of the
  general listings unless opted in).
  SEARCH-001: `search: TerminalSearchConfig`
  (`provider?: 'algolia'`, `algolia?: {appId, apiKey, indexName}`) resolved via
  `resolveSearch()` (partial creds → `algolia: null` = unconfigured) with the
  exported `isSearchConfigured()` helper; default `{ provider:'algolia',
  algolia:null }`. COMP-004: `comments: TerminalCommentsConfig`
  (`provider?: 'waline'`, `waline?: { serverURL }`) resolved via
  `resolveComments()` (blank `serverURL` → `waline: null` = unconfigured) with
  the exported `isCommentsConfigured()` helper; default `{ provider:'waline',
  waline:null }`.
  PAGE-004: `friends: TerminalFriendsConfig` — `{ showCount?, showRandom?,
  groups?: Record<groupId, { name?, desc? }> }` display options (the label
  overrides mirror `taxonomy`; the link DATA lives in data modules, the
  documented §6.5 exception), resolved to `Required<>` with
  `{ true, true, {} }` defaults.
  PAGE-001: `home: TerminalHomeConfig`
  (`command`/`greeting`/`tagline`/`body`/`links: TerminalPageLink[]`
  (`{ text, link, icon? }`), default `{}`) — the home welcome card. Projects
  and About are authored per-page views (PAGE-002/003), NOT config, so there is
  no `themeConfig.projects`/`.about`.
- `theme/locales/en.ts` — canonical English string table (I18N-001): source of truth
  for the theme key set (`lang.label` self-description, `mode.*`, `lang.switch`,
  `callout.*` ×8, `nav.label`/`nav.home` + `status.*`
      (read/home/notFound/clock/progress/top/bottom/backToTop — THEME-001/009/019),
  `explorer.*` ×3 — label/toggle/close (THEME-002),
  `settings.*` ×13 — title/open + fonts/fontFamily/fontSize +
  fontDefault/Sans/Serif/Mono + sizeSmall/Medium/Large + language (THEME-007),
  `code.copy`/`code.copied` (STYLE-004),
  `license.*` — author/published/updated/permalink/statement (COMP-003),
  `comments.title`/`comments.views` (COMP-004),
  `swiper.prev`/`swiper.next` (COMP-002 deck arrows),
  `window.close` (THEME-003), `search.*` — open/title/inputTitle/resultsTitle/
  placeholder/hint + idle/loading/empty/error/unconfigured status + poweredBy
  (Algolia attribution) (SEARCH-002),
  `footer.*` with `{year}/{author}`/`{vitepress}/{theme}`/`{license}`
  placeholders (THEME-004) + temporary `footer.demoCustom` label (THEME-006
  pre-footer demo),
  `post.*` — postsTitle/archivesTitle/categoriesTitle/tagsTitle + categories/tags
  (byline labels) + empty/undated/taggedWith/inCategory (`{term}`)/allTags/
  allCategories/pagination/prevPage/nextPage (POST-001), `series.label`
  (ARCH-001 series breadcrumb) + `series.indexTitle`/`series.articleCount`
  (`{count}`)/`series.empty` (POST-002 series index),
  `friends.random`/`friends.empty` (PAGE-004 friends page — the data strings
  themselves render verbatim/LocalizableText, not through the table),
  `notFound.title`/`.home`
  (ARCH-001 404) —
  grows per feature; PAGE-002/003 projects/About are authored per-language
  views, so they hold no locale keys); exports
  `ThemeLocaleStrings`/`ThemeLocaleKey`.
- `theme/locales/zh-Hans.ts` — built-in Chinese (Simplified) table, typed
  `ThemeLocaleStrings` so drift from the key set is a type error.
- `theme/locales/index.ts` — framework-free registry (`en`, `zh-Hans`; tag rule
  I18N-005: minimal canonical tag — script subtag only when it disambiguates,
  never a region) for the
  URL-free language system (I18N-003): `resolveLocaleStrings(tag, overrides?)`
  (English ← built-in match: exact ci tag, then primary subtag ← per-language
  `localeStrings[tag]`), `availableLanguages(overrides?)` (built-ins ∪ config-added
  tags, labeled by `lang.label`), `matchLanguageTag()` (canonicalizes e.g. `en-US` →
  `en`, `zh-CN` → `zh-Hans`), `LocalizableText` (`string | { tag: string }`) +
  `resolveLocalizedText()`
  (exact → primary → `en` → first entry; the pattern for all config text, I18N-004);
  `LocaleOverrides`/`ThemeLanguage` types; `asLocalizableText()` (ARCH-003) —
  the shared validator turning untyped authored metadata (frontmatter,
  `explorer.json`, YAML) into a `LocalizableText` or `undefined` (maps with any
  non-string value are rejected so malformed input degrades to fallbacks).
- `theme/composables/useThemeLocale.ts` — client composable & language state
  (singleton): `strings`/`t(key)`, `language` (canonical tag; preference ?? site
  `lang`), `languages`, `setLanguage()` (updates `<html lang>`, persists to
  localStorage `ct-lang`; restored post-mount to avoid hydration mismatch); the only
  way components obtain UI text.
- `theme/composables/useCalloutTitles.ts` — rewrites `[data-ct-callout-title]`
  elements from the locale table on mount, content update, and language switch;
  called once from the layout (MD-002).
- `theme/composables/useLocalizedContent.ts` — I18N-007 client switch of
  `::: lang` page content; called once from the layout. Groups adjacent
  `.ct-content .ct-lang` siblings and, per group, `hidden`s all but the block
  chosen for the active `useThemeLocale().language` (fallback exact tag →
  primary subtag → site default `lang` → first block); runs on mount,
  `onContentUpdated`, and language switch. Content outside `::: lang` is
  untouched.
- `theme/composables/useCodeCopy.ts` — STYLE-004 code-block COPY behavior +
  label localization; called once from the layout. A delegated document click
  copies the `.ct-code pre code` source and flashes a localized "Copied"
  (`--copied` class, WeakSet guards the flash); `[data-ct-code-copy-label]` +
  aria/title re-localized on mount, `onContentUpdated`, and language switch.
- `theme/composables/useLightbox.ts` — COMP-002 enlarge-on-click gallery:
  marks every `.ct-content img` (skipping linked / `data-no-lightbox` images)
  with `data-fancybox="ct-gallery"` on mount + `onContentUpdated`, lazy-loads
  Fancybox (client-only) and keeps ONE delegated bind; re-binds on language
  switch with the vendor's shipped l10n tables mapped from theme tags
  (`en` → `en`, `zh-Hans` → `zh_CN`, primary-subtag → English fallback — the
  documented vendor-chrome exception to the locale-table rule).
- `theme/composables/useSwipers.ts` — COMP-002 deck initializer: lazy-loads
  Swiper + EffectCards + Navigation and instantiates every uninitialized
  `.ct-swiper__deck` with `effect: 'cards'`, `slideShadows: false`,
  `grabCursor`, arrows wired to the sibling `.ct-swiper__nav--prev/--next`
  buttons in the `.ct-swiper` wrapper; sets
  `draggable=false` on slide images (native ghost-image drag would hijack the
  swipe); localizes the arrows' aria-label/title from the locale table
  (`swiper.prev`/`swiper.next`) on init + language switch; prunes/destroys
  instances whose element left the DOM after navigation, destroys all on
  unmount. Client-only, no-op during SSR.
- `theme/composables/useWaline.ts` — COMP-004 comments: called once from
  Layout. When comments are configured and an article's `.ct-comments__waline`
  is present, lazy-loads `@waline/client` (client-only) and `init()`s the
  widget there (its own count displays off; `dark: 'html[data-ct-mode="dark"]'`
  tracks the mode), then fills the `ArticleMeta` counters via `pageviewCount`/
  `commentCount`. Re-mounts on `onContentUpdated` (destroys the prior instance
  + aborts pending count requests) and `update()`s the widget language on a
  switch; maps theme tags → Waline locale (`zh-Hans` → `zh-CN`, else `en`).
  No-op during SSR and when unconfigured.
- `theme/composables/useFontSettings.ts` — THEME-007 content font preferences
  (singleton): `family` (`default`/sans/serif/mono) + `size` (small/medium/large),
  mirrored onto `<html data-ct-font-*>` (attr only for a non-default value),
  persisted to `ct-font-family`/`ct-font-size`, synced from the head-script
  attributes on mount. SSR-safe.
- `theme/composables/useSettings.ts` — THEME-007 settings opener: `openSettings()`
  opens the shared floating window with a prompt-less two-pane `settings` utility
  (Fonts `SettingsFonts` + Language `SettingsLanguage`, FA `fa-font`/`fa-language`
  border icons, localized title getters). Setup-time composable (needs
  `useThemeLocale` context).
- `theme/composables/useNerdFont.ts` — waits for the generated Nerd Font stylesheet
  before using the CSS Font Loading API to confirm the working
  `NerdFontsSymbols Nerd Font Terminal` alias (`fonts.ready` → `fonts.load()`); then
  flags `<html data-ct-nerdfont>`. Gates all PUA glyphs so a failed asset degrades
  tofu-free (FONT-002/003/004, MD-003); called once from the layout.
- `theme/composables/useExplorer.ts` — explorer state singleton (THEME-002/011/012/013/014):
  `available` (explicit or auto-discovered tree ∧ mode ≠ paper), `items`
  (a deterministic recursive tree built from `src/**/*.md` via VitePress
  `__pageData`, including folder-index links), and source-local
  `explorer.json` metadata for localized folder labels; `desktopOpen` (persisted
  to `ct-explorer`, restored post-mount), and
  transient `drawerOpen`. Auto page labels use `explorerTitle`/localized
  `title` frontmatter and page-title fallbacks. `toggle()` drives the drawer
  under the 640px matchMedia query, the desktop retract above it;
  `closeDrawer()`. THEME-011: per-folder expanded state remains in
  `ct-explorer-nodes`; route-only reveals and current-view user overrides live
  in transient state and are cleared after navigation. ARCH-001: discovery now
  skips dynamic-route source templates (relativePath containing `[`, e.g.
  `tags/[name].md`, `page/[num].md`) — only their generated listing routes are
  real, and those are not file-tree entries. ARCH-002: discovery also drops
  pages with frontmatter `showInExplorer: false` (a hidden folder `index.md`
  loses just its link; visible children keep the folder alive) and prunes any
  subtree whose `explorer.json` sets `showInExplorer: false` (branches left
  with no page and no visible children vanish; root `/` config honored).
  `asLocalizableText` now imported from `../locales` (ARCH-003). ARCH-004:
  each sibling level sorts through `siblingComparator(directorySegments)` —
  `order` first, then the folders-first-then-natural-name fallback
  (`compareBranchNames`, ex-`compareBranches`). `branchOrder()` resolves a
  branch's order: `explorer.json` `order` wins (new `order?: number` on
  `ExplorerJsonConfig`) → page/`index.md` frontmatter `order` → `0`;
  `toFiniteOrder()` keeps only finite numbers (negatives/fractions honored,
  `NaN`/`±Infinity`/non-numbers → `0`). Display-only, SSR + client identical;
  explicit `themeConfig.explorer` arrays bypass discovery entirely.
- `theme/composables/useFloatingWindow.ts` — shared floating-window singleton
  (THEME-003/016/017): `active` shallowRef holding the current utility payload
  `{ id, label(), panes: [{ title(), icon?, component }] }` — `label()` names
  the dialog; each pane is a framed box with its own border title (getters so
  they follow language switches; `icon` = optional FA classes) and content —
  plus `isOpen`, `open()` (replaces the current utility), `close()`.
  Hidden by default; only opened programmatically.
- `theme/composables/useSearch.ts` — find-palette state & behavior
  (SEARCH-002), module-singleton: `query`/`results`/`status`
  (`unconfigured|idle|loading|results|empty|error`)/`activeIndex` shared by both
  pane components; `setQuery()` debounces (200ms) an abortable Algolia request
  via `utils/algolia.ts` (unconfigured/empty query never hit the network),
  `move()`/`openActive()`/`openResult()` drive keyboard/click navigation
  (navigates + `close()`s the window). `useSearch()` (setup-time — needs
  `useThemeConfig`/`useThemeLocale`) also exposes `openSearch()` which resets
  and opens the two-pane `search` utility (`SearchPalette` + `SearchResults`,
  magnifier border icon). `useSearchShortcut()` binds `/` via the local
  input-guarded `useKeyShortcut()` helper.
- `theme/utils/algolia.ts` — framework-free Algolia DocSearch REST client
  (SEARCH-001/002): `searchAlgolia(algolia, query, signal, hitsPerPage=8)`
  POSTs to `{appId}-dsn.algolia.net/1/indexes/{indexName}/query` (credentials
  as query params + `x-www-form-urlencoded` body = no CORS preflight, like
  Algolia's lite client; empty highlight tags → plain snippets), mapping hits to
  `SearchResult` (`objectID`/`title` = deepest hierarchy level ← content, /
  `breadcrumb` = parent levels · ` › ` / `snippet` = `_snippetResult.content` ←
  content / `url`); rows without a `url` are dropped. No npm dependency.
- `theme/composables/useTaxonomy.ts` — I18N-008 taxonomy display labels:
  `useTaxonomy()` → `tagLabel(term)`/`categoryLabel(term)` resolving
  `themeConfig.taxonomy` through `termLabel()` (posts.ts) against the active
  language; consumed by PostTaxonomy, TagsIndex, CategoriesIndex, TermPosts.
- `theme/composables/useClock.ts` — THEME-019 live wall clock: a reactive
  `HH:MM:SS` (24-hour, zero-padded) string for the status bar's right end.
  SSR-safe — starts empty (server + first client render agree), fills and ticks
  each second via an interval started `onMounted` and cleared `onBeforeUnmount`.
- `theme/composables/useReadingProgress.ts` — scroll progress as an integer % for
  the status bar (THEME-001/008): tracks the `.ct-viewport` panel (the shell's
  only scroll container), 100 when the page fits inside it; updates on
  scroll/resize + `onContentUpdated`; SSR-safe (starts at 0, listeners on mount).
- `theme/composables/useViewportScroll.ts` — router-facing scroll behaviors for
  the fixed frame (THEME-008), wired to the viewport ref from Layout: on
  `onContentUpdated` jumps to the URL-hash target or resets the panel to top
  (VitePress's own window.scrollTo is a no-op) — but ONLY when
  `page.relativePath` changed since the last run: the hook also fires on
  same-page re-renders (in-place language switch, dev-mode updates, COMP-002
  lightbox DOM work), which must keep the reading position; a panel click
  listener scrolls
  same-page anchor targets (footnotes/header anchors) smoothly into view.
- `theme/composables/useSiteText.ts` — localized site `title`/`description`
  (I18N-004): themeConfig LocalizableText ?? site config values; post-mount
  watchEffect syncs `document.title` (`page | title` pattern) and
  `meta[name=description]` with the active language (SSR head keeps defaults).
  ARCH-003: the tab title's page part resolves a localized frontmatter `title`
  map first, else VitePress's `page.title`.
- `theme/composables/useThemeConfig.ts` — client composable: `useThemeConfig()` wraps
  `useData()` + `resolveThemeConfig()`; components read all user options through it,
  honoring per-locale `themeConfig`.
- `theme/composables/useColorMode.ts` — module-singleton `useColorMode()`:
  `mode`/`setMode`/`cycleMode` over `'dark'|'light'|'paper'`; mirrors the
  `data-ct-mode` attribute set pre-paint by head.ts, persists to localStorage
  `ct-mode`; SSR-safe.
- `theme/index.ts` — theme entry: default-exports `DemoLayout` (the demo site's
  wrapper filling the `pre-footer` slot, THEME-006); `enhanceApp` globally
  registers the POST-001/002 listing components (`PostsIndex`, `ArchivesList`,
  `CategoriesIndex`, `TagsIndex`, `TermPosts`, `SeriesIndex`,
  `SeriesArticles`) and the PAGE-004 `FriendLinks` so those `.md` pages can
  place them without per-file imports (the PAGE-002/003 projects/About views
  are instead imported directly by their `.md` via `@/views/…`, not registered
  here); named-exports the reusable `Card`
  component and the theme's own `Layout`; imports `styles/main.scss`. Swap the
  default `Layout` back to the real one to ship without the demo section.
- `theme/friends.ts` — PAGE-004 framework-free friend-links data layer:
  `FriendLinkEntry`/`FriendLinkGroup`/`FriendLinkSource` types +
  `mergeFriendSources()` — validates the generator-format modules
  (`asLocalizableText()`, entries need title+url, `screenshot` ignored;
  invalid input skipped with a `[theme/friends]` console warning), orders
  sources depth-then-path, merges same-`group`-id groups (first occurrence
  fixes position, labels from the first source that provides them, entries
  append).
- `theme/posts.ts` — POST-001/002/003 framework-free post & series helpers:
  `PostEntry`/`RawContentEntry`/`TermGroup` types; `normalizePosts(raw)` (maps +
  date-sorts the content-loader output, unzoned `YYYY-MM-DD` = UTC; drops series
  landing `index.md` pages; fills `series` slug from the URL, `cover`, and
  `order` via `toOrder` — finite numbers only, non-finite → 0), `toStringList`,
  `slugify` (the `/tags`, `/categories` URL slug), `groupByTag`/`groupByCategory`
  (term → posts, most-used first), `POSTS_PER_PAGE=10`, `pageCount`. POST-002:
  `SeriesEntry` type (slug/url/icon/title/description/order), `compareSeries`
  (order asc, ties slug), `seriesArticles(posts, slug)` (order asc, ties URL),
  `seriesDisplayTitle(series, slug, language)` (the localized series.yml
  title with slug fallback, shared by PostList/ArchivesList),
  and `filterListablePosts(posts, seriesToggles, surface)` — the per-surface
  series gate shared by listing components and the `.paths.mjs` route loaders.
  Imported by both data loaders, the route loaders, and the listing components.
  ARCH-003: `PostEntry.title`/`.excerpt` are `LocalizableText` — frontmatter
  maps pass through `asLocalizableText` and the display components resolve
  them; term names stay verbatim strings. I18N-008: `termLabel(term, labels,
  language)` — the display-label resolver over `themeConfig.taxonomy` maps
  (key matched by exact name or slug equality; fallback = the authored term).
- `theme/posts.data.mts` — POST-001/002 VitePress data loader:
  `createContentLoader(['posts/**/*.md', 'series/**/*.md'], { excerpt })` →
  `normalizePosts`; exports typed `data: PostEntry[]` inlined at build. Series
  articles are included tagged with their slug (landing pages dropped) and
  filtered per surface by the consumers — the loader stays toggle-agnostic so
  series landings and general listings share one dataset.
- `theme/series.data.mts` — POST-002 series-metadata loader: `defineLoader`
  watching `src/series/*/series.yml` (globs relative to the loader file),
  parses each with js-yaml (a bad file degrades to defaults, never breaks the
  build) through `asLocalizableText` into `SeriesEntry[]` sorted by
  `compareSeries`. Consumed by SeriesIndex, SeriesArticlePage, and PostList's
  series chip.
- `theme/utils/date.ts` — POST-001 deterministic date helpers: `formatListDate`
  (ISO → localized `long` date in **UTC** so SSR/hydration agree — unlike the
  license card's reader-timezone formatter), `toIsoDate` (frontmatter date shape
  → ISO, unzoned = UTC), `yearOf` (UTC year for archive grouping).
- `theme/DemoLayout.vue` — temporary THEME-006 demo wrapper: wraps `Layout.vue`
  and fills its `#pre-footer` slot with `PreFooterDemo.vue` — the exact
  extend-and-wrap pattern a consuming site uses. Registered as this demo site's
  Layout via `theme/index.ts`.
- `theme/components/PreFooterDemo.vue` — temporary THEME-006 demo content:
  left = Nerd-Font logo glyph (`.ct-prefooter-demo__logo`) + localized theme
  name (`useSiteText`); right = a Font Awesome icon (`fa-palette`), a Nerd Font
  icon (`.ct-prefooter-demo__nf`), and the localized `footer.demoCustom` label.
  Demonstrates arbitrary content, both icon systems, and i18n inside the slot.
- `theme/Layout.vue` — the TUI shell (THEME-001/008 + ARCH-001 dispatch): `.ct-shell`
  composing `<ToolBar/>`, the `.ct-main` row — `<Explorer/>` when
  `useExplorer().available` (THEME-002: tree configured ∧ not paper mode)
  beside the `.ct-viewport` panel (template ref wired to `useViewportScroll()`;
  wraps `.ct-content` with a single **page-type dispatch** — `<component
  :is=pageComponent>` where `pageComponent` maps `resolvePageType(page,
  frontmatter)` → the matching `pages/*Page.vue` — then the `.ct-footer-region`
  (THEME-004/006) with the optional `.ct-prefooter` slot above
  `<SiteFooter :divided/>`) — `<StatusBar/>`, and the shared `<FloatingWindow/>`
  (THEME-003). The old home placeholder + `isArticle` branching (ArticleMeta/
  License/Comments) moved into HomePage/PostPage. Still calls
  `useCalloutTitles()` + `useCodeCopy()` + `useNerdFont()` + `useSearchShortcut()`
  + `useLocalizedContent()` + `useLightbox()` / `useSwipers()` + `useWaline()`
  once (these are shell-wide, independent of page type).
- `theme/utils/pageType.ts` — ARCH-001 page-type resolver (framework-free):
  `PageType` = home|normal|post|series|listing|notFound; `resolvePageType({
  relativePath, isNotFound, frontmatter })` precedence = not-found → `pageType`
  frontmatter override → `home` → fixed listing filenames
  (`posts/archives/categories/tags/series.md`) & dynamic prefixes
  (`categories/`,`tags/`,`page/`) → `article:false` escape hatch (→ normal) →
  `series/`|`posts/` prefixes → normal. Single dispatch point for Layout.
- `theme/pages/HomePage.vue` — ARCH-001 home type + PAGE-001 welcome card: a
  single reusable `Card` **with** `show-prompt` (command from
  `themeConfig.home.command`, default `whoami`) holding the localized
  greeting/tagline/body + call-to-action `links`; greeting/tagline fall back
  to the localized site title/description (`useSiteText`) when unset. No
  `<Content/>` or article chrome. Styles in `_pages.scss`.
- `theme/pages/NormalPage.vue` — ARCH-001 normal type: bare `<Content/>`, no
  article footer (about/projects/guide/demo pages).
- `theme/pages/PostPage.vue` — ARCH-001 post type + POST-001 byline + POST-003
  cover: `<ArticleMeta>` (when comments configured), a `.ct-post-header` region
  — the `__meta` byline (formatted date + `<PostTaxonomy>` category/tag
  links) with the optional `__cover` img (frontmatter `cover`; base-aware
  URL, alt = localized title, `loading=lazy decoding=async data-no-lightbox`;
  the `--cover` modifier turns the header into a hero banner showing the full
  uncropped image with the byline overlaid on its faded bottom edge) —
  `<Content/>`, then `<ArticleLicense>` (unless `license:false`) and
  `<ArticleComments>` (when configured, unless `comments:false`). Reused
  wholesale by SeriesArticlePage.
- `theme/pages/SeriesArticlePage.vue` — ARCH-001 series type + POST-002 banner:
  a `.ct-series-banner` above `<PostPage/>` — label + link to
  `/series/<slug>/` showing the series' `series.yml` icon (gated
  `.ct-series-icon`) and localized title (folder-name fallback), plus a dim
  localized description line when configured (meta from `series.data.mts`).
- `theme/pages/ListingPage.vue` — ARCH-001 listing type: bare `<Content/>`; the
  listing `.md` files place the relevant globally-registered listing component,
  and this type carries no article footer.
- `theme/pages/NotFoundPage.vue` — ARCH-001 404 type: minimal localized
  not-found (`notFound.title`/`.home`) inside the shell; client-rendered
  (VitePress's `404.html` app div is empty and hydrates through the dispatch).
- `theme/views/About.vue`, `theme/views/Projects.vue` — PAGE-003/002 page
  views (authored-view pattern, content-architecture.md §8; imported by
  `src/about.md`/`src/projects.md` via `@/views/…`). Thin language dispatchers:
  render `views/{about,projects}/{en,zh-Hans}.vue` by
  `useThemeLocale().language` (primary-subtag match, en fallback → re-renders
  in place on a language switch).
- `theme/views/about/{en,zh-Hans}.vue`, `theme/views/projects/{en,zh-Hans}.vue`
  — hand-authored per-language content for the About/Projects pages, built from
  the `Card` component + shared fractional `.ct-cardgrid` with span modifiers
  (`--full`/`--two-thirds`/`--half`/`--third`): a `--full` lead card (shell
  prompt `whoami`/`open`) over fractional rows — projects show `1/3 + 2/3`,
  About shows `2/3 + 1/3` then `1/2 + 1/2` (About: labeled `<dl>` info rows;
  Projects: name link + description + literal `tags` chips). FA icons (always
  render); classes styled in `_pages.scss` (no SFC `<style>`). Edit these to
  author real content — this authoring IS the config surface for these pages.
- `theme/components/ToolBar.vue` — top tool bar / tabline (THEME-001/005/010/020):
  the explorer toggle `[=]` (FA bars, leftmost, hidden when the explorer doesn't
  exist — THEME-002), brand
  (gated Nerd Font glyph + localized site title, links home via `withBase`), a
  `<nav>` of editor tabs — the built-in `~/home` tab followed by the configurable
  `themeConfig.toolbar.nav` tabs (localized labels + optional FA icon, active when
  the link maps to the current page via the shared `linkRelativePath`, external =
  `_blank`, THEME-005), each wrapped in a `.ct-toolbar__navitem`; a tab with
  `items` children (THEME-020) gains a decorative caret and a
  `.ct-toolbar__submenu` dropdown of `.ct-toolbar__subitem` child links
  (icon + localized label, same external handling), revealed by CSS
  `:hover`/`:focus-within` on the wrapper; `isNavActive` highlights the parent
  when its own link or any child's matches — and the right-side action icons: the
  configurable `themeConfig.toolbar.actions` FA icon anchors (THEME-005), then
  the built-in find-palette search trigger (FA magnifying-glass →
  `useSearch().openSearch`, SEARCH-002) and the color-mode cycle button (FA
  half-circle, `mode.switch`); the settings gear moved to the status bar
  (THEME-019).
- `theme/components/Explorer.vue` — file-explorer sidebar (THEME-002/012/014):
  `<nav>` panel with mobile-only header (localized EXPLORER title + FA close
  button) and the explicit or source-discovered recursive tree from
  `useExplorer()`; `--closed`/`--drawer-open` classes; drawer dismissed via
  close button, backdrop tap (sibling `.ct-explorer-backdrop` div), `Esc`
  (window keydown), or navigation (watch `page.relativePath`); navigation also
  clears transient node overrides so route ancestor expansion recalculates.
- `theme/components/ExplorerTree.vue` — one recursive tree level
  (THEME-002/011/014), nvim-tree row anatomy: chevron (folders; pure toggle) or
  dash spacer (leaves) + NF folder/file icon span + label. Expanded state
  from the `useExplorer()` store keyed by `parentKey + '/' + raw config
  text` (language-stable); default = `depth === 0`.
  A folder-with-link label is a plain navigational anchor; route awareness
  expands it without persistence; link nodes use `withBase` (external `_blank
  noreferrer`); the active row matched by mapping the link to
  `page.relativePath` form (base- and clean-URL-proof, via the shared
  `linkRelativePath`/`isExternalLink` in `utils/pagePath.ts`, THEME-005);
  active-route ancestors
  expand temporarily without storage writes; labels via `resolveLocalizedText`
  against the active language.
- `theme/components/Card.vue` — reusable TUI floating card (COMP-001) with an
  explicit `showPrompt` flag and a typed `prompt` object (`command`, optional
  `host`/`path`/`args`). The prompt user comes from
  `useThemeConfig().author.username`; host uses the configured `siteName` (normalized
  for shell safety) or the normalized active site title, and path defaults to the
  current page location; every value remains overridable.
  Prompt markup separates host, path, command, and args so each can use an
  Oxocarbon role token; command and args preserve their explicit leading
  separators in the flex prompt layout. A resize-aware staged fitter hides the
  host, reduces the path to its last section, and then enables path ellipsis.
- `theme/components/ArticleLicense.vue` — end-of-article license card
  (COMP-003): a `Card` with `showPrompt` (command `license`) showing the
  article title (linked to its permalink), a labeled meta list (author ·
  release date from frontmatter `date` · last-updated date [frontmatter
  `updated`/`lastUpdated`, else VitePress git `page.lastUpdated`] · permalink,
  upgraded to the absolute URL on mount), and the license statement (`{license}`
  → deed link) + CC brand icons. Author & license from CONF-002 via
  `useThemeConfig()`; labels localized; a shared `formatDate(raw)` normalizes
  any date shape (bare `YYYY-MM-DD`, full ISO datetime with offset, YAML `Date`,
  numeric git timestamp) to a single instant, assumes UTC when an ISO string
  has no zone, and formats in UTC until mount before switching to the reader's
  browser timezone. Renders a `.ct-license__watermark` `<span>` (CC SVG mask)
  when `isCreativeCommons` (deed URL / CC icons). ARCH-003: the article title
  resolves a localized frontmatter `title` map first (falls back to
  `page.title`, then the site title).
- `theme/components/ArticleComments.vue` — end-of-article comment card
  (COMP-004): a `Card` with `showPrompt` (command `comments`) holding the
  localized `comments.title` heading and the `.ct-comments__waline` mount point
  that `useWaline()` fills.
- `theme/components/ArticleMeta.vue` — article view/comment counters (COMP-004):
  a small mono strip (eye + comment FA icons) with `.ct-article-meta__views` /
  `.ct-article-meta__comments` count spans (localized aria-labels) that Waline
  populates; rendered above the content on articles when comments are configured.
- `theme/components/PostTaxonomy.vue` — POST-001 categories/tags as links
  (shared by PostPage byline + PostList cards): categories → `/categories/<slug>`,
  tags → `/tags/<slug>` (`slugify`, `withBase`); localized `post.categories`/
  `post.tags` labels; term display names via `useTaxonomy()` (I18N-008,
  verbatim fallback; `#tag` marker on tags); slugs stay authored.
- `theme/components/PostList.vue` — POST-001/002/003 reusable list of post cards
  (PostsIndex / TermPosts / SeriesArticles): per post a `.ct-postcard` flex row
  — the `__body` column (title link · meta row: date via `formatListDate` + a
  series chip linking `/series/<slug>/` with the localized series.yml title
  (POST-002) · excerpt · `<PostTaxonomy>`) beside the optional `__cover`
  (POST-003: link-wrapped lazy full-height image panel fading into the card —
  lightbox skips it, tap navigates; `--cover` flips to a full-width top strip
  ≤640px); the
  `seriesInTitle` prop (TermPosts) prefixes a series article's title with the
  dim localized series name (`Series › Title`, via `seriesDisplayTitle`) and
  suppresses the chip; title/excerpt
  resolved via `resolveLocalizedText` against the active language (ARCH-003);
  localized `post.empty` when the list is empty.
- `theme/components/PostsIndex.vue` — POST-001 post-index landing + pagination:
  reads `posts.data.mts` filtered by `filterListablePosts(…, 'posts')`
  (POST-002 series toggle — matches the `page/[num].paths.mjs` count), slices
  the current page (`useData().params.num`,
  else 1), renders `<PostList>` + a `.ct-pagination` nav (prev · numbered ·
  next; page 1 = `/posts`, deeper = `/page/<n>`). Rendered by both `posts.md`
  and `page/[num].md`.
- `theme/components/ArchivesList.vue` — POST-001 by-year timeline: groups the
  date-sorted posts (filtered by the `'archives'` series toggle, POST-002) by
  descending UTC year (`yearOf`) into `.ct-archives__year`
  sections of date + title rows (titles resolved via `resolveLocalizedText`,
  ARCH-003; series rows prefixed with the dim localized series name via
  `seriesDisplayTitle`); no cards/excerpts. Rendered by `archives.md`.
- `theme/components/CategoriesIndex.vue` / `TagsIndex.vue` — POST-001 taxonomy
  indexes: `groupByCategory`/`groupByTag` over the `'categories'`/`'tags'`
  toggle-filtered posts (POST-002) → a list (categories) / cloud
  (tags) of `/…/<slug>` links with post counts; displayed names via
  `useTaxonomy()` (I18N-008). Rendered by `categories.md` / `tags.md`.
- `theme/components/TermPosts.vue` — POST-001 per-tag/-category listing (the
  `field` prop selects the taxonomy): reads route params `{ name: slug, term:
  display }` from the `[name].paths.mjs` loaders, filters the toggle-filtered
  posts (POST-002) by slug match,
  shows the localized `post.taggedWith`/`post.inCategory` heading (term via
  `useTaxonomy()`, I18N-008), a back link
  to the index, and `<PostList series-in-title>` (admitted series articles
  show their series name in the card title). Rendered by
  `{tags,categories}/[name].md`.
- `theme/components/FriendLinks.vue` — PAGE-004 friends-page component
  (globally registered, placed by `src/friends.md`): module-scope eager
  `import.meta.glob('../assets/**/linksData.mjs')` → `mergeFriendSources()`
  (SSR-complete HTML, no client fetch; missing submodule = no match, no
  crash); renders the `[⇄ random]` control (`window.open` `_blank,noopener`,
  hidden when `showRandom` off or no entries), per-group `h2` header (label:
  `themeConfig.friends.groups` override → data label → id verbatim; dim
  `(count)` gated on `showCount`; dim desc line) over the card grid — each
  card one external `<a>` with a rounded-square avatar over a placeholder
  glyph (`<img>` hides itself on `@error`; `data-no-lightbox`), ellipsized
  title, 2-line blurb; `friends.empty` notice when no groups at all; all
  LocalizableText display reactive on the UI language.
- `theme/components/SeriesIndex.vue` — POST-002 series index (rendered by
  `series.md`): merges `series.data.mts` metadata with article-only series
  folders (folder-name defaults), sorts by `compareSeries`, and renders
  `.ct-series-index__link` rows — gated `.ct-series-icon` + localized
  title/description + localized `series.articleCount` — with `series.empty`
  when none.
- `theme/components/SeriesArticles.vue` — POST-002 series landing list: derives
  the slug from `page.relativePath` (`series/<slug>/…`) and renders
  `<PostList>` with `seriesArticles()` — the series' articles in reading order
  (`order` asc, ties by URL). Placed on `series/<name>/index.md`.
- `theme/components/FloatingWindow.vue` — the single shared floating utility
  window (THEME-003/016/017), rendered once from Layout: `role="dialog"` +
  aria-modal container over a dimmed backdrop, stacking the active utility's
  framed pane `<section>`s (each aria-labeled by its title); pane titles
  (+ optional decorative FA icon) sit on the top border line, and the literal
  text `[x]` close control sits on the first pane's border; pane bodies are
  the scroll regions; dismissed via `[x]`, backdrop click, or `Esc`; focus
  moves into the container on open and returns on close.
- `theme/components/SearchPalette.vue` — find-palette input pane (SEARCH-002):
  a `>` prompt glyph + a borderless search field bound to `useSearch().query`;
  input runs `setQuery`, `↑`/`↓` `move` the active result, Enter `openActive`.
  Auto-focuses the field via rAF on mount (wins over the window's own panel
  focus). Placeholder/aria localized.
- `theme/components/SearchResults.vue` — find-palette results pane (SEARCH-002):
  renders the `useSearch()` result rows as real `<a>` links (title · optional
  breadcrumb · clamped snippet), the active row accent-washed; a `watch` keeps
  the keyboard-selected row scrolled into view; row click navigates through the
  shared `openResult` (modifier/non-left clicks fall through to the browser for
  open-in-new-tab). All other states show one localized status line
  (idle/loading/empty/error/unconfigured). A `.ct-search__footer` row closes
  the pane: the keyboard hint on the left, and — unless unconfigured — the
  required **Algolia attribution** on the right (`.ct-search__algolia`, a link
  to algolia.com wrapping the official single-path Algolia logo inline SVG in
  `currentColor`; label localized via `search.poweredBy`. Note `fa-algolia` is
  NOT in the loaded Font Awesome build, hence the inline SVG).
- `theme/components/SettingsFonts.vue` — THEME-007 settings Fonts pane: two
  segmented controls (`.ct-settings__option`) for the content font family
  (Default/Sans/Serif/Mono) and size (Small/Medium/Large), driven by
  `useFontSettings()`; every label localized.
- `theme/components/SettingsLanguage.vue` — THEME-007 settings Language pane: a
  list of `useThemeLocale().languages` rows (self-described `lang.label` + tag),
  active highlighted, `setLanguage()` switches in place (I18N-003).
- `theme/components/SiteFooter.vue` — in-viewport footer (THEME-004/006):
  takes a `divided` prop — when a custom pre-footer section sits above it
  (THEME-006), `.ct-footer--divided` draws the subtler inset inner separator (the
  edge-to-edge full separator is owned by the region wrapper in Layout). Grid of
  four cells — localized copyright (`{year}`/`{author}`, author from CONF-002) ·
  social icons (`themeConfig.footer.social`) · powered-by (localized
  `{vitepress}/{theme}` placeholders split into linked product names) · RSS
  (orange icon + untranslated "RSS" wordmark, only when `footer.rss` set) +
  license (CONF-002): icon cluster as one non-underlined link, or — when a
  custom license ships no icons — the localized `footer.licensedUnder`
  sentence (`{license}` placeholder) with the name as an underlined deed link
  (plain text without `url`).
- `theme/components/StatusBar.vue` — bottom statusline (THEME-001/009/010/019):
  left a **live state chip** — `state` computed from `page.isNotFound` /
  `frontmatter.home` → `status.notFound`/`.home`/`.read`, `kind` driving
  `.ct-statusbar__chip--{notfound,home,read}` — then a `.ct-statusbar__path`
  wrapper (single divided segment) holding the `formatPageLocation` breadcrumb +
  the blinking `.ct-statusbar__cursor`; right a tight progress-% + back-to-top
  cluster (FA arrow-up smooth-scrolls `.ct-viewport` to 0), the permanent
  in-place language switcher (cycles `languages`, hidden under two), a read-only
  color-mode indicator span, the settings gear (`useSettings().openSettings`,
  moved from the tool bar by THEME-019), and a `v-if`-gated
  `.ct-statusbar__clock` (`useClock`, `HH:MM:SS`) at the far right; replaces the
  I18N-002 placeholder controls.
- `theme/styles/main.scss` — SCSS entry: `@use`s the working Nerd Font face
  (`_fonts.scss`), tokens/modes/shell/toolbar/explorer/statusbar/window/
  settings/content/**posts**/pages/**friends**/card/license/comments/footer/
  prefooter-demo/code/
  callouts/lightbox/swiper (COMP-002 vendor CSS + overrides; `search` after
  `window`, SEARCH-002; `license`/`comments` after `card`, COMP-003/004;
  `posts` after `content`, ARCH-001/POST-001; `friends` after `pages`,
  PAGE-004), then base document styles
  (box-sizing, body bg/color/font
  via semantic tokens, `::selection` from the derived highlight).
- `theme/styles/_prefooter-demo.scss` — THEME-006 temporary pre-footer demo
  styles: flex `space-between` row, mono TUI text, accent-colored FA + Nerd
  Font glyphs; the logo/nf glyphs follow the NF gating convention (plain `::`/`*`
  fallback upgraded to `\f120`/`\f005` under `html[data-ct-nerdfont]`).
- `theme/styles/_fonts.scss` — registers the current jsDelivr
  `SymbolsNerdFont-Regular.ttf` under `NerdFontsSymbols Nerd Font Terminal`,
  compensating for the generated CSS's missing legacy `/fonts/` source path
  (FONT-004).
- `theme/styles/_tokens.scss` — primitives: `--ct-main` fallback on `html` (lower
  specificity so the head-injected `:root` value wins), main-color derivatives via
  `color-mix()` (bright/dim/subtle/border/selection/deep/deeper — no hardcoded
  derivative hex), Carbon grays + semantic colors (incl. purple 40/60 for
  `--ct-important`, orange 40/60 for the footer RSS accent), IBM Plex font
  stacks + the aliased `--ct-font-nerd` (FONT-002/004), fixed Oxocarbon prompt
  primitives, radius/gap.
- `theme/styles/_modes.scss` — semantic tokens (`--ct-bg/surface/text/link/border/
  inline-code/error/warning/info/success/important/rss/font-body`) as mixins per mode;
  body text NEUTRAL everywhere (STYLE-006: dark = gray-10, light/paper = gray-100),
  main color only on emphasis tokens (strong/heading/link/inline-code); `:root` =
  dark (default), `[data-ct-mode=light|paper]` overrides, `@media print`
  force-applies paper tokens; maps `--ct-prompt-*` to the active Oxocarbon role set.
- `theme/styles/_code.scss` — STYLE-003/004 code-block cards: `.ct-code` card
  frame (border/radius/shadow, matches `_card.scss`) + `.ct-code__titlebar`
  (file name · language · text `[copy]` accent button, `--copied` success flash);
  inner `div[class*=language-]` de-framed (hides default copy/lang leftovers),
  `pre.shiki` basics, per-mode `--shiki-dark/-light/-paper` selection incl. print
  (which also drops the card shadow).
- `theme/styles/_content.scss` — STYLE-005: `.ct-content` markdown styling (headings,
  text, links, lists, blockquotes, tables w/ overflow-x scroll, hr, img, inline code)
  via semantic tokens; 72ch measure; 480px mobile padding tier; `flex: 1 0 auto`
  so it grows in the viewport column and pins the footer to the panel bottom
  (THEME-004). Font uses `var(--ct-content-font, var(--ct-font-body))` and size
  `var(--ct-content-font-size, 1rem)` so the THEME-007 settings override the
  reader font (else follow the mode default). Also carries the I18N-007
  `.ct-lang` rules: `display: contents` (layout-neutral wrapper) with
  `.ct-lang[hidden]{display:none}` winning by specificity so hidden
  language blocks leave the flow.
- `theme/styles/_friends.scss` — PAGE-004 friends-page styles, scoped under
  `.ct-content`: `[⇄ random]` mono text-button (derived-accent hover), group
  headers (dim mono count + dim desc), `repeat(auto-fill, minmax(15rem,1fr))`
  card grid (forced 1-col ≤640px), compact link cards (surface + border +
  radius, ≥44px, main-color-derived hover border/title accent), 3rem
  rounded-square avatar with the placeholder glyph behind an absolutely
  positioned cover img, 2-line blurb clamp, `friends.empty` dim notice.
- `theme/styles/_posts.scss` — ARCH-001/POST-001/002/003 posts, series,
  taxonomy & listing styles, all scoped under `.ct-content` (out-specifies the
  base markdown list/heading rules): `.ct-taxonomy` link chips;
  `.ct-post-header` — plain separator byline, or with `--cover` a framed hero
  banner showing the FULL uncropped cover (normal-flow `width:100%;height:auto`,
  natural aspect drives the banner height, 8rem floor) at FULL opacity, masked
  into `--ct-surface` only along the bottom strip behind the `__meta` byline
  (which absolutely overlays that faded edge); mask `#000 65%→transparent 92%`,
  ≤640px `#000 45%→82%` (POST-003);
  `.ct-postlist`/`.ct-postcard` cards as `__body` +
  optional full-height 15rem `__cover` panels (negative-margin bleed to the
  right frame edges, `object-fit: cover` crop, left-edge fade mask;
  `--cover` card `overflow:hidden` + min-height) with a `__meta`
  date/series-chip row and the dim `__title-series` prefix (POST-002/003);
  `.ct-pagination`
  mono buttons (`--num--active` = accent fill); `.ct-terms__list`/`__cloud`
  index chips with counts; `.ct-archives` year timeline (border-left guide,
  fixed-width mono date, dim `__series` prefix on series rows);
  `.ct-series-banner` (label/name row + dim `__desc`);
  `.ct-series-icon` — `nf-*` classes get `--ct-font-nerd` and are
  display:none until `html[data-ct-nerdfont]` (FA classes unaffected);
  `.ct-series-index__*` rows (icon · title/desc column · count); `.ct-notfound`
  centered 404. Mono chrome, accent hover
  (`--ct-main-subtle`/`--ct-main-border`); ≤640px
  stacks archive rows and flips `--cover` cards to column-reverse — the cover
  becomes a full-width top strip fading downward into the card body.
- `theme/styles/_settings.scss` — THEME-007: maps `<html data-ct-font-family|size>`
  to `--ct-content-font`/`--ct-content-font-size` (default family = no attr =
  follow mode; medium size = base), and styles the settings-panel controls —
  `.ct-settings` font rows (label + `.ct-settings__option` segmented control) and
  `.ct-settings__langs` language list, accent active state (`--ct-main-subtle`).
- `theme/styles/_pages.scss` — PAGE-001/002/003 built-in content pages (scoped
  under `.ct-content`): shared `.ct-page__title`; the **fractional**
  `.ct-cardgrid` — a 6-column track (LCM of halves/thirds) where
  `.ct-cardgrid__item` picks a width via a span modifier `--third` (span 2 =
  1/3) / `--half` (span 3 = 1/2, also the default) / `--two-thirds` (span 4 =
  2/3) / `--full` (`1 / -1` = whole row), mixable per row; cards reset their
  stand-alone margin to fill the cell; ≤640px the grid collapses to one column
  (all modifiers reset to `1 / -1`). Then the home card
  (`.ct-home__greeting`/`__tagline`/`__body` + `__links` mono button chips);
  project cards (`.ct-project__name`/`__icon`/`__desc`/`__tags` chips); About
  cards (`.ct-about-block__title`/`__body`/`__items` labeled rows — a
  `.ct-about-block__row` is label-beside-value inline, and the
  `--stacked` variant forces label-over-value on two lines at any width, e.g.
  for long URLs/emails). Ends with
  the Nerd Font gate for `nf-*` card icons (`.ct-page i[class*='nf-']`, shown
  only under `html[data-ct-nerdfont]`). Width and the shell prompt are
  orthogonal (prompt = `show-prompt` on the Card).
- `theme/styles/_card.scss` — COMP-001 floating-card chrome: subtle rounded
  border, low-opacity 4px/12px shadow, semantic surface tokens, a monospace
  shell-prompt header with Oxocarbon segment roles, body spacing, narrow-screen
  overflow protection, explicit command/argument whitespace preservation, staged
  path ellipsis, and print-safe shadow removal.
- `theme/styles/_license.scss` — COMP-003 license-card body (rules scoped under
  `.ct-content` to out-specify `.ct-content h2/p/dl` so the article-heading
  margin doesn't gap above the title): `.ct-license__title`
  heading (linked, accent hover), `.ct-license__meta` labeled dl (fixed-width
  mono `dt` dim labels beside values, `__url` link), and the `__statement`
  (top-rule separated) with the inline accent `__icons` brand cluster. The card
  root is `position: relative` so the `.ct-license__watermark` — a `<span>` with
  `top:0;bottom:0` (height = card height) + `aspect-ratio:1` (square), the CC
  logo as an inline-SVG `mask` tinted by a faint `color-mix(--ct-text 7%)`
  `background-color`, rotated CCW and pushed past the right edge (`z-index:0`) —
  is clipped by the card's `overflow:hidden`; title/meta/statement get
  `z-index:1` above it; the watermark crops harder ≤640px. The card frame/prompt
  come from `_card.scss`.
- `theme/styles/_comments.scss` — COMP-004 comments (`.ct-comments` rules scoped
  under `.ct-content` so the card title out-specifies `.ct-content h2`, like the
  license card): `@use`s the Waline vendor
  CSS (`@waline/client/style` export) and reconciles it with the theme —
  `.ct-comments__waline` sets `--waline-theme-color`/`--waline-active-color`
  to the main color and the widget font to the body face; `.ct-comments__title`
  heading;
  the `.ct-article-meta` count strip (mono, dim, accent icons, tabular-nums).
  Waline keeps its own light/dark var sets (wired via the `dark` selector);
  comments + counts hidden in print (the license card still prints).
- `theme/styles/_footer.scss` — THEME-004/006 in-viewport footer region: the
  `.ct-footer-region` wrapper (flex-shrink:0, bottom-pinned) owns the full
  separator (`border-top: 1px solid var(--ct-border)`, before the whole footer
  section); `.ct-prefooter` holds the custom section with footer-matching
  padding; `.ct-footer--divided` adds the subtler inner separator only when
  the custom section is present — a `--ct-border` `::before` rule INSET by the
  footer's horizontal padding (so it does not reach the panel edges, matching
  the search window's hint rule), unlike the edge-to-edge full separator
  (THEME-006).
  Footer itself: full panel width
  (wider than the 72ch article column), mono small
  `--ct-text-neutral`; 2×2 grid (texts left, icon clusters right); ≥641px the
  powered/meta row is lightened via `color-mix(… 68%, transparent)` over the
  row above (derived, color-system §3); ≤640px collapses to one column in
  sketch-caption order (copyright · powered · social · meta) with left-aligned
  icons; print drops link underlines. Underline is opt-in for TEXT links only
  (`__copyright a`/`__powered a`/`__license-text a`) — icon anchors never
  underline in any state; RSS chip in `--ct-rss` orange (selector doubled
  `& &__rss` to out-rank `.ct-footer a`'s color inherit), license glyphs one
  tight 0.125rem cluster; glyph clusters at 0.9375rem, the license text
  fallback at the regular footer size.
- `theme/styles/_callouts.scss` — MD-002 callouts, minimal left-bar style (revised
  2026-07-09): 3px accent bar + accent-colored mono uppercase title, no bg/frame;
  accent + Nerd Font title glyph (nf-fa-* PUA, MD-003) per variant, glyphs gated
  behind `[data-ct-nerdfont]`; `<details>` variant hides the native marker and
  animates a rotating chevron (`❯` fallback, upgraded to the NF chevron by the same
  gated rule via specificity).
- `theme/utils/pagePath.ts` — framework-free page-path helpers: `formatPageLocation()`
  (maps `relativePath` to `~` or a home-relative path without the Markdown
  extension; status bar + card prompt defaults), and the active-link matchers
  `isExternalLink()` + `linkRelativePath()` (map a site-absolute link onto the
  `relativePath` form, base-/clean-URL-proof; external → `null`) shared by the
  explorer tree (`ExplorerTree.vue`) and the tool-bar nav tabs (`ToolBar.vue`,
  THEME-005).
- `theme/styles/_shell.scss` — THEME-001/008 shell frame: `.ct-shell` FIXED
  100dvh flex column with `--ct-gap` gaps/padding; `.ct-main` middle flex row
  (explorer beside viewport, THEME-002 — a retracted explorer is display:none
  so the row gap collapses); `.ct-viewport` bordered
  rounded panel is the only scroll container (`flex: 1; min-height: 0;
  overflow-y: auto; overscroll-behavior: contain; scroll-padding-top`) — content
  clips at its edges, the frame never scrolls; the panel is itself a flex
  column so the in-viewport footer pins to its bottom edge on short pages
  (THEME-004); print releases the fixed height, drops padding/border, and
  flattens `.ct-main` to a block so the full article prints.
- `theme/styles/_toolbar.scss` — top tool bar: fixed floating panel, surface bg
  + border/radius/shadow, mono; brand glyph `::` upgraded to nf-fa-terminal behind
  `[data-ct-nerdfont]`; editor-tab links with accent hover/active (home + the
  configurable THEME-005 nav tabs); THEME-020 nav submenus —
  `.ct-toolbar__navitem` relative wrapper anchoring an absolute
  `.ct-toolbar__submenu` dropdown (TUI floating panel: `--ct-border` frame,
  `--ct-radius`, surface bg, `0 4px 12px` shadow, z-30, 0.4rem gap with an
  invisible `::before` hover bridge, 0.15s opacity/translate reveal) shown via
  `:hover`/`:focus-within`, with tab-styled `.ct-toolbar__subitem` rows and a
  dimmed `.ct-toolbar__caret` marker; right-aligned `__actions` group with accent
  icon controls — `.ct-toolbar__action` now covers both `<button>` (search/mode)
  and the configurable `<a>` action slots (THEME-005: `inline-flex`,
  `text-decoration:none`); tabs
  hidden ≤640px (the explorer drawer takes over, THEME-002); hidden in print.
- `theme/styles/_explorer.scss` — THEME-002/011 file-explorer sidebar: desktop
  15rem surface panel with own scroll (`--closed` = display:none, instant
  editor-tree retract, ≥641px only); mono TUI chrome. Rows nvim-tree style
  behind `[data-ct-nerdfont]`: NF chevron `\f054` (rotates open), icon column
  (`__icon--folder \f07b` / `--folder-open \f07c` accent-tinted, `--file
  \f016` dim; display:none without the gate) with the leaf dash becoming a
  spacer; fallback = plain `❯` / `-`, no icon column. Folder labels
  `--ct-text-strong`; nested levels indent along a border-left guide; active
  row = `--ct-main-subtle` bg + accent label; ≤640px = fixed off-canvas
  drawer (`translateX` slide, `--drawer-open`, z-30) over the
  `.ct-explorer-backdrop` dim layer (z-20, desktop-hidden), drawer-only
  header; hidden in print. The drawer breakpoint must match useExplorer's
  `DRAWER_QUERY`.
- `theme/styles/_window.scss` — THEME-003/016/017 shared floating window:
  backdrop z-40 (above the explorer drawer's z-30) + invisible window
  container z-50 (centered top 14vh, `min(40rem, …)` wide, 70vh max) stacking
  framed `__pane` boxes with a `--ct-gap` flex gap; each `__pane` is
  `flex: 0 0 auto` (natural height, no shrink) while `__pane:last-child` is
  `flex: 1 1 auto` — so inside the height-capped window only the last pane
  (e.g. the find palette's results) shrinks & scrolls and the earlier panes
  (the search input) keep full height instead of being overlapped;
  `__pane-title` (+ optional
  accent `__icon`) and the text `[x]` `__close` sit on the top border via
  absolute positioning + `translateY(-50%)` with a `--ct-surface` backing
  masking the line; `__pane-body` is each pane's scroll region; deeper
  `0 12px 32px` shadow per pane, mono chrome, 0.15s fade-in; ≤640px =
  near-full-screen sheet inset by `--ct-gap` with the last pane growing;
  hidden in print. (The temporary demo styles were removed with SEARCH-002;
  the find palette's own styles live in `_search.scss`.)
- `theme/styles/_search.scss` — SEARCH-002 find-palette content inside the
  shared window's panes: `.ct-search__input` (`>` prompt + borderless
  `__field`, native search-clear hidden), `.ct-search__result` link rows
  (stacked `__result-title` accent / `__result-breadcrumb` dim / two-line
  clamped `__result-snippet`, `--active`/hover accent wash), `.ct-search__status`
  message line, and the `.ct-search__footer` (top rule, space-between) holding
  the `.ct-search__hint` keyboard row and the right-aligned `.ct-search__algolia`
  attribution link (dim → hover accent, 0.9375rem inline SVG). Mono is inherited
  from the window chrome.
- `theme/styles/_lightbox.scss` — COMP-002 lightbox: `@use`s the Fancybox
  vendor CSS from node_modules (the SCSS entry is where vendor stylesheets
  load), zoom-in cursor on marked images, theme-token overlay
  (`--fancybox-bg` from `--ct-bg` via color-mix, mono chrome font), hidden in
  print.
- `theme/styles/_swiper.scss` — COMP-002 deck: `@use`s Swiper core +
  effect-cards vendor CSS (no navigation CSS — the arrows are the theme's
  own flex siblings); `.ct-swiper` centered flex row (clamp gap,
  `-webkit-user-drag: none` on images) around the `.ct-swiper__deck`
  fixed-aspect (4/3) box (`flex: 1 1 auto; max-width: 24rem; min-width: 0`
  so it shrinks between the arrows on mobile);
  `.ct-swiper__slide` in the card finish (border,
  `--ct-radius`, surface bg, shadowless — the `-no-shadow` flavor), slide
  `<p>` collapsed so the `object-fit: cover` image owns the card;
  `.ct-swiper__nav` arrows as 44px TUI buttons beside the deck — mono
  `❮`/`❯` `::after` chevrons, module-injected vendor SVG hidden,
  `--ct-main-subtle` hover wash, module-set `swiper-button-disabled`/`-lock`
  states styled locally; print
  releases the aspect ratio and hides the arrows.
- `theme/styles/_statusbar.scss` — bottom statusline: fixed floating panel,
  same panel finish, mono small; inverted accent state `__chip` (main-color bg,
  gray-100 text; `--notfound` swaps to `--ct-error`, THEME-019). A
  `__path` inline-flex wraps the truncating `__location` and the
  `__cursor` — a baseline-aligned `0.55em×0.12em` main-color underscore bar
  with a hard `ct-cursor-blink` steps animation, `animation: none` under
  `prefers-reduced-motion` (THEME-019);
  `__clock` uses tabular-nums. Accent text-button controls + `--icon`
  modifier (back-to-top THEME-009, settings gear THEME-019); THEME-010:
  `::before` pseudo-element dividers between top-level group segments (pseudo,
  not border — survives the buttons' border reset) and a tight `__cluster`
  (progress + back-to-top, no divider inside); `__path` + `__clock` hidden
  ≤640px (gear stays); hidden in print.

## src/ (site content — VitePress `srcDir`)

- `index.md` — home page stub with `home: true` and localized `title`
  frontmatter used by the auto-discovered explorer; the `home` page type
  dispatches to `HomePage.vue` (the welcome card content is `themeConfig.home`,
  PAGE-001).
- `projects.md` — normal page (localized `title` frontmatter) whose
  `<script setup>` imports `@/views/Projects.vue` and renders `<Projects/>`
  (PAGE-002 authored view; content-architecture.md §8).
- `about.md` — normal page (localized `title` frontmatter) whose
  `<script setup>` imports `@/views/About.vue` and renders `<About/>`
  (PAGE-003 authored view).
- `friends.md` — PAGE-004 friends page: normal page (localized `title`)
  placing the global `<FriendLinks />` between authored `::: lang` en/zh-Hans
  blocks — a localized intro (h1) and a "How to apply" section with the
  generator issue-JSON template (`title` field; no explicit `{#apply}` ids —
  duplicating one id across lang blocks fails the VitePress build).
- `guide/index.md`, `guide/getting-started.md`, `guide/advanced/index.md`,
  `guide/advanced/deep-dive.md`, and
  `guide/advanced/advanced-2/{deep-dive.md,explorer.json}` — explorer demo
  content with localized title frontmatter; the getting-started page documents
  `"auto"`, source-local JSON folder metadata, the ARCH-002 `showInExplorer`
  toggle (frontmatter + JSON), explicit-tree compatibility, the I18N-007
  `::: lang` localized-content blocks, ARCH-003 localized frontmatter
  maps, the I18N-008 `taxonomy` config for localized tag/category labels, and
  the POST-002/003 posts & series section (`series.yml`, `SeriesIndex`/
  `SeriesArticles`, `order`, the `series` inclusion toggles + the series-name
  title prefix in general listings, frontmatter `cover`). `advanced/deep-dive.md` wraps its body in `::: lang en` /
  `::: lang zh-Hans` blocks as the I18N-007 demo (body switches with the UI
  language).
- `guide/advanced/hidden-page.md` — ARCH-002 demo: frontmatter
  `showInExplorer: false` hides the page from the auto-discovered explorer
  while it stays reachable at `/guide/advanced/hidden-page`.
- `drafts/{draft-post.md,explorer.json}` — ARCH-002 demo: the folder's
  `explorer.json` `{"showInExplorer": false}` prunes the whole `drafts/`
  subtree from the explorer; the draft still builds at `/drafts/draft-post`.
- `markdown-examples.md` — input/output demo of the theme markdown pipeline:
  Shiki highlighting incl. a `[main.scss]` file-name code-block card (STYLE-004),
  every MD-001 plugin (emoji, sub/sup, ins/mark, footnotes,
  deflists, abbr), math, inline Font Awesome icons (FONT-002), the COMP-002
  image demos (a lightbox gallery image + a `:::: swiper` /
  `::: swiper-slide-no-shadow` three-card deck), all 8 callout
  types + custom-title example (MD-002), the defaulted, fully overridden, and
  prompt-free COMP-001 card demo (including current-page path defaults and a long
  overridden path for prompt-overflow behavior), the configurable
  `themeConfig.siteName` host override and automatic fallback, and localized
  explorer title metadata. Carries a `date` frontmatter so the auto-appended COMP-003 license
  card (rendered on every article by Layout) shows its release row; the
  last-updated row falls back to VitePress's git `lastUpdated`.
- `public/images/demo-terminal-{1,2,3}.svg` — static demo art for the COMP-002
  image demos: three 800×600 terminal-mock SVGs in the theme palette (session /
  split panes / paper mode), served from the VitePress public dir as
  `/images/…`.
- `api-examples.md` — VitePress starter demo of the runtime API (`useData`) with
  localized explorer title metadata.
- `posts/{hello-terminal,tui-design,color-system,markdown-power,deploying}.md` —
  ARCH-001/POST-001 demo posts (post page type): each declares `title`/`date`/
  `categories`/`tags`/`description` frontmatter; `hello-terminal` carries
  per-language `title`/`description` maps as the ARCH-003 demo, and
  `hello-terminal` + `tui-design` carry `cover` demo SVGs (POST-003). Dates
  span 2024–2025 (exercise
  the archives year grouping); categories Guides/Design/Ops and overlapping tags
  (vitepress/theme/tui/terminal/color/markdown/deploy) give the tag/category
  listings multiple posts; 5 posts × 3/page = 2 index pages.
- `series/terminal-internals/{index,part-1,part-2}.md` + `series.yml` —
  ARCH-001/POST-002 demo series (series-article page type): `index.md` landing
  places `<SeriesArticles/>` (order-sorted auto list); the two parts carry
  `order: 1`/`2`, and part-1 a `cover` (POST-003) plus `Design` category +
  `tui`/`terminal` tags (exercises the series-name title prefix on the
  per-term pages); `series.yml` is the final
  POST-002 schema (localized icon/title/description + `order`) parsed by
  `series.data.mts`. Demo config admits the parts to archives, categories,
  and tags (not the posts index).
- `posts.md`/`archives.md`/`categories.md`/`tags.md` — POST-001 listing pages
  (listing page type): each places its globally-registered component
  (`<PostsIndex/>`/`<ArchivesList/>`/`<CategoriesIndex/>`/`<TagsIndex/>`); the
  component renders the localized heading, so the files carry only a plain-string
  `title` frontmatter for the browser tab.
- `series.md` — POST-002 series index (listing type): places `<SeriesIndex/>`
  (localized heading + one row per series).
- `categories/[name].{md,paths.mjs}`, `tags/[name].{md,paths.mjs}` — POST-001
  dynamic taxonomy routes: the `.md` places `<TermPosts field="categories|tags"/>`;
  the `.paths.mjs` loader runs `createContentLoader(['posts/**/*.md',
  'series/**/*.md'])` → `filterListablePosts` (POST-002: imports the exported
  site `themeConfig` so series terms only generate routes when opted in) →
  `groupBy{Category,Tag}` and emits one path per term (`params { name: slug, term:
  display }`). Build generated 3 category + 7 tag pages.
- `page/[num].{md,paths.mjs}` — POST-001 post-index pagination: `<PostsIndex/>`;
  the loader emits `/page/2 … /page/N` (page 1 lives at `/posts`) over the same
  toggle-filtered post set as PostsIndex (POST-002). Build generated
  `/page/2`.
