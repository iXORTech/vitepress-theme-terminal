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
