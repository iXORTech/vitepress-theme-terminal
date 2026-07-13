// =============================================================================
// useLightbox.ts — enlarge-on-click content images via Fancybox (COMP-002)
// =============================================================================
// Called once from the layout. Every image in the article body enlarges on
// click, and all of a page's images join one Fancybox gallery so the reader
// can browse them as slides (design-language.md §4, image containers).
//   - Images are marked (`data-fancybox="ct-gallery"` + `data-src`) on mount
//     and after every content swap; images inside links are left alone (the
//     link wins) and `data-no-lightbox` opts a single image out.
//   - Fancybox binds ONE delegated document-level listener, so freshly marked
//     images after navigation need no re-binding.
//   - The lightbox chrome is vendor UI with a complete vendor translation set:
//     its strings come from Fancybox's own shipped l10n tables, mapped from
//     the theme's canonical language tags (primary-subtag fallback to
//     English) and re-bound on a language switch — the documented exception
//     to the theme-locale-table rule (design-language.md §4).
// Fancybox is client-only and loaded lazily on first mount — it never runs
// during SSR and costs nothing until the page is interactive.

import { onBeforeUnmount, onMounted, watch } from 'vue'
import { onContentUpdated } from 'vitepress'
import type { Fancybox as FancyboxType } from '@fancyapps/ui'
import { useThemeLocale } from './useThemeLocale'

// One shared gallery per page: same attribute value = same slide group.
const GALLERY = 'ct-gallery'
const SELECTOR = `[data-fancybox="${GALLERY}"]`

// Fancybox l10n loaders keyed by the theme's canonical tags (I18N-005).
// Adding a theme language with a matching vendor table is one line here;
// unmapped languages fall back to English below.
const L10N: Record<string, () => Promise<Record<string, string>>> = {
  en: () =>
    import('@fancyapps/ui/dist/fancybox/l10n/en.esm.js').then((m) => m.en),
  'zh-Hans': () =>
    import('@fancyapps/ui/dist/fancybox/l10n/zh_CN.esm.js').then(
      (m) => m.zh_CN,
    ),
}

export function useLightbox(): void {
  const { language } = useThemeLocale()
  let Fancybox: typeof FancyboxType | null = null

  // Tag every eligible content image for the delegated Fancybox listener.
  const mark = (): void => {
    if (typeof document === 'undefined') return
    for (const img of document.querySelectorAll<HTMLImageElement>(
      '.ct-content img',
    )) {
      if (img.closest('a') || img.hasAttribute('data-no-lightbox')) continue
      img.dataset.fancybox = GALLERY
      // The full-size source: the image itself (markdown images have no
      // separate large variant).
      if (!img.dataset.src) img.dataset.src = img.currentSrc || img.src
    }
  }

  // (Re)bind the delegated listener with the active language's vendor l10n.
  const bind = async (): Promise<void> => {
    if (!Fancybox) ({ Fancybox } = await import('@fancyapps/ui'))
    const load =
      L10N[language.value] ?? L10N[language.value.split('-')[0]] ?? L10N.en
    const l10n = await load()
    Fancybox.unbind(SELECTOR)
    Fancybox.bind(SELECTOR, { l10n })
  }

  onMounted(() => {
    mark()
    void bind()
  })
  onContentUpdated(mark) // fresh markdown DOM after navigation
  watch(language, () => void bind()) // vendor chrome follows the switcher

  onBeforeUnmount(() => {
    if (!Fancybox) return
    Fancybox.unbind(SELECTOR)
    Fancybox.close()
  })
}
