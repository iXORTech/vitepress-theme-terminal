<script setup lang="ts">
// ============================================================================
// ArticleToc.vue — right-side article table of contents (THEME-024)
// ============================================================================
// A TUI panel to the right of the viewport (mirroring the explorer on the left,
// ui-sketch.md §1) that lists the current article's headings. Each entry jumps
// to its heading via the THEME-023 slug anchors, scrolling inside the
// `.ct-viewport` panel (the fixed shell frame — THEME-008), and the section
// currently in view is highlighted as the reader scrolls (scroll-spy).
//
// The heading set is read from the rendered `.ct-content` DOM (so it naturally
// follows localized `::: lang` content, I18N-007) on mount, after navigation,
// and on a UI-language switch. It renders only on article page types with
// enough qualifying headings and never in paper mode; narrow viewports drop it
// out of the reading column via CSS (_toc.scss, design-language.md §8).
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { onContentUpdated, useData } from 'vitepress'
import { useColorMode } from '../composables/useColorMode'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'
import { resolvePageType } from '../utils/pageType'

interface TocHeading {
  id: string
  text: string
  level: number
}

// Page types that carry an article body worth outlining (posts, series
// articles, and normal content pages) — home / listings / 404 never get a TOC.
const ARTICLE_TYPES = new Set(['post', 'series', 'normal'])

const { frontmatter, page } = useData()
const config = useThemeConfig()
const { mode } = useColorMode()
const { t, strings } = useThemeLocale()

const toc = computed(() => config.value.toc)

const isArticle = computed(() =>
  ARTICLE_TYPES.has(
    resolvePageType({
      relativePath: page.value.relativePath,
      isNotFound: page.value.isNotFound,
      frontmatter: frontmatter.value,
    }),
  ),
)

// ---------------------------------------------------------------------------
// Heading collection (client-side, from the rendered content DOM)
// ---------------------------------------------------------------------------
const headings = ref<TocHeading[]>([])

// The heading's text minus its `.header-anchor` (a zero-width space).
const headingText = (heading: Element): string => {
  const clone = heading.cloneNode(true) as HTMLElement
  clone.querySelector('.header-anchor')?.remove()
  return (clone.textContent ?? '').trim()
}

const collect = (): void => {
  if (typeof document === 'undefined') return
  const content = document.querySelector('.ct-content')
  if (!content) {
    headings.value = []
    return
  }
  const { minLevel, maxLevel } = toc.value
  const selector = Array.from(
    { length: maxLevel - minLevel + 1 },
    (_, i) => `h${minLevel + i}`,
  ).join(',')

  const collected: TocHeading[] = []
  for (const el of content.querySelectorAll<HTMLElement>(selector)) {
    if (!el.id) continue
    // Skip headings inside an inactive `::: lang` block (I18N-007).
    if (el.closest('[hidden]')) continue
    const text = headingText(el)
    if (!text) continue
    collected.push({ id: el.id, text, level: Number(el.tagName[1]) })
  }
  headings.value = collected
  updateActive()
}

const visible = computed(
  () =>
    toc.value.enabled &&
    mode.value !== 'paper' &&
    isArticle.value &&
    headings.value.length >= toc.value.minHeadings,
)

// ---------------------------------------------------------------------------
// Scroll-spy: highlight the section currently at the top of the panel
// ---------------------------------------------------------------------------
const activeId = ref('')
let scroller: HTMLElement | null = null
let frame = 0

// Distance below the panel's top edge that counts as "current".
const SPY_OFFSET = 96

const updateActive = (): void => {
  if (!scroller || headings.value.length === 0) return
  const scrollerTop = scroller.getBoundingClientRect().top
  let current = headings.value[0].id
  for (const heading of headings.value) {
    const el = document.getElementById(heading.id)
    if (!el) continue
    if (el.getBoundingClientRect().top - scrollerTop <= SPY_OFFSET) {
      current = heading.id
    } else {
      break
    }
  }
  // Scrolled to the very bottom → the last heading is the active one even if
  // its top never reached the offset line (short trailing sections).
  if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4) {
    current = headings.value[headings.value.length - 1].id
  }
  activeId.value = current
}

// rAF-throttled scroll handler.
const onScroll = (): void => {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    updateActive()
  })
}

// Jump to a heading inside the panel and reflect it in the URL hash, without
// handing the router a window-level scroll it cannot perform here (THEME-008).
const select = (event: MouseEvent, id: string): void => {
  event.preventDefault()
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth' })
  activeId.value = id
  try {
    history.replaceState(history.state, '', `#${id}`)
  } catch {
    // History unavailable — the in-panel scroll still happened.
  }
}

onMounted(() => {
  scroller = document.querySelector('.ct-viewport')
  scroller?.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  collect()
})

onUnmounted(() => {
  scroller?.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (frame) cancelAnimationFrame(frame)
})

// Re-read headings after navigation and on a language switch (localized
// content swaps the visible heading text).
onContentUpdated(collect)
watch(strings, collect)
</script>

<template>
  <nav v-if="visible" class="ct-toc" :aria-label="t('toc.title')">
    <p class="ct-toc__title">{{ t('toc.title') }}</p>
    <ul class="ct-toc__list">
      <li
        v-for="heading in headings"
        :key="heading.id"
        class="ct-toc__item"
        :class="[
          `ct-toc__item--h${heading.level}`,
          { 'ct-toc__item--active': heading.id === activeId },
        ]"
      >
        <a
          class="ct-toc__link"
          :href="`#${heading.id}`"
          @click="select($event, heading.id)"
          >{{ heading.text }}</a
        >
      </li>
    </ul>
  </nav>
</template>
