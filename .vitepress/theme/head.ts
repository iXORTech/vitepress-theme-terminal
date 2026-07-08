// =============================================================================
// head.ts — <head> tags built from the theme configuration
// =============================================================================
// Node-side helper (framework-free apart from VitePress types) used by
// `.vitepress/config.mts`. Produces, in order:
//   1. IBM Plex stylesheet <link>s (FONT-001) — fonts load via stylesheets
//      injected in <head>, never via npm packages (typography-and-icons.md §3).
//   2. An inline <style> exposing the configured main color as `--ct-main`
//      (STYLE-001) — set at build time so there is no flash of the default.
//   3. An inline <script> restoring the persisted color mode before first
//      paint (STYLE-002) — dark is the default when nothing is stored.

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

// Restores the persisted mode (localStorage `ct-mode`) onto <html> before
// first paint; falls back to dark, the default mode (color-system.md §6).
const MODE_RESTORE_SCRIPT =
  "(function(){var m;try{m=localStorage.getItem('ct-mode')}catch(e){}" +
  "if(m!=='light'&&m!=='paper'){m='dark'}" +
  "document.documentElement.setAttribute('data-ct-mode',m)})()"

/** Build the theme's `<head>` entries from the user `themeConfig`. */
export function themeHead(user?: TerminalThemeConfig): HeadConfig[] {
  const { mainColor } = resolveThemeConfig(user)
  return [
    // Font loading (FONT-001)
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: IBM_PLEX_CSS }],
    // Main color custom property (STYLE-001)
    ['style', {}, `:root{--ct-main:${mainColor};}`],
    // Color-mode restore (STYLE-002)
    ['script', {}, MODE_RESTORE_SCRIPT],
  ]
}
