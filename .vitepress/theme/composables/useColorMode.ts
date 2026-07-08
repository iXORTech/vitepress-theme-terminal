// =============================================================================
// useColorMode.ts — color-mode state: dark / light / paper (STYLE-002)
// =============================================================================
// The active mode lives on <html data-ct-mode="…">; the inline head script
// (theme/head.ts) restores the persisted choice before first paint, so this
// composable only has to mirror and update it. The choice persists in
// localStorage under `ct-mode`. Dark is the default (color-system.md §6).

import { onMounted, readonly, ref } from 'vue'
import type { DeepReadonly, Ref } from 'vue'

export type ColorMode = 'dark' | 'light' | 'paper'

const MODES: ColorMode[] = ['dark', 'light', 'paper']
const STORAGE_KEY = 'ct-mode'
const ATTRIBUTE = 'data-ct-mode'

// Module-level singleton so every component shares the same reactive state.
const mode = ref<ColorMode>('dark')

function isColorMode(value: unknown): value is ColorMode {
  return MODES.includes(value as ColorMode)
}

/** Read, set, and cycle the active color mode. SSR-safe. */
export function useColorMode(): {
  mode: DeepReadonly<Ref<ColorMode>>
  setMode: (m: ColorMode) => void
  cycleMode: () => void
} {
  // Sync with the attribute the head script applied before hydration.
  onMounted(() => {
    const current = document.documentElement.getAttribute(ATTRIBUTE)
    if (isColorMode(current)) mode.value = current
  })

  const setMode = (m: ColorMode): void => {
    mode.value = m
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute(ATTRIBUTE, m)
    }
    try {
      localStorage.setItem(STORAGE_KEY, m)
    } catch {
      // Persistence unavailable (private browsing, etc.) — mode still applies.
    }
  }

  // dark → light → paper → dark …
  const cycleMode = (): void => {
    setMode(MODES[(MODES.indexOf(mode.value) + 1) % MODES.length])
  }

  return { mode: readonly(mode), setMode, cycleMode }
}
