# UI Sketch — Layout Wireframes

> **Status: structure is binding, details are illustrative.** The arrangement of
> regions, their roles, and their responsive behavior follow
> [`design-language.md`](design-language.md) §4–§8 and are binding. Exact glyphs,
> labels, spacing, and copy in these sketches are placeholders, not pixel specs.
> Last updated: 2026-07-09.

## How to read the sketches

- Rounded frame corners (`╭ ╮ ╰ ╯`) are literal: panels and floating windows have
  rounded corners. Note that the actual corner radius in finalized website styling
  SHOULD not be too large (design-language.md §5, modern finish) so that the corners
  are subtle, not visually distracting, and feels like to be text-composed.
- The gaps between boxes are literal: panels float with visible spacing between them
  (design-language.md §5), they do not touch edge-to-edge.
- Glyph placeholders — final glyphs come from Font Awesome / Nerd Font per
  [`typography-and-icons.md`](typography-and-icons.md):
  `::` site glyph · `[/]` open search palette · `[o]` color-mode toggle ·
  `[EN]` language switcher · `[=]` menu / drawer trigger · `[x]` close ·
  `v` / `>` expanded / collapsed tree node.
- `READ` in the status bar is an illustrative mode indicator (modal-editor flavor
  without third-party branding, see design-language.md §3).
- Sketches depict **dark mode**, the default; body text is neutral near-white, with
  the main color reserved for emphasis — links, bold, headings, accents
  ([`color-system.md`](color-system.md) §2).

## 1. Desktop layout

```
╭─ tool bar / tabline ─────────────────────────────────────────────────────╮
│ :: site-name    ~/home   posts   tags   about            [/]  [o]  [EN]  │
╰──────────────────────────────────────────────────────────────────────────╯
╭─ explorer ─────────╮  ╭─ viewport ───────────────────────────────────────╮
│ v posts/           │  │                                                  │
│   v 2026/          │  │  # Post title                                    │
│     - hello-world  │  │                                                  │
│     - second-post  │  │  Body text in neutral near-white (dark mode).    │
│   > drafts/        │  │  Bold, links and buttons take accent styling.    │
│ - about            │  │                                                  │
│                    │  │   1 │ code block · oxocarbon palette             │
│                    │  │                                                  │
╰────────────────────╯  ╰──────────────────────────────────────────────────╯
╭─ status bar ─────────────────────────────────────────────────────────────╮
│ READ │ posts/2026/hello-world                    42% · 7 min · en · dark │
╰──────────────────────────────────────────────────────────────────────────╯
```

Tool bar: navigation as editor-style tabs plus global actions. Explorer: tree
navigation of the site content, collapsible. Status bar: mode flavor, current
location, reading progress, and the color-mode/language switchers.

## 2. Floating window — search / command palette

Floats centered above the viewport; the backdrop dims. Opened via `[/]` or a keyboard
shortcut, dismissed with `Esc` (design-language.md §7).

```
╭─ find ──────────────────────────────────────╮
│ > oxo_                                      │
│ ─────────────────────────────────────────── │
│ > Color system            docs/design/      │
│   Syntax highlighting     posts/2026/       │
│   About this site         about             │
│                                             │
│ [enter] open   [esc] close   [j/k] move     │
╰─────────────────────────────────────────────╯
```

On mobile this presents as a full/near-full-screen sheet (design-language.md §8).

## 3. Mobile layout (≈360 px)

Components adapt, they don't just shrink (design-language.md §8): the explorer moves
behind `[=]` as an off-canvas drawer, the tool bar condenses, the status bar keeps a
reduced set of segments.

```
╭─ tool bar ──────────────╮      ╭─ explorer (drawer) ─────╮
│ [=]  site-name       [/]│      │ v posts/            [x] │
╰─────────────────────────╯      │   v 2026/               │
╭─ viewport ──────────────╮      │     - hello-world       │
│                         │      │     - second-post       │
│  # Post title           │      │   > drafts/             │
│                         │      │ - about                 │
│  Body text wraps to a   │      ╰─────────────────────────╯
│  single column.         │       (drawer slides over the
│                         │        dimmed content when [=]
╰─────────────────────────╯        is tapped)
╭─ status bar ────────────╮
│ READ · 42% · dark       │
╰─────────────────────────╯
```

## 4. Paper / reader / print mode

The terminal chrome recedes to a minimum; a single reading column remains, set in IBM
Plex Serif on paper white ([`color-system.md`](color-system.md) §6,
[`typography-and-icons.md`](typography-and-icons.md) §1). Also applied via
`@media print`.

