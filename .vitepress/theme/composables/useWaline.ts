// =============================================================================
// useWaline.ts — Waline comments & article counts (COMP-004)
// =============================================================================
// Called once from the layout. When comments are configured
// (`themeConfig.comments.waline.serverURL`) and the current page is an article,
// this mounts the Waline comment widget into the ArticleComments card's
// `.ct-comments__waline` element and fills the ArticleMeta view/comment
// counters (`.ct-article-meta__views` / `.ct-article-meta__comments`).
//
// Waline is client-only and loaded lazily on first use (dynamic import on
// mount) — it never runs during SSR and costs nothing on pages without a
// comment card. Its own form UI follows the language switcher through Waline's
// shipped locale tables (mapped from the theme's canonical tags — the same
// documented vendor-chrome exception to the locale-table rule as Fancybox in
// COMP-002). Dark mode is wired via a CSS selector so it tracks `data-ct-mode`.

import { onBeforeUnmount, onMounted, watch } from 'vue'
import { onContentUpdated, useRoute } from 'vitepress'
import type { WalineInstance } from '@waline/client'
import { isCommentsConfigured } from '../config'
import { useThemeConfig } from './useThemeConfig'
import { useThemeLocale } from './useThemeLocale'

// Map a theme language tag → a Waline locale code (vendor UI). Waline ships
// `zh-CN` (not `zh-Hans`) and falls back to `en-US` for anything unknown.
function walineLang(tag: string): string {
  return tag.toLowerCase().split('-')[0] === 'zh' ? 'zh-CN' : 'en'
}

export function useWaline(): void {
  const config = useThemeConfig()
  const route = useRoute()
  const { language } = useThemeLocale()

  let instance: WalineInstance | null = null
  let abortViews: (() => void) | null = null
  let abortComments: (() => void) | null = null

  // Destroy the widget and abort any in-flight count requests.
  const teardown = (): void => {
    instance?.destroy()
    instance = null
    abortViews?.()
    abortViews = null
    abortComments?.()
    abortComments = null
  }

  // (Re)mount Waline for the current article, if comments are configured and
  // the comment card is present in the freshly rendered content.
  const mount = async (): Promise<void> => {
    if (typeof document === 'undefined') return
    teardown()

    const comments = config.value.comments
    if (!isCommentsConfigured(comments) || !comments.waline) return

    const el = document.querySelector<HTMLElement>('.ct-comments__waline')
    if (!el) return

    const { serverURL } = comments.waline
    const path = route.path
    const lang = walineLang(language.value)

    const { init, pageviewCount, commentCount } = await import('@waline/client')
    // The content may have swapped again while the library loaded.
    if (!el.isConnected) return

    // The comment widget itself (its own count displays are disabled — the
    // theme renders its own counters in the article meta strip instead).
    instance = init({
      el,
      serverURL,
      path,
      lang,
      dark: 'html[data-ct-mode="dark"]',
      comment: false,
      pageview: false,
      reaction: false,
    })

    // Article title-section counters (rendered by ArticleMeta).
    if (document.querySelector('.ct-article-meta__views')) {
      abortViews = pageviewCount({
        serverURL,
        path,
        lang,
        selector: '.ct-article-meta__views',
      })
    }
    if (document.querySelector('.ct-article-meta__comments')) {
      abortComments = commentCount({
        serverURL,
        path,
        lang,
        selector: '.ct-article-meta__comments',
      })
    }
  }

  onMounted(() => void mount())
  onContentUpdated(() => void mount()) // fresh article DOM after navigation
  // Language switch: re-localize the widget UI in place (counts are numeric).
  watch(language, () => instance?.update({ lang: walineLang(language.value) }))
  onBeforeUnmount(teardown)
}
