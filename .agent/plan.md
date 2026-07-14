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

- [x] **CONF-003** — Configurable normalized site name
  - **Category:** Configuration · **Deps:** CONF-001, COMP-001
  - **Acceptance criteria:** `themeConfig.siteName` can override the shell prompt
    host used by `Card.vue`; an unset or blank value falls back to the automatically
    normalized active site title; the resolved config, demo configuration, and card
    prompt behavior remain type-safe and documented.
    *Landed 2026-07-13: `siteName` is resolved as a trimmed shell-host override;
    `Card.vue` normalizes it for the prompt and falls back to the active site title
    when unset. The config example and card/design docs describe the option;
    build and rendered browser checks cover both paths.*

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

- [x] **STYLE-004** — Code block cards
  - **Category:** Styling · **Deps:** STYLE-003, I18N-001, COMP-001
  - **Acceptance criteria:** code blocks render as card-style floating windows in the
    card component's visual language (`docs/design/ui-sketch.md` §6, code block
    variant): a **title bar** — not a shell-prompt decoration — shows the file name
    (when given) and the language name and holds a COPY button; highlighting stays
    Shiki-powered with the STYLE-003 palettes; labels localized; styles in dedicated
    SCSS.
    *Landed 2026-07-12: a markdown-it fence wrapper (`theme/markdown/codeblock.ts`)
    wraps VitePress's Shiki output in a `.ct-code` card headed by a
    `.ct-code__titlebar` (file name · language · text `[copy]` control); the file
    name comes from an info-string `[name]` bracket (VitePress's `[title]`
    convention, read before VitePress strips it). Highlighting is untouched inside
    the card. The COPY label is emitted in the build language, tagged
    `data-ct-code-copy-label`, and re-localized by `useCodeCopy()` (called from
    Layout), which also copies the source and flashes a localized "Copied"; styles
    in `styles/_code.scss`; demo `[main.scss]` block in `markdown-examples.md`.
    Verified headless.*

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

- [x] **I18N-007** — Localized page content (`::: lang` blocks)
  - **Category:** i18n · **Deps:** I18N-003, MD-001
  - **Acceptance criteria:** an author can supply per-language versions of a
    page's body — the rendered content switches with the client-side UI
    language (`ct-lang`), no URL change, exactly like the localized `title`
    frontmatter drives the explorer label; a `::: lang <tag>` markdown
    container wraps each language's content, content left **outside** any
    `::: lang` block always shows, and the active block is chosen by the
    theme's standard fallback (exact tag → primary subtag → site default →
    first block); the site-default block is server-rendered visible (no flash,
    correct with JS off); `deep-dive.md` demonstrates it (English + Simplified
    Chinese bodies); recorded in `design-language.md` §9 and the user guide.
    *Landed 2026-07-12: `theme/markdown/localized-content.ts` registers the
    `::: lang <tag>` container → `<div class="ct-lang" data-ct-lang="tag">`
    (non-default-language blocks emitted `hidden` for a flash-free, JS-off-safe
    SSR); `useLocalizedContent()` (called once from Layout) groups adjacent
    `.ct-lang` siblings and reveals one per group via the shared fallback on
    mount / content update / language switch; `.ct-lang` is layout-neutral
    (`display: contents`) in `_content.scss`; `deep-dive.md` ships en +
    zh-Hans bodies; documented in design-language.md §9 and
    guide/getting-started.md. Verified headless.*

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

