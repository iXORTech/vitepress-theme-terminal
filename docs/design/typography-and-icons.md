# Typography & Icons

> **Status: binding.** To change a decision, update this document first, then the code.
> Last updated: 2026-07-20.

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
  bar, file explorer, and callout chrome (the per-type title glyphs and the details
  chevron, MD-003) — e.g. file-type glyphs and powerline-style separators.
- **Implemented (FONT-002 / FONT-004):** Font Awesome Free `all.min.css` (cdnjs) and
  the generated symbols-only Nerd Font stylesheet from jsDelivr
  (`cdn.jsdelivr.net/gh/ryanoasis/nerd-fonts@master/css/nerd-fonts-generated.min.css`)
  load via `<link>`s built in `theme/head.ts`. The generated CSS's legacy
  `/fonts/` face URL is not present in the Git repository, so the theme also
  registers the matching `SymbolsNerdFont-Regular.ttf` from jsDelivr under the
  private `NerdFontsSymbols Nerd Font Terminal` alias; `--ct-font-nerd` uses that
  working face.
- **Safe fallback (MD-003):** Nerd Font glyphs live in Private Use Area codepoints and
  would render as tofu if the font were missing, so PUA glyphs in CSS are gated behind
  `html[data-ct-nerdfont]`, set by the `useNerdFont()` composable only after the CSS
  Font Loading API confirms the face is usable. When the stylesheet fails, callouts
  degrade to no title icon and the plain `❯` details chevron.
- **Readiness:** the runtime gate waits for the external Nerd Font stylesheet to finish
  loading before querying the face. This avoids treating an early, pre-`@font-face`
  check as a permanent load failure while preserving the fallback when the stylesheet
  or font itself genuinely fails.

## 2a. Math typeface — IBM Plex Math (FONT-005)

Both math renderers use **IBM Plex Math** as the math typeface, instead of each
renderer's own default math font (MathJax's TeX font / Typst's New Computer Modern
Math):

- **LaTeX** (`$…$` / `$$…$$`, the MD-001 path) and **Typst** (`::: typst` block and
  the `:typst[…]` inline form, MD-004) both render their formulas in IBM Plex Math.
- IBM Plex Math is a proper math font (it carries an OpenType `MATH` table), so it can
  drive the math layout of both engines.
- Fallback stack: `"IBM Plex Math", math, "IBM Plex Serif", serif` — `math` is the
  generic CSS math family, so a page still renders sensibly if the webfont fails.

**Why the LaTeX renderer emits MathML (FONT-005 decision).** MD-001's original wiring
(`markdown-it-mathjax3`) produced **SVG**, in which every glyph is a baked-in vector
path from MathJax's own font — CSS `font-family` cannot restyle it, and there is no IBM
Plex Math build for MathJax. To honor the "IBM Plex Math for both renderers" rule, the
LaTeX path now converts TeX to **MathML** (still MathJax — `mathjax-full`'s serialized
MathML, produced at build time so SSR stays clean) and the browser renders the `<math>`
elements natively, respecting `math { font-family: "IBM Plex Math" }`. Trade-off: native
MathML is excellent in Chromium/Firefox and weaker in older Safari; the win is a
consistent math typeface across both engines and lighter, script-free SSR output.

Typst renders to SVG (glyphs are vector paths), so its IBM Plex Math cannot come from a
stylesheet — the OTF is fed **to the Typst compiler** as font bytes and selected with
`#show math.equation: set text(font: "IBM Plex Math")`.

**Loading (FONT-005):** IBM Plex Math loads via a stylesheet `<link>` injected in
`<head>` from the VitePress config (the FONT-001 rule) — the `@ibm/plex-math` CSS on
jsDelivr, which declares `@font-face { font-family: "IBM Plex Math" }` (woff2). This
covers the MathML/page side. The Typst **compiler** additionally needs the raw OTF
(the `ttf-parser` it uses does not read woff2), so the theme ships
`assets/fonts/IBMPlexMath-Regular.otf` (SIL OFL 1.1, redistributable — license kept
beside it) and hands its bytes to the WASM compiler. That binary is a renderer
internal, like the Typst WASM module itself, not a page font — no stylesheet can supply
it, which is the documented reason it does not go through the `<head>` rule.

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