```
╭─ tool bar / tabline ─────────────────────────────────────────────────────╮
│ :: site-name    ~/home   posts   tags   about            [/]  [o]  [EN]  │
╰──────────────────────────────────────────────────────────────────────────╯
╭─ paper mode ─────────────────────────────────────────────────────────────╮
│                                                                          │
│                       Post Title (IBM Plex Serif)                        │
│                                                                          │
│          Near-black serif body on paper white. Terminal chrome           │
│              recedes; accents use the main color sparingly.              │
│                                                                          │
╰──────────────────────────────────────────────────────────────────────────╯
╭─ status bar ─────────────────────────────────────────────────────────────╮
│ READ │ posts/2026/hello-world                    42% · 7 min · en · dark │
╰──────────────────────────────────────────────────────────────────────────╯
```

Nav bars, status bar, and floating windows are still visible/usable but minimal;
the focus is on reading. The extra explorer or utility panels are hidden. The main
color is used sparingly for accents (links, buttons, highlights). The body text is
near-black on a paper-white background.

## 5. Footer — bottom of the main viewport

The footer lives **inside** the viewport panel, after the article content — it scrolls
with the page rather than floating as its own bar (design-language.md §4, footer).

```
╭─ viewport (bottom of the page) ──────────────────────────────────────────╮
│                                                                          │
│  ... end of article content ...                                          │
│                                                                          │
│  [ custom area · rendered from a user-supplied Vue file ]                │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  Copyright © 2026 Author                                 [gh] [tw] [em]  │
│  Powered by VitePress and VitePress Theme Terminal      [rss] [cc] [by]  │
│                                                                          │
╰──────────────────────────────────────────────────────────────────────────╯
```

The custom section on top is rendered from a user-supplied Vue file and renders
nothing when none is supplied (THEME-006). The rule below it is the separator from the
footer spec. `[gh] [tw] [em]` stand for the easily configurable social-icon list,
`[rss]` for the RSS link (icon shown only when a feed is configured), and `[cc] [by]`
for the license icons, which follow the license configured in the author & license
system (CONF-002; default CC BY-NC-SA 4.0) — all Font Awesome. On mobile each row
stacks (copyright line, powered by line, social icons, RSS/license icons).
Implementation details are to be added later (THEME-004, THEME-006).

*Extra Note: The second row's text should be lighter in color than the first row,
to visually separate the two rows. Apply only on desktop.*

## 6. Card component — floating window with shell prompt

The reusable card (design-language.md §4, cards) is a TUI-style floating window. The
prompt line is optional and configured per use: `admin` here is the normalized author
username from the author & license configuration (CONF-002); host, path, and command
are chosen by the consuming component.

```
╭─ card ───────────────────────────────────────────────────────────────────╮
│ admin@vitepress-theme-terminal:~/posts$ license ~/posts/hello-world      │
│ ──────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  Card body: license info, comments, welcome text, project tiles, ...     │
│                                                                          │
╰──────────────────────────────────────────────────────────────────────────╯
```

With the prompt: license card (COMP-003), comment card (COMP-004), home welcome card
(PAGE-001), and the more featured project/About entries (PAGE-002/003). Without the
prompt: the settings panel (THEME-007) and any plain content card.

### Code block variant

Code blocks reuse the card look, but the header is a **title bar** — file name (when
given), language name, and a COPY button — not a shell-prompt decoration (STYLE-004):

```
╭─ code block ─────────────────────────────────────────────────────────────╮
│ main.scss · scss                                                 [copy]  │
│ ──────────────────────────────────────────────────────────────────────── │
│  1 │ @use "tokens" as *;                                                 │
│  2 │ body { color: var(--main-color); }                                  │
╰──────────────────────────────────────────────────────────────────────────╯
```

## Region → specification → build task

| Sketch region | Specification | Build task |
| --- | --- | --- |
| Tool bar / tabline | design-language.md §4–§5 | THEME-001, THEME-005 |
| Status bar | design-language.md §4–§5 | THEME-001 |
| File explorer / mobile drawer | design-language.md §4, §8 | THEME-002 |
| Floating find window | design-language.md §4, §7 | THEME-003 |
| Footer (in-viewport) + custom section | design-language.md §4 (footer) | THEME-004, THEME-006 |
| Card / floating window with prompt | design-language.md §4 (cards) | COMP-001 |
| Code block card (file · lang · COPY) | design-language.md §4 (cards) | STYLE-004 |
| Viewport text & code colors | color-system.md | STYLE-001 … STYLE-003 |
| Fonts & glyphs used in chrome | typography-and-icons.md | FONT-001, FONT-002 |
| Mobile behaviors overall | design-language.md §8 | MOBILE-001 |
