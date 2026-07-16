// =============================================================================
// useSiteText.ts — localized site title & description (I18N-004)
// =============================================================================
// Resolves `themeConfig.title`/`.description` (LocalizableText: plain string
// or per-language map) against the active UI language, falling back to the
// site config's `title`/`description`. Client-side, it keeps the browser tab
// title and `meta[name=description]` in sync with the language and the
// current page. Best effort by design: the server-rendered head keeps the
// site-config defaults (design-language.md §9).

import { computed, onMounted, watchEffect } from 'vue'
import type { ComputedRef } from 'vue'
import { useData } from 'vitepress'
import { resolveThemeConfig } from '../config'
import type { TerminalThemeConfig } from '../config'
import { asLocalizableText, resolveLocalizedText } from '../locales'
import { useThemeLocale } from './useThemeLocale'

/** Localized site title/description for the active UI language. */
export function useSiteText(): {
  title: ComputedRef<string>
  description: ComputedRef<string>
} {
  const { site, page, frontmatter, theme } = useData<TerminalThemeConfig>()
  const { language } = useThemeLocale()

  const config = computed(() => resolveThemeConfig(theme.value))

  const title = computed(
    () =>
      resolveLocalizedText(config.value.title, language.value) ||
      site.value.title,
  )
  const description = computed(
    () =>
      resolveLocalizedText(config.value.description, language.value) ||
      site.value.description,
  )

  // The page part of the tab title: a localized frontmatter `title` map wins
  // (ARCH-003 — a map makes VitePress's `page.title` fall back to the body
  // h1), else VitePress's resolved page title.
  const pageTitle = computed(
    () =>
      resolveLocalizedText(
        asLocalizableText(frontmatter.value.title),
        language.value,
      ) || page.value.title,
  )

  // Head sync — registered post-mount so it runs after VitePress's own head
  // updater in the flush queue and wins the write on page changes.
  onMounted(() => {
    watchEffect(() => {
      document.title = pageTitle.value
        ? `${pageTitle.value} | ${title.value}`
        : title.value
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', description.value)
    })
  })

  return { title, description }
}
