# Context Cache

Brief per-file summaries of the repository — purpose plus the essentials, 1–3 lines
each. **Update whenever a file is added, meaningfully changed, or removed** (rule:
[`AGENTS.md`](../AGENTS.md) §5). Last updated: 2026-07-12 (SEARCH-001/002 find
palette — `themeConfig.search.algolia` DocSearch keys + `resolveSearch()`/
`isSearchConfigured()` (SEARCH-001; decision: the palette queries Algolia
directly and IS the search UI — no `@docsearch/*`, no DocSearch modal); the real
two-pane find palette (`useSearch` + `utils/algolia.ts` REST query,
`SearchPalette`/`SearchResults`, `_search.scss`) opens from the tool-bar
magnifier and `/`, replacing the retired THEME-003 demo (four components,
`useWindowDemo.ts`, button, `~` shortcut, `window.demo*`/`window.search*`
strings all removed); new `search.*` locale keys. 2026-07-13 follow-up: floating
window panes are `flex: 0 0 auto` with `:last-child` `flex: 1 1 auto` so the
results pane scrolls without shrinking/overlapping the search input box.
Earlier: I18N-007
localized page content — `::: lang <tag>` markdown container
(`theme/markdown/localized-content.ts`) → `<div class="ct-lang"
data-ct-lang>`; site-default block visible / rest `hidden` at build;
`useLocalizedContent()` reveals one block per adjacent-sibling group via the
shared fallback on mount/nav/language switch; `.ct-lang` is layout-neutral
(`display: contents`) in `_content.scss`; `deep-dive.md` ships en + zh-Hans
bodies; documented in design-language.md §9 + guide/getting-started.md. Earlier
same day: THEME-019 status-bar rework — live state chip (HOME/READ/404, `--notfound` error tint), blinking
`.ct-statusbar__cursor` block trailing the location (in a `.ct-statusbar__path`
wrapper, underscore style), a live `HH:MM:SS` clock (`useClock`, SSR-safe) at the far right, and
the settings gear moved out of the tool bar into the status bar; new
`status.home/.notFound/.clock` strings. Earlier same day: STYLE-004 code-block
cards — markdown fence wrapper `.ct-code` + title bar (file name · language ·
text `[copy]`), Shiki untouched, `[name]` info-string bracket, `useCodeCopy`
copy + label re-localization; THEME-007 settings panel — prompt-less two-pane
floating utility (Fonts family/size + Language) from the tool-bar gear, font
prefs persisted + restored pre-paint via `data-ct-font-*`, `useFontSettings`,
`--ct-content-font`/`-font-size`. Earlier same day: THEME-006 fully-custom
pre-footer section — `.ct-footer-region` wrapper with the edge-to-edge full
separator, the `pre-footer` layout slot, and a subtler inset inner separator
when the slot is filled; `Layout` now exported for wrapper use, plus a temporary
`DemoLayout`/`PreFooterDemo` example filling the slot; THEME-003 shared
floating utility window + temporary `~`/tool-bar demo; THEME-016 optional
title icons; THEME-017 TUI chrome rework — framed panes with border titles,
text-based `[✕]` close, two-pane demo; THEME-018 `/` search-shaped demo —
input + results panes). Earlier: 2026-07-10 (FIX-002 progressive
prompt overflow; FIX-001 argument spacing; COMP-001 Oxocarbon prompt styling and softer card
shadow; DEMO-002 override demo;
COMP-001 current-page prompt path default; DEMO-002 card demo; COMP-001 reusable card component; THEME-015 removal of
explicit folder collapsed configuration; THEME-014 transient route-aware
explorer expansion; FONT-003 reliable Nerd
Font readiness; THEME-013 source-local JSON folder metadata and index-less
advanced-2 explorer node; THEME-012/I18N-006
auto-discovered explorer pages with localized frontmatter labels;
THEME-011 nvim-style explorer rework: NF folder/file icons, depth defaults +
persisted node states, folder-index click, guide demo pages; earlier same day
THEME-002 file
explorer, THEME-004 in-viewport
footer). Earlier: 2026-07-09 (CONF-002 author &
license system; I18N-005 canonical
locale tags: zh-CN → zh-Hans, site lang en-US → en; THEME-001 TUI shell:
tool bar / viewport / status bar; THEME-008 fixed shell frame with
viewport-contained scrolling; THEME-009 back-to-top button; THEME-010 statusline
separators, mode indicator + tool-bar switcher; earlier same day:
FONT-002/004 icon systems and jsDelivr Nerd Font loading,
MD-003 nerd-font callout glyphs, STYLE-006 neutral body text, MD-001 plugin
suite, MD-002 callouts + left-bar revision; 2026-07-08: INFRA-001, CONF-001,
STYLE-001/002/003/005, FONT-001, I18N-001/002/003/004).

## Root

- `package.json` — pnpm project; devDeps: `vitepress 2.0.0-alpha.18`, `vue ^3.5.39`,
  `sass ^1.101.0` (INFRA-001), and the MD-001 markdown-it suite (emoji, sub, sup,
  ins, mark, footnote, deflist, abbr, container; mathjax3 pinned ^4 — v5 emits
  inline <style> per formula, which breaks Vue template compilation). Scripts
  `dev`/`build`/`preview` run vitepress on the project root (`srcDir` set in config).
- `pnpm-lock.yaml` — pnpm lockfile.
- `.gitignore` — node/logs/dist/editor ignores plus `.vitepress/dist` and
  `.vitepress/cache`; ignores `themeConfig.mjs` **except**
  `.vitepress/theme/assets/themeConfig.mjs` (reserved path from the upstream template).
- `AGENTS.md` — single source of agent instructions: session protocol, plan &
  context-cache rules, compliance code, engineering conventions (hard rules), repo map.
- `CLAUDE.md` — pure pointer to `AGENTS.md` (read by Claude Code). No content.

## .claude/

- `skills/verify/SKILL.md` — repo verification recipe for coding agents: build +
  `pnpm preview` (must be RESTARTED after each rebuild — sirv snapshots the
  asset list, so re-hashed assets 404), drive the rendered site headless
  (temp-dir playwright, system Chromium fallback), and the UI flows worth
  exercising (modes, language, shell chrome, mobile, print, Nerd Font gating).

## .github/

- `copilot-instructions.md` — pure pointer to `AGENTS.md` (read by GitHub Copilot). No
  content.

## .agent/

