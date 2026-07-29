---
title:
  en: "Design Language"
  zh-Hans: "设计语言"
order: 1
---
# Design Language — VitePress Theme Terminal

> **Status: binding.** These are recorded design decisions, not suggestions. To change
> one, update this document first, then the code. Workflow rules: [`AGENTS.md`](../../AGENTS.md).
> Last updated: 2026-07-28.

## 1. Identity

- Project name: **VitePress Theme Terminal**.
- A custom VitePress theme for blogs and personal websites that looks and feels like a
  modern terminal/TUI session.
- **Favicon (THEME-031):** the official mark is the theme's own TUI-window glyph — a
  Carbon-dark editor window (titlebar with the three prompt dots) framing the shell
  chevron and a `TERM` wordmark, distilled from the theme's own chrome, not any
  third-party tool (so it stays inside §3). It ships as `src/public/favicon.svg` and is
  linked from `<head>` by `theme/head.ts` as an SVG-only `rel="icon"`; consumer sites
  may override it with their own `head` entry. The same mark is reused inside the UI as
  the brand icon (THEME-032) via `SiteMark.vue` — the tool-bar brand and the pre-footer
  brand cluster — so the browser-tab mark and the in-page mark stay identical.

## 2. Core metaphor & inspiration

The site presents itself as a modal text editor running inside a modern terminal. UI and
UX design — structure, layout, style, interaction — are inspired by **NeoVim**,
particularly the **LazyVim** distribution: its chrome (tabline, statusline, tree
explorer), its panel discipline, and its keyboard-centric floating utilities.

## 3. No-branding rule (hard)

**No third-party branding may appear anywhere in the rendered theme**: no names, logos,
wordmarks, or recognizable ASCII art of NeoVim, LazyVim, NeoFetch, or any similar tool.
Inspiration sources may be named in repo documentation and code comments only — never in
UI text, default content, or shipped assets.

## 4. Iconic TUI elements to preserve

| Editor/TUI element | Role in the theme |
| --- | --- |
| Tool bar / tabline (top) | Site navigation, page tabs, global action icons (color-mode switcher; more via THEME-005) |
| Status bar (bottom) | Live **state chip** (HOME / READ / 404, per the current page), current location (breadcrumb) trailed by a blinking cursor, reading progress + back-to-top (one tight cluster), color-mode **indicator** (read-only — switching lives in the tool bar), language switcher, settings gear, and a live clock at the right end; thin separators divide top-level segments |
| File explorer (side tree) | Site/content navigation sidebar — retractable on desktop; not part of the UI in paper mode |
| Floating windows | Utilities: search / command palette / pickers, settings |
| Editor viewport | The content area (article body) |

Flavor details are welcome where they reinforce the metaphor without hurting usability —
e.g. a mode indicator in the status bar, subtle line numbers on code blocks.

**Statusline separator rhythm (THEME-010, refined 2026-07-19).** The separators
must read as one even rhythm whatever a segment contains — an icon button, a
text label, a CJK label — so the statusline is laid out as **cells**: segments
touch (no gaps or margins), each divider is drawn on the shared seam as a
**fixed** centered mark (never a percentage of the segment box, whose heights
differ once controls carry touch targets), and every divider-facing side
carries the **same inset**, so the distance from a separator to the label on
either side of it is identical everywhere. Two consequences follow: no cell
may be the row's only flexible one (it would absorb every tight-fit pixel
alone and pull its label toward the divider), and the inset is sized so the
**widest supported locale** still fits the reference width — a label narrower
than the 44 px touch minimum (a lone glyph, a short language tag) centers in
its stretched box and may sit ~4 px further from its divider, the model's one
accepted tolerance.

**Tool bar (THEME-001/005/010/020)** — the editor-style top bar: on the left the
explorer toggle (`[=]`, THEME-002) and the brand (site glyph + localized title,
links home), the navigation tabs beside it, and the global action icons pushed to
the right edge. The theme keeps a small always-present core — the built-in
`~/home` tab, and the find-palette search trigger + color-mode switcher controls
(THEME-010; the status bar only *indicates* the mode) — and everything else is
configurable from `themeConfig.toolbar` **without editing components** (THEME-005):

- `toolbar.nav` — additional navigation tabs rendered after the home tab. Each is
  `{ text, link, icon?, items? }` where `text` is a `LocalizableText` (§9), `link`
  is a site-absolute path or external URL, and `icon` is an optional Font Awesome
  class list rendered before the label; a tab highlights when its link maps to the
  current page (matched against `relativePath`, so `base` / clean URLs never
  matter — the same matcher the explorer uses), and external links open in a new
  tab.
