<script setup lang="ts">
// ============================================================================
// SearchResults.vue — find-palette results pane (SEARCH-002)
// ============================================================================
// The second pane of the find palette (ui-sketch.md §2): the list of Algolia
// DocSearch hits (title · breadcrumb context · snippet · link), plus the status
// messages for the empty / loading / error / unconfigured states and the
// keyboard hint row. All state comes from the shared search singleton
// (useSearch); rows are real links so mouse, keyboard, and new-tab all work.
import { nextTick, ref, watch } from 'vue'
import type { SearchResult } from '../utils/algolia'
import { useSearch } from '../composables/useSearch'
import { useThemeLocale } from '../composables/useThemeLocale'

const { t } = useThemeLocale()
const { results, status, activeIndex, openResult } = useSearch()

const list = ref<HTMLElement | null>(null)

// Keep the keyboard-selected row visible as the cursor moves through results.
watch(activeIndex, async () => {
  await nextTick()
  list.value
    ?.querySelector('.ct-search__result--active')
    ?.scrollIntoView({ block: 'nearest' })
})

// Row click: navigate through the shared handler (so the window closes too),
// but leave modifier / non-left clicks to the browser (open-in-new-tab, etc.).
function onRowClick(event: MouseEvent, result: SearchResult): void {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }
  event.preventDefault()
  openResult(result)
}
</script>

<template>
  <div class="ct-search__results">
    <!-- Result list -->
    <ul v-if="status === 'results'" ref="list" class="ct-search__list">
      <li v-for="(result, index) in results" :key="result.objectID">
        <a
          class="ct-search__result"
          :class="{ 'ct-search__result--active': index === activeIndex }"
          :href="result.url"
          @click="onRowClick($event, result)"
        >
          <span class="ct-search__result-title">{{ result.title }}</span>
          <span
            v-if="result.breadcrumb"
            class="ct-search__result-breadcrumb"
          >{{ result.breadcrumb }}</span>
          <span
            v-if="result.snippet"
            class="ct-search__result-snippet"
          >{{ result.snippet }}</span>
        </a>
      </li>
    </ul>

    <!-- Status messages for every non-results state -->
    <p v-else class="ct-search__status">
      <template v-if="status === 'unconfigured'">{{ t('search.unconfigured') }}</template>
      <template v-else-if="status === 'loading'">{{ t('search.loading') }}</template>
      <template v-else-if="status === 'empty'">{{ t('search.empty') }}</template>
      <template v-else-if="status === 'error'">{{ t('search.error') }}</template>
      <template v-else>{{ t('search.idle') }}</template>
    </p>

    <!-- Footer: keyboard hints with the Algolia attribution to their right
         (DocSearch requires the "Search by Algolia" credit). Hidden while
         search is unconfigured, since nothing is Algolia-powered then. -->
    <div class="ct-search__footer">
      <p class="ct-search__hint">{{ t('search.hint') }}</p>
      <a
        v-if="status !== 'unconfigured'"
        class="ct-search__algolia"
        href="https://www.algolia.com/"
        target="_blank"
        rel="noopener noreferrer"
        :title="t('search.poweredBy')"
        :aria-label="t('search.poweredBy')"
      >
        <!-- Official Algolia logo mark (single path, currentColor) -->
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.445 0 .103 5.285.01 11.817c-.097 6.634 5.285 12.131 11.92 12.17a11.91 11.91 0 0 0 5.775-1.443.281.281 0 0 0 .052-.457l-1.122-.994a.79.79 0 0 0-.833-.14 9.693 9.693 0 0 1-3.923.77c-5.36-.067-9.692-4.527-9.607-9.888.084-5.293 4.417-9.573 9.73-9.573h9.73v17.296l-5.522-4.907a.407.407 0 0 0-.596.063 4.52 4.52 0 0 1-3.934 1.793 4.538 4.538 0 0 1-4.192-4.168 4.53 4.53 0 0 1 4.512-4.872 4.532 4.532 0 0 1 4.509 4.126c.018.205.11.397.265.533l1.438 1.275a.28.28 0 0 0 .462-.158 6.82 6.82 0 0 0 .099-1.725c-.232-3.376-2.966-6.092-6.345-6.3-3.873-.24-7.11 2.79-7.214 6.588-.1 3.7 2.933 6.892 6.634 6.974a6.75 6.75 0 0 0 4.136-1.294l7.212 6.394a.48.48 0 0 0 .797-.36V.456A.456.456 0 0 0 23.54 0Z" />
        </svg>
      </a>
    </div>
  </div>
</template>
