// =============================================================================
// useThemeLocale.ts — localized theme strings & UI-language state (I18N-001/003)
// =============================================================================
// The one way components obtain UI text (AGENTS.md §6.7: no hardcoded
// user-facing strings). The UI language is a client-side preference, exactly
// like the color mode: no `/<lang>/` URL trees (design-language.md §9). It
// defaults to the site's `lang`, persists in localStorage under `ct-lang`,
// and switching updates strings in place plus <html lang>. The stored choice
// is applied after mount so server-rendered markup hydrates cleanly.

import { computed, onMounted, ref } from 'vue'
import type { ComputedRef } from 'vue'
import { useData } from 'vitepress'
import { resolveThemeConfig } from '../config'
import type { TerminalThemeConfig } from '../config'
import {
  availableLanguages,
  matchLanguageTag,
  resolveLocaleStrings,
} from '../locales'
import type { ThemeLanguage, ThemeLocaleKey, ThemeLocaleStrings } from '../locales'

const STORAGE_KEY = 'ct-lang'

// Module-level singleton: every component shares the same preference.
// `null` = no explicit choice — follow the site `lang`.
const preferred = ref<string | null>(null)

/** Localized strings plus the language state and switcher data. */
export function useThemeLocale(): {
  strings: ComputedRef<ThemeLocaleStrings>
  t: (key: ThemeLocaleKey) => string
  /** Active UI language — canonical available tag (preference, else site `lang`). */
  language: ComputedRef<string>
  /** Languages offered by the switcher (built-in + config-added). */
  languages: ComputedRef<ThemeLanguage[]>
  setLanguage: (tag: string) => void
} {
  const { site, theme } = useData<TerminalThemeConfig>()

  const overrides = computed(
    () => resolveThemeConfig(theme.value).localeStrings,
  )
  const language = computed(() =>
    matchLanguageTag(preferred.value ?? site.value.lang, overrides.value),
  )
  const languages = computed(() => availableLanguages(overrides.value))
  const strings = computed(() =>
    resolveLocaleStrings(language.value, overrides.value),
  )

  const t = (key: ThemeLocaleKey): string => strings.value[key]

  const setLanguage = (tag: string): void => {
    preferred.value = tag
    if (typeof document !== 'undefined') {
      document.documentElement.lang = tag
    }
    try {
      localStorage.setItem(STORAGE_KEY, tag)
    } catch {
      // Persistence unavailable — the choice still applies to this session.
    }
  }

  // Restore the persisted choice post-hydration (avoids SSR text mismatch).
  onMounted(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
    } catch {
      return
    }
    if (stored && stored !== language.value) {
      setLanguage(stored)
    }
  })

  return { strings, t, language, languages, setLanguage }
}
