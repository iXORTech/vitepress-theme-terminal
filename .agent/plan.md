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

- [x] **DOC-006** — Feature-set requirements recorded (2026-07-07 batch)
  - **Category:** Documentation · **Deps:** DOC-005
  - **Acceptance criteria:** the 21-requirement feature batch is captured as plan tasks
    with IDs, categories, dependencies, and acceptance criteria; the card component and
    shell-prompt decoration are documented in `design-language.md` §4 and sketched in
    `ui-sketch.md` §6; the footer task and documentation are expanded with
    configurability and the author & license system; the context cache is updated.

### Infrastructure

- [x] **INFRA-001** — SCSS toolchain
  - **Category:** Infrastructure · **Deps:** —
  - **Acceptance criteria:** `sass` added as a devDependency; `.vitepress/theme/styles/`
    established with a `main.scss` entry imported by the theme; `style.css` retired;
    `pnpm dev` and `pnpm build` succeed.

### Configuration

- [x] **CONF-001** — Theme configuration surface
  - **Category:** Configuration · **Deps:** —
  - **Acceptance criteria:** a typed `themeConfig` schema (main color with default
    `#80E0A7`, locale-strings hook, feature toggles as they appear) read from
    `.vitepress/config.mts`; defaults applied when unset; no user-configurable value
    lives outside the config without a documented reason.

- [ ] **CONF-002** — Author & license system
  - **Category:** Configuration · **Deps:** CONF-001
  - **Acceptance criteria:** `themeConfig` carries the author identity — full/display
    name plus a username, with a normalized shell-safe username derived automatically
    when not set explicitly — and the content license, default **CC BY-NC-SA 4.0**.
    All consuming surfaces read from this single source: footer copyright & license
    icons (THEME-004), author info displays, shell-prompt decorations (COMP-001), and
    the license card (COMP-003).

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

- [ ] **STYLE-004** — Code block cards
  - **Category:** Styling · **Deps:** STYLE-003, I18N-001, COMP-001
  - **Acceptance criteria:** code blocks render as card-style floating windows in the
    card component's visual language (`docs/design/ui-sketch.md` §6, code block
    variant): a **title bar** — not a shell-prompt decoration — shows the file name
    (when given) and the language name and holds a COPY button; highlighting stays
    Shiki-powered with the STYLE-003 palettes; labels localized; styles in dedicated
    SCSS.

- [ ] **STYLE-005** — Base markdown content styling
  - **Category:** Styling · **Deps:** STYLE-001, FONT-001
  - **Acceptance criteria:** all standard markdown output (headings, paragraphs,
    lists, tables, blockquotes, rules, links, images, inline code) styled to the
    design language across the three color modes; readable measure; mobile-safe.

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

### Markdown

- [ ] **MD-001** — markdown-it plugin suite
  - **Category:** Markdown · **Deps:** —
  - **Acceptance criteria:** the following plugins are wired into the VitePress
    markdown config and render correctly: markdown-it-emoji, markdown-it-sub,
    markdown-it-sup, markdown-it-ins, markdown-it-mark, markdown-it-footnote,
    markdown-it-deflist, markdown-it-abbr, markdown-it-container, and
    markdown-it-mathjax3 (math formulas); a sample-usage demo file exercises every
    plugin. (Plugin packages are regular devDependencies — the no-npm rule covers only
    fonts/icons.)

- [ ] **MD-002** — Callouts (admonition containers)
  - **Category:** Markdown · **Deps:** MD-001, STYLE-001
  - **Acceptance criteria:** custom containers render TUI-card-style callouts:
    `info`, `note` (alias of `info`), `tip`, `warning`, `danger`, `caution` (alias of
    `danger`), `important`, and `details` (collapsible); semantic colors from the
    Carbon layer; default titles localized; custom titles supported.

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
    retractable/extendable on desktop via an explicit control, with collapsible tree
    nodes; contents easily configured via `themeConfig`; behaves as an off-canvas
    drawer on mobile; not rendered at all in paper mode.

- [ ] **THEME-003** — Floating-window utilities (search / command palette)
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** floating panel with content search; keyboard shortcut to
    open and `Esc` to dismiss; presents as a full/near-full-screen sheet on mobile.

- [ ] **THEME-004** — Footer component
  - **Category:** Theme · **Deps:** THEME-001, CONF-001, CONF-002
  - **Acceptance criteria:** footer renders at the bottom of the main viewport, below
    the content, per `docs/design/design-language.md` §4 (footer) and
    `docs/design/ui-sketch.md` §5: separator rule, copyright row, and attribution row
    (“Powered by VitePress and VitePress Theme Terminal”); on desktop the attribution
    row's text is lighter than the copyright row's (ui-sketch.md §5 note), with the
    lighter tone derived per the color rules. Configurable via `themeConfig`: RSS link
    (icon shown only when a feed is configured) and an easily editable social-icon
    list (Font Awesome); the copyright author and the license icons are driven by the
    author & license system (CONF-002). Fixed strings localized; dedicated SCSS; rows
    stack on mobile per the sketch caption. The fully-custom section above the footer
    is THEME-006.

- [ ] **THEME-005** — Tool bar configurability & extras
  - **Category:** Theme · **Deps:** THEME-001, CONF-001
  - **Acceptance criteria:** navigation entries are easy to configure via
    `themeConfig`; the color-mode (theme) switcher lives in the tool bar; an
    extensible icon-slot mechanism lets extra feature icons (e.g. search trigger,
    important social links) be added from configuration without component edits.

- [ ] **THEME-006** — Fully-custom section above the footer
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** a section directly above the footer whose entire content
    is rendered from a user-supplied Vue file; renders nothing when the user provides
    none; the wiring mechanism is documented.

