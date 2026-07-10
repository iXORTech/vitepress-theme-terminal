# Design Language — VitePress Theme Terminal

> **Status: binding.** These are recorded design decisions, not suggestions. To change
> one, update this document first, then the code. Workflow rules: [`AGENTS.md`](../../AGENTS.md).
> Last updated: 2026-07-09.

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
| Status bar (bottom) | State/mode indicator, current location (breadcrumb), reading progress + back-to-top (one tight cluster), color-mode **indicator** (read-only — switching lives in the tool bar), language switcher; thin separators divide top-level segments |
| File explorer (side tree) | Site/content navigation sidebar — retractable on desktop; not part of the UI in paper mode |
| Floating windows | Utilities: search / command palette / pickers, settings |
| Editor viewport | The content area (article body) |

Flavor details are welcome where they reinforce the metaphor without hurting usability —
e.g. a mode indicator in the status bar, subtle line numbers on code blocks.

**Footer** — sits at the bottom of the main viewport, inside the content panel: it
scrolls with the article and is **not** a separate floating bar. Structure, top to
bottom:

1. a fully-custom section rendered from a user-supplied Vue file — its own component
   sitting directly on top of the footer, rendering nothing when the user supplies no
   file (plan task THEME-006);
2. a separator rule;
3. a copyright row — `Copyright © <year> <author>` on the left, social icons on the
   right;
4. an attribution row — “Powered by VitePress and VitePress Theme Terminal” on the
   left, the RSS icon (only when a feed is configured) and the license icons on the
   right; on desktop this row's text is lighter than the copyright row's (the lighter
   tone derived per the color rules; see the ui-sketch.md §5 note).

The social-icon list and the RSS feed are easily configured via `themeConfig`; the
author in the copyright and the license icons come from the central author & license
system (CONF-002; default license CC BY-NC-SA 4.0). Fixed strings are localized; the
icons are Font Awesome (general-icon context,
[`typography-and-icons.md`](typography-and-icons.md) §2). On narrow viewports the rows
stack. The custom section on top is still to come (plan task THEME-006).

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

**Cards & shell-prompt decoration** — a reusable card component renders as a TUI-style
floating window (Unicode-frame flavor, with the rounded, floating finish of §5). Each
use may configure an optional **shell-prompt decoration**, a header line of the form
`user@host:path$ command args`, where `user` is always the normalized author username
from the central author & license configuration (CONF-002); host, path, and command
are chosen by the consuming component. The prompt marks featured or special content:
the license card and the comment card always carry it, the home-page welcome card
carries it, project/About grids use it for their more featured entries, and the
settings panel never does (plan task COMP-001). Related: code blocks render as
card-style floating windows in the same visual language — framed like the card
component, but headed by a title bar (file name when given, plus the language name)
holding a COPY button, **not** by a shell-prompt-like decoration (STYLE-004; wireframe
in ui-sketch.md §6).

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
defaulting to the site's `lang` value. Page *content* is whatever the author wrote;
only theme UI strings switch.

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
