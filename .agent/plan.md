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

- [x] **CONF-002** — Author & license system
  - **Category:** Configuration · **Deps:** CONF-001
  - **Acceptance criteria:** `themeConfig` carries the author identity — full/display
    name plus a username, with a normalized shell-safe username derived automatically
    when not set explicitly — and the content license, default **CC BY-NC-SA 4.0**.
    All consuming surfaces read from this single source: footer copyright & license
    icons (THEME-004), author info displays, shell-prompt decorations (COMP-001), and
    the license card (COMP-003).
    *Landed 2026-07-09: `themeConfig.author`/`.license` + `normalizeUsername()` in
    `theme/config.ts`; rule documented in design-language.md §4. The consuming
    surfaces are later tasks — each reads the resolved config via
    `useThemeConfig()` when it lands.*

### Styling

- [x] **STYLE-001** — Design tokens: Carbon palette + main color
  - **Category:** Styling · **Deps:** INFRA-001, CONF-001
  - **Acceptance criteria:** Carbon palette and the main color exposed as CSS custom
    properties from SCSS; all main-color derivatives (hover/dim/subtle/border/selection)
    computed from the configured value per `docs/design/color-system.md` §3; no
    hardcoded derivative hex values anywhere.

- [x] **STYLE-002** — Color modes: dark / light / paper
  - **Category:** Styling · **Deps:** STYLE-001
  - **Acceptance criteria:** three switchable modes with dark as default; user choice
    persisted; paper mode reader-optimized and also applied via `@media print`; token
    values per `docs/design/color-system.md` §6.

- [x] **STYLE-003** — Oxocarbon syntax highlighting
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

- [x] **STYLE-005** — Base markdown content styling
  - **Category:** Styling · **Deps:** STYLE-001, FONT-001
  - **Acceptance criteria:** all standard markdown output (headings, paragraphs,
    lists, tables, blockquotes, rules, links, images, inline code) styled to the
    design language across the three color modes; readable measure; mobile-safe.

- [x] **STYLE-006** — Neutral body text; main color as emphasis only (rework)
  - **Category:** Styling · **Deps:** STYLE-002, STYLE-005
  - **Acceptance criteria:** body text renders in neutral Carbon colors in every mode
    (near-white on dark, near-black on light/paper) — never in the main color; the
    main color (or its contrast-safe derivatives) appears only on emphasis and
    visual-appeal elements: links, bold, headings, inline code, buttons,
    active/selected states, selection highlight; `docs/design/color-system.md` §2/§6
    and `docs/design/ui-sketch.md` record the decision.

### Typography & icons

- [x] **FONT-001** — IBM Plex font loading
  - **Category:** Typography · **Deps:** —
  - **Acceptance criteria:** Plex Sans/Serif/Mono load via stylesheet `<link>`s injected
    into `<head>` from the VitePress config; fallback stacks defined; no npm font
    packages.

- [x] **FONT-002** — Icon systems: Font Awesome + Nerd Font
  - **Category:** Typography · **Deps:** —
  - **Acceptance criteria:** Font Awesome `all.css` and a symbols-only Nerd Font
    stylesheet injected into `<head>` from the VitePress config; both render; Nerd Font
    use restricted to TUI chrome per `docs/design/typography-and-icons.md` §2; no npm
    icon packages.

- [x] **FONT-003** — Reliable Nerd Font readiness
  - **Category:** Typography · **Deps:** FONT-002
  - **Acceptance criteria:** the runtime Nerd Font gate waits until the external
    symbols stylesheet has had an opportunity to register its face before checking
    the CSS Font Loading API; a temporarily early check cannot permanently leave
    explorer/callout icons in fallback mode; failed font loads still preserve the
    tofu-safe fallback; the behavior is covered by repeated rendered-surface checks.
    *Landed 2026-07-10: `useNerdFont()` waits for the Nerd Font stylesheet's
    load/error lifecycle before calling `document.fonts.ready/load`, preventing
    an early empty-face result from becoming permanent; repeated browser loads
    show explorer icons consistently and a blocked stylesheet retains the
    fallback glyphs.*

