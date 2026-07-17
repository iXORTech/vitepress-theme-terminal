import { defineConfigWithTheme } from "vitepress";
import type { TerminalThemeConfig } from "./theme/config";
import { themeHead } from "./theme/head";
import { createMarkdownConfig } from "./theme/markdown";
import { createPageDataTransformer } from "./theme/pageData";
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
// Exported so the build-time dynamic-route loaders (`src/tags/[name].paths.mjs`,
// `src/categories/[name].paths.mjs`, `src/page/[num].paths.mjs`) can apply the
// same series listing toggles the components use (POST-002).
export const themeConfig: TerminalThemeConfig = {
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
  // Shell-prompt host override; blank/unset falls back to the automatically
  // normalized active site title.
  siteName: "vitepress-theme-terminal",

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

  // Tool bar (THEME-005) — the tabline and its action icons are configurable
  // without editing components. `nav` tabs render after the built-in `~/home`
  // tab (labels are LocalizableText, highlighted when the page matches);
  // `actions` are extra icon slots (Font Awesome) shown before the built-in
  // search / color-mode controls, for important social links or external tools.
  // A nav tab may also carry `items` (THEME-020): child `{ text, link, icon? }`
  // links shown in a hover dropdown submenu — the tab itself stays a link.
  toolbar: {
    nav: [
      {
        text: { en: "Guide", "zh-Hans": "指南" },
        link: "/guide/",
        icon: "fa-solid fa-book",
        items: [
          {
            text: { en: "Getting Started", "zh-Hans": "快速开始" },
            link: "/guide/getting-started",
            icon: "fa-solid fa-rocket",
          },
          {
            text: { en: "Advanced", "zh-Hans": "进阶" },
            link: "/guide/advanced/",
            icon: "fa-solid fa-flask",
          },
        ],
      },
      {
        text: { en: "Posts", "zh-Hans": "文章" },
        link: "/posts",
        icon: "fa-solid fa-feather",
        items: [
          { text: { en: "Categories", "zh-Hans": "分类" }, link: "/categories", icon: "fa-solid fa-folder" },
          { text: { en: "Tags", "zh-Hans": "标签" }, link: "/tags", icon: "fa-solid fa-tags" },
          { text: { en: "Series", "zh-Hans": "系列" }, link: "/series", icon: "fa-solid fa-layer-group" },
        ],
      },
      { text: { en: "Archives", "zh-Hans": "归档" }, link: "/archives", icon: "fa-solid fa-box-archive" },
    ],
    actions: [
      {
        icon: "fa-brands fa-github",
        link: "https://github.com/iXORTech/vitepress-theme-terminal",
        label: "GitHub",
      },
    ],
  },

  // Localized taxonomy display labels (I18N-008) — keys are the tag/category
  // names as authored in post frontmatter (matched through their slug);
  // values are LocalizableText display labels. Display-only: slugs, URLs, and
  // grouping stay derived from the authored names, so routes never change
  // with the language. Terms without an entry render verbatim.
  taxonomy: {
    tags: {
      theme: { en: "theme", "zh-Hans": "主题" },
      color: { en: "color", "zh-Hans": "色彩" },
    },
    categories: {
      Guides: { en: "Guides", "zh-Hans": "指南" },
      Design: { en: "Design", "zh-Hans": "设计" },
    },
  },

  // Series listing inclusion (POST-002) — series articles always render on
  // their own pages, the series index, and their series' landing list; these
  // toggles additionally admit them to the general post listings (all default
  // false). Admitted series articles carry their series name before the title
  // in the archives and per-term listings. This demo opts them into the
  // archives, categories, and tags, while `/posts` keeps regular posts only.
  series: {
    inArchives: true,
    inCategories: true,
    inTags: true,
    // inPosts: true,
  },

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
        link: "https://github.com/iXORTech/vitepress-theme-terminal",
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

  // Article comments (COMP-004) — a Waline-powered comment card renders at the
  // end of every article, and view/comment counts appear near the title. Set
  // your deployed Waline server URL to enable it; without it, no comment card
  // or counts render. A page can opt out with `comments: false` (or
  // `article: false` / `license: false`) in its frontmatter.
  comments: {
    waline: { serverURL: "https://waline.example.com" },
  },
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

  // Git-derived last-updated timestamp per page — the license card's "Updated"
  // row (COMP-003) uses it when a page has no explicit `updated` frontmatter.
  lastUpdated: true,

  // Fonts (FONT-001), main-color property (STYLE-001), mode restore (STYLE-002)
  head: themeHead(themeConfig),

  themeConfig,

  // UI language is a client-side preference — no /<lang>/ URL trees
  // (I18N-003, design-language.md §9). The default follows `lang`; the
  // switcher offers the built-in tables (en, zh-Hans) plus any language added
  // via `themeConfig.localeStrings`.
  lang,

  // Localized frontmatter maps (ARCH-003) — resolves a per-language
  // `description`/`title` to the build language for the SSR head; the client
  // re-resolves from the raw frontmatter on language switches.
  transformPageData: createPageDataTransformer(lang),

  markdown: {
    theme: shikiThemes,
    // Math formulas via VitePress's built-in markdown-it-mathjax3 wiring (MD-001)
    math: true,
    // Plugin suite (MD-001) + callout containers (MD-002)
    config: createMarkdownConfig(lang),
  },
});
