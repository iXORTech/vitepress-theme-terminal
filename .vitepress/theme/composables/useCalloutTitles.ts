// =============================================================================
// useCalloutTitles.ts — client re-localization of callout default titles (MD-002)
// =============================================================================
// Callout HTML is static markdown output: default titles are baked in at
// build time in the site's default language, marked with
// `data-ct-callout-title="<name>"` (theme/markdown/callouts.ts). Custom
// titles carry no marker and are never touched. This composable rewrites the
// marked titles from the locale table whenever the UI language switches or
// new content renders — call it once from the layout.

import { onMounted, watch } from 'vue'
import { onContentUpdated } from 'vitepress'
import { useThemeLocale } from './useThemeLocale'
import type { ThemeLocaleKey } from '../locales'

export function useCalloutTitles(): void {
  const { strings } = useThemeLocale()

  const patch = (): void => {
    if (typeof document === 'undefined') return
    for (const el of document.querySelectorAll('[data-ct-callout-title]')) {
      const name = el.getAttribute('data-ct-callout-title')
      const text = strings.value[`callout.${name}` as ThemeLocaleKey]
      if (text) el.textContent = text
    }
  }

  onMounted(patch)
  onContentUpdated(patch) // page navigations swap in fresh markdown DOM
  watch(strings, patch) // language switch / per-language overrides
}