- [x] **FONT-004** — jsDelivr Nerd Font stylesheet
  - **Category:** Typography · **Deps:** FONT-003
  - **Acceptance criteria:** the theme loads the generated Nerd Font stylesheet
    from jsDelivr's GitHub mirror of `ryanoasis/nerd-fonts` at the latest
    `master` revision; runtime stylesheet detection matches the new URL; the
    documented family and fallback behavior remain unchanged; the generated
    stylesheet's legacy missing font path is paired with a working jsDelivr
    Symbols font face so the icons still render.
    *Landed 2026-07-10: the generated CSS now loads from jsDelivr's `master`
    branch, and `_fonts.scss` supplies a valid jsDelivr Symbols font face under
    the theme alias used by the CSS gate and TUI tokens; repeated browser loads
    show explorer icons consistently.*

### Markdown

- [x] **MD-001** — markdown-it plugin suite
  - **Category:** Markdown · **Deps:** —
  - **Acceptance criteria:** the following plugins are wired into the VitePress
    markdown config and render correctly: markdown-it-emoji, markdown-it-sub,
    markdown-it-sup, markdown-it-ins, markdown-it-mark, markdown-it-footnote,
    markdown-it-deflist, markdown-it-abbr, markdown-it-container, and
    markdown-it-mathjax3 (math formulas); a sample-usage demo file exercises every
    plugin. (Plugin packages are regular devDependencies — the no-npm rule covers only
    fonts/icons.)

- [x] **MD-002** — Callouts (admonition containers)
  - **Category:** Markdown · **Deps:** MD-001, STYLE-001
  - **Acceptance criteria:** custom containers render minimal left-bar callouts
    (revised 2026-07-09: a colored bar on the left with an accent-colored title —
    no background fill, no frame/outline): `info`, `note` (alias of `info`), `tip`,
    `warning`, `danger`, `caution` (alias of `danger`), `important`, and `details`
    (collapsible, with an animated expand/collapse chevron); semantic colors from
    the Carbon layer; default titles localized; custom titles supported.

- [x] **MD-003** — Nerd Font icons in callouts
  - **Category:** Markdown · **Deps:** FONT-002, MD-002
  - **Acceptance criteria:** callout title lines gain a per-type Nerd Font glyph,
    and the details chevron's placeholder unicode `❯` is replaced by a Nerd Font
    chevron (keeping the expand/collapse rotation animation); glyphs render from
    the FONT-002 symbols-only Nerd Font stylesheet with a safe fallback when it
    fails to load; `docs/design/typography-and-icons.md` §2 is updated first to
    extend the Nerd Font scope to callout chrome (currently tool bar / status bar /
    explorer only).

### i18n

- [x] **I18N-001** — Locale system scaffolding
  - **Category:** i18n · **Deps:** CONF-001
  - **Acceptance criteria:** all theme UI strings resolve through a locale layer
    integrated with VitePress `locales`; English defaults built in; adding a locale
    requires no component edits. The theme also ships with Chinese (Simplified) locale.

- [x] **I18N-002** — Temporary language switcher (placeholder shell)
  - **Category:** i18n · **Deps:** I18N-001
  - **Acceptance criteria:** the demo site configures VitePress `locales` (root
    `en-US` + `zh` with `lang: zh-CN`); the placeholder shell shows a language
    switcher when two or more locales are configured (hidden otherwise), with labels
    taken from the locale config and a localized `aria-label`; switching navigates to
    the equivalent path under the target locale (best effort — untranslated pages may
    404, as in the default theme); the built `/zh/` page renders the built-in zh-CN
    theme strings. Temporary: retired when the permanent switcher lands in the status
    bar (THEME-001, design-language.md §4) and settings panel (THEME-007).
    *Retired 2026-07-09: THEME-001's status-bar language switcher replaced it.*

- [x] **I18N-003** — URL-free language switching (rework of I18N-001/002 integration)
  - **Category:** i18n · **Deps:** I18N-001, I18N-002
  - **Acceptance criteria:** no `/<lang>/` URL segment anywhere — the VitePress
    `locales` trees and `src/zh/` are removed; the UI language is a client-side
    preference persisted in `localStorage` (`ct-lang`), defaulting to the site `lang`;
    switching updates theme strings in place (and `<html lang>`) with no navigation;
    `themeConfig.localeStrings` becomes a per-language map (`{ [tag]: partial table }`)
    so config can override or add whole languages; locale tables self-describe via a
    `lang.label` key; the temporary switcher operates on this mechanism; documented in
    design-language.md §9.

