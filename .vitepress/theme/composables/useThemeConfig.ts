// =============================================================================
// useThemeConfig.ts — component access to the resolved theme config (CONF-001)
// =============================================================================
// Client-side composable wrapping the framework-free schema in `../config.ts`.
// Components read every user option through this — never from `useData()`
// directly — so defaults are always applied.

import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useData } from 'vitepress'
import { resolveThemeConfig } from '../config'
import type { ResolvedTerminalThemeConfig, TerminalThemeConfig } from '../config'

/**
 * Reactive, fully-resolved theme configuration. Wraps VitePress `useData()`,
 * so locale-specific `themeConfig` (per-locale overrides) is honored.
 */
export function useThemeConfig(): ComputedRef<ResolvedTerminalThemeConfig> {
  const { theme } = useData<TerminalThemeConfig>()
  return computed(() => resolveThemeConfig(theme.value))
}
