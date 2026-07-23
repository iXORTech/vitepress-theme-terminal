// =============================================================================
// useToc.ts — shared article-TOC state (THEME-027 retract)
// =============================================================================
// Module-singleton state shared by `ArticleToc.vue` (which owns the panel and
// computes whether the current page even has an outline) and `Layout.vue`
// (which renders the TOC's resize handle only when the panel is actually
// showing). Two pieces of state:
//   • `visible`   — whether the outline is on screen at all (article page, enough
//                   headings, not paper mode). ArticleToc pushes this in; Layout
//                   reads it to gate the resize handle (THEME-026).
//   • `collapsed` — the desktop retract choice (THEME-027), persisted in
//                   localStorage (`ct-toc`) and mirrored pre-paint by the head
//                   script as `<html data-ct-toc="closed">`, so the panel never
//                   flashes open before collapsing.

import { readonly, ref } from 'vue'
import type { DeepReadonly, Ref } from 'vue'
import { TOC_COLLAPSE_KEY } from '../utils/sidebarWidth'

// Seed the retract state synchronously from the pre-paint <html> attribute (or
// localStorage) so the very first client render is already correct — the TOC is
// client-rendered (its headings come from the mounted DOM), so there is no SSR
// markup to mismatch, and reading here avoids an expanded-then-collapse flash.
function initialCollapsed(): boolean {
  if (typeof document !== 'undefined') {
    if (document.documentElement.getAttribute('data-ct-toc') === 'closed') return true
    try {
      if (localStorage.getItem(TOC_COLLAPSE_KEY) === 'closed') return true
    } catch {
      // Unreadable — fall through to the default.
    }
  }
  return false
}

const tocVisible = ref(false)
const tocCollapsed = ref(initialCollapsed())

export function useToc(): {
  visible: DeepReadonly<Ref<boolean>>
  collapsed: DeepReadonly<Ref<boolean>>
  /** ArticleToc reports whether the outline is currently on screen. */
  setVisible: (value: boolean) => void
  /** Retract / restore the outline on desktop (persisted). */
  toggle: () => void
} {
  const setVisible = (value: boolean): void => {
    tocVisible.value = value
  }

  const toggle = (): void => {
    tocCollapsed.value = !tocCollapsed.value
    try {
      localStorage.setItem(TOC_COLLAPSE_KEY, tocCollapsed.value ? 'closed' : 'open')
    } catch {
      // Persistence unavailable — the choice still applies to this session.
    }
    // Keep the pre-paint mirror current for the next navigation/reload.
    if (typeof document !== 'undefined') {
      if (tocCollapsed.value) {
        document.documentElement.setAttribute('data-ct-toc', 'closed')
      } else {
        document.documentElement.removeAttribute('data-ct-toc')
      }
    }
  }

  return {
    visible: readonly(tocVisible),
    collapsed: readonly(tocCollapsed),
    setVisible,
    toggle,
  }
}