- [x] **I18N-004** — Localizable site/config text
  - **Category:** i18n · **Deps:** I18N-003
  - **Acceptance criteria:** a `LocalizableText` type (`string | { [tag]: string }`)
    with a resolver (exact tag → primary subtag → `en` → first entry) is the
    documented pattern for every user-facing text value in the config surface;
    `themeConfig.title`/`.description` accept it, falling back to the site config's
    `title`/`description` when unset; the shell and home placeholder render the
    localized values, and `document.title` + `meta[name=description]` follow the
    active language client-side (best effort — SSR head keeps the site-config
    defaults); the demo config exercises a per-language description; the misplaced
    top-level `localeStrings` is moved into `themeConfig`; recorded in
    design-language.md §9.

- [x] **I18N-005** — Canonical locale tags (`zh-CN` → `zh-Hans`, `en-US` → `en`)
  - **Category:** i18n · **Deps:** I18N-004
  - **Acceptance criteria:** built-in locale tags follow one rule — the minimal
    canonical BCP 47 tag: language subtag plus script subtag only where the script
    disambiguates (`zh-Hans`), never a region subtag (English's suppressed script
    makes it bare `en`); the Chinese table file, export, and registry key are renamed
    to `zh-Hans`; the demo site `lang` and per-language config maps use `en` /
    `zh-Hans`; region-tagged inputs (`zh-CN`, `en-US`) still resolve to the right
    table via the existing primary-subtag matching; docs and examples updated.

- [x] **I18N-006** — Localized auto-explorer titles
  - **Category:** i18n · **Deps:** THEME-012
  - **Acceptance criteria:** auto-discovered labels resolve `LocalizableText`
    from source-local JSON metadata first, then a page's frontmatter title
    metadata; plain VitePress string titles remain valid; resolution follows
    the existing exact-tag → primary-subtag → English → first-entry fallback,
    and no component contains hardcoded page labels.
    *Landed 2026-07-10: adjacent `explorer.json` metadata supplies folder
    overrides; localized `title` frontmatter is read from VitePress
    `__pageData`, and `ExplorerTree` resolves every generated label through
    the existing language resolver.*

### Theme components

- [x] **THEME-001** — Layout shell: tool bar · viewport · status bar
  - **Category:** Theme · **Deps:** STYLE-001, FONT-001, FONT-002, I18N-001
  - **Acceptance criteria:** top tool bar, content viewport, and bottom status bar per
    `docs/design/design-language.md` §4–5 (rounded, floating finish); no third-party
    branding; all strings localized; major sections commented; styles in dedicated SCSS
    files.

- [x] **THEME-002** — File-explorer navigation sidebar
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** tree-style navigation of site content with TUI look;
    retractable/extendable on desktop via an explicit control, with collapsible tree
    nodes; contents easily configured via `themeConfig`; behaves as an off-canvas
    drawer on mobile; not rendered at all in paper mode.
    *Landed 2026-07-10: `themeConfig.explorer` tree (`{ text, link?, items? }`,
    LocalizableText labels); `Explorer.vue` + recursive
    `ExplorerTree.vue` in a new `.ct-main` shell row beside the viewport;
    tool-bar `[=]` toggle — desktop retract persisted as `ct-explorer`,
    ≤640px an off-canvas drawer with backdrop / close button / Esc /
    navigation dismissal; active page accent-highlighted; chevron & file
    glyphs Nerd-Font-gated; not rendered at all in paper mode or when
    unconfigured; styles in `styles/_explorer.scss`, state in
    `composables/useExplorer.ts`; spec note in design-language.md §4.*