- [x] **THEME-003** — Floating-window utilities (search / command palette)
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** floating panel component for search, command center, or other
    utilities; TUI-window look with rounded/floating finish; a single instance of (this type
    of) component is shared across all utilities; the component is hidden by default and can
    be opened programmatically; the component is dismissible via an explicit close control,
    clicking outside, or pressing `Esc`; presents as a full/near-full-screen sheet on mobile.
    This task only includes the implementation of the floating-window visual component
    and its interative behavior. Add a demo page that can be opened via `~` keyboard and
    a button in the tool bar. No actual logic needed behind the demo.
    *Landed 2026-07-12: shared `FloatingWindow.vue` instance rendered once from
    the layout, driven by the `useFloatingWindow()` singleton with
    `{ id, title(), component }` utility payloads (opening replaces the current
    utility, so at most one window exists); `role="dialog"` panel with focus
    moved in on open / restored on close, dismissed via title-bar close button,
    backdrop click, or `Esc`; ≤640px it becomes a near-full-screen sheet;
    styles in `styles/_window.scss` (z-40/50, above the explorer drawer; hidden
    in print). Temporary logic-free demo (`WindowDemo.vue` + `useWindowDemo`)
    opens via the `~` shortcut — ignored inside inputs/editable regions — and a
    tool-bar button; demo strings/button/wiring retire with SEARCH-002.
    Verified headless 18/18 incl. zh-Hans localization and modal backdrop
    blocking.*

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

- [x] **THEME-005** — Tool bar configurability & extras
  - **Category:** Theme · **Deps:** THEME-001, CONF-001
  - **Acceptance criteria:** navigation entries are easy to configure via
    `themeConfig`; the color-mode (theme) switcher lives in the tool bar
    (landed early via THEME-010); an
    extensible icon-slot mechanism lets extra feature icons (e.g. search trigger,
    important social links) be added from configuration without component edits.
    *Landed 2026-07-13: `themeConfig.toolbar = { nav?, actions? }` (config.ts —
    `TerminalNavItem` `{ text: LocalizableText, link }` + `TerminalToolbarAction`
    `{ icon, link, label? }`, both defaulting to `[]`). `ToolBar.vue` renders the
    `nav` tabs after the built-in `~/home` tab (localized labels, active when the
    link maps to the current page via the shared `linkRelativePath()`, external =
    `_blank`) and the `actions` as extra Font Awesome icon anchors **before** the
    built-in search + color-mode controls (which stay anchored at the right edge).
    The active-matcher/external-link helpers were extracted to
    `utils/pagePath.ts` (`isExternalLink`/`linkRelativePath`) and shared with
    `ExplorerTree.vue`. Demo config adds a `guide` tab + a GitHub action icon;
    documented in design-language.md §4 (tool bar note) and ui-sketch.md §1.
    Verified headless 11/11 (nav/action render, active state on navigation,
    zh-Hans tab localization, external target, no underline) + explorer
    regression.*

