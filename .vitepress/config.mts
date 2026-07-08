import { defineConfigWithTheme } from "vitepress";
import type { TerminalThemeConfig } from "./theme/config";
import { themeHead } from "./theme/head";
import {
  oxocarbonDark,
  oxocarbonLight,
  oxocarbonPaper,
} from "./theme/shiki/oxocarbon";

// Theme options — the user configuration surface. Every option is optional;
// defaults live in `.vitepress/theme/config.ts` (schema: TerminalThemeConfig).
const themeConfig: TerminalThemeConfig = {
  // mainColor: "#80E0A7", // the one accent color; all variants derive from it
  // localeStrings: {},    // per-site overrides of theme UI strings (I18N-001)
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

  markdown: {
    theme: shikiThemes,
  },
});