- [ ] **THEME-003** — Floating-window utilities (search / command palette)
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** floating panel component for search, command center, or other
    utilities; TUI-window look with rounded/floating finish; a single instance of (this type
    of) component is shared across all utilities; the component is hidden by default and can
    be opened programmatically; the component is dismissible via an explicit close control,
    clicking outside, or pressing `Esc`; presents as a full/near-full-screen sheet on mobile.
    This task only includes the implementation of the floating-window visual component
    and its interative behavior. Add a demo page that can be opened via `~` keyboard and
    a button in the tool bar. No actual logic needed behind the demo.

- [x] **THEME-012** — Auto-discovered source file explorer
  - **Category:** Theme · **Deps:** THEME-011
  - **Acceptance criteria:** when enabled, the explorer discovers every Markdown
    page under `src/` without a hand-written tree;
    nested directories become folders, `index.md` becomes the folder link,
    standalone Markdown files become leaves, ordering is deterministic, and
    explicit `themeConfig.explorer` trees remain supported for backwards
    compatibility; the generated tree is available during SSR and client
    navigation and includes newly added source files after a rebuild.
    *Landed 2026-07-10: `explorer: "auto"` uses an eager Vite glob of
    `src/**/*.md` metadata, builds deterministic folder/file nodes with
    `index.md` links, and feeds the resolved tree through `useExplorer()` for
    SSR and hydration; explicit arrays remain unchanged.*

- [x] **THEME-013** — Source-local JSON explorer metadata
  - **Category:** Theme · **Deps:** THEME-012, I18N-006
  - **Acceptance criteria:** an adjacent `explorer.json` can configure an
    auto-discovered folder without adding a Markdown index or editing the
    VitePress site config; its localized `title` applies to that folder;
    removing `advanced-2/index.md` leaves
    `advanced-2/deep-dive.md` discoverable as a non-linked folder child; the
    JSON schema and example are documented.
    *Landed 2026-07-10: `useExplorer()` eagerly loads adjacent
    `explorer.json` metadata, the demo `advanced-2` index was removed, and the
    source/docs/config surfaces now describe the non-site-config contract;
    build and browser checks confirm the localized, index-less folder.*

- [x] **THEME-014** — Route-aware transient explorer expansion
  - **Category:** Theme · **Deps:** THEME-011, THEME-012
  - **Acceptance criteria:** when the active page is a folder index or a
    descendant leaf, every required ancestor folder is visibly expanded;
    route-driven expansion is not written to `ct-explorer-nodes` and is
    recalculated after navigation; explicit user toggles still use the existing
    persisted behavior and can override the temporary route reveal for the
    current page.
    *Landed 2026-07-10: active-link ancestry is derived recursively in
    `ExplorerTree`; route reveals and folder-index link navigation are not
    stored, navigation clears temporary overrides, and user chevron toggles
    remain persisted and can close a route-open folder for the current view.*

- [x] **THEME-015** — Remove explicit folder collapsed configuration
  - **Category:** Theme · **Deps:** THEME-014, THEME-013
  - **Acceptance criteria:** `collapsed` is removed from
    `TerminalExplorerItem`, source-local explorer JSON, and all folder
    resolution logic; folder expansion uses only depth defaults, transient
    active-route reveals, and persisted user toggles; the `advanced-2` demo,
    user guide, design specification, context cache, and task descriptions no
    longer document an explicit collapsed option.
    *Landed 2026-07-10: removed the field from the explorer item and JSON
    contracts, switched default expansion to depth only, updated documentation
    and cache entries, and verified build plus depth-based and route-aware
    browser behavior.*

- [x] **THEME-004** — Footer component
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
    *Landed 2026-07-10: `SiteFooter.vue` inside `.ct-viewport` after `.ct-content`
    (viewport is now a flex column so the footer pins to the panel bottom on short
    pages); `themeConfig.footer = { rss?, social? }`; localized `{year}/{author}` +
    `{vitepress}/{theme}` placeholder strings; desktop-lighter attribution tone
    derived via `color-mix`; styles in `styles/_footer.scss`; RSS renders as an
    orange icon + "RSS" wordmark (`--ct-rss` over Carbon orange) with the license
    glyphs as one tight cluster; implemented note in design-language.md §4.*

- [ ] **THEME-005** — Tool bar configurability & extras
  - **Category:** Theme · **Deps:** THEME-001, CONF-001
  - **Acceptance criteria:** navigation entries are easy to configure via
    `themeConfig`; the color-mode (theme) switcher lives in the tool bar
    (landed early via THEME-010); an
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

