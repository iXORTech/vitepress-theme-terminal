// =============================================================================
// useCleanUrls.ts — normalize a `.html` URL in place (THEME-033)
// =============================================================================
// The site generates suffix-free links (`cleanUrls`, THEME-030), but a reader
// can still ARRIVE on the `.html` form: an old external link, a bookmark from
// before the switch, or a markdown link an author wrote as `./page.html`. The
// page served is already the right one — only its address is the legacy
// spelling — so this composable, called once from the layout, rewrites the
// address bar to the clean form with `history.replaceState`: no navigation, no
// reload, and no extra history entry (Back still goes where it went before).
//
// Deliberately gated on the site's own `cleanUrls` setting: with the option
// off, `/page.html` IS the canonical URL and stripping it would produce a link
// the host cannot serve. Only the suffix is touched, so a deployed `base`
// prefix, the query string, and the `#hash` all survive — which matters for the
// heading-link copy (THEME-028), whose copied URL comes from the address bar.

import { onMounted } from 'vue'
import { onContentUpdated, useData } from 'vitepress'

/**
 * The clean form of a pathname, or `null` when there is nothing to strip.
 * `…/index.html` becomes the folder form, since that is the URL the site links
 * to: `/guide/index.html` → `/guide/`, `/index.html` → `/`.
 */
export function cleanPathname(pathname: string): string | null {
  if (!pathname.endsWith('.html')) return null
  return pathname.endsWith('/index.html')
    ? pathname.slice(0, -'index.html'.length)
    : pathname.slice(0, -'.html'.length)
}

export function useCleanUrls(): void {
  const { site } = useData()

  const normalize = (): void => {
    if (typeof window === 'undefined' || !site.value.cleanUrls) return
    const cleaned = cleanPathname(location.pathname)
    if (cleaned === null) return
    // Keep the current history entry's state so the router's own bookkeeping
    // (and the Back button) are unaffected — only the URL string changes.
    history.replaceState(
      history.state,
      '',
      `${cleaned}${location.search}${location.hash}`,
    )
  }

  onMounted(normalize)
  // Also after client-side navigation — an in-content link written with an
  // explicit `.html` is left as-is by VitePress's link normalizer.
  onContentUpdated(normalize)
}
