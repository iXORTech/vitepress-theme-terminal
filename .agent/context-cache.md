# Context Cache

Brief per-file summaries of the repository — purpose plus the essentials, 1–3 lines
each. **Update whenever a file is added, meaningfully changed, or removed** (rule:
[`AGENTS.md`](../AGENTS.md) §5). Last updated: 2026-07-07 (DOC-005).

## Root

- `package.json` — pnpm project; devDeps only: `vitepress 2.0.0-alpha.18`, `vue ^3.5.39`.
  Scripts `dev`/`build`/`preview` run vitepress on the project root (`srcDir` set in
  config). No `sass` yet (comes with INFRA-001).
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
  acceptance criteria. DOC-001/003/005 done; the rest is the roadmap for building the
  theme, incl. THEME-004 (footer) and DOC-004 (user docs, deps: all tasks). Note:
  I18N-001 also requires shipping a Chinese (Simplified) locale.
- `context-cache.md` — this file.

## docs/

- `README.md` — documentation index (design docs, process files) plus documentation
  rules; clarifies `docs/` is repo documentation, not site content.
- `design/design-language.md` — binding: identity, NeoVim/LazyVim-inspired TUI design
  language, hard no-branding rule, iconic components table (tool bar, status bar,
  explorer, floating windows), footer spec (in-viewport: custom Vue region · separator
  · copyright/social row · powered-by/RSS/CC-BY row; details TBD in THEME-004), modern
  finish, mode list, keyboard/mobile/i18n principles.
- `design/color-system.md` — binding: main color (default `#80E0A7`, `themeConfig`)
  dominant esp. for text; hard rule that all auxiliary colors are derived from it; IBM
  Carbon as supporting palette; Oxocarbon (nvim for dark/light, vscode variant for
  paper) for code; three-mode table.
- `design/typography-and-icons.md` — binding: IBM Plex allocation (Sans = UI/body,
  Serif = paper-mode body, Mono = code + TUI chrome); Font Awesome for most icons, Nerd
  Font only in TUI chrome; hard rule: load via stylesheets injected in `<head>` from
  VitePress config, no npm font/icon packages.
- `design/ui-sketch.md` — ASCII wireframes (structure binding, details illustrative):
  desktop shell (tool bar / explorer + viewport / status bar), floating find palette,
  mobile layout with explorer drawer, paper mode (keeps minimal tool/status bars,
  hides explorer/utility panels), in-viewport footer; legend of placeholder glyphs and
  a region → spec → build-task map.

## .vitepress/

- `config.mts` — site config: `srcDir: "src"`, title "VitePress Theme Terminal",
  description. Future home of head injection (fonts/icons), `themeConfig` surface,
  locales, and Shiki theme setup.
- `theme/index.ts` — theme entry: exports `Layout.vue`, imports `style.css`, empty
  `enhanceApp`.
- `theme/Layout.vue` — placeholder layout: `frontmatter.home` branch renders site
  title/description/starter links, otherwise a Home link + `<Content/>`. Replaced by
  THEME-001.
- `theme/style.css` — placeholder (only sets `html { font-family: Arial, Helvetica }`).
  Retired by INFRA-001 in favor of SCSS.

## src/ (site content — VitePress `srcDir`)

- `index.md` — home page stub: only `home: true` frontmatter.
- `markdown-examples.md` — VitePress starter demo of markdown features.
- `api-examples.md` — VitePress starter demo of the runtime API (`useData`).
