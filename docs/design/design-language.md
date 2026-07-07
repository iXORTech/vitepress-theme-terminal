# Design Language — VitePress Theme Terminal

> **Status: binding.** These are recorded design decisions, not suggestions. To change
> one, update this document first, then the code. Workflow rules: [`AGENTS.md`](../../AGENTS.md).
> Last updated: 2026-07-07.

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
| File explorer (side tree) | Site/content navigation sidebar |
| Floating windows | Utilities: search / command palette / pickers, settings |
| Editor viewport | The content area (article body) |

Flavor details are welcome where they reinforce the metaphor without hurting usability —
e.g. a mode indicator in the status bar, subtle line numbers on code blocks.

**Footer** — sits at the bottom of the main viewport, inside the content panel: it
scrolls with the article and is **not** a separate floating bar. Structure, top to
bottom:

1. an optional fully-custom region, rendered from a user-supplied Vue file;
2. a separator rule;
3. a copyright row — `Copyright © <year> <author>` on the left, social icons on the
   right;
4. an attribution row — “Powered by VitePress and VitePress Theme Terminal” on the
   left, RSS and Creative Commons (CC BY) license icons on the right.

Author, social links, RSS, and license values come from `themeConfig`; the fixed
strings are localized; the icons are Font Awesome (general-icon context,
[`typography-and-icons.md`](typography-and-icons.md) §2). On narrow viewports the rows
stack. Further implementation details — including how the custom Vue file is wired in —
are to be specified later (plan task THEME-004).

ASCII wireframes of this layout — desktop, floating window, mobile, paper mode, and
footer — live in [`ui-sketch.md`](ui-sketch.md).

## 5. Modern finish

Preserve the TUI structure but render it with a modern look rather than retro pixel
fidelity:

- rounded corners on panels and floating windows;
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
components is localizable, integrated with VitePress `locales`. Adding a language must
not require editing components.
