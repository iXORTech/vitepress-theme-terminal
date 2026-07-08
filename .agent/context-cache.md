# Context Cache

Brief per-file summaries of the repository — purpose plus the essentials, 1–3 lines
each. **Update whenever a file is added, meaningfully changed, or removed** (rule:
[`AGENTS.md`](../AGENTS.md) §5). Last updated: 2026-07-08 (styling foundation batch:
STYLE-001/002/003/005 + FONT-001 — tokens, modes, oxocarbon shiki, content styling,
IBM Plex; earlier same day: INFRA-001, CONF-001).

## Root

- `package.json` — pnpm project; devDeps only: `vitepress 2.0.0-alpha.18`,
  `vue ^3.5.39`, `sass ^1.101.0` (INFRA-001). Scripts `dev`/`build`/`preview` run
  vitepress on the project root (`srcDir` set in config).
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
  FONT-001 done. Roadmap: config (incl.
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
  modern finish, mode list, keyboard/mobile/i18n principles.
- `design/color-system.md` — binding: main color (default `#80E0A7`, `themeConfig`)
  dominant esp. for text; hard rule that all auxiliary colors are derived from it; IBM
  Carbon as supporting palette; Oxocarbon (nvim for dark/light, vscode variant for
  paper) for code; three-mode table; §8 implementation reference (`--ct-` tokens,
  head-injected main color, `data-ct-mode` + `ct-mode` storage, three-theme shiki).
- `design/typography-and-icons.md` — binding: IBM Plex allocation (Sans = UI/body,
  Serif = paper-mode body, Mono = code + TUI chrome); Font Awesome for most icons, Nerd
  Font only in TUI chrome; hard rule: load via stylesheets injected in `<head>` from
  VitePress config, no npm font/icon packages. FONT-001 implementation note: Google
  Fonts CSS2, weights 400/600/700 (+italic 400), stacks in `_tokens.scss`.
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
  `paper` key is forwarded to shiki and loaded lazily as a raw object). Still to come:
  Font Awesome/Nerd Font links (FONT-002), locales (I18N-001).
- `theme/head.ts` — node-side `themeHead(themeConfig)`: IBM Plex Google-Fonts-CSS2
  `<link>`s + preconnects (FONT-001), inline `:root{--ct-main:…}` style from the
  resolved config (STYLE-001), inline pre-paint script restoring `ct-mode` from
  localStorage onto `data-ct-mode` with dark default (STYLE-002).
- `theme/shiki/oxocarbon.ts` — builds `oxocarbon-dark`/`oxocarbon-light` shiki themes
  from the oxocarbon.nvim palettes (treesitter groups transcribed to TextMate scopes;
  MIT attribution in header) and re-exports the vendored paper theme.
- `theme/shiki/oxocarbon-paper.json` — vendored `PRINT.json` from
  nyoom-engineering/oxocarbon-vscode (MIT), renamed `oxocarbon-paper`; grayscale
  ink-on-white print palette used for paper mode.
- `theme/config.ts` — CONF-001 configuration surface, framework-free (importable from
  the Node-side config): `TerminalThemeConfig` schema (`mainColor` default `#80E0A7`,
  `localeStrings` override hook for I18N-001; feature toggles land here),
  `themeConfigDefaults`, `resolveThemeConfig()` (per-option fallback, survives
  explicit `undefined`).
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
  temporary top bar (site title + mode-cycle button showing the raw mode key) and
  `.ct-content` viewport wrapping the home branch or `<Content/>`.
- `theme/styles/main.scss` — SCSS entry: `@use`s tokens/modes/shell/content/code, then
  base document styles (box-sizing, body bg/color/font via semantic tokens,
  `::selection` from the derived highlight).
- `theme/styles/_tokens.scss` — primitives: `--ct-main` fallback on `html` (lower
  specificity so the head-injected `:root` value wins), main-color derivatives via
  `color-mix()` (bright/dim/subtle/border/selection/deep/deeper — no hardcoded
  derivative hex), Carbon grays + semantic colors, IBM Plex font stacks, radius/gap.
- `theme/styles/_modes.scss` — semantic tokens (`--ct-bg/surface/text/link/border/
  inline-code/error…/font-body`) as mixins per mode; `:root` = dark (default),
  `[data-ct-mode=light|paper]` overrides, `@media print` force-applies paper tokens.
- `theme/styles/_code.scss` — code blocks: `div[class*=language-]` frame (hides
  default-theme copy/lang leftovers pending STYLE-004), `pre.shiki` basics, per-mode
  selection of `--shiki-dark/-light/-paper` token variables incl. print.
- `theme/styles/_content.scss` — STYLE-005: `.ct-content` markdown styling (headings,
  text, links, lists, blockquotes, tables w/ overflow-x scroll, hr, img, inline code)
  via semantic tokens; 72ch measure; 480px mobile padding tier.
- `theme/styles/_shell.scss` — temporary shell/top-bar/mode-switch styling for the
  placeholder layout; hidden in print; retired by THEME-001.

## src/ (site content — VitePress `srcDir`)

- `index.md` — home page stub: only `home: true` frontmatter.
- `markdown-examples.md` — VitePress starter demo of markdown features.
- `api-examples.md` — VitePress starter demo of the runtime API (`useData`).