- [x] **THEME-006** — Fully-custom section above the footer
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** a section directly above the footer whose entire content
    is rendered from a user-supplied Vue file; renders nothing when the user provides
    none; the wiring mechanism is documented.
    *Landed 2026-07-12: the footer is wrapped in `.ct-footer-region` (Layout.vue),
    which owns the **full separator** (edge-to-edge `--ct-border` `border-top`, before
    the entire footer section) and pins the region to the viewport bottom. The custom
    section is the named `pre-footer` Vue **layout slot** — a user supplies it by
    extending the theme with a wrapper Layout that fills `#pre-footer` (`Layout` is now
    exported from `theme/index.ts`); unfilled it renders nothing. When filled, Layout
    passes `divided` to `SiteFooter`, adding the **subtler inner separator**
    (`.ct-footer--divided`: a `--ct-border` pseudo-element rule **inset** by the
    footer's horizontal padding so it does not reach the panel edges — matching the
    search window's hint rule) between the custom section and the standard footer.
    Documented in design-language.md §4 and ui-sketch.md §5. Verified
    headless: default = region + full separator only (no `.ct-prefooter`, footer not
    `--divided`); filled = `.ct-prefooter` + `.ct-footer--divided`, with the inner
    `::before` rule inset 24px (1.5rem) on each side while the region full separator
    spans edge to edge. A temporary demo ships the pattern: `DemoLayout.vue` (the demo site's
    registered Layout) fills `#pre-footer` with `PreFooterDemo.vue` — a Nerd-Font logo
    glyph + localized theme name on the left, and a Font Awesome icon, a Nerd Font icon,
    and a localized `footer.demoCustom` label on the right; styles in
    `styles/_prefooter-demo.scss`. Verified headless: renders in the slot, left/right
    split, accent glyphs with NF gating + fallback, label/name re-localize on switch.*

- [x] **THEME-007** — Settings panel (floating window)
  - **Category:** Theme · **Deps:** THEME-001, CONF-001, I18N-001, FONT-001
  - **Acceptance criteria:** a hovering TUI-window settings panel **without** shell
    prompt; the first version only offers font configuration and language switching;
    choices persisted; full/near-full-screen sheet on mobile; strings localized.
    *Landed 2026-07-12: `useSettings()` opens a prompt-less two-pane utility in the
    shared floating window from the tool-bar gear — a **Fonts** pane (content font
    family Default/Sans/Serif/Mono + size Small/Medium/Large, `SettingsFonts.vue`)
    and a **Language** pane (in-place UI-language switch, `SettingsLanguage.vue`).
    Font preferences persist in `localStorage` (`ct-font-family`/`ct-font-size`),
    restored pre-paint onto `<html data-ct-font-*>` by the head script (no flash),
    and mapped in `styles/_settings.scss` to `--ct-content-font`/`-font-size` on
    `.ct-content`; state in `composables/useFontSettings.ts`. Mobile = the window's
    near-full-screen sheet; all strings localized. Verified headless 25/25 with
    STYLE-004.*

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

- [x] **THEME-016** — Floating-window title-bar icons
  - **Category:** Theme · **Deps:** THEME-003
  - **Acceptance criteria:** a utility opened in the shared floating window can
    supply an optional icon (Font Awesome classes, general-icon context per
    `docs/design/typography-and-icons.md` §2) rendered in the title bar before
    the title; utilities without an icon render exactly as before; the icon is
    decorative (hidden from assistive tech — the dialog keeps its text label);
    the demo utility exercises it; documented in the THEME-003 notes in
    `design-language.md` §4; styles stay in `styles/_window.scss`.
    *Landed 2026-07-12: optional `icon` on `FloatingWindowUtility`, rendered
    in `FloatingWindow.vue` as an `aria-hidden` accent glyph inside
    `.ct-window__title`; `.ct-window__icon` styles in `_window.scss`; the
    demo passes `fa-solid fa-window-restore` (matching its tool-bar trigger).
    Verified headless 5/5 — glyph drawn from the FA face, dialog label stays
    the text title.*

- [x] **THEME-017** — TUI window chrome rework: border titles, panes, text controls
  - **Category:** Theme · **Deps:** THEME-003, THEME-016
  - **Acceptance criteria:** the floating window renders in the Unicode-frame TUI
    idiom — a utility is composed of one or more **panes**, each its own bordered
    box whose title (with the optional THEME-016 icon) sits **on the top border
    line** (text-over-border, like the sketch frames); panes stack with the
    floating gap and carry separate titles and content components, so a utility
    like the find palette can pair an input box with a results box; the close
    control renders text-based (`[x]` on the first pane's border) instead of an
    icon button; dismissal (close/backdrop/`Esc`), focus handling, and the mobile
    near-full-screen sheet are unchanged (on mobile the last pane grows to fill
    the sheet); the demo exercises two panes; documented in
    `design-language.md` §4 and `ui-sketch.md` §2.
    *Landed 2026-07-12: utility payload reworked to
    `{ id, label(), panes: [{ title(), icon?, component }] }`; the window
    container is an invisible flex stack (gap = `--ct-gap`) of framed pane
    `<section>`s; `.ct-window__pane-title` and the literal `[x]`
    `.ct-window__close` sit on the border via absolute positioning +
    `translateY(-50%)` with a surface backing masking the line; pane bodies
    are the scroll regions; demo split into WindowDemo (description) +
    WindowDemoHints (hints pane, new `window.demoHintsTitle` string).
    Verified headless 15/15 — border-centered captions, text `[x]`, 12px
    inter-pane gap, all dismissals, mobile sheet with the last pane filling.*

- [x] **THEME-018** — Search-shaped floating-window demo (`/`)
  - **Category:** Theme · **Deps:** THEME-003, THEME-016, THEME-017
  - **Acceptance criteria:** a second temporary demo utility, opened via the `/`
    keyboard shortcut (ignored while typing in inputs/editable regions, like
    `~`), renders the find-palette shape from `ui-sketch.md` §2 — two panes: a
    **search input** pane (static field with a prompt glyph and a magnifier
    border-title icon) over a **results** pane (illustrative static rows plus a
    keyboard hint row); it shares the one floating-window instance (opening it
    replaces the window demo and vice versa); all labels localized (result
    paths are literal identifiers, like the shell prompt); documented in the
    THEME-003 notes in `design-language.md` §4 and `ui-sketch.md` §2; retired
    with the rest of the demo when the find palette lands (SEARCH-002).
    *Landed 2026-07-12: `useSearchDemo()` opens a two-pane utility — `SearchDemo.vue`
    (static `<input type=search>` + `>` prompt, magnifier border-title icon) over
    `SearchDemoResults.vue` (three localized-label/literal-path rows + hint row);
    `/` bound via a shared `useKeyShortcut()` helper in `useWindowDemo.ts`
    (`useWindowDemoShortcut` → `useWindowDemoShortcuts`, now binding `~` and `/`);
    9 new `window.search*` strings; styles in the temporary block of
    `_window.scss`. Verified headless 16/16 — `/` open + input guard, two panes,
    single-instance swap with the `~` demo, zh-Hans localization, mobile sheet.*

- [x] **THEME-019** — Status bar: live state chip, blinking cursor, clock, settings gear
  - **Category:** Theme · **Deps:** THEME-001, THEME-007, THEME-009, THEME-010
  - **Acceptance criteria:** the left mode chip reflects the real page state —
    `HOME` on the home page, `404` on the not-found page, `READ` on a regular
    article (labels localized, with a per-state modifier class so `404` can take
    the error tint); a blinking block cursor trails the current location (a hard
    steps blink, disabled under `prefers-reduced-motion`); a live `HH:MM:SS`
    clock sits at the right end of the status bar, client-only and SSR-safe
    (empty until mounted, interval cleared on unmount); the settings gear moves
    out of the tool bar into the status bar's right controls (`useSettings` →
    `openSettings`); all strings localized; on mobile the path/cursor/clock are
    hidden while the settings control stays reachable; recorded in
    `design-language.md` §4 (status bar row + note) and `ui-sketch.md` §1.
    *Landed 2026-07-12: `StatusBar.vue` computes a `state` from
    `page.isNotFound` / `frontmatter.home` (→ `status.notFound`/`.home`/`.read`,
    localized) driving `.ct-statusbar__chip--{notfound,home,read}` (404 = error
    tint). The location now sits in a `.ct-statusbar__path` wrapper (single
    divided segment) trailed by `.ct-statusbar__cursor` — a main-color
    underscore bar (baseline-aligned) with a hard `ct-cursor-blink` steps
    animation, held steady under `prefers-reduced-motion`. New `composables/useClock.ts` (SSR-safe, empty
    until mounted, interval cleared on unmount) feeds a `v-if`-gated
    `.ct-statusbar__clock` (`HH:MM:SS`, tabular-nums) at the far right. The
    settings gear moved from `ToolBar.vue` into the status bar's right controls
    (`useSettings` → `openSettings`). Mobile hides `.ct-statusbar__path` +
    `.ct-statusbar__clock`, keeps the gear. New strings
    `status.home/.notFound/.clock` (en + zh-Hans). Verified headless 20/20.*

### Components

- [x] **COMP-001** — Card component: TUI floating window + shell-prompt decoration
  - **Category:** Components · **Deps:** STYLE-001, FONT-001, FONT-002, CONF-002
  - **Acceptance criteria:** a reusable card styled as a TUI floating window
    (Unicode-frame flavor, rounded/floating finish) per
    `docs/design/design-language.md` §4 (cards) and `docs/design/ui-sketch.md` §6; an
    optional shell-prompt decoration line (`user@host:path$ command args`) is
    enabled explicitly with `showPrompt`; `prompt` supplies the required command
    and optional host/path/args, `user` is the normalized author username from
    CONF-002, `host` defaults to the shell-normalized active site title, and `path`
    defaults to the current page's home-relative location; all prompt values remain
    overridable; prompt segments use mode-aware Oxocarbon role tokens; serves as
    the base for the license card, comment card, and page cards/grids.
    *Landed 2026-07-10: `theme/components/Card.vue` accepts `showPrompt` plus a
    typed `prompt` object (`command`, optional `host`/`path`/`args`), derives the
    normalized prompt user from `useThemeConfig().author.username`, default host
    from the active site title, and default path from the current page; exports the
    reusable component; `styles/_card.scss` provides the responsive floating-window
    finish, softened shadow, and mode-aware Oxocarbon prompt coloring.*

- [x] **COMP-002** — Image containers: lightbox + Swiper
  - **Category:** Components · **Deps:** MD-001, STYLE-001
  - **Acceptance criteria:** content images gain enlarge-on-click, and all images on a
    page can be browsed as slides (Fancybox); a `:::: swiper` container with nested
    `::: swiper-slide-no-shadow` blocks renders images as SwiperJS slides with the
    cards effect (cards stacked on top of each other), supporting exactly the block
    syntax documented in the requirement.
    *Landed 2026-07-13: `useLightbox()` marks every `.ct-content img` (skipping
    linked / `data-no-lightbox` images) as one `ct-gallery` Fancybox group on
    mount/navigation — one delegated bind, re-bound on language switch with
    Fancybox's own shipped l10n tables mapped from the theme tags (`en`,
    `zh-Hans` → `zh_CN`; the documented vendor-chrome exception to the locale
    rule). The `:::: swiper` / `::: swiper-slide-no-shadow` containers
    (`theme/markdown/swiper.ts`) emit inert `.ct-swiper.swiper` markup that
    `useSwipers()` upgrades to a cards-effect Swiper (`slideShadows: false`,
    stale instances destroyed after navigation); both libraries lazy-load
    client-side only. Vendor CSS + theme overrides in `styles/_lightbox.scss`
    / `_swiper.scss`; three palette SVGs in `src/public/images/`; demo section
    in `markdown-examples.md`. 2026-07-13 follow-up: prev/next arrow buttons
    (Navigation module wired to `<button>`s emitted by the container, TUI
    `❮`/`❯` text chevrons replacing the vendor SVG, ≥44px targets, localized
    `swiper.prev`/`swiper.next` labels re-applied on language switch) and
    native image dragging disabled on slides (`draggable=false` +
    `-webkit-user-drag: none`) so a real mouse drag slides the deck instead
    of starting a ghost-image drag; verified headless 14/14. Second follow-up
    same day: the arrows moved fully OUTSIDE the images — the container now
    emits a `.ct-swiper` flex row (prev button · `.ct-swiper__deck.swiper` ·
    next button, deck shrinking between them on mobile; vendor navigation CSS
    dropped) — and closing the lightbox no longer scrolls the article back to
    top: `useViewportScroll` (THEME-008) now resets the panel only when
    `page.relativePath` actually changed, since `onContentUpdated` also fires
    on same-page re-renders (dev-server zoom/fullscreen close paths reproduced
    it; in-place language switches keep their position too). Verified headless
    13/13 build + dev repro paths. **`@fancyapps/ui` pinned to v5** — the last
    GPLv3/commercial dual-licensed line (v6 is commercial-only); Swiper is
    MIT. Verified headless 16/16 + SPA-navigation regression.*

