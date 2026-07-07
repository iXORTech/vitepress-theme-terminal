# Color System

> **Status: binding.** To change a decision, update this document first, then the code.
> Last updated: 2026-07-07.

## 1. Three layers

1. **Main color** — one configurable accent, default `#80E0A7`. The protagonist.
2. **IBM Carbon palette** — the supporting structure and design enhancement.
3. **Oxocarbon** — code syntax highlighting (itself Carbon-derived).

## 2. Main color

- A single user-configurable color, set in `.vitepress/config.mts` (`themeConfig`);
  default **`#80E0A7`**.
- It is **dominant** in the UI — especially for text content: in dark mode, body text
  itself renders in the main color (green-phosphor terminal feel with the default value).
- It also styles visuals and emphasis: buttons, links, bold text, active/selected
  states, highlights.
- In light and paper modes, contrast comes first: where the raw value lacks contrast,
  use **derived** (darkened/adjusted) variants of the main color — still generated from
  it, never a second configured constant (§3).

## 3. Derivation rule (hard)

Every auxiliary color that matches or varies the main color **must be generated from the
configured main color** — computed in SCSS color functions and/or CSS
`color-mix()`/custom properties — never configured separately and never hardcoded.

Examples of derived roles: link hover (lighten/darken), dimmed text (alpha), subtle
accent background (alpha or mix with the surface color), accent borders, selection
highlight.

Rationale: a user changes one config value and the entire theme re-tunes consistently.

## 4. IBM Carbon palette

The [IBM Carbon Design System palette](https://carbondesignsystem.com/elements/color/overview/)
provides everything that is not the main color: background layers and surfaces, neutral
text tiers, borders, and semantic colors (error/warning/info/success). Carbon enhances
the design; it must never compete with the main color for attention.

## 5. Oxocarbon for code

Syntax highlighting uses nyoom-engineering's **Oxocarbon**:

- **Dark & light modes:** the palettes of
  [oxocarbon.nvim](https://github.com/nyoom-engineering/oxocarbon.nvim) (dark and light
  variants respectively).
- **Paper/print mode:** the print-friendly light palette of the
  [VSCode variant](https://github.com/nyoom-engineering/vscode-oxocarbon).

Implementation goes through custom Shiki themes configured in the VitePress config.

## 6. The three modes

| Mode | Priority | Surfaces | Text | Notes |
| --- | --- | --- | --- | --- |
| **Dark** | Default; design here first | Carbon dark layers (gray-90/100 family) | Main color dominant | The terminal-authentic mode |
| **Light** | Second | Carbon light layers (white/gray-10 family) | Darkened main-color derivatives and Carbon neutrals, main-color accents | Must be designed, not just inverted |
| **Paper / reader / print** | Special | Paper white, minimal chrome | Near-black body text; main-color accents used sparingly | Serif body (see [typography-and-icons.md](typography-and-icons.md)), print-friendly syntax palette; also applied via `@media print` |

## 7. Configuration surface

Only the **main color** is user-configurable (via `themeConfig`, default `#80E0A7`).
Carbon and Oxocarbon values are fixed theme constants. Any future configurable color
must be added to the VitePress config surface and documented (see `AGENTS.md` §6.5).
