// =============================================================================
// head.ts — <head> tags built from the theme configuration
// =============================================================================
// Node-side helper (framework-free apart from VitePress types) used by
// `.vitepress/config.mts`. Produces, in order:
//   1. IBM Plex stylesheet <link>s (FONT-001) — fonts load via stylesheets
//      injected in <head>, never via npm packages (typography-and-icons.md §3).
//   2. Icon stylesheet <link>s (FONT-002): Font Awesome for general-purpose
//      icons, symbols-only Nerd Font for TUI chrome — same loading rule.
//   3. An inline <style> exposing the configured main color as `--ct-main`
//      (STYLE-001) — set at build time so there is no flash of the default.
//   4. An inline <script> restoring the persisted color mode (STYLE-002) and
//      the content font preferences (THEME-007) before first paint — dark is
//      the default mode, and the font attributes are set only for a non-default
//      choice, so there is no flash or reflow when the settings are restored.

import type { HeadConfig } from 'vitepress'
import { resolveThemeConfig } from './config'
import type { TerminalThemeConfig } from './config'

// IBM Plex Sans / Serif / Mono via the Google Fonts CSS2 API
// (typography-and-icons.md §3 names this as an approved source).
const IBM_PLEX_CSS =
  'https://fonts.googleapis.com/css2' +
  '?family=IBM+Plex+Mono:ital,wght@0,400;0,600;1,400' +
  '&family=IBM+Plex+Sans:ital,wght@0,400;0,600;0,700;1,400' +
  '&family=IBM+Plex+Serif:ital,wght@0,400;0,600;0,700;1,400' +
  '&display=swap'

// Icon stylesheets (FONT-002/004, typography-and-icons.md §2–3): Font Awesome
// Free from cdnjs; the generated symbols-only Nerd Font stylesheet from the
// latest Nerd Fonts master branch via jsDelivr (defines family
// "NerdFontsSymbols Nerd Font", checked by useNerdFont).
const FONT_AWESOME_CSS =
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css'
const NERD_FONT_CSS =
  'https://cdn.jsdelivr.net/gh/ryanoasis/nerd-fonts@master/css/nerd-fonts-generated.min.css'

// Restores the persisted color mode (localStorage `ct-mode`) and content font
// preferences (`ct-font-family` / `ct-font-size`, THEME-007) onto <html> before
// first paint. Mode falls back to dark (color-system.md §6); the font
// attributes are applied only for a valid non-default choice, so the default
// (mode-following family, medium size) leaves <html> clean and the CSS
// fallbacks win — no flash, no reflow.
const MODE_RESTORE_SCRIPT =
  "(function(){var d=document.documentElement;try{" +
  "var m=localStorage.getItem('ct-mode');" +
  "if(m!=='light'&&m!=='paper'){m='dark'}d.setAttribute('data-ct-mode',m);" +
  "var ff=localStorage.getItem('ct-font-family');" +
  "if(ff==='sans'||ff==='serif'||ff==='mono'){d.setAttribute('data-ct-font-family',ff)}" +
  "var fs=localStorage.getItem('ct-font-size');" +
  "if(fs==='small'||fs==='large'){d.setAttribute('data-ct-font-size',fs)}" +
  "}catch(e){}})()"

/** Build the theme's `<head>` entries from the user `themeConfig`. */
export function themeHead(user?: TerminalThemeConfig): HeadConfig[] {
  const { mainColor } = resolveThemeConfig(user)
  return [
    // Font loading (FONT-001)
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: IBM_PLEX_CSS }],
    // Icon loading (FONT-002)
    ['link', { rel: 'stylesheet', href: FONT_AWESOME_CSS }],
    ['link', { rel: 'stylesheet', href: NERD_FONT_CSS }],
    // Main color custom property (STYLE-001)
    ['style', {}, `:root{--ct-main:${mainColor};}`],
    // Color-mode restore (STYLE-002) + font-preference restore (THEME-007)
    ['script', {}, MODE_RESTORE_SCRIPT],
  ]
}