- **Nav submenus (THEME-020)** — a nav tab may carry `items`, an array of child
  links `{ text, link, icon? }` (same shapes as the tab's own fields). The tab
  itself still **requires** its `link` and keeps the flat-tab behavior — clicking
  it navigates — but while it (or its dropdown) is hovered, a **submenu** floats
  below it: a small panel in the TUI-window look (rounded corners, `--ct-border`
  frame on the surface color, small drop shadow) listing the children as rows of
  optional icon + localized label, each navigating like a tab (external links open
  a new tab). The submenu closes as soon as the pointer leaves both the tab and
  the panel; keyboard focus inside the tab or its children reveals it too
  (`:focus-within`), so the child links stay tab-reachable. A parent tab
  highlights as active when its own link **or any child's** maps to the current
  page; a tab whose `items` is unset/empty renders exactly as before. Mobile
  hides the whole tabline (§8 — the explorer drawer takes over), so the hover
  submenu is desktop-only by construction.
- `toolbar.actions` — the extensible icon-slot mechanism: extra action icons
  (important social links, external tools, …) rendered *before* the built-in
  search / color-mode controls, so those two stay anchored at the right edge as a
  consistent cluster. Each is `{ icon, link, label? }` — `icon` is a Font Awesome
  class list (general-icon context, typography-and-icons.md §2), `label` is a
  localizable accessible name that falls back to the URL.

Both lists are plain data and default to empty; the tool bar renders identically
to before when they are unset.

- **Overflow drawer (THEME-022, 2026-07-19)** — the tool bar never truncates or
  wraps: the moment the title, nav tabs, and action icons **cannot be displayed
  in full**, the nav (submenu children become indented rows) and *all* action
  icons — configured slots **and** the built-in search + color-mode controls —
  move into a dedicated **right-side off-canvas drawer**, and the bar condenses
  to the explorer toggle · brand · a localized expander control (`[⋮]`) at the
  right edge. The collapse is driven by **measured overflow** (a site with many
  tabs collapses on a mid-size window too, and re-expands when room returns —
  re-checked on resize, language switch, and font readiness), with ≤640px
  always collapsed as the CSS floor so SSR/no-JS mobile renders correctly. The
  drawer mirrors the explorer drawer on the opposite side: a fixed TUI panel
  over a dimmed backdrop, explicit close control, dismissed by `Esc`, the
  backdrop, or navigating; rows are ≥44px (§8) with active-page rows accented;
  the color-mode row applies immediately and keeps the drawer open, the search
  row opens the find palette. Opening either side's drawer closes the other.
  The hover submenu remains a pointer affordance of the expanded tabline; in
  the drawer the same children are plain indented rows.

**File explorer (THEME-002/011)** — the side navigation tree, presented in the
NeoVim file-browser idiom. Its contents are configured as a tree in
`themeConfig.explorer`: nodes of `{ text, link?, items? }`, where `text`
is a `LocalizableText` (§9), a node with `items` is a collapsible folder, and a
folder node's `link` is understood as its **index page**. An unset or empty tree
removes the explorer — and its toggle — entirely.

Expansion rules (THEME-011): by default only the **first layer** of folders starts
open — every deeper folder starts collapsed. Every folder's expanded state is
**remembered**:
toggles persist in `localStorage` (`ct-explorer-nodes`, keyed by the node's raw
config-text path so labels may localize freely) and win over the defaults on the
next visit. Clicking the **label** of a folder that has an index page navigates to
that page; route awareness then temporarily expands the folder without changing
the saved tree state. The chevron is the pure expand/collapse toggle and never
navigates. When navigation opens a page inside a closed folder, the explorer
temporarily expands the folder and all required ancestors so the active row is
visible; this route-driven reveal is not written to `ct-explorer-nodes` and is
recalculated on the next navigation. A visitor's explicit toggle remains the
persisted user choice for the current view.

*Implemented (THEME-002, reworked THEME-011):* on desktop the explorer is a
fixed-width floating panel left of the viewport with its own scroll; the explicit
retract/extend control is the `[=]` toggle at the left of the tool bar, and the
choice persists in `localStorage` (`ct-explorer`, alongside `ct-mode`/`ct-lang`).
The retract is instant — editor-tree style — while the mobile drawer slides. At
mobile widths (≤640px) the same toggle opens the tree as an off-canvas drawer over
a dimmed backdrop, dismissed by its explicit close button, tapping the backdrop,
`Esc` (§7), or navigating. The current page's row is accent-highlighted (links
resolved against the page's `relativePath`, so the `base` never matters). Rows use
Nerd Font glyphs behind the font-loaded gate (typography-and-icons.md §2): a
rotating chevron plus a folder icon that switches closed/open on folders (accent
tint), and a file icon on leaves (dim tint); when the symbols font is unavailable
the row degrades to the sketch's plain `❯` / `-` markers with no icon column. In
paper mode the explorer and its toggle are **not rendered at all** (this section's
table; ui-sketch.md §4), and neither prints.

*Concise drawer rows (THEME-021, 2026-07-19):* the mobile drawer keeps the
desktop tree's **tight column layout** — chevron/marker/icon columns stay at
their compact 1.25rem desktop widths and the indentation is identical — it does
not widen columns to meet the §8 touch-target rule. Instead, rows grow only in
**height** (≥44px), and the chevron's 44×44 tap box comes from the §8
padding + negative-margin pattern: its grown box overlays the adjacent
non-interactive icon column and the label's leading edge (an intentional,
small ambiguity strip — a tap that close to the chevron reads as an expand
gesture).

*Adjustable width (THEME-025, 2026-07-23):* on desktop a drag handle on the
explorer's **inner (right) edge** resizes the panel — dragging right widens it —
clamped to a documented **180px–420px** (default 15rem / 240px). The width
persists in `localStorage` (`ct-explorer-width`, a pixel integer) and is applied
**pre-paint** by the head restore script as a `--ct-explorer-width` CSS custom
property on `<html>` (the panel SCSS reads it with the rem default as fallback),
so a resized panel never flashes its default width. The handle is a focusable
ARIA `separator` (localized `explorer.resize` name, `aria-valuemin/max/now`) —
`←`/`→` step it, `Home`/`End` jump to the bounds. It is desktop-only (hidden at
≤640px, where the explorer is a drawer) and never printed. Shared with the TOC
handle: `components/ResizeHandle.vue` + `composables/useResizableSidebar.ts` +
`styles/_resize.scss`; the bounds live in `utils/sidebarWidth.ts` (imported by
both the composable and the head script so they agree). The handle is a
zero-width flex item of `.ct-main` whose negative inline margin cancels the extra
flex `gap` it would otherwise introduce.

*Auto-discovery (THEME-012 / I18N-006 / THEME-013):* `themeConfig.explorer` may be set to
`"auto"` to derive the tree from every Markdown file below the site's `src/`
source directory. Directories become folders, `index.md` is the folder's
optional link, and other Markdown files become leaves; the generated tree is
sorted deterministically and is available in SSR output as well as client
navigation. A page label uses frontmatter `explorerTitle`, then a localized
frontmatter `title`, and finally the normal VitePress title/path fallback. A
folder may add source-local `explorer.json` beside its Markdown children:
`title` is a `LocalizableText` override, and `showInExplorer: false` hides the
folder (see below). This metadata intentionally lives with the content,
not in the VitePress site config, so an index-less folder can still have a
localized label. The existing explicit explorer-array form remains supported,
so auto-discovery is opt-in and does not change existing sites.

*Visibility toggle (ARCH-002):* an auto-discovered page or folder can opt out
of the tree; the default is always **shown**. A page sets frontmatter
`showInExplorer: false` to remove itself — hiding a folder's `index.md` this
way drops only the folder's link, and the folder survives (link-less) as long
as it still has visible children. A folder's `explorer.json` may set
`showInExplorer: false` to prune the folder **and its whole subtree**. Hidden
pages still build and remain reachable by URL — this controls navigation
chrome, not routing. Explicit hand-written `themeConfig.explorer` trees are
unaffected: what is listed there is what renders.

*Sibling ordering (ARCH-004):* an auto-discovered entry's position among its
siblings is set with an `order` — any finite number (negatives and fractions
included), smaller sorts higher, default `0`. A page reads it from frontmatter;
a folder reads it from its `explorer.json` (which **wins**, mirroring the
title/visibility precedence) or its `index.md` frontmatter. Because negatives
are allowed, an entry can be pinned above the unnumbered `0` siblings without
renumbering them. Non-numeric or non-finite values (`NaN`, `±Infinity`) are
ignored and fall back to `0`. Entries with equal `order` keep the existing
deterministic fallback (folders before files, then case-insensitive natural
name comparison), so unconfigured trees render exactly as before. Ordering is
display-only — URLs, discovery, and route behavior are unchanged, and it
applies identically in SSR and client navigation. Explicit
`themeConfig.explorer` arrays stay hand-ordered and unaffected.

**Floating windows (THEME-003/017)** — all floating utilities (find palette,
settings panel, pickers) share **one** window instance, rendered in the
Unicode-frame TUI idiom (2026-07-12 rework): a utility is composed of one or
more **panes**, each its own bordered box with the rounded/floating finish of
§5 whose **title sits on the top border line** — text over border, the way a
TUI frame carries its caption (`╭─ TITLE ──╮`). Panes stack vertically with the
shell's floating gap and carry separate titles and content, so a utility like
the find palette pairs an input box with a separately titled results box, while
simple utilities render a single box. Window controls are **text-based**, TUI
style: the close control is a literal `[x]` sitting on the first pane's top
border. The window floats centered above the viewport over a dimmed backdrop
(ui-sketch.md §2), is hidden by default and only opened programmatically;
opening a utility replaces whatever the window currently shows, so at most one
floating window exists at a time. It is dismissed by the `[x]` control, by
clicking outside (the backdrop), or by `Esc` (§7); at mobile widths it presents
as a near-full-screen sheet (§8) in which the last pane grows to fill the
remaining height. Paper mode keeps it usable on screen; it never prints.

