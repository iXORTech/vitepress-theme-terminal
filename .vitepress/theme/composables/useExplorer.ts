// =============================================================================
// useExplorer.ts — file-explorer visibility state (THEME-002)
// =============================================================================
// Module-singleton state shared by the tool-bar toggle and the explorer panel.
// Two independent states, because the explorer is two things (design-
// language.md §4/§8): on desktop a retractable side panel whose extended/
// retracted choice persists in localStorage (`ct-explorer`, alongside
// `ct-mode`/`ct-lang`), on mobile a transient off-canvas drawer that always
// starts closed. The single tool-bar control drives whichever applies to the
// current viewport width.

import { computed, onMounted, readonly, ref } from 'vue'
import type { ComputedRef, DeepReadonly, Ref } from 'vue'
import { useColorMode } from './useColorMode'
import { useThemeConfig } from './useThemeConfig'

const STORAGE_KEY = 'ct-explorer'
const NODES_KEY = 'ct-explorer-nodes'

// Must match the drawer breakpoint in styles/_explorer.scss.
const DRAWER_QUERY = '(max-width: 640px)'

// Module-level singletons so every component shares the same state.
// Desktop defaults to extended; SSR renders it that way.
const desktopOpen = ref(true)
const drawerOpen = ref(false)

// Per-folder expanded states the visitor has touched, keyed by the node's
// raw config-text path (THEME-011). Only deviations live here — untouched
// folders follow the depth default (first layer open, deeper collapsed) or
// the node's explicit `collapsed`. Persisted as JSON and restored post-mount.
const nodeStates = ref<Record<string, boolean>>({})
let nodesRestored = false

function isDrawerViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(DRAWER_QUERY).matches
}

/** Explorer availability and open state, plus the toggle the tool bar uses. */
export function useExplorer(): {
  /** Whether the explorer exists at all: a tree is configured and the mode isn't paper. */
  available: ComputedRef<boolean>
  desktopOpen: DeepReadonly<Ref<boolean>>
  drawerOpen: DeepReadonly<Ref<boolean>>
  toggle: () => void
  closeDrawer: () => void
  /** A folder's expanded state: the remembered toggle, else its default. */
  isNodeExpanded: (key: string, defaultOpen: boolean) => boolean
  /** Remember (and persist) a folder's expanded state. */
  setNodeExpanded: (key: string, open: boolean) => void
} {
  const config = useThemeConfig()
  const { mode } = useColorMode()

  // The explorer is not part of the UI in paper mode (design-language.md §4)
  // and doesn't exist without configured contents — the layout skips rendering
  // it and the tool bar hides the toggle.
  const available = computed(
    () => config.value.explorer.length > 0 && mode.value !== 'paper',
  )

  // Restore the persisted desktop preference and the remembered per-folder
  // states post-mount (avoids SSR mismatch).
  onMounted(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'closed') desktopOpen.value = false
    } catch {
      // Persistence unavailable — keep the default.
    }
    if (!nodesRestored) {
      nodesRestored = true
      try {
        const raw = localStorage.getItem(NODES_KEY)
        const parsed: unknown = raw ? JSON.parse(raw) : null
        if (parsed && typeof parsed === 'object') {
          nodeStates.value = parsed as Record<string, boolean>
        }
      } catch {
        // Unreadable state — folders keep their defaults.
      }
    }
  })

  /** The tool-bar control: opens the drawer on mobile, retracts/extends on desktop. */
  const toggle = (): void => {
    if (isDrawerViewport()) {
      drawerOpen.value = !drawerOpen.value
      return
    }
    desktopOpen.value = !desktopOpen.value
    try {
      localStorage.setItem(STORAGE_KEY, desktopOpen.value ? 'open' : 'closed')
    } catch {
      // Persistence unavailable — the choice still applies to this session.
    }
  }

  const closeDrawer = (): void => {
    drawerOpen.value = false
  }

  const isNodeExpanded = (key: string, defaultOpen: boolean): boolean =>
    nodeStates.value[key] ?? defaultOpen

  const setNodeExpanded = (key: string, open: boolean): void => {
    nodeStates.value[key] = open
    try {
      localStorage.setItem(NODES_KEY, JSON.stringify(nodeStates.value))
    } catch {
      // Persistence unavailable — the state still applies to this session.
    }
  }

  return {
    available,
    desktopOpen: readonly(desktopOpen),
    drawerOpen: readonly(drawerOpen),
    toggle,
    closeDrawer,
    isNodeExpanded,
    setNodeExpanded,
  }
}
