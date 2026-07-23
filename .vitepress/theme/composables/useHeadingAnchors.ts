// =============================================================================
// useHeadingAnchors.ts — heading permalink labels + link copy (THEME-023/028)
// =============================================================================
// VitePress emits a slug `id` and a `.header-anchor` `<a href="#slug">` on every
// content heading; the `#` affordance and the hover/focus reveal are pure CSS
// (styles/_anchors.scss). This composable, called once from the layout, owns the
// two client behaviors of that control:
//   - LABEL: its default `aria-label` ("Permalink to …") is baked at build time
//     in English, so — like useCodeCopy's COPY labels — it is re-localized from
//     the active locale table on mount, on content updates (navigation), and on
//     a UI-language switch;
//   - COPY (THEME-028): activating the control copies that heading's **full**
//     URL (origin + path + `#slug`) to the clipboard, confirmed by a transient
//     notification (THEME-029). The link keeps its normal behavior — the hash
//     still lands in the URL and the panel still scrolls — the copy is added on
//     top, never a `preventDefault`.
//
// In-panel hash scrolling (clicking an anchor, or loading a `#slug` URL) is
// handled by useViewportScroll (THEME-008): the anchors live inside the
// `.ct-viewport` scroll container, so its delegated click handler catches them.

import { onBeforeUnmount, onMounted, watch } from 'vue'
import { onContentUpdated } from 'vitepress'
import { useNotifications } from './useNotifications'
import { useThemeLocale } from './useThemeLocale'

export function useHeadingAnchors(): void {
  const { strings } = useThemeLocale()
  const { notify } = useNotifications()

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

  // Copy the heading's absolute URL. `anchor.href` is the fragment-only href
  // resolved against the document — origin, path, query and `#slug` included —
  // so it stays correct under `base` and either URL style (THEME-030).
  const copyLink = async (anchor: HTMLAnchorElement): Promise<void> => {
    try {
      await navigator.clipboard.writeText(anchor.href)
    } catch {
      return // clipboard unavailable (insecure context, denied) — no false confirmation
    }
    notify(strings.value['anchor.copied'])
  }

  // One delegated listener survives content swaps (no per-anchor binding).
  const onClick = (event: MouseEvent): void => {
    const anchor =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('.ct-content .header-anchor')
        : null
    if (anchor) void copyLink(anchor)
  }

  onMounted(() => {
    document.addEventListener('click', onClick)
    relabel()
  })
  onBeforeUnmount(() => document.removeEventListener('click', onClick))
  onContentUpdated(relabel) // fresh markdown DOM after navigation
  watch(strings, relabel) // language switch / per-language overrides
}