*Implemented (THEME-003, icons THEME-016, TUI chrome THEME-017):* the shared
instance is `FloatingWindow.vue`, rendered once from the layout and driven by
the `useFloatingWindow()` singleton — a utility is
`{ id, label(), panes: [{ title(), icon?, component }] }`: `label()` is the
dialog's accessible name, each pane's `title()` is a getter so it follows
language switches while open, and `icon` is optional Font Awesome classes
(general-icon context, typography-and-icons.md §2) rendered as a decorative
accent glyph inside the border title. The window is a `role="dialog"` container
(focus moves in on open and returns on close) of framed pane `<section>`s, each
labeled by its title, with the pane body the scrolling region; styles in
`styles/_window.scss`, layered above the explorer drawer.

*Find palette (SEARCH-001/002):* the site's search is a real utility rendered
in this shared window — an **input pane** (a shell-style `>` prompt and a
search field) over a **results pane** (title · breadcrumb context · snippet ·
link, with idle/loading/empty/error/not-configured status lines and a keyboard
hint row). It opens from the tool-bar magnifier action or the `/` shortcut
(ignored while typing in inputs/editable regions), the field auto-focuses, the
arrow keys move the active result and Enter opens it, and rows are real links
(mouse, keyboard, and open-in-new-tab all work). **Search-wiring decision
(SEARCH-001):** the palette queries the site's **Algolia DocSearch** index
*directly from the browser* (`themeConfig.search.algolia` — `appId` / `apiKey`
(search-only key) / `indexName`, `theme/utils/algolia.ts`, no `@docsearch/*`
dependency) and renders the hits in this TUI window — the theme deliberately
does **not** use DocSearch's own modal, so the find palette *is* the search UI.
When credentials are absent or incomplete the palette still opens but shows a
localized "not configured" notice instead of querying. The results pane's footer
carries the keyboard hint and, as DocSearch requires, a small **"Search by
Algolia" attribution** (an inline Algolia logo SVG linking to algolia.com —
Font Awesome has no Algolia glyph — shown whenever search is configured). State
and the debounced, abortable request live in `composables/useSearch.ts`; panes
are `SearchPalette.vue` / `SearchResults.vue`; styles in `styles/_search.scss`.