- [x] **THEME-008** — Fixed shell frame: viewport-contained scrolling (THEME-001 fix)
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** the shell is a fixed full-height frame — the tool
    bar, the status bar, and the viewport panel's rounded frame never scroll;
    article content scrolls **inside** `.ct-viewport` and clips at its edges,
    never showing through the gaps between panels; reading progress tracks the
    panel scroll; navigating resets the panel to the top, and URL-hash /
    in-page anchor links scroll to their target inside the panel; printing
    still outputs the full article (the frame releases its fixed height);
    decision recorded in design-language.md §5.

- [x] **THEME-009** — Status bar: back-to-top button
  - **Category:** Theme · **Deps:** THEME-001, THEME-008
  - **Acceptance criteria:** an icon-only button (Font Awesome, general-icon
    context per `docs/design/typography-and-icons.md` §2) in the status bar's
    right segment cluster smooth-scrolls the viewport panel back to the top;
    accessible name/tooltip localized (`status.backToTop`); styled in the
    status bar's dedicated SCSS; remains available in the reduced mobile
    segment set; recorded in `design-language.md` §4 (status bar role).

- [x] **THEME-010** — Status bar polish & tool-bar mode switcher (rework)
  - **Category:** Theme · **Deps:** THEME-001, THEME-009
  - **Acceptance criteria:** thin visual separators divide the top-level
    segments of both status-bar clusters; the reading-progress % and the
    back-to-top button form one tight sub-cluster with no divider between
    them; the status bar's color-mode element becomes a non-interactive
    indicator; an icon-only color-mode cycle button lives in the tool bar's
    right action area (its permanent home per THEME-005), localized;
    `design-language.md` §4 table rows updated for both bars.

- [x] **THEME-011** — Explorer rework: NeoVim-style file browser
  - **Category:** Theme · **Deps:** THEME-002
  - **Acceptance criteria:** explorer rows render in the NeoVim file-browser
    idiom — chevron plus Nerd Font folder (closed/open) and file glyphs, gated
    behind the font-loaded flag with the plain `❯`/`-` fallback; default
    expansion is depth-based: first-layer folders open, deeper folders
    collapsed; every folder's
    expanded state is remembered (persisted and restored across reloads); a
    folder node that carries a `link` (its index page) navigates there **and**
    expands on label click, while its chevron only toggles; demo pages exercise
    all of it (a `guide/` section with an index page, a child page, and a
    nested folder with its own index) and the demo explorer config covers them;
    documented in design-language.md §4.
    *Landed 2026-07-10: icon column (`nf-fa-folder`/`folder_open`/`file_o`)
    NF-gated with the plain-marker fallback; per-folder state store in
    `useExplorer` persisted as `ct-explorer-nodes` (keyed by raw config-text
    path, stable across language switches), precedence stored > depth default;
    folder-link label navigation expands transiently (never
    persists), while the chevron remains the remembered user toggle; demo pages
    `src/guide/{index,getting-started,advanced/index,
    advanced/deep-dive}.md` + demo tree in config.mts; verified headless
    25/25.*

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

- [ ] **SEARCH-002** — Find palette (floating window)
  - **Category:** Search · **Deps:** SEARCH-001, THEME-003
  - **Acceptance criteria:** a floating-window find palette with a text input and
    a list of results; keyboard shortcut `/` to open and `Esc` to dismiss; presents
    as a full/near-full-screen sheet on mobile; the palette's search is wired to the
    site's Algolia DocSearch index (SEARCH-001) and returns results with titles,
    snippets, and links; strings localized; styles in dedicated SCSS. Also remove the
    included floating-window demo (THEME-003) when this lands.

### Responsive

- [ ] **MOBILE-001** — Mobile adaptation pass
  - **Category:** Responsive · **Deps:** all THEME-*, COMP-*, PAGE-*, POST-* tasks
  - **Acceptance criteria:** no horizontal overflow at 360 px; drawer/condensed/reduced
    behaviors per `docs/design/design-language.md` §8 verified on real viewport sizes;
    touch targets ≥ 44 px.
