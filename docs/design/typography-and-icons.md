# Typography & Icons

> **Status: binding.** To change a decision, update this document first, then the code.
> Last updated: 2026-07-08.

## 1. Font families — IBM Plex only

| Family | Use |
| --- | --- |
| **IBM Plex Sans** | UI chrome and default body text (dark and light modes) |
| **IBM Plex Serif** | Long-form body text in the paper/reader/print mode |
| **IBM Plex Mono** | All code, plus TUI chrome: tool bar, status bar, file explorer |

- The Sans-by-default / Serif-in-paper-mode allocation is a recorded decision: Sans and
  Serif are both approved for text, Mono is exclusively for code and TUI chrome.
- Every family gets a system fallback stack (e.g. `…, ui-sans-serif, system-ui,
  sans-serif` and `…, ui-monospace, monospace`).

## 2. Icons

- **Font Awesome** (Free) is the icon system for most icons — anywhere a
  general-purpose icon is needed, Font Awesome is the default and the tiebreaker.
- **Nerd Font** glyphs are permitted **only** in TUI-flavored chrome — tool bar, status
  bar, file explorer — e.g. file-type glyphs and powerline-style separators.

## 3. Loading rule (hard)

- Fonts and icon fonts load via **stylesheets, not npm packages**:
  - Font Awesome `all.css` from a CDN (e.g. cdnjs);
  - IBM Plex CSS (Google Fonts CSS2 API or another IBM Plex CDN stylesheet);
  - a symbols-only Nerd Font webfont stylesheet for the TUI glyphs.
- Inject the `<link>` tags into `<head>` via the VitePress config (`head` /
  `transformHead`) — this is the preferred mechanism. If a case genuinely cannot go
  through the config, importing the stylesheet URL from an SCSS file is the fallback,
  and the reason must be documented.
- **No new npm dependencies** may be introduced for fonts or icons.
- Self-hosting the same stylesheets/woff2 files later is acceptable (add a plan task),
  as long as the no-npm rule holds.
- **Implemented (FONT-001):** IBM Plex Sans/Serif/Mono load from the Google Fonts CSS2
  API (weights 400/600/700 + italic 400; Mono without 700) via `<link>`s built in
  `theme/head.ts`; fallback stacks live in `styles/_tokens.scss` (`--ct-font-sans/
  -serif/-mono`), and the per-mode body family is the `--ct-font-body` semantic token
  (Serif in paper mode).