*Settings panel (THEME-007):* a real utility rendered in the shared window —
opened from the gear action (`useSettings` → `openSettings`), which lives in the
status bar's right controls (moved there by THEME-019),
**without** a shell prompt (it is a plain window, not a prompt card). Its first
version is two framed panes: **Fonts** (segmented controls for the content font
family — Default / Sans / Serif / Mono — and size — Small / Medium / Large) and
**Language** (the available UI languages, each self-described by its
`lang.label`, switching in place like the status-bar switcher). Both font
preferences persist in `localStorage` (`ct-font-family` / `ct-font-size`) and are
restored onto `<html>` (`data-ct-font-*`) before first paint by the head script,
alongside the color mode — the attributes are set only for a non-default choice,
so the default (mode-following family, medium size) leaves `<html>` clean and
causes no flash or reflow. SCSS maps those attributes to `--ct-content-font` /
`--ct-content-font-size`, which the content column reads (falling back to the
mode's body font and the base size); state in `composables/useFontSettings.ts`,
panes in `SettingsFonts.vue` / `SettingsLanguage.vue`, styles in
`styles/_settings.scss`. At mobile widths it is the window's near-full-screen
sheet (§8).

*Status bar (THEME-001/009/010/019):* the leftmost chip is a **live state
indicator** — `HOME` on the home page, `404` on the not-found page, and `READ`
on a regular article — each a localized string with a per-state modifier class
(so `404` takes the error tint). The current-location breadcrumb is trailed by a
**blinking underscore cursor** (a hard steps blink in the main color, disabled
under `prefers-reduced-motion`), reinforcing the terminal metaphor. The right cluster
carries the reading-progress + back-to-top pair, the language switcher, the
read-only color-mode indicator, the **settings gear** (moved here from the tool
bar by THEME-019 — `useSettings` → `openSettings`), and a live **clock**
(`HH:MM:SS`) at the far right. The clock is client-only and SSR-safe (empty on
the server and first client render, then ticks each second via an interval that
is cleared on unmount — `composables/useClock.ts`). On mobile the reduced set
drops the location, cursor, and clock while keeping the settings control
reachable (§8).

**Footer** — sits at the bottom of the main viewport, inside the content panel: it
scrolls with the article and is **not** a separate floating bar. Structure, top to
bottom:

1. a **full separator** — an edge-to-edge rule that opens the whole footer section,
   dividing the article content from everything below;
2. a fully-custom section rendered from a user-supplied Vue file — its own component
   sitting directly on top of the standard footer, rendering nothing when the user
   supplies no file (plan task THEME-006);
3. a **subtler inner separator** — drawn **only when** the custom section is present,
   dividing it from the standard footer; unlike the edge-to-edge full separator it is
   **inset on both sides** (it does not connect to the panel edges, like the search
   window's hint rule), so it reads as the gentler of the two dividers;
4. a copyright row — `Copyright © <year> <author>` on the left, social icons on the
   right;
5. an attribution row — “Powered by VitePress and VitePress Theme Terminal” on the
   left, the RSS icon (only when a feed is configured) and the license icons on the
   right; on desktop this row's text is lighter than the copyright row's (the lighter
   tone derived per the color rules; see the ui-sketch.md §5 note).

The social-icon list and the RSS feed are easily configured via `themeConfig`; the
author in the copyright and the license icons come from the central author & license
system (CONF-002; default license CC BY-NC-SA 4.0). Fixed strings are localized; the
icons are Font Awesome (general-icon context,
[`typography-and-icons.md`](typography-and-icons.md) §2). On narrow viewports the rows
stack.

*Implemented (THEME-004):* the footer spans the full width of the viewport panel
(wider than the 72ch article column, like the sketch's edge-to-edge separator);
only its text links carry an underline — icon links (social · RSS · license)
never do, in any state. `themeConfig.footer = { rss?, social? }` — `rss` is the
feed URL (icon only when set); `social` entries are
`{ icon: <FA classes>, link, label? }` with a `LocalizableText` label falling back
to the URL. The localized copyright/attribution strings carry `{year}`/`{author}`
and `{vitepress}`/`{theme}` placeholders so translations may reorder them; the
product names render as links. The attribution row's desktop-lighter tone is
**derived** from the copyright row's color via `color-mix` (color-system.md §3),
never a second constant. The RSS link renders as its conventional orange icon
plus an "RSS" wordmark (a proper noun, untranslated) — the orange comes from the
fixed Carbon layer (`--ct-rss` mode token over Carbon orange 40/60), not from the
main color; the license glyphs sit as one tight cluster, read as a single mark.
A custom license without `icons` falls back to a localized "licensed under"
sentence (`{license}` placeholder) whose license name is a link to the deed —
underlined like the theme's other text links, unlike the icon cluster; without
`url` the name renders as plain text. On mobile the cells stack in the order
copyright · powered-by · social icons · RSS/license icons (ui-sketch.md §5).

*Implemented (THEME-006):* the footer is wrapped in a `.ct-footer-region` that owns
the **full separator** (its `border-top`, `--ct-border`) and pins the region to the
bottom of the viewport column. The fully-custom section is a named Vue **layout slot**,
`pre-footer` — the documented way to inject a user Vue file into a theme region, since
a Vue component cannot travel through the JSON-serialized `themeConfig` (the AGENTS §6.5
exception, recorded here). A site fills it by extending the theme with a wrapper Layout:

```ts
// .vitepress/theme/index.ts
import Theme, { Layout } from 'vitepress-theme-terminal-reforged/theme'
import MyLayout from './MyLayout.vue'
export default { extends: Theme, Layout: MyLayout }
```

```vue
<!-- MyLayout.vue -->
<script setup>import { Layout } from 'vitepress-theme-terminal-reforged/theme'</script>
<template>
  <Layout><template #pre-footer><MyCustomSection /></template></Layout>
</template>
```

When the slot is unfilled the custom section renders nothing and no inner separator is
drawn (only the full separator remains, directly above the footer rows). When it is
filled, `Layout` passes `divided` to the footer, which adds the **subtler inner
separator** (`.ct-footer--divided`) — a `--ct-border` rule rendered as a pseudo-element
so it can be **inset** by the footer's horizontal padding (a `border-top` cannot),
leaving a gap at each panel edge exactly like the search window's hint rule. The custom
section's padding matches the footer's so its content — and the inset rule — align with
the rows below.

The demo site ships this exact pattern as a temporary example: `DemoLayout.vue` (the
site's registered Layout) fills the slot with `PreFooterDemo.vue`, which renders a
Nerd-Font logo glyph + localized theme name on the left and a Font Awesome icon, a Nerd
Font icon, and a localized “Customizable Footer Content” label on the right — showing
arbitrary content, both icon systems, and localized strings inside the slot. Removed
(swap `Layout` back for the demo wrapper) when real example content is decided.

**Cards & shell-prompt decoration** — a reusable card component renders as a TUI-style
floating window (Unicode-frame flavor, with the rounded, floating finish of §5). Each
use may set the explicit `showPrompt` flag to render an optional **shell-prompt
decoration**, a header line of the form `user@host:path$ command args`; it defaults
to off. The `prompt` data supplies the command and optional host, path, and args.
When omitted, `host` uses the shell-safe `themeConfig.siteName` override when one
is configured, otherwise the active site title is normalized automatically, and
`path` defaults to the current page's home-relative location; every value remains
overridable. `user` is always the normalized author username from the central
author & license configuration (CONF-002). The prompt
marks featured or special content: the license card and the comment card always
carry it, the home-page welcome card carries it, project/About grids use it for
their more featured entries, and the settings panel never does (plan task COMP-001).
On constrained widths it progressively removes `@host`, reduces the path to its
final section, and then applies an end ellipsis to the path; the command and
arguments remain visible unless their own content is longer than the available
line.

*Implemented (PAGE-001/002/003):* the home welcome card is config-driven
(`themeConfig.home`, `pages/HomePage.vue`) and always carries the prompt. The
projects and About pages are hand-authored per-language **Vue views** under
`.vitepress/theme/views/` (imported by `src/projects.md` / `src/about.md` via
the `@` alias — content-architecture.md §8), not a config schema; each uses the
`Card` component and the shared card grid (`.ct-cardgrid`), where a `featured`
grid item spans the full row and carries the prompt while the rest are plain
cards — the "more featured content carries the extra decoration" rule. Styles
in `styles/_pages.scss`. See
[`content-architecture.md`](content-architecture.md) §7–§8.
Related: code blocks render as card-style floating windows in the same visual
language — framed like the card component, but headed by a title bar (file name when
given, plus the language name) holding a COPY button, **not** by a shell-prompt-like
decoration (STYLE-004; wireframe in ui-sketch.md §6).

*Implemented (STYLE-004):* a markdown-it fence wrapper (theme/markdown/codeblock.ts)
wraps VitePress's Shiki output in a `.ct-code` card (matching `_card.scss`) headed by a
`.ct-code__titlebar`: the file name (when given) · the language name · a text-based
`[copy]` control (TUI style, like the window's `[x]`). The highlighting stays
Shiki-powered with the STYLE-003 oxocarbon palettes, untouched inside the card. A
**file name** is written in the info string in square brackets after the language —
`` ```scss [main.scss] `` — reusing VitePress's own `[title]` convention (read before
VitePress strips the bracket), so it never collides with the `{highlight}` /
`:line-numbers` modifiers. The COPY label is emitted in the build language and tagged
`data-ct-code-copy-label` so the client re-localizes it on a language switch
(useCodeCopy), which also copies the block source and flashes a localized "Copied";
styles in `styles/_code.scss`.

**Image containers (COMP-002)** — content images are interactive by default:

- **Lightbox** — every image in the article body enlarges on click, opening in a
  [Fancybox](https://fancyapps.com/fancybox/) overlay; all of a page's content
  images join **one gallery**, so the reader can browse them as slides with the
  arrow controls/keys. Images wrapped in a link are left alone (the link wins),
  and an author can opt a single image out with a `data-no-lightbox` attribute.
- **Swiper cards** — a `:::: swiper` markdown container with nested
  `::: swiper-slide-no-shadow` blocks renders its images as
  [SwiperJS](https://swiperjs.com/) slides using the **cards effect** — the
  slides sit stacked on top of each other like a deck and are swiped/dragged
  away, or stepped with the **prev/next arrow controls** flanking the deck
  (TUI text chevrons `❮`/`❯` — the explorer's glyph family — not the vendor's
  SVG arrows; accessible names localized via `swiper.prev`/`swiper.next`);
  the `-no-shadow` flavor renders the cards **without** Swiper's own
  slide-shadow overlay (the theme's card finish supplies the depth instead).
  The exact block syntax:

  ```markdown
  :::: swiper
  ::: swiper-slide-no-shadow
  ![First](/images/first.png)
  :::
  ::: swiper-slide-no-shadow
  ![Second](/images/second.png)
  :::
  ::::
  ```

Both libraries are client-only and load **lazily on demand** (dynamic import on
mount), so they never run during SSR and cost nothing on pages without images.
Their UI text follows the language switcher through **Fancybox's own shipped
l10n tables** (mapped from the theme's canonical tags — `en` → `en`,
`zh-Hans` → `zh_CN` — with the usual primary-subtag → English fallback): the
lightbox chrome is vendor UI with a complete vendor translation set, so the
theme maps languages to tables instead of duplicating ~20 vendor strings into
its own locale files (recorded exception to §9's locale-table rule). Slides
render in the theme's card visual language: rounded frame, `--ct-border`
border, surface background.

**Dependency & license note:** `@fancyapps/ui` is pinned to **v5** — the last
line dual-licensed GPLv3 / commercial (v6 moved to a commercial-only license);
sites using the theme's lightbox commercially need their own Fancybox license.
Swiper is MIT.

*Implemented (COMP-002):* the `:::: swiper` / `::: swiper-slide-no-shadow`
containers are registered in `theme/markdown/swiper.ts`, emitting a
`.ct-swiper` flex row of prev `<button>` · `.ct-swiper__deck.swiper` (holding
`.swiper-wrapper > .ct-swiper__slide.swiper-slide`) · next `<button>` — the
arrows are laid out **beside** the card stack, never over the images, and the
deck shrinks between them on narrow viewports;
`useLightbox()` marks content images (`data-fancybox="ct-gallery"`, skipping
linked/opted-out ones) on mount/navigation and binds one delegated Fancybox
instance, re-bound with the mapped l10n on language switch; `useSwipers()`
instantiates the cards-effect Swiper per container on mount/navigation
(Navigation module wired to the emitted buttons; native image dragging
disabled on the slides so the browser's ghost-image drag cannot hijack the
swipe) and destroys stale instances; the arrows' accessible names come from
the theme locale table (`swiper.prev`/`swiper.next`), re-applied on language
switch. Both composables are called once from the layout. Related shell fix:
`useViewportScroll` (THEME-008) only resets the panel scroll when the route's
`relativePath` actually changed — `onContentUpdated` also fires on same-page
re-renders (in-place language switches, dev-mode updates, lightbox DOM work),
and those must never move the reader.
Vendor stylesheets are pulled in through the theme's SCSS entry partials
`styles/_lightbox.scss` / `styles/_swiper.scss`, which also carry the theme
overrides (zoom-in cursor, theme-token backdrop/chrome, card-finish slides).

**Pull quotes (MD-005)** — a `::: quote` container sets a passage apart as a
display quotation, framed by the Chinese corner brackets **「** (upper-left) and
**」** (lower-right) drawn in the main color. The frame **shrink-wraps the
quotation and centers in the column**: the marks belong to the quotation, not to
the column, so a short line keeps them right beside it rather than stranded at
the content edges; a quotation long enough to wrap fills the column as usual and
the marks land at its corners. The two quotation forms are
deliberately distinct and neither replaces the other: the plain Markdown `>`
blockquote stays the quiet, left-barred form for a quotation inside the flow of
the text, while `::: quote` is the loud one — centered, generously padded, and
framed — for a line meant to be looked at. The corner marks follow the accent
rule of §6/color-system.md §2: the quotation itself is neutral body text and only
the marks take the accent (its darkened derivative on light and paper surfaces,
so contrast comes first).

**The marks are drawn with borders, not typed as `「`/`」` glyphs** — a decision,
not an implementation detail. The intended mark is *shorter* than the
typographic bracket: stubby arms and a thick stroke, a corner rule rather than
punctuation, which no glyph can be made to look like. Drawing it also removes
the dependency on the reader's CJK font (IBM Plex has none), so the arm lengths
and stroke weight are the theme's own and identical on every platform. The
geometry is a **14×20px outer box with a 6px stroke** — the vertical arm
deliberately longer than the horizontal one.

*Implemented (MD-005):* `theme/markdown/quote.ts` registers the container and
emits a real `<blockquote class="ct-quote">` — the quotation stays semantic
markup, not decoration. Each mark is an empty `::before`/`::after` in
`styles/_quote.scss` showing only the two borders that meet at its corner, so
the marks are unselectable, absent from copied text, and invisible to screen
readers, which read the quotation alone. The quotation is set bold and tighter
than body copy (a pulled quotation is looked at before it is read); the weight
is typographic only — the text keeps the neutral body token, since the accent
belongs to the marks. One inherited-rule note: `.ct-content .ct-quote` is one
class heavier than the base `.ct-content blockquote` rule, which is what lets it
drop the left bar without touching the plain form.

**Timelines (MD-006)** — a `::: timeline <label>` container renders one entry of
a chronological list against a vertical rail: a node marker on the rail, the
authored label (a date, a version, a milestone name), and the entry body. The
label is authored text, never locale-derived — unlike a callout title there is
no default to translate, so a bilingual page puts each language's timeline in
its own `::: lang` block rather than asking the theme to switch labels.

The structural decision is that the **rail belongs to the entry, not to a
wrapper**: each container emits its own `.ct-timeline` carrying the rail as a
left border, and adjacent entries stack borders with no gap, so a run reads as
one unbroken rail. The alternative — an outer container wrapping the entries —
would have matched the visual grouping but broken the theme's one rule for
containers, that one `:::` block is one thing; nesting is reserved for the
slider deck, where the deck is genuinely a single component. The tail of the
last entry fades out instead of stopping on a hard edge, because a timeline is
open-ended and a cut border reads as truncation.

Color follows the callout division of labor: the rail is the neutral border
token and only the node and label carry the **main color**, derived per mode
(`--ct-main` on dark, `--ct-main-deep` on light/paper/print) — the accent marks
the point of interest instead of flooding the block. The node is an empty,
`aria-hidden` element ringed in the page background so it stays readable where
entries sit close together, and stays out of selections, copied text, and the
accessibility tree. See `theme/markdown/timeline.ts` and
`styles/_timeline.scss`.

**Rendered math (MD-001 / MD-004 / FONT-005)** — two math renderers, one typeface.
Both render in **IBM Plex Math** (the font decision lives in
`docs/design/typography-and-icons.md` §2a).

- **LaTeX** stays on the `$…$` (inline) / `$$…$$` (display) delimiters (MD-001).
  MathJax converts it to **MathML** at build time (SSR-clean) and the browser renders
  the `<math>` natively — so `font-family: "IBM Plex Math"` applies (SVG output cannot
  be re-fonted). Wrapped in `.ct-math--inline` / `.ct-math--block` (display math is
  centered and horizontally scrollable). See `theme/markdown/math.ts`.
- **Typst** is the alternative, with its own **unambiguous** syntax so it never
  collides with the LaTeX delimiters (`$$…$$` is always LaTeX):

  ```markdown
  Inline: :typst[e^(i pi) + 1 = 0] sits in the line.

  ::: typst
  sum_(k=1)^n k = (n(n+1)) / 2
  :::
  ```

  The `::: typst` container holds a block of Typst math and `:typst[…]` an inline
  fragment. Both emit inert markup carrying the **raw source** (`.ct-typst__src`,
  shown as the no-JS / pre-hydration fallback); the client composable `useTypst()`
  compiles each to SVG with the [typst.ts](https://github.com/Myriad-Dreamin/typst.ts)
  WASM compiler on mount and after navigation, then swaps the source for the render.
  Black glyph **fills and rule strokes** (the fraction bar is a stroke) are
  normalized to `currentColor`, so the math tracks the active color mode without
  recompiling. **Malformed Typst fails gracefully** — a visible error
  beside the kept source, never a blank — and nothing runs during SSR or at build
  (no build crash possible). The compiler is fed the IBM Plex Math OTF and selects it
  with `#show math.equation: set text(font: "IBM Plex Math")`. See
  `theme/markdown/typst.ts` + `theme/composables/useTypst.ts`.

  The WASM stays **self-hosted** (no runtime CDN), but the compiler module
  (~27 MiB) exceeds static-host file-size caps (Cloudflare Pages: 25 MiB), so
  the build ships it **gzipped** as a `.wasm.gz` asset (~10.7 MB) and
  `useTypst()` decompresses it client-side via `DecompressionStream` before
  compiler init (INFRA-002 — `theme/vite/gzipWasm.ts`; dev serves the raw WASM
  unchanged, and a decompression failure surfaces the visible Typst error).

**Dependency & license note:** `mathjax-full` (Apache-2.0) drives the LaTeX→MathML
conversion; `@myriaddreamin/typst.ts` and its WASM compiler/renderer (Apache-2.0)
drive Typst. Both are regular devDependencies (the no-npm rule covers only
fonts/icons). The bundled IBM Plex Math OTF is SIL OFL 1.1 (redistributable).

**Author & license system (CONF-002)** — the author identity and the content license
are configured once, in `themeConfig`, and every consuming surface reads from that
single source: the footer copyright and license icons (THEME-004), shell-prompt
decorations (COMP-001), the license card (COMP-003), and any author info display.

- `author.name` — the author's full/display name, a `LocalizableText` (§9).
- `author.username` — the shell-safe name used as the prompt `user`. When not set
  explicitly it is **derived** from the name: resolve the localized name (English
  preferred), Unicode-normalize (NFKD) and strip diacritics, lowercase, collapse
  whitespace runs to `-`, drop every remaining character outside `a-z 0-9 . _ -`,
  collapse separator runs, and trim leading/trailing separators. If nothing
  survives (or no name is set), the username falls back to `user`.
- `license` — the content license: display `name`, deed `url`, and the Font Awesome
  `icons` classes shown in the footer. Default: **CC BY-NC-SA 4.0**, linking to the
  Creative Commons deed, with the CC brand icons (cc · by · nc · sa). Setting a
  custom `license.name` replaces the default as a whole — the CC url/icons are not
  inherited, so a custom license supplies its own `url`/`icons` (unset means none).

**Article footer components (COMP-003 / COMP-004)** — every **article** (any
regular content page — not the home page or the 404 page) ends with two
prompt-decorated cards, both drawing on the shared card component (§4, cards)
and the author & license system above:

- **License card (COMP-003)** — shows the article info (title, permalink,
  **release** date from frontmatter `date`, **last-updated** date, author) and
  the configured content license, defaulting to CC BY-NC-SA 4.0. Author and
  license come from CONF-002 (the same single source as the footer); the
  license statement links to the deed and shows the brand icons. The last-updated
  date prefers an explicit frontmatter `updated`/`lastUpdated` and otherwise
  uses VitePress's git-derived `lastUpdated` timestamp (`lastUpdated: true` in
  the site config). Dates accept any frontmatter shape (a bare `YYYY-MM-DD`, a
  full ISO datetime with an offset, a YAML `Date`, or a numeric timestamp).
  Explicit timezone offsets and `Z` values preserve their source instant; a
  frontmatter value without a timezone is interpreted as UTC. The SSR and
  initial client render use UTC, then the card formats both dates in the
  reader's current timezone after hydration, so a date near midnight may show
  a different local calendar day. A Creative Commons license also draws a large,
  faint **CC
  watermark** that spans the card's height, is slightly rotated
  counter-clockwise, and is clipped by the card's right edge (decorative, CC
  licenses only — a custom license has no CC branding, so no watermark). The
  prompt reads `… $ license`.
- **Comment card (COMP-004)** — a [Waline](https://waline.js.org/)-powered
  comment section, prompt `… $ comments ~/path`. The server is configured via
  `themeConfig.comments.waline.serverURL`; when unset the card (and the counts
  below) do not render. A **view count** and a **comment count** appear in the
  article's title section (above the content). Waline's own form UI follows the
  language switcher through its shipped locale tables (`zh-Hans` → `zh-CN`,
  else `en`) — the same documented vendor-chrome exception to §9's locale rule
  as the COMP-002 lightbox — and its dark theme tracks `data-ct-mode`.

An author can opt a page out of both with `article: false` in frontmatter, or
drop just one with `license: false` / `comments: false`.

**Heading anchor links (THEME-023)** — every content heading (`h1`–`h6` inside
`.ct-content`) carries a stable slug `id` and a clickable permalink control that
sets the URL hash to that heading. VitePress emits the slug and the
`.header-anchor` link; the theme styles it as a terminal-flavored `#` mark that
stays hidden until the heading is hovered (or the control itself takes keyboard
focus) and is drawn in the derived accent color across the three modes. Loading
or navigating to a `#slug` URL — and clicking a `#` control — scrolls the target
heading into view **inside the viewport panel**, never the window (§5, the fixed
shell frame): the anchors live in the `.ct-viewport` scroll container, so the
existing in-panel scroll handling (`useViewportScroll`) applies unchanged. The
control's accessible name is localized (§9): its default English `aria-label` is
re-written client-side from the active locale table (`anchor.permalink`,
`{title}` = the heading text) on mount, after navigation, and on a language
switch — the same re-localization pattern as the code-block COPY button. On
mobile the control stays visible (no hover) and presents a ≥44px tap target
(§8). *Implemented:* styles in `styles/_anchors.scss`; label localization in
`composables/useHeadingAnchors.ts` (called once from Layout).

*Link copy (THEME-028, 2026-07-23):* activating a `#` control also copies that
heading's **full** URL — origin, path and `#slug` — to the clipboard, so sharing
a section is one click rather than a select-the-address-bar exercise. The copy is
purely additive: the link keeps its normal behavior (the hash still lands in the
URL and the panel still scrolls), it is never a `preventDefault`. The URL comes
from the anchor element's resolved `href`, so it stays correct under a deployed
`base` and under either URL style (clean or `.html`, THEME-030). The copy is
confirmed by a transient notification (below); when the clipboard is
unavailable — an insecure context, or permission denied — nothing is copied and
**no** notification appears, so the reader is never told a copy succeeded that
did not. *Implemented:* one delegated click listener in
`composables/useHeadingAnchors.ts`, beside the label localization.

**Transient notifications (THEME-029)** — the theme's one place for short
"that worked" feedback about an action with no visible result of its own. Small
TUI boxes (mono, surface background, derived accent border, subtle drop shadow)
stack in the shell's **bottom-right corner, just above the status bar**, and
grow upward over the content; on mobile they span the shell's width (§8). Each
box carries the message and a text `[x]` dismiss control in the floating
window's idiom (THEME-017); it disappears on its own after ~3s or immediately
when dismissed. Repeating the same action replaces the message on screen rather
than stacking an identical copy, and at most three are shown at once. The stack
is a persistent `role="status"` / `aria-live="polite"` region — always in the
DOM, empty or not — so appended messages are announced; message text and the
dismiss label are localized like all UI text (§9), with the *caller* supplying
the already-localized message. It is on-screen chrome only (never printed) and
its enter/leave motion respects `prefers-reduced-motion`. *Implemented:*
`composables/useNotifications.ts` (the shared queue and timing) +
`components/NotificationStack.vue` (rendered once by Layout as a zero-height
shell row between the viewport row and the status bar) + `styles/_notifications.scss`.
Its first consumer is the heading-anchor link copy (THEME-028).

**Article table of contents (THEME-024)** — article pages show an "on this page"
panel to the **right** of the viewport, mirroring the explorer sidebar on the
left: a fixed TUI panel (mono type, its own scroll, rounded/floating finish)
built from the page's headings. Each entry is a link that jumps to its heading
through the THEME-023 anchors, scrolling within the viewport panel, and the
section currently in view is highlighted as the reader scrolls (**scroll-spy**);
entries indent by heading depth and the active row lights its left rail in the
derived accent. It reads the heading set from the rendered content DOM, so it
follows localized `::: lang` bodies (§9) and re-reads after navigation and on a
language switch. Configured via `themeConfig.toc = { enabled?, minLevel?,
maxLevel?, minHeadings? }` (defaults `true` / `2` / `3` / `2` — h2–h3, shown
once a page has ≥2 qualifying headings); it renders only on article page types
(post / series / normal), never on the home, listing, or 404 types. It is not
rendered in paper mode / print, and on narrow viewports (below the wide-desktop
threshold) it collapses out of the reading column entirely rather than crowding
or overflowing the content (§8). The "on this page" label is localized
(`toc.title`). *Implemented:* `components/ArticleToc.vue` (placed in the
`.ct-main` row after the viewport, in Layout) + `styles/_toc.scss`; the TOC
hides ≤1023px via CSS.

*Adjustable width (THEME-026, 2026-07-23):* a drag handle on the TOC's **inner
(left) edge** resizes it — dragging left widens it — clamped to a documented
**160px–400px** (default 14rem / 224px), persisted (`ct-toc-width`) and applied
pre-paint as `--ct-toc-width` on `<html>`. It reuses the explorer's handle
machinery (`ResizeHandle` / `useResizableSidebar` / `_resize.scss`,
`utils/sidebarWidth.ts`), with the opposite drag sign; localized name
`toc.resize`, keyboard-operable, hidden ≤1023px and in print. Layout renders it
only while the outline is actually docked (visible and not retracted), for which
`ArticleToc` shares its on-screen state through `composables/useToc.ts`.

*Retractable on desktop (THEME-027, 2026-07-23):* a `[«]` control in the panel
header collapses the outline to a slim **reopen rail** on the reading column's
right edge (a vertical "on this page" caption); clicking the rail restores it.
The choice persists (`localStorage` `ct-toc`) and is mirrored **pre-paint** by
the head script as `<html data-ct-toc="closed">`, and `useToc` seeds its state
from that attribute synchronously — so a retracted outline renders as the rail on
first paint with no expanded flash (the TOC is client-rendered, so there is no
SSR markup to mismatch). Controls are localized (`toc.collapse` / `toc.expand`)
and keyboard-operable; the rail follows the panel's desktop-only visibility
(hidden ≤1023px and in print).

*Implemented (COMP-003/004):* `ArticleLicense.vue` (title · release + last-updated
dates · author · permalink, license statement + CC icons, and a `.ct-license__watermark`
— an absolutely-positioned `<span>` whose top/bottom insets make its height the
card's, masked with the Creative Commons SVG logo [`background-color` tints it
per mode] and rotated CCW, clipped by the card's `overflow:hidden`, gated on an
`isCreativeCommons` check), `ArticleComments.vue`, and `ArticleMeta.vue` are
rendered from `Layout.vue` under an `isArticle` guard;
`useWaline()` (called once from Layout) lazy-loads `@waline/client` client-side
to mount the widget into `.ct-comments__waline` and fill the meta counters via
Waline's `pageviewCount`/`commentCount`, re-mounting per navigation and
re-localizing on a language switch. `themeConfig.comments` resolves through
`resolveComments()` (blank `serverURL` → `null` = unconfigured) with the
`isCommentsConfigured()` helper — the same pattern as search (SEARCH-001).
Styles: `styles/_license.scss` (card body) and `styles/_comments.scss` (the
Waline vendor stylesheet + theme accent reconciliation + the meta strip).

ASCII wireframes of this layout — desktop, floating window, mobile, paper mode,
footer, and cards — live in [`ui-sketch.md`](ui-sketch.md).

## 5. Modern finish

Preserve the TUI structure but render it with a modern look rather than retro pixel
fidelity:

- rounded corners on panels and floating windows, note that the corner radius SHOULD NOT
  be too large - the goal is a subtle rounding so the components seems to be composed by
  text (for TUI feel) and not a separate shape;
- a floating feel: panels separated by gaps/padding instead of hard full-bleed splits;
- subtle borders and shadows for depth; small, smooth transitions;
- **a fixed shell frame** (2026-07-09): the tool bar, the status bar, and the viewport
  panel's frame never move — the page itself does not scroll. Article content scrolls
  *inside* the viewport panel and clips at its edges, exactly like an editor buffer
  inside its window: content must never be visible in the gaps between panels or
  behind the chrome. Printing is exempt — the frame releases its fixed height so the
  whole article prints.

Think “modern, carefully customized terminal setup”, not an ANSI museum piece.

## 6. Color modes

Three modes: **dark (the default and the most important)**, **light**, and a special
**paper/reader/print** mode. Full palette rules and per-mode guidance live in
[`color-system.md`](color-system.md).

## 7. Keyboard-friendly UX

The terminal feel implies keyboard support where reasonable — e.g. a shortcut to open
the search palette, `Esc` to dismiss floating windows. Mouse and touch interaction must
always remain fully sufficient on their own.

## 8. Mobile (hard requirement)

The site must work well on mobile; components **adapt**, they don't just shrink:

- file explorer → off-canvas drawer (left side);
- tool bar → condensed: overflowing nav + action icons collapse into the
  right-side drawer behind an expander control (THEME-022 — measured overflow,
  ≤640 px always collapsed);
- status bar → reduced set of segments (location, cursor, and clock go first;
  on viewports narrower than the 360 px reference the read-only color-mode
  **indicator** follows — it is redundant, the switcher lives in the tool bar
  and the mode is evident from the colors, so every interactive control stays
  reachable rather than the row compressing or overflowing);
- floating windows → full- or near-full-screen sheets;
- article table of contents (THEME-024) → collapses out of the reading column
  (hidden below the wide-desktop threshold, well above the mobile breakpoint),
  so the content measure stays intact and nothing overflows;
- heading anchor `#` controls (THEME-023) → stay visible (no hover on touch)
  and grow to a ≥44 px tap box via the padding + negative-margin pattern below;
- no horizontal overflow at small widths (≈360 px); adequate touch targets.

**Touch targets (MOBILE-001, 2026-07-19).** At the theme's mobile breakpoint
(≤640 px, the same width that triggers the drawer/sheet behaviors) every
interactive theme control presents a box of at least **44 px (`--ct-tap`,
2.75 rem) in both dimensions** — as *real box growth* (padding/min sizes), not
invisible hit-area extensions, so the rule stays objectively verifiable at the
rendered surface. Where the visual rhythm must stay dense (post-card title
links, the series-banner name, links inside the footer's copyright/powered-by
sentences — a wrapped line must not open a 44 px line gap), the box may grow
via padding compensated by a negative margin — the rendered box still
measures ≥44 px. Icon clusters (the footer's social/RSS/license rows) keep
real boxes but align their glyphs flush left, so the first icon lines up with
the text column above it. The tool bar and
status bar simply grow taller on mobile to fit their controls; that is the
intended "adapt, don't shrink" reading, the wireframes are structural, not
pixel-binding. Two documented exemptions:

- **links inside running prose** (sentences, list items, footnote references)
  follow the text's line height — the WCAG 2.5.5 "inline" exception;
- **third-party widget internals** (the Waline form, Fancybox chrome) get
  best-effort overrides in the theme's reconcile layer, not a guarantee.

## 9. i18n by design

Internationalization is built in from the start: every user-facing string in theme
components is localizable. Adding a language must not require editing components.

**No locale path prefixes (hard).** The theme does **not** use VitePress's path-based
`locales` trees: there is no `/<lang>/` segment in URLs. The UI language is a
**client-side preference** — switching it changes the theme strings in place on the
same URL, exactly like the color mode: persisted in `localStorage` (`ct-lang`),
defaulting to the site's `lang` value. Theme UI strings switch on this preference;
page *content* is whatever the author wrote — unless the author opts a page's body
into localization with `::: lang` blocks (see **Localized page content** below).

**Localized page content (I18N-007).** A page body can offer per-language versions
without a `/<lang>/` URL, mirroring how a localized `title` frontmatter map drives the
explorer label. Each language's content goes in a `::: lang <tag>` markdown container:

```markdown
::: lang en
English body…
:::

::: lang zh-Hans
中文正文…
:::
```

Only one block per group of adjacent `::: lang` blocks is shown; it is chosen by the
standard fallback (exact tag → primary subtag → site default → first block) against
the active UI language, and re-chosen in place on every language switch. Content left
**outside** any `::: lang` block always shows (shared code, images, headings that need
not vary). The site-default-language block is server-rendered visible — so there is no
flash, and the default-language reader sees correct content with JavaScript off.
Implementation: the `::: lang` container (`theme/markdown/localized-content.ts`) emits
`<div class="ct-lang" data-ct-lang="<tag>">` with the non-default blocks `hidden`, and
`useLocalizedContent()` (called once from the layout) reveals the right one on load,
navigation, and language switch.

**Localizable config text (I18N-004).** Every user-facing text value in the
configuration surface is a `LocalizableText`: either a plain string (used for all
languages) or a per-language map `{ "en": …, "zh-Hans": … }`, resolved against the
active UI language (exact tag → primary subtag → `en` → first entry). The theme's
`themeConfig.title`/`.description` follow this pattern, defaulting to the site
config's `title`/`description`; the browser tab title and meta description follow the
active language client-side, while the server-rendered head keeps the site-config
defaults. All future config text (nav labels, footer text, series metadata, …) must
use `LocalizableText`.

**Localized frontmatter fields (ARCH-003).** The same `LocalizableText` pattern
applies to authored page metadata: every *displayed* frontmatter field — a page's
`title`, a post's `description`, series `title`/`description` in `series.yml`
(POST-002), and future displayed fields — accepts either a plain string (used for
all languages, the default) or a per-language map:

```yaml
---
title:
  en: Hello, Terminal
  zh-Hans: 你好，终端
description:
  en: A first look at the theme.
  zh-Hans: 主题初识。
---
```

Resolution is the standard fallback (exact tag → primary subtag → `en` → first
entry) against the active UI language, re-resolved in place on a language switch.
Untyped metadata is validated through the shared `asLocalizableText()` helper
(`theme/locales/`) — a map with any non-string value is ignored, so malformed
frontmatter degrades to the normal VitePress fallback instead of breaking.
Consumers: the explorer label (I18N-006), post-list and archive titles/excerpts,
the license card's article title, and the browser tab title (a localized map makes
VitePress's own `page.title` fall back to the body h1; the theme resolves the map
first, client-side). The SSR head is resolved to the **build language** by the
theme's `transformPageData` hook (`theme/pageData.ts`, wired in `config.mts`) —
required, because VitePress escapes `pageData.description` straight into the
`<meta name="description">` and an unresolved map would break the build; the
client then follows the active language best-effort, like the site title
(I18N-004). Non-displayed frontmatter (dates, tags/categories term names —
authored content kept verbatim per POST-001, toggles) stays plain — taxonomy
terms localize through the dedicated config below, never in frontmatter.

**Localizable taxonomy labels (I18N-008).** Tag and category *display* labels
localize through a dedicated config — not per-post frontmatter, because a term is
shared across posts and its identity must stay stable. `themeConfig.taxonomy`
maps authored term names to `LocalizableText` labels:

```ts
taxonomy: {
  tags: { theme: { en: "theme", "zh-Hans": "主题" } },
  categories: { Guides: { en: "Guides", "zh-Hans": "指南" } },
}
```

Keys are the term names as written in post frontmatter, matched
case-insensitively through their slug (`Guides` and `guides` share one entry);
resolution is the standard fallback against the active UI language, re-resolved
in place on a switch. **Display-only:** slugs, `/tags/<slug>` / `/categories/<slug>`
URLs, and grouping identity always derive from the authored name, so listing
routes never change with the language (consistent with the no-`/<lang>/`-URL rule).
A term without an entry renders verbatim — the default. Consumers: the post
byline/card taxonomy links (`PostTaxonomy`), the tag & category indexes, and the
per-term listing headings (`TermPosts`), all through the `useTaxonomy()`
composable over the shared `termLabel()` helper (`theme/posts.ts`).

**Locale tag rule (I18N-005).** Built-in locale tags are the **minimal canonical
BCP 47 tag**: the language subtag plus a script subtag only where the script
disambiguates — never a region subtag. Hence `zh-Hans` (Simplified vs. Traditional
is a script distinction, not a regional one) and bare `en` (Latin is English's
suppressed script). Region-tagged inputs (a site `lang` of `zh-CN` or `en-US`, a
visitor preference) still resolve to the right table through primary-subtag
matching.

**Implemented (I18N-001/003):** built-in string tables live in `theme/locales/`
(English = canonical key set; Chinese (Simplified) ships with the theme), typed so
translations cannot drift from the key set; each table names itself via the
`lang.label` key. Per string, resolution is: English → built-in table matching the
active UI language (exact tag, then primary subtag) → `themeConfig.localeStrings[tag]`
overrides. Components read strings only through the `useThemeLocale()` composable
(`t('key')`), which also exposes the active language, the available-language list,
and `setLanguage()`. Adding a language = one data file + a registry entry — or purely
from site config via a complete `localeStrings` entry.
