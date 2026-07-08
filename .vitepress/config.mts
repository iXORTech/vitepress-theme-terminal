import { defineConfigWithTheme } from 'vitepress'
import type { TerminalThemeConfig } from './theme/config'

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<TerminalThemeConfig>({
  srcDir: "src",

  title: "VitePress Theme Terminal",
  description: "A TUI-inspired VitePress Theme for Blog and Personal Website",

  // Theme options — the user configuration surface. Every option is optional;
  // defaults live in `.vitepress/theme/config.ts` (schema: TerminalThemeConfig).
  themeConfig: {
    // mainColor: "#80E0A7", // the one accent color; all variants derive from it
    // localeStrings: {},    // per-site overrides of theme UI strings (I18N-001)
  }
})
