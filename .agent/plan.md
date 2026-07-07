# Plan — VitePress Theme Terminal

Task board for this repository. Full workflow rules live in [`AGENTS.md`](../AGENTS.md)
§4; in short: every requirement becomes a task **before** implementation; a task has an
ID (`TYPE-###`), a category, dependencies, and acceptance criteria; **no task starts
until all its dependencies are `[x]`**; tasks with no dependency relationship may run in
parallel; tick `[x]` only when every acceptance criterion is met.

## Tasks

### Documentation

- [x] **DOC-001** — Foundational documentation & agent memory
  - **Category:** Documentation · **Deps:** —
  - **Acceptance criteria:** `AGENTS.md` is the single agent-instruction source with
    session protocol, workflow rules, conventions, and compliance code; `CLAUDE.md` and
    `.github/copilot-instructions.md` are pure references to it; `.agent/plan.md` and
    `.agent/context-cache.md` exist and are usable; `docs/design/` records all design
    decisions known so far; `docs/README.md` indexes everything.

- [ ] **DOC-002** — User-facing configuration documentation
  - **Category:** Documentation · **Deps:** CONF-001
  - **Acceptance criteria:** every `themeConfig` option is documented with type,
    default, and an example.

- [x] **DOC-003** — UI design sketch
  - **Category:** Documentation · **Deps:** DOC-001
  - **Acceptance criteria:** `docs/design/ui-sketch.md` contains wireframes for the
    desktop layout, the floating utility window, the mobile layout including the
    explorer drawer, and paper mode; regions map to their design docs and build tasks;
    linked from `docs/README.md` and `docs/design/design-language.md`.

- [ ] **DOC-004** — User Documentation
  - **Category:** Documentation · **Deps:** ALL-TASKS
  - **Acceptance criteria:** a full documentations set for users, including a
    getting-started guide, configuration reference, etc.

- [x] **DOC-005** — Footer design documentation
  - **Category:** Documentation · **Deps:** DOC-001, DOC-003
  - **Acceptance criteria:** footer structure (custom Vue region · separator ·
    copyright/social row · powered-by/RSS/license row, at the bottom of the main
    viewport) recorded in `docs/design/design-language.md` §4 and wireframed in
    `docs/design/ui-sketch.md` §5; added to the region → spec → task map; explicitly
    notes that further implementation details follow later (THEME-004).

### Infrastructure

- [ ] **INFRA-001** — SCSS toolchain
  - **Category:** Infrastructure · **Deps:** —
  - **Acceptance criteria:** `sass` added as a devDependency; `.vitepress/theme/styles/`
    established with a `main.scss` entry imported by the theme; `style.css` retired;
    `pnpm dev` and `pnpm build` succeed.

### Configuration

- [ ] **CONF-001** — Theme configuration surface
  - **Category:** Configuration · **Deps:** —
  - **Acceptance criteria:** a typed `themeConfig` schema (main color with default
    `#80E0A7`, locale-strings hook, feature toggles as they appear) read from
    `.vitepress/config.mts`; defaults applied when unset; no user-configurable value
    lives outside the config without a documented reason.

### Styling

- [ ] **STYLE-001** — Design tokens: Carbon palette + main color
  - **Category:** Styling · **Deps:** INFRA-001, CONF-001
  - **Acceptance criteria:** Carbon palette and the main color exposed as CSS custom
    properties from SCSS; all main-color derivatives (hover/dim/subtle/border/selection)
    computed from the configured value per `docs/design/color-system.md` §3; no
    hardcoded derivative hex values anywhere.

- [ ] **STYLE-002** — Color modes: dark / light / paper
  - **Category:** Styling · **Deps:** STYLE-001
  - **Acceptance criteria:** three switchable modes with dark as default; user choice
    persisted; paper mode reader-optimized and also applied via `@media print`; token
    values per `docs/design/color-system.md` §6.

- [ ] **STYLE-003** — Oxocarbon syntax highlighting
  - **Category:** Styling · **Deps:** STYLE-002
  - **Acceptance criteria:** Shiki custom themes wired in the VitePress config:
    oxocarbon.nvim dark/light palettes for dark/light modes, vscode-oxocarbon light
    palette for paper mode; code blocks follow the active mode.

### Typography & icons

- [ ] **FONT-001** — IBM Plex font loading
  - **Category:** Typography · **Deps:** —
  - **Acceptance criteria:** Plex Sans/Serif/Mono load via stylesheet `<link>`s injected
    into `<head>` from the VitePress config; fallback stacks defined; no npm font
    packages.

- [ ] **FONT-002** — Icon systems: Font Awesome + Nerd Font
  - **Category:** Typography · **Deps:** —
  - **Acceptance criteria:** Font Awesome `all.css` and a symbols-only Nerd Font
    stylesheet injected into `<head>` from the VitePress config; both render; Nerd Font
    use restricted to TUI chrome per `docs/design/typography-and-icons.md` §2; no npm
    icon packages.

### i18n

- [ ] **I18N-001** — Locale system scaffolding
  - **Category:** i18n · **Deps:** CONF-001
  - **Acceptance criteria:** all theme UI strings resolve through a locale layer
    integrated with VitePress `locales`; English defaults built in; adding a locale
    requires no component edits. The theme also ships with Chinese (Simplified) locale.

### Theme components

- [ ] **THEME-001** — Layout shell: tool bar · viewport · status bar
  - **Category:** Theme · **Deps:** STYLE-001, FONT-001, FONT-002, I18N-001
  - **Acceptance criteria:** top tool bar, content viewport, and bottom status bar per
    `docs/design/design-language.md` §4–5 (rounded, floating finish); no third-party
    branding; all strings localized; major sections commented; styles in dedicated SCSS
    files.

- [ ] **THEME-002** — File-explorer navigation sidebar
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** tree-style navigation of site content with TUI look;
    collapsible; behaves as an off-canvas drawer on mobile.

- [ ] **THEME-003** — Floating-window utilities (search / command palette)
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** floating panel with content search; keyboard shortcut to
    open and `Esc` to dismiss; presents as a full/near-full-screen sheet on mobile.

- [ ] **THEME-004** — Footer component
  - **Category:** Theme · **Deps:** THEME-001, CONF-001
  - **Acceptance criteria:** footer renders at the bottom of the main viewport, below
    the content, per `docs/design/design-language.md` §4 (footer) and
    `docs/design/ui-sketch.md` §5; the region above the separator is a fully custom,
    user-supplied Vue file; standard rows show configured copyright/author with social
    icons, and “Powered by VitePress and VitePress Theme Terminal” with RSS and CC BY
    icons (Font Awesome); all values come from `themeConfig`; fixed strings localized;
    styles in dedicated SCSS; rows stack correctly on mobile. The footer spec is marked
    “details to be added later” — incorporate the updated spec before ticking this
    task.

### Responsive

- [ ] **MOBILE-001** — Mobile adaptation pass
  - **Category:** Responsive · **Deps:** THEME-001, THEME-002, THEME-003
  - **Acceptance criteria:** no horizontal overflow at 360 px; drawer/condensed/reduced
    behaviors per `docs/design/design-language.md` §8 verified on real viewport sizes;
    touch targets ≥ 44 px.