- `plan.md` — task board: tasks with `TYPE-###` IDs, categories, dependencies,
  acceptance criteria. DOC-001/003/005/006, INFRA-001, CONF-001/002,
  STYLE-001/002/003/005,
  FONT-001/002, I18N-001/002/003/004/005, MD-001/002/003, STYLE-006, DEMO-002,
  THEME-001/008/009/010 done (THEME-001 retired the I18N-002 temporary switcher;
  THEME-008 = fixed shell frame rework; THEME-009 = back-to-top button;
  THEME-010 = statusline separators + mode switcher moved to tool bar, which
  pre-satisfies that part of THEME-005; CONF-002 = author & license config layer —
  COMP-001/COMP-003 consume it for prompts and the license card; THEME-004 =
  in-viewport
  footer + THEME-002 = file-explorer sidebar + THEME-011 = nvim-style explorer
  rework, THEME-012 auto-discovered source explorer and I18N-006 localized
  labels done 2026-07-10; THEME-003 = shared floating utility window (+
  temporary demo, retired by SEARCH-002), THEME-016 = optional title icons,
  THEME-017 = TUI chrome rework (framed panes, border titles, text `[✕]`),
  and THEME-018 = `/` search-shaped input+results demo done 2026-07-12;
  THEME-006 = fully-custom `pre-footer` slot section with the full + inner
  footer separators done 2026-07-12; STYLE-004 = code-block cards (title bar +
  COPY) and THEME-007 = settings panel (fonts + language) done 2026-07-12;
  SEARCH-001 (Algolia DocSearch config keys + decision: the palette is the
  search UI) and SEARCH-002 (real find palette — input + results panes wired to
  Algolia, replacing the THEME-003 demo) done 2026-07-12.
  Roadmap:
  theme chrome
  (tool bar extras), components (Fancybox/Swiper images, license card,
  Waline comments),
  content (tags/categories, series), pages (home, projects, about,
  friends — spec TBD), demos, mobile pass. I18N-001 includes
  a shipped Chinese (Simplified) locale.
- `context-cache.md` — this file.

## docs/

- `README.md` — documentation index (design docs, process files) plus documentation
  rules; clarifies `docs/` is repo documentation, not site content.
- `design/design-language.md` — binding: identity, NeoVim/LazyVim-inspired TUI design
  language, hard no-branding rule, iconic components table (tool bar, status bar,
  explorer, floating windows), fixed shell frame — page never scrolls, content
  scrolls inside the viewport panel and clips at its edges (§5, THEME-008),
  file-explorer spec + THEME-002/011 implemented note (§4: `themeConfig.explorer`
  tree `{ text, link?, items? }`, folder `link` = its index page
  (label click navigates and route awareness expands transiently; chevron pure
  toggle); depth default =
  first layer open / deeper collapsed, toggles remembered in
  `ct-explorer-nodes`; NF chevron + folder/file icon row with plain-marker
  fallback; tool-bar `[=]` toggle,
  `ct-explorer` persistence, ≤640px drawer, paper mode = not rendered),
  auto-discovery from `src/**/*.md` via `themeConfig.explorer: "auto"` with
  optional source-local `explorer.json` folder metadata (THEME-012/013/I18N-006);
  active-route ancestor folders expand transiently without storage writes
  (THEME-014),
  floating-windows spec + THEME-003/016/017 implemented note (§4: one shared
  `FloatingWindow.vue` instance driven by the `useFloatingWindow()` singleton,
  utility = `{ id, label(), panes: [{ title(), icon?, component }] }` — framed
  panes whose titles (+ decorative FA icon) sit on the top border line, text
  `[x]` close on the first pane, hidden by default / opened programmatically,
  dialog semantics + focus
  handling, dismissed via `[✕]` / backdrop / `Esc`, ≤640px sheet with the
  last pane growing; two temporary demos until SEARCH-002 — `~`/tool-bar
  description demo and the `/` search-shaped input+results demo),
  footer spec (custom Vue section on top · separator ·
  copyright/social · powered-by/RSS/license rows; RSS + icons configurable;
  author/license from CONF-002; attribution row lighter on desktop; THEME-004
  implemented note: `themeConfig.footer` shape, placeholder strings,
  color-mix-derived lighter tone, mobile stack order), author &
  license system spec (§4: `author.name`/`author.username` + normalization rule,
  `license` default CC BY-NC-SA 4.0, custom name drops CC url/icons), cards &
  shell-prompt decoration (explicit `showPrompt`; prompt user = normalized author
  username; host defaults to normalized active site title; path defaults to the
  current page location; host/path/command/args remain overridable; prompt marks
  featured content; constrained prompts progressively hide host, reduce the path
  to its last section, and apply an end ellipsis; code blocks are card-style
  windows with a file/lang title bar + COPY button, no prompt), explorer retractable
  on desktop & absent in paper mode,
  modern finish, mode list, keyboard/mobile/i18n principles; §9: hard rule — no
  `/<lang>/` URL trees, UI language is a client-side preference (`ct-lang`);
  LocalizableText pattern for all config text (I18N-004); optional per-language
  page bodies via `::: lang <tag>` blocks that switch client-side with the
  default block SSR-visible (I18N-007); I18N-001/003
  implementation notes (tables, resolution order, `useThemeLocale()`); the
  auto-discovery contract (THEME-012/I18N-006) for `explorer: "auto"`, folder
  indexes, deterministic ordering, and localized frontmatter/config labels.
- `design/color-system.md` — binding: main color (default `#80E0A7`, `themeConfig`)
  is an ACCENT for emphasis/links/bold/headings — body text is neutral Carbon in all
  modes (2026-07-09 decision, §2/§6); hard rule that all auxiliary colors derive
  from it; IBM Carbon supporting palette; Oxocarbon (nvim dark/light, vscode PRINT
  for paper) for code and shell prompts; §8 implementation reference (`--ct-`
  tokens, head-injected main color, `data-ct-mode` + `ct-mode` storage, callout
  colors, three-theme shiki, and mode-aware prompt roles).
- `design/typography-and-icons.md` — binding: IBM Plex allocation (Sans = UI/body,
  Serif = paper-mode body, Mono = code + TUI chrome); Font Awesome for most icons, Nerd
  Font only in TUI chrome incl. callout chrome (title glyphs + details chevron, MD-003);
  hard rule: load via stylesheets injected in `<head>` from VitePress config, no npm
  font/icon packages. FONT-001 note: Google Fonts CSS2, weights 400/600/700 (+italic
  400), stacks in `_tokens.scss`. FONT-002/004 note: FA `all.min.css` (cdnjs) +
  generated symbols-only Nerd Font CSS from jsDelivr's `ryanoasis/nerd-fonts`
  master branch plus a working `SymbolsNerdFont-Regular.ttf` face under the
  `NerdFontsSymbols Nerd Font Terminal` alias (`--ct-font-nerd`); PUA glyphs
  gated behind `html[data-ct-nerdfont]` (useNerdFont) after the external
  stylesheet has loaded (FONT-003) — safe fallback: no icon / plain `❯` chevron.
- `design/ui-sketch.md` — ASCII wireframes (structure binding, details illustrative):
  desktop shell (tool bar / explorer + viewport / status bar), floating find
  palette as stacked framed panes — border titles + text `[x]` close
  (§2, reworked THEME-017; the generic window shell is landed, find content =
  SEARCH-002),
  mobile layout with explorer drawer, paper mode (keeps minimal tool/status bars,
  hides explorer/utility panels), in-viewport footer (attribution row lighter on
  desktop), card component with explicit `showPrompt`, normalized site-title host,
  and code-block variant with file/lang/COPY title bar (§6); legend of placeholder
  glyphs and a region → spec → build-task map.

## .vitepress/

- `config.mts` — site config via `defineConfigWithTheme<TerminalThemeConfig>`:
  `srcDir: "src"`, title, description; `themeConfig` const with commented option
  examples; `head: themeHead(themeConfig)` (fonts + main color + mode restore);
  `markdown.theme` = three oxocarbon shiki themes (`{ light, dark, paper }` — extra
  `paper` key is forwarded to shiki and loaded lazily as a raw object); `lang:
  "en"` as the default UI language (minimal canonical tag, I18N-005; no
  VitePress `locales` — I18N-003);
  `themeConfig` demos per-language `title`/`description` maps, an MIT
  `license` (exercises the footer's icon-less text fallback), a `footer`
  block (GitHub social icon; demo `rss: "/feed.rss"` — feed not actually
  generated yet),   and `explorer: "auto"` to discover every Markdown page under `src/`;
  index-less folder metadata is read from adjacent `explorer.json` files;
  a commented `search.algolia` example documents the SEARCH-001 keys (demo
  ships unconfigured → the palette shows its notice); `markdown.math: true`
  (mathjax3) + `markdown.config: createMarkdownConfig(lang)` (MD-001/002).
- `theme/head.ts` — node-side `themeHead(themeConfig)`: IBM Plex Google-Fonts-CSS2
  `<link>`s + preconnects (FONT-001), icon stylesheet `<link>`s (FONT-002/004:
  Font Awesome 6 `all.min.css` from cdnjs + generated Nerd Font CSS from
  jsDelivr's `ryanoasis/nerd-fonts@master`),
  inline `:root{--ct-main:…}` style from the resolved config (STYLE-001), inline
  pre-paint script restoring `ct-mode` from localStorage onto `data-ct-mode` with
  dark default (STYLE-002) AND the font preferences `ct-font-family`/`ct-font-size`
  onto `data-ct-font-*` (THEME-007) — attributes set only for a non-default choice,
  so no flash/reflow.
- `theme/markdown/index.ts` — node-side `createMarkdownConfig(lang)` → the
  `markdown.config` hook: wires the MD-001 plugin suite (emoji `full` preset, sub,
  sup, ins, mark, footnote, deflist, abbr) then `calloutsPlugin`. Math goes through
  VitePress's `markdown.math: true` (markdown-it-mathjax3) instead. Then
  `localizedContentPlugin(md, lang)` (I18N-007) and `codeBlockCardsPlugin(md,
  lang)` last (STYLE-004).
- `theme/markdown/localized-content.ts` — I18N-007 per-language content:
  registers a `::: lang <tag>` markdown-it-container → `<div class="ct-lang"
  data-ct-lang="<tag>">`. The block whose tag matches the build `lang`
  (exact or primary subtag) is emitted visible; every other block gets `hidden`
  (flash-free, JS-off-safe SSR). Client `useLocalizedContent` re-resolves with
  the full fallback and switches on language change.
- `theme/markdown/codeblock.ts` — STYLE-004 code-block cards: wraps VitePress's
  Shiki `fence` output in a `.ct-code` card + `.ct-code__titlebar` (file name ·
  language · text `[copy]` button). Reads `token.info` BEFORE delegating (VitePress
  strips the `[title]` bracket in its own rule); language = leading word, file
  name = `[...]` group. COPY label emitted in the build `lang`, tagged
  `data-ct-code-copy-label` for client re-localization (useCodeCopy). Highlighting
  untouched inside the card.
- `theme/markdown/callouts.ts` — MD-002 containers: overrides VitePress's built-in
  info/tip/warning/danger/details renderer rules and registers note/caution/important
  fresh; emits `.ct-callout .ct-callout--<kind>` cards with `.ct-callout__title`
  (details → `<details>/<summary>`); default titles from the locale table for the
  build `lang`, tagged `data-ct-callout-title` for client re-localization; custom
  titles render inline markdown untagged. Aliases: note→info, caution→danger.
- `theme/shiki/oxocarbon.ts` — builds `oxocarbon-dark`/`oxocarbon-light` shiki themes
  from the oxocarbon.nvim palettes (treesitter groups transcribed to TextMate scopes;
  MIT attribution in header) and re-exports the vendored paper theme.
- `theme/shiki/oxocarbon-paper.json` — vendored `PRINT.json` from
  nyoom-engineering/oxocarbon-vscode (MIT), renamed `oxocarbon-paper`; grayscale
  ink-on-white print palette used for paper mode.
- `theme/config.ts` — CONF-001 configuration surface, framework-free (importable from
  the Node-side config): `TerminalThemeConfig` schema (`mainColor` default `#80E0A7`;
  `title`/`description` as `LocalizableText` falling back to the site config values;
  `localeStrings?: LocaleOverrides` — per-language map `{ tag: partial table }` that
  can also add whole languages; feature toggles land here), `themeConfigDefaults`,
  `resolveThemeConfig()` (per-option fallback, survives explicit `undefined`).
  CONF-002: `author` (`name` LocalizableText + shell-safe `username`, derived via
  exported `normalizeUsername()` when unset, fallback `user`); the shared
  `normalizeShellIdentifier()` helper also normalizes the site-title host used by
  COMP-001. `license`
  (default CC BY-NC-SA 4.0 + deed URL + FA CC icons; a custom `name` drops the CC
  url/icons — bring your own); single source for footer/prompt/license-card
  consumers (THEME-004, COMP-001, COMP-003). THEME-004: `footer`
  (`rss` feed URL, default `''`; `social: TerminalSocialLink[]` — FA `icon` +
  `link` + optional LocalizableText `label`). THEME-002/011/012:
  `explorer: TerminalExplorerItem[] | "auto"` — explicit tree or automatic
  discovery of `src/**/*.md`; explicit nodes retain `{ text, link?, items? }`,
  while source-local `explorer.json` files can provide localized folder labels;
  default `[]` = no explorer rendered. SEARCH-001: `search: TerminalSearchConfig`
  (`provider?: 'algolia'`, `algolia?: {appId, apiKey, indexName}`) resolved via
  `resolveSearch()` (partial creds → `algolia: null` = unconfigured) with the
  exported `isSearchConfigured()` helper; default `{ provider:'algolia',
  algolia:null }`.
- `theme/locales/en.ts` — canonical English string table (I18N-001): source of truth
  for the theme key set (`lang.label` self-description, `mode.*`, `lang.switch`,
  `callout.*` ×8, `nav.label`/`nav.home` + `status.*`
      (read/home/notFound/clock/progress/top/bottom/backToTop — THEME-001/009/019),
  `explorer.*` ×3 — label/toggle/close (THEME-002),
  `settings.*` ×13 — title/open + fonts/fontFamily/fontSize +
  fontDefault/Sans/Serif/Mono + sizeSmall/Medium/Large + language (THEME-007),
  `code.copy`/`code.copied` (STYLE-004),
  `window.close` (THEME-003), `search.*` — open/title/inputTitle/resultsTitle/
  placeholder/hint + idle/loading/empty/error/unconfigured status + poweredBy
  (Algolia attribution) (SEARCH-002),
  `footer.*` with `{year}/{author}`/`{vitepress}/{theme}`/`{license}`
  placeholders (THEME-004) + temporary `footer.demoCustom` label (THEME-006
  pre-footer demo) — grows per feature); exports
  `ThemeLocaleStrings`/`ThemeLocaleKey`.
- `theme/locales/zh-Hans.ts` — built-in Chinese (Simplified) table, typed
  `ThemeLocaleStrings` so drift from the key set is a type error.
- `theme/locales/index.ts` — framework-free registry (`en`, `zh-Hans`; tag rule
  I18N-005: minimal canonical tag — script subtag only when it disambiguates,
  never a region) for the
  URL-free language system (I18N-003): `resolveLocaleStrings(tag, overrides?)`
  (English ← built-in match: exact ci tag, then primary subtag ← per-language
  `localeStrings[tag]`), `availableLanguages(overrides?)` (built-ins ∪ config-added
  tags, labeled by `lang.label`), `matchLanguageTag()` (canonicalizes e.g. `en-US` →
  `en`, `zh-CN` → `zh-Hans`), `LocalizableText` (`string | { tag: string }`) +
  `resolveLocalizedText()`
  (exact → primary → `en` → first entry; the pattern for all config text, I18N-004);
  `LocaleOverrides`/`ThemeLanguage` types.
- `theme/composables/useThemeLocale.ts` — client composable & language state
  (singleton): `strings`/`t(key)`, `language` (canonical tag; preference ?? site
  `lang`), `languages`, `setLanguage()` (updates `<html lang>`, persists to
  localStorage `ct-lang`; restored post-mount to avoid hydration mismatch); the only
  way components obtain UI text.
- `theme/composables/useCalloutTitles.ts` — rewrites `[data-ct-callout-title]`
  elements from the locale table on mount, content update, and language switch;
  called once from the layout (MD-002).
- `theme/composables/useLocalizedContent.ts` — I18N-007 client switch of
  `::: lang` page content; called once from the layout. Groups adjacent
  `.ct-content .ct-lang` siblings and, per group, `hidden`s all but the block
  chosen for the active `useThemeLocale().language` (fallback exact tag →
  primary subtag → site default `lang` → first block); runs on mount,
  `onContentUpdated`, and language switch. Content outside `::: lang` is
  untouched.
- `theme/composables/useCodeCopy.ts` — STYLE-004 code-block COPY behavior +
  label localization; called once from the layout. A delegated document click
  copies the `.ct-code pre code` source and flashes a localized "Copied"
  (`--copied` class, WeakSet guards the flash); `[data-ct-code-copy-label]` +
  aria/title re-localized on mount, `onContentUpdated`, and language switch.
- `theme/composables/useFontSettings.ts` — THEME-007 content font preferences
  (singleton): `family` (`default`/sans/serif/mono) + `size` (small/medium/large),
  mirrored onto `<html data-ct-font-*>` (attr only for a non-default value),
  persisted to `ct-font-family`/`ct-font-size`, synced from the head-script
  attributes on mount. SSR-safe.
- `theme/composables/useSettings.ts` — THEME-007 settings opener: `openSettings()`
  opens the shared floating window with a prompt-less two-pane `settings` utility
  (Fonts `SettingsFonts` + Language `SettingsLanguage`, FA `fa-font`/`fa-language`
  border icons, localized title getters). Setup-time composable (needs
  `useThemeLocale` context).
- `theme/composables/useNerdFont.ts` — waits for the generated Nerd Font stylesheet
  before using the CSS Font Loading API to confirm the working
  `NerdFontsSymbols Nerd Font Terminal` alias (`fonts.ready` → `fonts.load()`); then
  flags `<html data-ct-nerdfont>`. Gates all PUA glyphs so a failed asset degrades
  tofu-free (FONT-002/003/004, MD-003); called once from the layout.
- `theme/composables/useExplorer.ts` — explorer state singleton (THEME-002/011/012/013/014):
  `available` (explicit or auto-discovered tree ∧ mode ≠ paper), `items`
  (a deterministic recursive tree built from `src/**/*.md` via VitePress
  `__pageData`, including folder-index links), and source-local
  `explorer.json` metadata for localized folder labels; `desktopOpen` (persisted
  to `ct-explorer`, restored post-mount), and
  transient `drawerOpen`. Auto page labels use `explorerTitle`/localized
  `title` frontmatter and page-title fallbacks. `toggle()` drives the drawer
  under the 640px matchMedia query, the desktop retract above it;
  `closeDrawer()`. THEME-011: per-folder expanded state remains in
  `ct-explorer-nodes`; route-only reveals and current-view user overrides live
  in transient state and are cleared after navigation.
- `theme/composables/useFloatingWindow.ts` — shared floating-window singleton
  (THEME-003/016/017): `active` shallowRef holding the current utility payload
  `{ id, label(), panes: [{ title(), icon?, component }] }` — `label()` names
  the dialog; each pane is a framed box with its own border title (getters so
  they follow language switches; `icon` = optional FA classes) and content —
  plus `isOpen`, `open()` (replaces the current utility), `close()`.
  Hidden by default; only opened programmatically.
- `theme/composables/useSearch.ts` — find-palette state & behavior
  (SEARCH-002), module-singleton: `query`/`results`/`status`
  (`unconfigured|idle|loading|results|empty|error`)/`activeIndex` shared by both
  pane components; `setQuery()` debounces (200ms) an abortable Algolia request
  via `utils/algolia.ts` (unconfigured/empty query never hit the network),
  `move()`/`openActive()`/`openResult()` drive keyboard/click navigation
  (navigates + `close()`s the window). `useSearch()` (setup-time — needs
  `useThemeConfig`/`useThemeLocale`) also exposes `openSearch()` which resets
  and opens the two-pane `search` utility (`SearchPalette` + `SearchResults`,
  magnifier border icon). `useSearchShortcut()` binds `/` via the local
  input-guarded `useKeyShortcut()` helper.
- `theme/utils/algolia.ts` — framework-free Algolia DocSearch REST client
  (SEARCH-001/002): `searchAlgolia(algolia, query, signal, hitsPerPage=8)`
  POSTs to `{appId}-dsn.algolia.net/1/indexes/{indexName}/query` (credentials
  as query params + `x-www-form-urlencoded` body = no CORS preflight, like
  Algolia's lite client; empty highlight tags → plain snippets), mapping hits to
  `SearchResult` (`objectID`/`title` = deepest hierarchy level ← content, /
  `breadcrumb` = parent levels · ` › ` / `snippet` = `_snippetResult.content` ←
  content / `url`); rows without a `url` are dropped. No npm dependency.
- `theme/composables/useClock.ts` — THEME-019 live wall clock: a reactive
  `HH:MM:SS` (24-hour, zero-padded) string for the status bar's right end.
  SSR-safe — starts empty (server + first client render agree), fills and ticks
  each second via an interval started `onMounted` and cleared `onBeforeUnmount`.
- `theme/composables/useReadingProgress.ts` — scroll progress as an integer % for
  the status bar (THEME-001/008): tracks the `.ct-viewport` panel (the shell's
  only scroll container), 100 when the page fits inside it; updates on
  scroll/resize + `onContentUpdated`; SSR-safe (starts at 0, listeners on mount).
- `theme/composables/useViewportScroll.ts` — router-facing scroll behaviors for
  the fixed frame (THEME-008), wired to the viewport ref from Layout: on
  `onContentUpdated` jumps to the URL-hash target or resets the panel to top
  (VitePress's own window.scrollTo is a no-op); a panel click listener scrolls
  same-page anchor targets (footnotes/header anchors) smoothly into view.
- `theme/composables/useSiteText.ts` — localized site `title`/`description`
  (I18N-004): themeConfig LocalizableText ?? site config values; post-mount
  watchEffect syncs `document.title` (`page | title` pattern) and
  `meta[name=description]` with the active language (SSR head keeps defaults).
- `theme/composables/useThemeConfig.ts` — client composable: `useThemeConfig()` wraps
  `useData()` + `resolveThemeConfig()`; components read all user options through it,
  honoring per-locale `themeConfig`.
- `theme/composables/useColorMode.ts` — module-singleton `useColorMode()`:
  `mode`/`setMode`/`cycleMode` over `'dark'|'light'|'paper'`; mirrors the
  `data-ct-mode` attribute set pre-paint by head.ts, persists to localStorage
  `ct-mode`; SSR-safe.
- `theme/index.ts` — theme entry: default-exports `DemoLayout` (the demo site's
  wrapper filling the `pre-footer` slot, THEME-006) + empty `enhanceApp`, and
  named-exports the reusable `Card` component and the theme's own `Layout` (so
  users can wrap it to fill the slot); imports `styles/main.scss`. Swap the
  default `Layout` back to the real one to ship without the demo section.
- `theme/DemoLayout.vue` — temporary THEME-006 demo wrapper: wraps `Layout.vue`
  and fills its `#pre-footer` slot with `PreFooterDemo.vue` — the exact
  extend-and-wrap pattern a consuming site uses. Registered as this demo site's
  Layout via `theme/index.ts`.
- `theme/components/PreFooterDemo.vue` — temporary THEME-006 demo content:
  left = Nerd-Font logo glyph (`.ct-prefooter-demo__logo`) + localized theme
  name (`useSiteText`); right = a Font Awesome icon (`fa-palette`), a Nerd Font
  icon (`.ct-prefooter-demo__nf`), and the localized `footer.demoCustom` label.
  Demonstrates arbitrary content, both icon systems, and i18n inside the slot.
- `theme/Layout.vue` — the TUI shell (THEME-001/008): `.ct-shell` composing
  `<ToolBar/>`, the `.ct-main` row — `<Explorer/>` when `useExplorer().available`
  (THEME-002: tree configured ∧ not paper mode; truly unrendered otherwise)
  beside the `.ct-viewport` panel (template ref wired to
  `useViewportScroll()`; wraps `.ct-content` with the placeholder home branch —
  localized title/description, PAGE-001 pending — or `<Content/>`, then the
  `.ct-footer-region` (THEME-004/006): it owns the full separator and wraps the
  optional `.ct-prefooter` (rendered only when the `pre-footer` slot is filled —
  `$slots['pre-footer']`) above `<SiteFooter :divided="…" />`) —
  `<StatusBar/>`, and the shared `<FloatingWindow/>` (THEME-003); calls
  `useCalloutTitles()` + `useCodeCopy()` (STYLE-004) + `useNerdFont()` +
  `useSearchShortcut()` (binds `/` to open the find palette, SEARCH-002) +
  `useLocalizedContent()` (I18N-007 `::: lang` block switching) once.
- `theme/components/ToolBar.vue` — top tool bar / tabline (THEME-001/010): the
  explorer toggle `[=]` (FA bars, leftmost, hidden when the explorer doesn't
  exist — THEME-002), brand
  (gated Nerd Font glyph + localized site title, links home via `withBase`), a
  `<nav>` of editor tabs — currently the single built-in `~/home` tab with active
  state — and the right-side action icons: the find-palette search trigger (FA
  magnifying-glass → `useSearch().openSearch`, SEARCH-002) and the color-mode
  cycle button (FA half-circle, `mode.switch`); the settings gear moved to the
  status bar (THEME-019); configurable entries/more actions come with THEME-005.
- `theme/components/Explorer.vue` — file-explorer sidebar (THEME-002/012/014):
  `<nav>` panel with mobile-only header (localized EXPLORER title + FA close
  button) and the explicit or source-discovered recursive tree from
  `useExplorer()`; `--closed`/`--drawer-open` classes; drawer dismissed via
  close button, backdrop tap (sibling `.ct-explorer-backdrop` div), `Esc`
  (window keydown), or navigation (watch `page.relativePath`); navigation also
  clears transient node overrides so route ancestor expansion recalculates.
- `theme/components/ExplorerTree.vue` — one recursive tree level
  (THEME-002/011/014), nvim-tree row anatomy: chevron (folders; pure toggle) or
  dash spacer (leaves) + NF folder/file icon span + label. Expanded state
  from the `useExplorer()` store keyed by `parentKey + '/' + raw config
  text` (language-stable); default = `depth === 0`.
  A folder-with-link label is a plain navigational anchor; route awareness
  expands it without persistence; link nodes use `withBase` (external `_blank
  noreferrer`); the active row matched by mapping the link to
  `page.relativePath` form (base- and clean-URL-proof); active-route ancestors
  expand temporarily without storage writes; labels via `resolveLocalizedText`
  against the active language.
- `theme/components/Card.vue` — reusable TUI floating card (COMP-001) with an
  explicit `showPrompt` flag and a typed `prompt` object (`command`, optional
  `host`/`path`/`args`). The prompt user comes from
  `useThemeConfig().author.username`; host defaults to the normalized active site
  title and path to the current page location, with every value overridable.
  Prompt markup separates host, path, command, and args so each can use an
  Oxocarbon role token; command and args preserve their explicit leading
  separators in the flex prompt layout. A resize-aware staged fitter hides the
  host, reduces the path to its last section, and then enables path ellipsis.
- `theme/components/FloatingWindow.vue` — the single shared floating utility
  window (THEME-003/016/017), rendered once from Layout: `role="dialog"` +
  aria-modal container over a dimmed backdrop, stacking the active utility's
  framed pane `<section>`s (each aria-labeled by its title); pane titles
  (+ optional decorative FA icon) sit on the top border line, and the literal
  text `[x]` close control sits on the first pane's border; pane bodies are
  the scroll regions; dismissed via `[x]`, backdrop click, or `Esc`; focus
  moves into the container on open and returns on close.
- `theme/components/SearchPalette.vue` — find-palette input pane (SEARCH-002):
  a `>` prompt glyph + a borderless search field bound to `useSearch().query`;
  input runs `setQuery`, `↑`/`↓` `move` the active result, Enter `openActive`.
  Auto-focuses the field via rAF on mount (wins over the window's own panel
  focus). Placeholder/aria localized.
- `theme/components/SearchResults.vue` — find-palette results pane (SEARCH-002):
  renders the `useSearch()` result rows as real `<a>` links (title · optional
  breadcrumb · clamped snippet), the active row accent-washed; a `watch` keeps
  the keyboard-selected row scrolled into view; row click navigates through the
  shared `openResult` (modifier/non-left clicks fall through to the browser for
  open-in-new-tab). All other states show one localized status line
  (idle/loading/empty/error/unconfigured). A `.ct-search__footer` row closes
  the pane: the keyboard hint on the left, and — unless unconfigured — the
  required **Algolia attribution** on the right (`.ct-search__algolia`, a link
  to algolia.com wrapping the official single-path Algolia logo inline SVG in
  `currentColor`; label localized via `search.poweredBy`. Note `fa-algolia` is
  NOT in the loaded Font Awesome build, hence the inline SVG).
- `theme/components/SettingsFonts.vue` — THEME-007 settings Fonts pane: two
  segmented controls (`.ct-settings__option`) for the content font family
  (Default/Sans/Serif/Mono) and size (Small/Medium/Large), driven by
  `useFontSettings()`; every label localized.
- `theme/components/SettingsLanguage.vue` — THEME-007 settings Language pane: a
  list of `useThemeLocale().languages` rows (self-described `lang.label` + tag),
  active highlighted, `setLanguage()` switches in place (I18N-003).
- `theme/components/SiteFooter.vue` — in-viewport footer (THEME-004/006):
  takes a `divided` prop — when a custom pre-footer section sits above it
  (THEME-006), `.ct-footer--divided` draws the subtler inset inner separator (the
  edge-to-edge full separator is owned by the region wrapper in Layout). Grid of
  four cells — localized copyright (`{year}`/`{author}`, author from CONF-002) ·
  social icons (`themeConfig.footer.social`) · powered-by (localized
  `{vitepress}/{theme}` placeholders split into linked product names) · RSS
  (orange icon + untranslated "RSS" wordmark, only when `footer.rss` set) +
  license (CONF-002): icon cluster as one non-underlined link, or — when a
  custom license ships no icons — the localized `footer.licensedUnder`
  sentence (`{license}` placeholder) with the name as an underlined deed link
  (plain text without `url`).
- `theme/components/StatusBar.vue` — bottom statusline (THEME-001/009/010/019):
  left a **live state chip** — `state` computed from `page.isNotFound` /
  `frontmatter.home` → `status.notFound`/`.home`/`.read`, `kind` driving
  `.ct-statusbar__chip--{notfound,home,read}` — then a `.ct-statusbar__path`
  wrapper (single divided segment) holding the `formatPageLocation` breadcrumb +
  the blinking `.ct-statusbar__cursor`; right a tight progress-% + back-to-top
  cluster (FA arrow-up smooth-scrolls `.ct-viewport` to 0), the permanent
  in-place language switcher (cycles `languages`, hidden under two), a read-only
  color-mode indicator span, the settings gear (`useSettings().openSettings`,
  moved from the tool bar by THEME-019), and a `v-if`-gated
  `.ct-statusbar__clock` (`useClock`, `HH:MM:SS`) at the far right; replaces the
  I18N-002 placeholder controls.
- `theme/styles/main.scss` — SCSS entry: `@use`s the working Nerd Font face
  (`_fonts.scss`), tokens/modes/shell/toolbar/explorer/statusbar/window/
  settings/content/card/footer/prefooter-demo/code/callouts (+ `search` after
  `window`, SEARCH-002), then base document styles
  (box-sizing, body bg/color/font
  via semantic tokens, `::selection` from the derived highlight).
- `theme/styles/_prefooter-demo.scss` — THEME-006 temporary pre-footer demo
  styles: flex `space-between` row, mono TUI text, accent-colored FA + Nerd
  Font glyphs; the logo/nf glyphs follow the NF gating convention (plain `::`/`*`
  fallback upgraded to `\f120`/`\f005` under `html[data-ct-nerdfont]`).
- `theme/styles/_fonts.scss` — registers the current jsDelivr
  `SymbolsNerdFont-Regular.ttf` under `NerdFontsSymbols Nerd Font Terminal`,
  compensating for the generated CSS's missing legacy `/fonts/` source path
  (FONT-004).
- `theme/styles/_tokens.scss` — primitives: `--ct-main` fallback on `html` (lower
  specificity so the head-injected `:root` value wins), main-color derivatives via
  `color-mix()` (bright/dim/subtle/border/selection/deep/deeper — no hardcoded
  derivative hex), Carbon grays + semantic colors (incl. purple 40/60 for
  `--ct-important`, orange 40/60 for the footer RSS accent), IBM Plex font
  stacks + the aliased `--ct-font-nerd` (FONT-002/004), fixed Oxocarbon prompt
  primitives, radius/gap.
- `theme/styles/_modes.scss` — semantic tokens (`--ct-bg/surface/text/link/border/
  inline-code/error/warning/info/success/important/rss/font-body`) as mixins per mode;
  body text NEUTRAL everywhere (STYLE-006: dark = gray-10, light/paper = gray-100),
  main color only on emphasis tokens (strong/heading/link/inline-code); `:root` =
  dark (default), `[data-ct-mode=light|paper]` overrides, `@media print`
  force-applies paper tokens; maps `--ct-prompt-*` to the active Oxocarbon role set.
- `theme/styles/_code.scss` — STYLE-003/004 code-block cards: `.ct-code` card
  frame (border/radius/shadow, matches `_card.scss`) + `.ct-code__titlebar`
  (file name · language · text `[copy]` accent button, `--copied` success flash);
  inner `div[class*=language-]` de-framed (hides default copy/lang leftovers),
  `pre.shiki` basics, per-mode `--shiki-dark/-light/-paper` selection incl. print
  (which also drops the card shadow).
- `theme/styles/_content.scss` — STYLE-005: `.ct-content` markdown styling (headings,
  text, links, lists, blockquotes, tables w/ overflow-x scroll, hr, img, inline code)
  via semantic tokens; 72ch measure; 480px mobile padding tier; `flex: 1 0 auto`
  so it grows in the viewport column and pins the footer to the panel bottom
  (THEME-004). Font uses `var(--ct-content-font, var(--ct-font-body))` and size
  `var(--ct-content-font-size, 1rem)` so the THEME-007 settings override the
  reader font (else follow the mode default). Also carries the I18N-007
  `.ct-lang` rules: `display: contents` (layout-neutral wrapper) with
  `.ct-lang[hidden]{display:none}` winning by specificity so hidden
  language blocks leave the flow.
- `theme/styles/_settings.scss` — THEME-007: maps `<html data-ct-font-family|size>`
  to `--ct-content-font`/`--ct-content-font-size` (default family = no attr =
  follow mode; medium size = base), and styles the settings-panel controls —
  `.ct-settings` font rows (label + `.ct-settings__option` segmented control) and
  `.ct-settings__langs` language list, accent active state (`--ct-main-subtle`).
- `theme/styles/_card.scss` — COMP-001 floating-card chrome: subtle rounded
  border, low-opacity 4px/12px shadow, semantic surface tokens, a monospace
  shell-prompt header with Oxocarbon segment roles, body spacing, narrow-screen
  overflow protection, explicit command/argument whitespace preservation, staged
  path ellipsis, and print-safe shadow removal.
- `theme/styles/_footer.scss` — THEME-004/006 in-viewport footer region: the
  `.ct-footer-region` wrapper (flex-shrink:0, bottom-pinned) owns the full
  separator (`border-top: 1px solid var(--ct-border)`, before the whole footer
  section); `.ct-prefooter` holds the custom section with footer-matching
  padding; `.ct-footer--divided` adds the subtler inner separator only when
  the custom section is present — a `--ct-border` `::before` rule INSET by the
  footer's horizontal padding (so it does not reach the panel edges, matching
  the search window's hint rule), unlike the edge-to-edge full separator
  (THEME-006).
  Footer itself: full panel width
  (wider than the 72ch article column), mono small
  `--ct-text-neutral`; 2×2 grid (texts left, icon clusters right); ≥641px the
  powered/meta row is lightened via `color-mix(… 68%, transparent)` over the
  row above (derived, color-system §3); ≤640px collapses to one column in
  sketch-caption order (copyright · powered · social · meta) with left-aligned
  icons; print drops link underlines. Underline is opt-in for TEXT links only
  (`__copyright a`/`__powered a`/`__license-text a`) — icon anchors never
  underline in any state; RSS chip in `--ct-rss` orange (selector doubled
  `& &__rss` to out-rank `.ct-footer a`'s color inherit), license glyphs one
  tight 0.125rem cluster; glyph clusters at 0.9375rem, the license text
  fallback at the regular footer size.
- `theme/styles/_callouts.scss` — MD-002 callouts, minimal left-bar style (revised
  2026-07-09): 3px accent bar + accent-colored mono uppercase title, no bg/frame;
  accent + Nerd Font title glyph (nf-fa-* PUA, MD-003) per variant, glyphs gated
  behind `[data-ct-nerdfont]`; `<details>` variant hides the native marker and
  animates a rotating chevron (`❯` fallback, upgraded to the NF chevron by the same
  gated rule via specificity).
- `theme/utils/pagePath.ts` — framework-free `formatPageLocation()` helper shared
  by the status bar and card prompt defaults; maps `relativePath` to `~` or a
  home-relative path without the Markdown extension.
- `theme/styles/_shell.scss` — THEME-001/008 shell frame: `.ct-shell` FIXED
  100dvh flex column with `--ct-gap` gaps/padding; `.ct-main` middle flex row
  (explorer beside viewport, THEME-002 — a retracted explorer is display:none
  so the row gap collapses); `.ct-viewport` bordered
  rounded panel is the only scroll container (`flex: 1; min-height: 0;
  overflow-y: auto; overscroll-behavior: contain; scroll-padding-top`) — content
  clips at its edges, the frame never scrolls; the panel is itself a flex
  column so the in-viewport footer pins to its bottom edge on short pages
  (THEME-004); print releases the fixed height, drops padding/border, and
  flattens `.ct-main` to a block so the full article prints.
- `theme/styles/_toolbar.scss` — top tool bar: fixed floating panel, surface bg
  + border/radius/shadow, mono; brand glyph `::` upgraded to nf-fa-terminal behind
  `[data-ct-nerdfont]`; editor-tab links with accent hover/active; right-aligned
  `__actions` group with accent icon buttons (mode switcher, THEME-010); tabs
  hidden ≤640px (the explorer drawer takes over, THEME-002); hidden in print.
- `theme/styles/_explorer.scss` — THEME-002/011 file-explorer sidebar: desktop
  15rem surface panel with own scroll (`--closed` = display:none, instant
  editor-tree retract, ≥641px only); mono TUI chrome. Rows nvim-tree style
  behind `[data-ct-nerdfont]`: NF chevron `\f054` (rotates open), icon column
  (`__icon--folder \f07b` / `--folder-open \f07c` accent-tinted, `--file
  \f016` dim; display:none without the gate) with the leaf dash becoming a
  spacer; fallback = plain `❯` / `-`, no icon column. Folder labels
  `--ct-text-strong`; nested levels indent along a border-left guide; active
  row = `--ct-main-subtle` bg + accent label; ≤640px = fixed off-canvas
  drawer (`translateX` slide, `--drawer-open`, z-30) over the
  `.ct-explorer-backdrop` dim layer (z-20, desktop-hidden), drawer-only
  header; hidden in print. The drawer breakpoint must match useExplorer's
  `DRAWER_QUERY`.
- `theme/styles/_window.scss` — THEME-003/016/017 shared floating window:
  backdrop z-40 (above the explorer drawer's z-30) + invisible window
  container z-50 (centered top 14vh, `min(40rem, …)` wide, 70vh max) stacking
  framed `__pane` boxes with a `--ct-gap` flex gap; each `__pane` is
  `flex: 0 0 auto` (natural height, no shrink) while `__pane:last-child` is
  `flex: 1 1 auto` — so inside the height-capped window only the last pane
  (e.g. the find palette's results) shrinks & scrolls and the earlier panes
  (the search input) keep full height instead of being overlapped;
  `__pane-title` (+ optional
  accent `__icon`) and the text `[x]` `__close` sit on the top border via
  absolute positioning + `translateY(-50%)` with a `--ct-surface` backing
  masking the line; `__pane-body` is each pane's scroll region; deeper
  `0 12px 32px` shadow per pane, mono chrome, 0.15s fade-in; ≤640px =
  near-full-screen sheet inset by `--ct-gap` with the last pane growing;
  hidden in print. (The temporary demo styles were removed with SEARCH-002;
  the find palette's own styles live in `_search.scss`.)
- `theme/styles/_search.scss` — SEARCH-002 find-palette content inside the
  shared window's panes: `.ct-search__input` (`>` prompt + borderless
  `__field`, native search-clear hidden), `.ct-search__result` link rows
  (stacked `__result-title` accent / `__result-breadcrumb` dim / two-line
  clamped `__result-snippet`, `--active`/hover accent wash), `.ct-search__status`
  message line, and the `.ct-search__footer` (top rule, space-between) holding
  the `.ct-search__hint` keyboard row and the right-aligned `.ct-search__algolia`
  attribution link (dim → hover accent, 0.9375rem inline SVG). Mono is inherited
  from the window chrome.
- `theme/styles/_statusbar.scss` — bottom statusline: fixed floating panel,
  same panel finish, mono small; inverted accent state `__chip` (main-color bg,
  gray-100 text; `--notfound` swaps to `--ct-error`, THEME-019). A
  `__path` inline-flex wraps the truncating `__location` and the
  `__cursor` — a baseline-aligned `0.55em×0.12em` main-color underscore bar
  with a hard `ct-cursor-blink` steps animation, `animation: none` under
  `prefers-reduced-motion` (THEME-019);
  `__clock` uses tabular-nums. Accent text-button controls + `--icon`
  modifier (back-to-top THEME-009, settings gear THEME-019); THEME-010:
  `::before` pseudo-element dividers between top-level group segments (pseudo,
  not border — survives the buttons' border reset) and a tight `__cluster`
  (progress + back-to-top, no divider inside); `__path` + `__clock` hidden
  ≤640px (gear stays); hidden in print.

## src/ (site content — VitePress `srcDir`)

- `index.md` — home page stub with `home: true` and localized `title`
  frontmatter used by the auto-discovered explorer.
- `guide/index.md`, `guide/getting-started.md`, `guide/advanced/index.md`,
  `guide/advanced/deep-dive.md`, and
  `guide/advanced/advanced-2/{deep-dive.md,explorer.json}` — explorer demo
  content with localized title frontmatter; the getting-started page documents
  `"auto"`, source-local JSON folder metadata, explicit-tree compatibility, and
  the I18N-007 `::: lang` localized-content blocks. `advanced/deep-dive.md`
  wraps its body in `::: lang en` / `::: lang zh-Hans` blocks as the I18N-007
  demo (body switches with the UI language).
- `markdown-examples.md` — input/output demo of the theme markdown pipeline:
  Shiki highlighting incl. a `[main.scss]` file-name code-block card (STYLE-004),
  every MD-001 plugin (emoji, sub/sup, ins/mark, footnotes,
  deflists, abbr), math, inline Font Awesome icons (FONT-002), all 8 callout
  types + custom-title example (MD-002), the defaulted, fully overridden, and
  prompt-free COMP-001 card demo (including current-page path defaults and a long
  overridden path for prompt-overflow behavior), and localized explorer title
  metadata.
- `api-examples.md` — VitePress starter demo of the runtime API (`useData`) with
  localized explorer title metadata.
