// ============================================================================
// useNavDrawer — tool-bar overflow drawer state (THEME-022)
// ============================================================================
// Module-singleton state shared by the tool bar and the right-side nav drawer:
//
//   - `collapsed` — the tool bar cannot display the title, nav, and action
//     icons in full. Written by ToolBar.vue, which owns the measurement (a
//     momentary no-shrink layout pass compares the bar's natural content width
//     against the available width, so the collapse triggers at ANY window
//     width — not just a fixed breakpoint — and re-expands when room returns).
//   - `drawerOpen` — visibility of the right-side off-canvas drawer holding
//     the collapsed nav + actions (NavDrawer.vue).
//
// Opening the nav drawer closes the explorer drawer so only one side's drawer
// is ever open (design-language.md §4, tool bar overflow drawer); the reverse
// direction is handled by the tool bar's explorer toggle.

import { readonly, ref } from 'vue'
import type { DeepReadonly, Ref } from 'vue'
import { useExplorer } from './useExplorer'

// Shared singleton state (one tool bar, one drawer)
const collapsed = ref(false)
const drawerOpen = ref(false)

/** Collapsed-bar state plus the right-side drawer controls. */
interface UseNavDrawer {
  /** Whether the bar is collapsed (nav + actions live in the drawer). */
  collapsed: Ref<boolean>
  /** Whether the right-side drawer is currently open. */
  drawerOpen: DeepReadonly<Ref<boolean>>
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
}

export function useNavDrawer(): UseNavDrawer {
  const { closeDrawer: closeExplorerDrawer } = useExplorer()

  const openDrawer = (): void => {
    closeExplorerDrawer() // one drawer at a time
    drawerOpen.value = true
  }

  const closeDrawer = (): void => {
    drawerOpen.value = false
  }

  const toggleDrawer = (): void => {
    if (drawerOpen.value) closeDrawer()
    else openDrawer()
  }

  return {
    collapsed,
    drawerOpen: readonly(drawerOpen),
    openDrawer,
    closeDrawer,
    toggleDrawer,
  }
}
