// =============================================================================
// useFloatingWindow.ts — shared floating-window state (THEME-003)
// =============================================================================
// Module-singleton state for the theme's single floating utility window
// (design-language.md §4, ui-sketch.md §2). All utilities — the find palette
// (SEARCH-002), the settings panel (THEME-007) — share
// this one instance: opening a utility replaces whatever is currently shown,
// so at most one floating window exists at a time. The window is hidden by
// default and only ever opened programmatically through `open()`.

import { computed, shallowRef } from 'vue'
import type { Component, ComputedRef, ShallowRef } from 'vue'

/**
 * One framed pane of the floating window (THEME-017): its own bordered box
 * with the title sitting on the top border line, TUI style.
 */
export interface FloatingWindowPane {
  /**
   * Pane title getter — a function (typically closing over `t()`) so the
   * title re-resolves when the UI language switches while the window is open.
   * Rendered on the pane's top border.
   */
  title: () => string
  /**
   * Optional border-title icon — Font Awesome classes (general-icon context,
   * typography-and-icons.md §2), rendered decoratively before the title
   * (THEME-016). Omit for a text-only title.
   */
  icon?: string
  /** The pane's content, rendered as its scrolling body. */
  component: Component
}

/** One utility rendered inside the shared floating window. */
export interface FloatingWindowUtility {
  /** Stable identifier, e.g. `'search'`, `'settings'`. */
  id: string
  /** Accessible dialog name getter (not visually rendered; panes show titles). */
  label: () => string
  /**
   * The utility's framed panes, stacked top to bottom with the floating gap —
   * e.g. the find palette pairs an input pane with a results pane; simple
   * utilities supply a single pane (THEME-017).
   */
  panes: FloatingWindowPane[]
}

// Module-level singleton so every opener and the window component share the
// same state. `shallowRef` keeps the payload (and its component) unproxied.
const active = shallowRef<FloatingWindowUtility | null>(null)

/** The shared floating window's state and controls. */
export function useFloatingWindow(): {
  /** The currently shown utility — `null` while the window is hidden. */
  active: Readonly<ShallowRef<FloatingWindowUtility | null>>
  isOpen: ComputedRef<boolean>
  /** Show the window with the given utility (replacing any current one). */
  open: (utility: FloatingWindowUtility) => void
  close: () => void
} {
  const isOpen = computed(() => active.value !== null)

  const open = (utility: FloatingWindowUtility): void => {
    active.value = utility
  }

  const close = (): void => {
    active.value = null
  }

  return { active, isOpen, open, close }
}
