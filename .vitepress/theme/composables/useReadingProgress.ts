// =============================================================================
// useReadingProgress.ts — viewport scroll progress for the status bar
// (THEME-001/008)
// =============================================================================
// Tracks how far the visitor has scrolled through the current page as an
// integer percentage (the status bar's `42%` segment, ui-sketch.md §1). The
// shell is a fixed frame, so the scroll container is the `.ct-viewport` panel
// — not the window (THEME-008, design-language.md §5). Pages that fit
// entirely inside the panel read as 100%. SSR-safe: starts at 0 and only
// attaches listeners in the browser; re-measures when VitePress swaps page
// content in place.

import { onMounted, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'
import { onContentUpdated } from 'vitepress'

export function useReadingProgress(): Ref<number> {
  const progress = ref(0)
  let scroller: HTMLElement | null = null

  const update = (): void => {
    if (!scroller) return
    const scrollable = scroller.scrollHeight - scroller.clientHeight
    progress.value =
      scrollable > 0
        ? Math.min(100, Math.round((scroller.scrollTop / scrollable) * 100))
        : 100 // page fits inside the panel — fully read
  }

  onMounted(() => {
    // The layout renders exactly one viewport panel, persistent across routes
    scroller = document.querySelector('.ct-viewport')
    if (!scroller) return
    update()
    scroller.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
  })

  onUnmounted(() => {
    scroller?.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  })

  // New page content changes the scrollable height — re-measure
  onContentUpdated(update)

  return progress
}
