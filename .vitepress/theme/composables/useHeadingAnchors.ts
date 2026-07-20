// =============================================================================
// useHeadingAnchors.ts — heading permalink label localization (THEME-023)
// =============================================================================
// VitePress emits a slug `id` and a `.header-anchor` `<a href="#slug">` on every
// content heading; the `#` affordance and the hover/focus reveal are pure CSS
// (styles/_anchors.scss). Its default `aria-label` ("Permalink to …") is baked
// at build time in English, so — like useCodeCopy's COPY labels — this
// composable re-localizes each anchor's accessible name from the active locale
// table on mount, on content updates (navigation), and on a UI-language switch.
//
// In-panel hash scrolling (clicking an anchor, or loading a `#slug` URL) is
// already handled by useViewportScroll (THEME-008): the anchors live inside the
// `.ct-viewport` scroll container, so its delegated click handler catches them.

import { onMounted, watch } from 'vue'
import { onContentUpdated } from 'vitepress'
import { useThemeLocale } from './useThemeLocale'

export function useHeadingAnchors(): void {
  const { strings } = useThemeLocale()

  // The heading's text, excluding the anchor's own content (a zero-width space).
  const headingText = (heading: Element): string => {
    const clone = heading.cloneNode(true) as HTMLElement
    clone.querySelector('.header-anchor')?.remove()
    return (clone.textContent ?? '').trim()
  }

  // Re-label every heading anchor with the active language's permalink text.
  const relabel = (): void => {
    if (typeof document === 'undefined') return
    const template = strings.value['anchor.permalink']
    for (const anchor of document.querySelectorAll<HTMLElement>(
      '.ct-content .header-anchor',
    )) {
      const heading = anchor.parentElement
      if (!heading) continue
      const label = template.replace('{title}', headingText(heading))
      anchor.setAttribute('aria-label', label)
      anchor.setAttribute('title', label)
    }
  }

  onMounted(relabel)
  onContentUpdated(relabel) // fresh markdown DOM after navigation
  watch(strings, relabel) // language switch / per-language overrides
}
