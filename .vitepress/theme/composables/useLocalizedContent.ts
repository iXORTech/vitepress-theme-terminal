// =============================================================================
// useLocalizedContent.ts — client language switching of page content (I18N-007)
// =============================================================================
// Per-language content blocks are static markdown output: `::: lang <tag>`
// containers render as `<div class="ct-lang" data-ct-lang="<tag>">` with the
// site-default-language block visible and the rest `hidden` at build time
// (theme/markdown/localized-content.ts). This composable — called once from the
// layout, like useCalloutTitles / useCodeCopy — reveals exactly one block per
// group whenever the page renders or the UI language switches. Content OUTSIDE
// any `::: lang` block is never touched.
//
// A "group" is a run of adjacent `.ct-lang` sibling elements (one set of
// language alternatives). Within a group the shown block is chosen by the
// theme's standard fallback: exact tag → primary subtag → site default → first.

import { onMounted, watch } from 'vue'
import { onContentUpdated, useData } from 'vitepress'
import { useThemeLocale } from './useThemeLocale'

/** Primary subtag of a BCP 47 tag, lower-cased (`zh-Hans` → `zh`). */
function primary(tag: string): string {
  return tag.toLowerCase().split('-')[0]
}

/**
 * Index of the block to show for `active`, falling back through `fallback`
 * (the site default) and finally the first block — mirrors resolveLocalizedText.
 */
function chooseIndex(tags: string[], active: string, fallback: string): number {
  const lower = tags.map((tag) => tag.toLowerCase())

  const exact = lower.indexOf(active.toLowerCase())
  if (exact !== -1) return exact

  const activePrimary = primary(active)
  const byPrimary = lower.findIndex((tag) => primary(tag) === activePrimary)
  if (byPrimary !== -1) return byPrimary

  const fallbackExact = lower.indexOf(fallback.toLowerCase())
  if (fallbackExact !== -1) return fallbackExact

  const fallbackPrimary = primary(fallback)
  const byFallback = lower.findIndex((tag) => primary(tag) === fallbackPrimary)
  if (byFallback !== -1) return byFallback

  return 0
}

/** Group adjacent `.ct-lang` siblings into sets of language alternatives. */
function groupBlocks(blocks: HTMLElement[]): HTMLElement[][] {
  const groups: HTMLElement[][] = []
  let current: HTMLElement[] | null = null

  for (const block of blocks) {
    const prev = block.previousElementSibling
    if (current && prev && current[current.length - 1] === prev) {
      current.push(block)
    } else {
      current = [block]
      groups.push(current)
    }
  }
  return groups
}

export function useLocalizedContent(): void {
  const { language } = useThemeLocale()
  const { site } = useData()

  const apply = (): void => {
    if (typeof document === 'undefined') return

    const blocks = [
      ...document.querySelectorAll<HTMLElement>('.ct-content .ct-lang'),
    ]
    for (const group of groupBlocks(blocks)) {
      const tags = group.map((el) => el.getAttribute('data-ct-lang') ?? '')
      const shown = chooseIndex(tags, language.value, site.value.lang)
      group.forEach((el, i) => {
        el.hidden = i !== shown
      })
    }
  }

  onMounted(apply)
  onContentUpdated(apply) // fresh markdown DOM after navigation
  watch(language, apply) // language switch / per-language overrides
}
