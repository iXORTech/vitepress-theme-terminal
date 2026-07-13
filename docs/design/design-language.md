# Design Language — VitePress Theme Terminal

> **Status: binding.** These are recorded design decisions, not suggestions. To change
> one, update this document first, then the code. Workflow rules: [`AGENTS.md`](../../AGENTS.md).
> Last updated: 2026-07-12.

## 1. Identity

- Project name: **VitePress Theme Terminal**.
- A custom VitePress theme for blogs and personal websites that looks and feels like a
  modern terminal/TUI session.

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

*Auto-discovery (THEME-012 / I18N-006 / THEME-013):* `themeConfig.explorer` may be set to
`"auto"` to derive the tree from every Markdown file below the site's `src/`
source directory. Directories become folders, `index.md` is the folder's
optional link, and other Markdown files become leaves; the generated tree is
sorted deterministically and is available in SSR output as well as client
navigation. A page label uses frontmatter `explorerTitle`, then a localized
frontmatter `title`, and finally the normal VitePress title/path fallback. A
folder may add source-local `explorer.json` beside its Markdown children:
`title` is a `LocalizableText` override. This metadata intentionally lives with the content,
not in the VitePress site config, so an index-less folder can still have a
localized label. The existing explicit explorer-array form remains supported,
so auto-discovery is opt-in and does not change existing sites.

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
When omitted, `host` is generated by applying the same shell-safe normalization to
the active site title, and `path` defaults to the current page's home-relative
location; every value remains overridable. `user` is always the normalized author
username from the central author & license configuration (CONF-002). The prompt
marks featured or special content: the license card and the comment card always
carry it, the home-page welcome card carries it, project/About grids use it for
their more featured entries, and the settings panel never does (plan task COMP-001).
On constrained widths it progressively removes `@host`, reduces the path to its
final section, and then applies an end ellipsis to the path; the command and
arguments remain visible unless their own content is longer than the available
line.
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

- file explorer → off-canvas drawer;
- tool bar → condensed/collapsible;
- status bar → reduced set of segments;
- floating windows → full- or near-full-screen sheets;
- no horizontal overflow at small widths (≈360 px); adequate touch targets.

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