- [ ] **THEME-007** — Settings panel (floating window)
  - **Category:** Theme · **Deps:** THEME-001, CONF-001, I18N-001, FONT-001
  - **Acceptance criteria:** a hovering TUI-window settings panel **without** shell
    prompt; the first version only offers font configuration and language switching;
    choices persisted; full/near-full-screen sheet on mobile; strings localized.

### Components

- [ ] **COMP-001** — Card component: TUI floating window + shell-prompt decoration
  - **Category:** Components · **Deps:** STYLE-001, FONT-001, FONT-002, CONF-002
  - **Acceptance criteria:** a reusable card styled as a TUI floating window
    (Unicode-frame flavor, rounded/floating finish) per
    `docs/design/design-language.md` §4 (cards) and `docs/design/ui-sketch.md` §6; an
    optional shell-prompt decoration line (`user@host:path$ command args`) is
    configurable per use, where `user` is the normalized author username from
    CONF-002 and host/path/command are chosen by the consuming component; serves as
    the base for the license card, comment card, and page cards/grids.

- [ ] **COMP-002** — Image containers: lightbox + Swiper
  - **Category:** Components · **Deps:** MD-001, STYLE-001
  - **Acceptance criteria:** content images gain enlarge-on-click, and all images on a
    page can be browsed as slides (Fancybox); a `:::: swiper` container with nested
    `::: swiper-slide-no-shadow` blocks renders images as SwiperJS slides with the
    cards effect (cards stacked on top of each other), supporting exactly the block
    syntax documented in the requirement.

- [ ] **COMP-003** — License card
  - **Category:** Components · **Deps:** THEME-001, COMP-001, CONF-002
  - **Acceptance criteria:** at the end of every article (posts and series), a card
    **with** shell-prompt decoration shows the configured license (default
    CC BY-NC-SA 4.0) and the article info — title, URL, publish date, author — with
    author and license sourced from CONF-002; strings localized.

- [ ] **COMP-004** — Waline comments & counts
  - **Category:** Components · **Deps:** THEME-001, COMP-001, CONF-001
  - **Acceptance criteria:** a Waline-powered comment section renders at the end of
    every article (posts and series) inside a card **with** shell-prompt decoration;
    the Waline server is configured via `themeConfig`; a viewer count and a comment
    count appear in the article title section; strings localized.

### Content & pages

- [ ] **POST-001** — Tags & categories
  - **Category:** Content · **Deps:** THEME-001
  - **Acceptance criteria:** posts/articles declare tags and categories in their
    frontmatter; dedicated pages list all tags and all categories and the posts under
    each; post metadata links to them; labels localized.

- [ ] **POST-002** — Post series
  - **Category:** Content · **Deps:** POST-001, CONF-001, I18N-001
  - **Acceptance criteria:** regular posts live in `src/posts`, series articles in
    `src/series`; each series has a YAML configuration for its icon, title, and
    description, each with localized versions; series and the articles within a series
    sort by an `order` attribute (default 0, smaller = higher) falling back to
    alphabetical; `themeConfig` toggles control whether series posts are included in
    the general posts' archive/category/tag pages.

- [ ] **PAGE-001** — Home page
  - **Category:** Pages · **Deps:** THEME-001, COMP-001
  - **Acceptance criteria:** a home page with basic personal-website welcome content
    presented in a card component that **does** carry the shell-prompt decoration;
    content configurable; strings localized; mobile-correct.

- [ ] **PAGE-002** — Projects page
  - **Category:** Pages · **Deps:** THEME-001, COMP-001
  - **Acceptance criteria:** a page demonstrating all projects with grid/card
    components; cards may or may not carry the shell prompt — more featured content
    carries the extra decoration; data easy to configure; localized; grid adapts on
    mobile.

- [ ] **PAGE-003** — About Me page
  - **Category:** Pages · **Deps:** THEME-001, COMP-001
  - **Acceptance criteria:** an About Me page organizing info with grid/card
    components; shell prompt used judiciously — more featured blocks carry the extra
    decoration; localized; mobile-correct.

- [ ] **PAGE-004** — Friends page (spec incoming)
  - **Category:** Pages · **Deps:** THEME-001, COMP-001
  - **Acceptance criteria:** a page listing friends, fed by a formatted data source.
    **The data-source spec is still to be provided — do not start this task until the
    spec lands and this entry is updated.**

- [ ] **DEMO-001** — Markdown demo pages
  - **Category:** Content · **Deps:** STYLE-005, MD-001, MD-002
  - **Acceptance criteria:** demo files show markdown sources alongside their rendered
    results, covering standard markdown, the plugin suite (MD-001), and callouts
    (MD-002); reachable from the site navigation.

### Search

- [ ] **SEARCH-001** — Algolia DocSearch preparation
  - **Category:** Search · **Deps:** CONF-001
  - **Acceptance criteria:** `themeConfig` keys for DocSearch (appId, apiKey,
    indexName) exist and are documented; the integration point is stubbed so a site
    with credentials gets a working DocSearch entry (e.g. via the tool bar search
    icon); the relationship with the find palette (THEME-003) is decided and
    documented.

### Responsive

- [ ] **MOBILE-001** — Mobile adaptation pass
  - **Category:** Responsive · **Deps:** all THEME-*, COMP-*, PAGE-*, POST-* tasks
  - **Acceptance criteria:** no horizontal overflow at 360 px; drawer/condensed/reduced
    behaviors per `docs/design/design-language.md` §8 verified on real viewport sizes;
    touch targets ≥ 44 px.
