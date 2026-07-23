// =============================================================================
// sidebarWidth.ts — resizable-sidebar bounds & storage keys (THEME-025/026/027)
// =============================================================================
// Framework-free constants shared by two consumers that must agree on the same
// numbers: `composables/useResizableSidebar.ts` (live drag / keyboard clamping)
// and `head.ts` (the pre-paint restore script that clamps the persisted value
// before first paint — so there is no flash of the default width). Kept here,
// with no `vue` import, so the node-side `head.ts` can import it too.
//
// Widths are stored in localStorage as an integer pixel string and applied to a
// CSS custom property on <html>; the panel SCSS reads it with a rem fallback so
// an un-resized panel keeps its documented default width. The min/max clamp
// keeps the tree/outline readable without crowding the viewport.

/** A resizable panel's persistence key, CSS variable, and px min/max bounds. */
export interface SidebarWidthSpec {
  /** localStorage key holding the chosen width (integer px, as a string). */
  key: string
  /** CSS custom property the width is applied to on <html>. */
  cssVar: string
  /** Smallest allowed width, px (design-language.md §4). */
  min: number
  /** Largest allowed width, px. */
  max: number
}

// File explorer (THEME-025) — default 15rem (240px), see _explorer.scss.
export const EXPLORER_WIDTH: SidebarWidthSpec = {
  key: 'ct-explorer-width',
  cssVar: '--ct-explorer-width',
  min: 180,
  max: 420,
}

// Article table of contents (THEME-026) — default 14rem (224px), see _toc.scss.
export const TOC_WIDTH: SidebarWidthSpec = {
  key: 'ct-toc-width',
  cssVar: '--ct-toc-width',
  min: 160,
  max: 400,
}

// TOC desktop retract state (THEME-027): localStorage value `'closed'` collapses
// the outline to its reopen rail; the head script mirrors it pre-paint as the
// `data-ct-toc="closed"` attribute on <html> so the panel never flashes open.
export const TOC_COLLAPSE_KEY = 'ct-toc'
