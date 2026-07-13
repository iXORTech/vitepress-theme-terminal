import { defineConfigWithTheme } from "vitepress";
import type { TerminalThemeConfig } from "./theme/config";
import { themeHead } from "./theme/head";
import { createMarkdownConfig } from "./theme/markdown";
import {
  oxocarbonDark,
  oxocarbonLight,
  oxocarbonPaper,
} from "./theme/shiki/oxocarbon";

// Default UI language (I18N-003): SSR text and build-time markdown defaults
// (e.g. callout titles) render in this language; the client switches in place.
// Locale tags use the minimal canonical form (I18N-005): bare `en`, `zh-Hans`.
const lang = "en";

// Theme options — the user configuration surface. Every option is optional;
// defaults live in `.vitepress/theme/config.ts` (schema: TerminalThemeConfig).
const themeConfig: TerminalThemeConfig = {
  // mainColor: "#80E0A7", // the one accent color; all variants derive from it

  // User-facing config text is LocalizableText: a plain string for all
  // languages, or a per-language map resolved against the active UI language
  // (I18N-004). Unset title/description fall back to the site values below.
  title: {
    en: "VitePress Theme Terminal",
    "zh-Hans": "VitePress 终端主题",
  },
  description: {
    en: "A TUI-inspired VitePress Theme for Blog and Personal Website",
    "zh-Hans": "一个受 TUI 界面风格启发的 VitePress 博客与个人网站主题",
  },

  // Per-language theme-string overrides; a complete table under a new tag
  // adds a whole language to the switcher (I18N-003).
  // localeStrings: { "zh-Hans": { "mode.paper": "阅读" } },

  // Author & license system (CONF-002) — the single source for the footer
  // copyright & license icons, shell-prompt decorations, and the license
  // card. `username` is derived shell-safe from `name` when unset; the
  // license defaults to CC BY-NC-SA 4.0 (a custom name replaces the default
  // as a whole — bring your own url/icons).
  // author: { name: "Ada Lovelace", username: "ada" },
  // license: { name: "MIT", url: "https://opensource.org/license/mit/" },

  // Auto-discover every Markdown file below src/. Folder index pages become
  // folder links; page labels come from frontmatter title metadata. An
  // index-less folder can keep its localized label and initial state in an
  // adjacent src/**/explorer.json file.
  explorer: "auto",

  // Footer (THEME-004) — the RSS icon renders only when a feed URL is set;
  // social icons are Font Awesome classes with a localizable label.
  // The copyright author and the license icons come from `author`/`license`.
  footer: {
    rss: "/feed.rss", // demo feed — not actually generated yet
    social: [
      {
        icon: "fa-brands fa-github",
        link: "https://github.com/iXORTech/vitepress-theme-terminal-reforged",
        label: "GitHub",
      },
    ],
  },

  // Site search (SEARCH-001) — the find palette (tool-bar magnifier or `/`)
  // queries this Algolia DocSearch index directly and renders results in its
  // own TUI window (no DocSearch modal). Use the search-only (public) API key.
  // Without credentials the palette still opens, showing a "not configured"
  // notice.
  // search: {
    // algolia: {
      // appId: "YOUR_APP_ID",
      // apiKey: "YOUR_SEARCH_ONLY_API_KEY",
      // indexName: "YOUR_INDEX",
    // },
  // },
};

// Shiki themes for the three color modes (STYLE-003). VitePress registers
// `light`/`dark` up front and forwards the whole object to Shiki with
// `defaultColor: false`; the extra `paper` entry is a raw theme object, which
// Shiki loads on the fly — every token then carries --shiki-dark/-light/-paper
// variables, switched per mode in styles/_code.scss.
const shikiThemes = {
  light: oxocarbonLight,
  dark: oxocarbonDark,
  paper: oxocarbonPaper,
};

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<TerminalThemeConfig>({
  srcDir: "src",

  title: "VitePress Theme Terminal",
  description: "A TUI-inspired VitePress Theme for Blog and Personal Website",

  // Fonts (FONT-001), main-color property (STYLE-001), mode restore (STYLE-002)
  head: themeHead(themeConfig),

  themeConfig,

  // UI language is a client-side preference — no /<lang>/ URL trees
  // (I18N-003, design-language.md §9). The default follows `lang`; the
  // switcher offers the built-in tables (en, zh-Hans) plus any language added
  // via `themeConfig.localeStrings`.
  lang,

  markdown: {
    theme: shikiThemes,
    // Math formulas via VitePress's built-in markdown-it-mathjax3 wiring (MD-001)
    math: true,
    // Plugin suite (MD-001) + callout containers (MD-002)
    config: createMarkdownConfig(lang),
  },
});
