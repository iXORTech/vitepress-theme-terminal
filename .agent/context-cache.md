# Context Cache

Brief per-file summaries of the repository — purpose plus the essentials, 1–3 lines
each. **Update whenever a file is added, meaningfully changed, or removed** (rule:
[`AGENTS.md`](../AGENTS.md) §5). Last updated: 2026-07-09 (FONT-002 icon systems,
MD-003 nerd-font callout glyphs; earlier same day: STYLE-006 neutral body text,
MD-001 plugin suite, MD-002 callouts + left-bar revision; 2026-07-08: INFRA-001,
CONF-001, STYLE-001/002/003/005, FONT-001, I18N-001/002/003/004).

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

## .github/

- `copilot-instructions.md` — pure pointer to `AGENTS.md` (read by GitHub Copilot). No
  content.

## .agent/

- `plan.md` — task board: tasks with `TYPE-###` IDs, categories, dependencies,
  acceptance criteria. DOC-001/003/005/006, INFRA-001, CONF-001, STYLE-001/002/003/005,
  FONT-001/002, I18N-001/002/003/004, MD-001/002/003, STYLE-006 done. Roadmap: config (incl.
  CONF-002 author & license system), styling (tokens, modes, oxocarbon, code-block
  chrome, markdown styling), markdown plugin suite + callouts, theme chrome (shell,
  explorer, palette, footer + custom pre-footer section, tool bar extras, settings
  panel), components (card w/ shell prompt, Fancybox/Swiper images, license card,
  Waline comments), content (tags/categories, series), pages (home, projects, about,
  friends — spec TBD), Algolia DocSearch prep, demos, mobile pass. I18N-001 includes
  a shipped Chinese (Simplified) locale.
- `context-cache.md` — this file.

## docs/

- `README.md` — documentation index (design docs, process files) plus documentation
  rules; clarifies `docs/` is repo documentation, not site content.
- `design/design-language.md` — binding: identity, NeoVim/LazyVim-inspired TUI design
  language, hard no-branding rule, iconic components table (tool bar, status bar,
  explorer, floating windows), footer spec (custom Vue section on top · separator ·
  copyright/social · powered-by/RSS/license rows; RSS + icons configurable;
  author/license from CONF-002; attribution row lighter on desktop), cards &
  shell-prompt decoration (prompt user = normalized author username; prompt marks
  featured content; code blocks are card-style windows with a file/lang title bar +
  COPY button, no prompt), explorer retractable on desktop & absent in paper mode,
  modern finish, mode list, keyboard/mobile/i18n principles; §9: hard rule — no
  `/<lang>/` URL trees, UI language is a client-side preference (`ct-lang`);
  LocalizableText pattern for all config text (I18N-004); I18N-001/003
  implementation notes (tables, resolution order, `useThemeLocale()`).
- `design/color-system.md` — binding: main color (default `#80E0A7`, `themeConfig`)
  is an ACCENT for emphasis/links/bold/headings — body text is neutral Carbon in all
  modes (2026-07-09 decision, §2/§6); hard rule that all auxiliary colors derive
  from it; IBM Carbon supporting palette; Oxocarbon (nvim dark/light, vscode PRINT
  for paper) for code; §8 implementation reference (`--ct-` tokens, head-injected
  main color, `data-ct-mode` + `ct-mode` storage, callout colors, three-theme shiki).
- `design/typography-and-icons.md` — binding: IBM Plex allocation (Sans = UI/body,
  Serif = paper-mode body, Mono = code + TUI chrome); Font Awesome for most icons, Nerd
  Font only in TUI chrome incl. callout chrome (title glyphs + details chevron, MD-003);
  hard rule: load via stylesheets injected in `<head>` from VitePress config, no npm
  font/icon packages. FONT-001 note: Google Fonts CSS2, weights 400/600/700 (+italic
  400), stacks in `_tokens.scss`. FONT-002 note: FA `all.min.css` (cdnjs) + official
  symbols-only Nerd Font webfont css (family `NerdFontsSymbols Nerd Font`,
  `--ct-font-nerd`); PUA glyphs gated behind `html[data-ct-nerdfont]` (useNerdFont) —
  safe fallback: no icon / plain `❯` chevron.
- `design/ui-sketch.md` — ASCII wireframes (structure binding, details illustrative):
  desktop shell (tool bar / explorer + viewport / status bar), floating find palette,
  mobile layout with explorer drawer, paper mode (keeps minimal tool/status bars,
  hides explorer/utility panels), in-viewport footer (attribution row lighter on
  desktop), card component with shell prompt + code-block variant with file/lang/COPY
  title bar (§6); legend of placeholder glyphs and a region → spec → build-task map.

## .vitepress/

- `config.mts` — site config via `defineConfigWithTheme<TerminalThemeConfig>`:
  `srcDir: "src"`, title, description; `themeConfig` const with commented option
  examples; `head: themeHead(themeConfig)` (fonts + main color + mode restore);
  `markdown.theme` = three oxocarbon shiki themes (`{ light, dark, paper }` — extra
  `paper` key is forwarded to shiki and loaded lazily as a raw object); `lang:
  "en-US"` as the default UI language (no VitePress `locales` — I18N-003);
  `themeConfig` demos per-language `title`/`description` maps; `markdown.math: true`
  (mathjax3) + `markdown.config: createMarkdownConfig(lang)` (MD-001/002).
