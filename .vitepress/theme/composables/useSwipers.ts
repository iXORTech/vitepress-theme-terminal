// =============================================================================
// useSwipers.ts — cards-effect image sliders (COMP-002)
// =============================================================================
// Called once from the layout. The `:::: swiper` markdown container
// (theme/markdown/swiper.ts) emits inert `.ct-swiper.swiper` markup; this
// composable instantiates SwiperJS on every such container with the CARDS
// effect — the slides sit stacked like a deck and slide away by drag/swipe or
// via the prev/next arrow buttons (Navigation module, wired to the buttons
// the container emitted) — in the shadowless flavor (`slideShadows: false`;
// the theme's card finish in styles/_swiper.scss supplies the depth instead).
// Native image dragging is disabled on the slides: the browser's ghost-image
// drag would otherwise hijack the pointer mid-swipe. Arrow buttons get their
// accessible names from the theme locale table, re-applied on a language
// switch (the useCodeCopy relabel pattern). Instances are created on mount
// and after every content swap, and destroyed once their element has left
// the DOM. Swiper is client-only and loaded lazily on first use — it never
// runs during SSR and costs nothing on pages without a deck.

import { onBeforeUnmount, onMounted, watch } from 'vue'
import { onContentUpdated } from 'vitepress'
import type SwiperClass from 'swiper'
import { useThemeLocale } from './useThemeLocale'

export function useSwipers(): void {
  const { strings } = useThemeLocale()
  const instances: SwiperClass[] = []

  // Localize every deck's arrow buttons to the active language.
  const relabel = (): void => {
    if (typeof document === 'undefined') return
    for (const [selector, key] of [
      ['.ct-swiper__nav--prev', 'swiper.prev'],
      ['.ct-swiper__nav--next', 'swiper.next'],
    ] as const) {
      for (const button of document.querySelectorAll(selector)) {
        button.setAttribute('aria-label', strings.value[key])
        button.setAttribute('title', strings.value[key])
      }
    }
  }

  // Drop (and destroy) instances whose container is gone after navigation.
  const prune = (): void => {
    for (let i = instances.length - 1; i >= 0; i--) {
      if (!instances[i].el?.isConnected) {
        instances[i].destroy(true, false)
        instances.splice(i, 1)
      }
    }
  }

  // Instantiate every not-yet-initialized deck in the current content.
  const init = async (): Promise<void> => {
    if (typeof document === 'undefined') return
    prune()
    relabel()
    const decks = [
      ...document.querySelectorAll<HTMLElement>('.ct-swiper__deck'),
    ].filter((el) => !el.classList.contains('swiper-initialized'))
    if (decks.length === 0) return

    const [{ default: Swiper }, { EffectCards, Navigation }] =
      await Promise.all([import('swiper'), import('swiper/modules')])
    for (const el of decks) {
      // The content may have swapped again while the library loaded.
      if (!el.isConnected || el.classList.contains('swiper-initialized'))
        continue
      // A native image drag (browser ghost image) would hijack the swipe.
      for (const img of el.querySelectorAll('img')) img.draggable = false
      // The arrows are siblings of the deck inside the .ct-swiper wrapper.
      const wrapper = el.closest('.ct-swiper')
      instances.push(
        new Swiper(el, {
          modules: [EffectCards, Navigation],
          effect: 'cards',
          grabCursor: true,
          cardsEffect: { slideShadows: false },
          navigation: {
            prevEl:
              wrapper?.querySelector<HTMLElement>('.ct-swiper__nav--prev') ??
              null,
            nextEl:
              wrapper?.querySelector<HTMLElement>('.ct-swiper__nav--next') ??
              null,
          },
        }),
      )
    }
  }

  onMounted(() => void init())
  onContentUpdated(() => void init()) // fresh markdown DOM after navigation
  watch(strings, relabel) // language switch / per-language overrides
  onBeforeUnmount(() => {
    for (const swiper of instances) swiper.destroy(true, false)
    instances.length = 0
  })
}
