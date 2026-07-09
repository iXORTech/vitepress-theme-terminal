// =============================================================================
// useViewportScroll.ts — in-panel scrolling for the fixed shell frame
// (THEME-008)
// =============================================================================
// The shell is a fixed full-height frame: the page itself never scrolls — the
// `.ct-viewport` panel is the scroll container (design-language.md §5). The
// VitePress router only knows how to scroll the *window*, so this composable
// takes over the two behaviors that would otherwise be lost:
//   1. on navigation, jump to the URL-hash target or reset the panel to the
//      top (the router's window.scrollTo is a no-op here);
//   2. on same-page anchor clicks (header anchors, footnotes), scroll the
//      target into view inside the panel — the router still updates the URL.
// Initial-load fragment scrolling needs no help: the browser scrolls the
// nearest scrollable ancestor natively.

import { onMounted } from 'vue'
import type { Ref } from 'vue'
import { onContentUpdated } from 'vitepress'

export function useViewportScroll(viewport: Ref<HTMLElement | null>): void {
  // Scroll the element addressed by a location hash into view (inside the
  // panel — scrollIntoView scrolls the panel, the only scrollable ancestor).
  const scrollToHash = (hash: string, smooth = false): boolean => {
    if (!hash) return false
    let target: Element | null = null
    try {
      target = document.getElementById(decodeURIComponent(hash).slice(1))
    } catch {
      return false
    }
    target?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
    return target !== null
  }

  // Page navigations (and initial mount): hash target, else back to the top
  onContentUpdated(() => {
    if (!scrollToHash(location.hash) && viewport.value) {
      viewport.value.scrollTop = 0
    }
  })

  // Same-page anchor clicks: let the router handle the URL, do the panel
  // scroll ourselves once the click settles.
  onMounted(() => {
    viewport.value?.addEventListener('click', (event) => {
      const link = (event.target as Element).closest?.('a')
      if (!link || !link.hash) return
      if (
        link.origin !== location.origin ||
        link.pathname !== location.pathname
      ) {
        return // cross-page link — handled by onContentUpdated after routing
      }
      requestAnimationFrame(() => scrollToHash(link.hash, true))
    })
  })
}
