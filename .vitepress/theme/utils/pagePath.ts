// ============================================================================
// pagePath.ts — shared home-relative page locations
// ============================================================================
// TUI surfaces use the same shell-style location for the current page. Keeping
// the formatter here prevents the status bar and card prompts from drifting.

/** Format a VitePress source-relative path as a home-relative TUI location. */
export function formatPageLocation(relativePath: string): string {
  const path = relativePath
    .replace(/(^|\/)index\.md$/, '')
    .replace(/\.md$/, '')
  return path ? `~/${path}` : '~'
}

/** Whether a link is an external/absolute URL (carries a URL scheme). */
export function isExternalLink(link: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(link)
}

/**
 * Map a site-absolute link onto the page `relativePath` form so the current
 * page can be matched (active-tab / active-row highlighting) without caring
 * about `base` or clean-URL settings; external URLs return `null` (never match).
 * Shared by the explorer tree and the tool-bar navigation tabs.
 */
export function linkRelativePath(link: string): string | null {
  if (isExternalLink(link)) return null
  let path = link
    .replace(/[?#].*$/, '')
    .replace(/^\//, '')
    .replace(/\.html$/, '')
  if (path === '' || path.endsWith('/')) path += 'index'
  return `${path}.md`
}
