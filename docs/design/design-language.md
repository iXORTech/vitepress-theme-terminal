# Design Language — VitePress Theme Terminal

> **Status: binding.** These are recorded design decisions, not suggestions. To change
> one, update this document first, then the code. Workflow rules: [`AGENTS.md`](../../AGENTS.md).
> Last updated: 2026-07-08.

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
| Tool bar / tabline (top) | Site navigation, page tabs |
| Status bar (bottom) | State/mode indicator, current location (breadcrumb), reading progress, color-mode and language switchers |
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
stack. Further implementation details are to be specified later (plan tasks THEME-004,
THEME-006).

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

ASCII wireframes of this layout — desktop, floating window, mobile, paper mode,
footer, and cards — live in [`ui-sketch.md`](ui-sketch.md).

## 5. Modern finish

Preserve the TUI structure but render it with a modern look rather than retro pixel
fidelity:

- rounded corners on panels and floating windows, note that the corner radius SHOULD NOT
  be too large - the goal is a subtle rounding so the components seems to be composed by
  text (for TUI feel) and not a separate shape;
- a floating feel: panels separated by gaps/padding instead of hard full-bleed splits;
- subtle borders and shadows for depth; small, smooth transitions.

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
languages) or a per-language map `{ "en": …, "zh-CN": … }`, resolved against the
active UI language (exact tag → primary subtag → `en` → first entry). The theme's
`themeConfig.title`/`.description` follow this pattern, defaulting to the site
config's `title`/`description`; the browser tab title and meta description follow the
active language client-side, while the server-rendered head keeps the site-config
defaults. All future config text (nav labels, footer text, series metadata, …) must
use `LocalizableText`.

**Implemented (I18N-001/003):** built-in string tables live in `theme/locales/`
(English = canonical key set; Chinese (Simplified) ships with the theme), typed so
translations cannot drift from the key set; each table names itself via the
`lang.label` key. Per string, resolution is: English → built-in table matching the
active UI language (exact tag, then primary subtag) → `themeConfig.localeStrings[tag]`
overrides. Components read strings only through the `useThemeLocale()` composable
(`t('key')`), which also exposes the active language, the available-language list,
and `setLanguage()`. Adding a language = one data file + a registry entry — or purely
from site config via a complete `localeStrings` entry.