- [x] **COMP-003** — License card
  - **Category:** Components · **Deps:** THEME-001, COMP-001, CONF-002
  - **Acceptance criteria:** at the end of every article (posts and series), a card
    **with** shell-prompt decoration shows the configured license (default
    CC BY-NC-SA 4.0) and the article info — title, URL, publish date, author — with
    author and license sourced from CONF-002; strings localized.
    *Landed 2026-07-13: `ArticleLicense.vue` renders a `Card` (`showPrompt`,
    command `license`) at the end of every article — a page that is not the home
    or 404 page and not opted out via `article: false`/`license: false`
    frontmatter. It shows the article title (linked to its permalink), a labeled
    meta list (author · localized publish date from frontmatter `date`, UTC-formatted
    to avoid an off-by-one · permalink, upgraded to the absolute URL on the
    client), and the license statement + CC brand icons — author & license from
    CONF-002 via `useThemeConfig()`, the statement's `{license}` linking to the
    deed (footer pattern). New `license.*` locale keys (en + zh-Hans); styles in
    `styles/_license.scss`. Wired in `Layout.vue` under the `isArticle` guard;
    `markdown-examples.md` gained a `date` to exercise the row. Verified headless.
    2026-07-13 follow-up: added a **last-updated** row (`license.updated`) beside
    the release date — an explicit frontmatter `updated`/`lastUpdated` wins, else
    VitePress's git `page.lastUpdated` (`lastUpdated: true` enabled in the site
    config) — and a decorative **CC watermark** shown only for Creative Commons
    licenses (`isCreativeCommons` = deed URL / CC icons); content lifted above it
    with `z-index`. Second follow-up: `formatDate` now accepts any frontmatter
    date shape (bare `YYYY-MM-DD`, full ISO datetime with offset, YAML `Date`,
    numeric timestamp) and formats in UTC (deterministic/SSR-safe, no off-by-one);
    the watermark became a mask-scaled `<span>` (top/bottom insets → height =
    card's native height, CC SVG `mask` + mode-tinted `background-color`, rotated
    CCW, right-cropped) so it fills the card without ever affecting its size.
    Verified headless (ISO datetime → "August 8, 2021"; watermark height = card
    height, square, rotated, doesn't change card height) + dark/light/mobile
    screenshots.*

- [x] **COMP-005** — Timezone-aware article dates
  - **Category:** Components · **Deps:** COMP-003
  - **Acceptance criteria:** explicit date offsets/Z values preserve their source
    instant; frontmatter date values without a timezone are interpreted as UTC;
    valid YAML `Date` objects and numeric timestamps remain instant-based; the
    license card formats release and updated dates in the reader's current
    timezone after hydration, while the SSR/initial-client render remains UTC
    to avoid hydration mismatch; dates that cross a timezone boundary show the
    corresponding local calendar day; the date behavior is documented and
    verified on the rendered site.
    *Landed 2026-07-13: `ArticleLicense.vue` normalizes unzoned ISO strings with
    an explicit UTC suffix, keeps offset-bearing strings/`Date` objects/numeric
    timestamps as instants, and switches the formatter from SSR-safe UTC to the
    browser's resolved timezone after mount. Verified with source-offset and
    quoted unzoned frontmatter pages across UTC−12, UTC, UTC−07, and UTC+14.*

- [x] **COMP-004** — Waline comments & counts
  - **Category:** Components · **Deps:** THEME-001, COMP-001, CONF-001
  - **Acceptance criteria:** a Waline-powered comment section renders at the end of
    every article (posts and series) inside a card **with** shell-prompt decoration;
    the Waline server is configured via `themeConfig`; a viewer count and a comment
    count appear in the article title section; strings localized.
    *Landed 2026-07-13: `themeConfig.comments.waline.serverURL` (config.ts —
    `TerminalCommentsConfig`/`TerminalWalineConfig`, resolved via
    `resolveComments()`: blank URL → `null` = unconfigured, `isCommentsConfigured()`
    helper). `ArticleComments.vue` renders a `Card` (`showPrompt`, command
    `comments`) holding the localized heading + a `.ct-comments__waline` mount
    point; `ArticleMeta.vue` renders the view + comment counters in the article's
    title section (above the content). `useWaline()` (called once from Layout)
    lazy-loads `@waline/client` client-side, mounts the widget (its own count
    displays off), fills the meta counters via `pageviewCount`/`commentCount`,
    re-mounts per navigation, and re-localizes the widget UI on a language switch
    (Waline locale tables mapped from theme tags — `zh-Hans` → `zh-CN`, else `en`;
    the vendor-chrome exception to §9). Dark theme tracks `data-ct-mode` via
    Waline's `dark` selector. Both card + counts render only on articles when
    configured (opt out with `comments: false`/`article: false`). New `comments.*`
    locale keys; styles in `styles/_comments.scss` (Waline CSS + accent reconcile +
    meta strip); `@waline/client` added as a devDependency. Verified headless
    (widget mounts `.wl-comment`/`.wl-panel`, counters + localization).*

### Architecture

- [ ] **ARCH-001** — Content architecture: `src/` layout & page-type components
  - **Category:** Architecture · **Deps:** THEME-001, I18N-001
  - **Acceptance criteria:** the `src/` directory follows the content architecture in
    [`docs/design/content-architecture.md`](../docs/design/content-architecture.md)
    (modeled on
    [`vitepress-theme-arch/src`](https://github.com/iXORTech/vitepress-theme-arch/tree/main/src)):
    normal/standalone pages (home `index.md`, `about`, `projects`, `friends`, and
    similar non-article pages) sit **directly in `src/`** with no `pages/` folder;
    regular posts live under `src/posts/`, series articles under
    `src/series/<series-name>/`, static assets under `src/public/`; the listing/route
    pages (`archives.md`, `categories.md`, `tags.md`, `series.md`, and the
    `categories/[name]`, `tags/[name]`, `page/[num]` dynamic routes) occupy their
    documented paths (their content/behavior lands in POST-001/POST-002). The theme
    `Layout` resolves every page to exactly one **page type** — home, normal page,
    post, series article, listing page, 404 — from its location under `src/` plus the
    frontmatter escape hatches (`article`/`license`/`comments: false`), and renders a
    dedicated Vue component per type (e.g. `pages/HomePage.vue`, `pages/NormalPage.vue`,
    `pages/PostPage.vue`, `pages/SeriesArticlePage.vue`, `pages/ListingPage.vue`,
    `pages/NotFoundPage.vue`) so each type's chrome is customizable independently, while
    the shared shell chrome still wraps them; the existing home placeholder and the
    inline `isArticle` branching in `Layout.vue` are folded into this page-type layer.
    Existing demo content keeps rendering (under the normal-page / post types), the
    explorer auto-discovery still works, and `pnpm build` succeeds. The convention is
    recorded in `docs/design/content-architecture.md` and linked from `docs/README.md`
    and `AGENTS.md`.

### Content & pages

- [ ] **POST-001** — Tags & categories
  - **Category:** Content · **Deps:** ARCH-001
  - **Acceptance criteria:** posts/articles declare tags and categories in their
    frontmatter; the listing pages defined by the content architecture
    (`archives.md`, `categories.md` + `categories/[name]`, `tags.md` + `tags/[name]`,
    *posts index*, optional `page/[num]` pagination, and related components — see
    [`docs/design/content-architecture.md`](../docs/design/content-architecture.md))
    list all tags and all categories and the posts under each; post metadata links to
    them; labels localized.

- [ ] **POST-002** — Posts & post series
  - **Category:** Content · **Deps:** ARCH-001, POST-001, CONF-001
  - **Acceptance criteria:** regular posts live in `src/posts`, series articles in
    `src/series/<series-name>` (per the ARCH-001 content architecture); each series
    folder carries a YAML configuration for its icon, title, and description, each with
    localized versions; series and the articles within a series sort by an `order`
    attribute (default 0, smaller = higher) falling back to alphabetical; `themeConfig`
    toggles control whether series posts are included in the general posts'
    archive/category/tag pages.

- [ ] **PAGE-001** — Home page
  - **Category:** Pages · **Deps:** ARCH-001, COMP-001
  - **Acceptance criteria:** a home page with basic personal-website welcome content
    presented in a card component that **does** carry the shell-prompt decoration;
    content configurable; strings localized; mobile-correct.

- [ ] **PAGE-002** — Projects page
  - **Category:** Pages · **Deps:** ARCH-001, COMP-001
  - **Acceptance criteria:** a page demonstrating all projects with grid/card
    components; cards may or may not carry the shell prompt — more featured content
    carries the extra decoration; data easy to configure; localized; grid adapts on
    mobile.

- [ ] **PAGE-003** — About Me page
  - **Category:** Pages · **Deps:** ARCH-001, COMP-001
  - **Acceptance criteria:** an About Me page organizing info with grid/card
    components; shell prompt used judiciously — more featured blocks carry the extra
    decoration; localized; mobile-correct.

- [ ] **PAGE-004** — Friends page (spec incoming)
  - **Category:** Pages · **Deps:** ARCH-001, COMP-001
  - **Acceptance criteria:** a page listing friends, fed by a formatted data source.
    **The data-source spec is still to be provided — do not start this task until the
    spec lands and this entry is updated.**

- [ ] **DEMO-001** — Markdown demo pages
  - **Category:** Content · **Deps:** STYLE-005, MD-001, MD-002
  - **Acceptance criteria:** demo files show markdown sources alongside their rendered
    results, covering standard markdown, the plugin suite (MD-001), and callouts
    (MD-002); reachable from the site navigation.

- [x] **DEMO-002** — Card component demo
  - **Category:** Content · **Deps:** COMP-001
  - **Acceptance criteria:** `src/markdown-examples.md` imports and renders the
    reusable card with a shell-prompt example, documents `showPrompt`, prompt
    defaults, and overrides, and shows that the prompt is optional; the rendered
    demo remains mobile-safe.
    *Landed 2026-07-10: the page imports `Card.vue` and shows defaulted,
    fully overridden, and prompt-free cards with source snippets and rendered
    output.*

### Search

- [x] **SEARCH-001** — Algolia DocSearch preparation
  - **Category:** Search · **Deps:** CONF-001
  - **Acceptance criteria:** `themeConfig` keys for DocSearch (appId, apiKey,
    indexName) exist and are documented; the integration point is stubbed so a site
    with credentials gets a working DocSearch entry (e.g. via the tool bar search
    icon); the relationship with the find palette (THEME-003) is decided and
    documented.
    *Landed 2026-07-12: `themeConfig.search.algolia`
    (`appId`/`apiKey`/`indexName`) added to `theme/config.ts` with
    `resolveSearch()` (a partial credential set resolves to `null` =
    unconfigured) and the `isSearchConfigured()` helper; documented in the
    config JSDoc, a commented example in `config.mts`, and design-language.md §4.
    **Decision:** the find palette (THEME-003 shared window) IS the search UI —
    it queries the Algolia index directly from the browser (no `@docsearch/*`
    dep, no DocSearch modal); the tool-bar magnifier action opens it, and an
    unconfigured site sees a localized notice.*

- [x] **SEARCH-002** — Find palette (floating window)
  - **Category:** Search · **Deps:** SEARCH-001, THEME-003
  - **Acceptance criteria:** a floating-window find palette with a text input and
    a list of results; keyboard shortcut `/` to open and `Esc` to dismiss; presents
    as a full/near-full-screen sheet on mobile; the palette's search is wired to the
    site's Algolia DocSearch index (SEARCH-001) and returns results with titles,
    snippets, and links; strings localized; styles in dedicated SCSS. Also remove the
    included floating-window demo (THEME-003) when this lands.
    *Landed 2026-07-12: `useSearch()` (module-singleton query/results/status/
    activeIndex + debounced, abortable Algolia fetch via `utils/algolia.ts`)
    opens a two-pane `search` utility in the shared window — `SearchPalette.vue`
    (auto-focused `>`-prompt field; `↑`/`↓` move, Enter opens) over
    `SearchResults.vue` (title · breadcrumb · snippet · link rows, real anchors;
    idle/loading/empty/error/unconfigured status; keyboard hint). `/` binds via
    `useSearchShortcut()` (input-guarded) and the tool-bar magnifier; `Esc`/
    backdrop dismiss; mobile last-pane-grows sheet. New `search.*` locale keys
    (en + zh-Hans); styles in `styles/_search.scss`. The THEME-003 demo — its
    four components, `useWindowDemo.ts`, the tool-bar button, the `~` shortcut,
    and the `window.demo*`/`window.search*` strings — is removed. Verified
    headless 16/16 (interactions, localization, mobile) + 11/11 (mocked-Algolia
    results, keyboard nav, navigation).*

### Responsive

- [ ] **MOBILE-001** — Mobile adaptation pass
  - **Category:** Responsive · **Deps:** all THEME-*, COMP-*, PAGE-*, POST-* tasks
  - **Acceptance criteria:** no horizontal overflow at 360 px; drawer/condensed/reduced
    behaviors per `docs/design/design-language.md` §8 verified on real viewport sizes;
    touch targets ≥ 44 px.