- `theme/head.ts` — node-side `themeHead(themeConfig)`: IBM Plex Google-Fonts-CSS2
  `<link>`s + preconnects (FONT-001), icon stylesheet `<link>`s (FONT-002: Font
  Awesome 6 `all.min.css` from cdnjs + nerdfonts.com symbols-only `webfont.css`),
  inline `:root{--ct-main:…}` style from the resolved config (STYLE-001), inline
  pre-paint script restoring `ct-mode` from localStorage onto `data-ct-mode` with
  dark default (STYLE-002).
- `theme/markdown/index.ts` — node-side `createMarkdownConfig(lang)` → the
  `markdown.config` hook: wires the MD-001 plugin suite (emoji `full` preset, sub,
  sup, ins, mark, footnote, deflist, abbr) then `calloutsPlugin`. Math goes through
  VitePress's `markdown.math: true` (markdown-it-mathjax3) instead.
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
- `theme/locales/en.ts` — canonical English string table (I18N-001): source of truth
  for the theme key set (`lang.label` self-description, `mode.*`, `lang.switch`,
  `callout.*` ×8 — grows per feature); exports `ThemeLocaleStrings`/`ThemeLocaleKey`.
- `theme/locales/zh-CN.ts` — built-in Chinese (Simplified) table, typed
  `ThemeLocaleStrings` so drift from the key set is a type error.
- `theme/locales/index.ts` — framework-free registry (`en`, `zh-CN`) for the
  URL-free language system (I18N-003): `resolveLocaleStrings(tag, overrides?)`
  (English ← built-in match: exact ci tag, then primary subtag ← per-language
  `localeStrings[tag]`), `availableLanguages(overrides?)` (built-ins ∪ config-added
  tags, labeled by `lang.label`), `matchLanguageTag()` (canonicalizes e.g. `en-US` →
  `en`), `LocalizableText` (`string | { tag: string }`) + `resolveLocalizedText()`
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
- `theme/composables/useNerdFont.ts` — flags `<html data-ct-nerdfont>` once the CSS
  Font Loading API confirms `NerdFontsSymbols Nerd Font` is usable (`fonts.ready` →
  `fonts.load()`, empty result = stylesheet missing); gates all PUA glyphs so a
  failed stylesheet degrades tofu-free (FONT-002/MD-003); called once from the layout.
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
- `theme/index.ts` — theme entry: exports `Layout.vue`, imports `styles/main.scss`,
  empty `enhanceApp`.
- `theme/Layout.vue` — placeholder layout (replaced by THEME-001): `.ct-shell` with a
  temporary top bar (localized site title via `useSiteText()`; actions group with the
  in-place language switcher — buttons per available language, hidden under two — and
  the mode-cycle button, labels via `t()`), and `.ct-content` viewport wrapping the
  home branch (localized title/description) or `<Content/>`; calls
  `useCalloutTitles()` + `useNerdFont()` once.
- `theme/styles/main.scss` — SCSS entry: `@use`s tokens/modes/shell/content/code/
  callouts, then base document styles (box-sizing, body bg/color/font via semantic
  tokens, `::selection` from the derived highlight).
- `theme/styles/_tokens.scss` — primitives: `--ct-main` fallback on `html` (lower
  specificity so the head-injected `:root` value wins), main-color derivatives via
  `color-mix()` (bright/dim/subtle/border/selection/deep/deeper — no hardcoded
  derivative hex), Carbon grays + semantic colors (incl. purple 40/60 for
  `--ct-important`), IBM Plex font stacks + `--ct-font-nerd` (FONT-002), radius/gap.
- `theme/styles/_modes.scss` — semantic tokens (`--ct-bg/surface/text/link/border/
  inline-code/error/warning/info/success/important/font-body`) as mixins per mode;
  body text NEUTRAL everywhere (STYLE-006: dark = gray-10, light/paper = gray-100),
  main color only on emphasis tokens (strong/heading/link/inline-code); `:root` =
  dark (default), `[data-ct-mode=light|paper]` overrides, `@media print`
  force-applies paper tokens.
- `theme/styles/_code.scss` — code blocks: `div[class*=language-]` frame (hides
  default-theme copy/lang leftovers pending STYLE-004), `pre.shiki` basics, per-mode
  selection of `--shiki-dark/-light/-paper` token variables incl. print.
- `theme/styles/_content.scss` — STYLE-005: `.ct-content` markdown styling (headings,
  text, links, lists, blockquotes, tables w/ overflow-x scroll, hr, img, inline code)
  via semantic tokens; 72ch measure; 480px mobile padding tier.
- `theme/styles/_callouts.scss` — MD-002 callouts, minimal left-bar style (revised
  2026-07-09): 3px accent bar + accent-colored mono uppercase title, no bg/frame;
  accent + Nerd Font title glyph (nf-fa-* PUA, MD-003) per variant, glyphs gated
  behind `[data-ct-nerdfont]`; `<details>` variant hides the native marker and
  animates a rotating chevron (`❯` fallback, upgraded to the NF chevron by the same
  gated rule via specificity).
- `theme/styles/_shell.scss` — temporary shell/top-bar/actions/lang-switch/mode-switch
  styling for the placeholder layout; hidden in print; retired by THEME-001.

## src/ (site content — VitePress `srcDir`)

- `index.md` — home page stub: only `home: true` frontmatter.
- `markdown-examples.md` — input/output demo of the theme markdown pipeline:
  Shiki highlighting, every MD-001 plugin (emoji, sub/sup, ins/mark, footnotes,
  deflists, abbr), math, inline Font Awesome icons (FONT-002), and all 8 callout
  types + custom-title example (MD-002).
- `api-examples.md` — VitePress starter demo of the runtime API (`useData`).
