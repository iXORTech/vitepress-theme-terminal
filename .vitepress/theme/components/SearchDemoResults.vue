<script setup lang="ts">
// ============================================================================
// SearchDemoResults.vue — search demo results pane (THEME-018, temporary)
// ============================================================================
// The demo's second section: a static list of illustrative results plus the
// keyboard hint row (ui-sketch.md §2). Result labels are localized; the paths
// are literal identifiers, like the shell prompt's paths — not translatable
// UI copy. No logic; removed with the rest of the demo (SEARCH-002).
import type { ThemeLocaleKey } from '../locales/en'
import { useThemeLocale } from '../composables/useThemeLocale'

const { t } = useThemeLocale()

// Illustrative, static rows — label localized, path a literal identifier.
const samples: { label: ThemeLocaleKey; path: string }[] = [
  { label: 'window.searchSample1', path: 'docs/design/' },
  { label: 'window.searchSample2', path: 'posts/2026/' },
  { label: 'window.searchSample3', path: 'about' },
]
</script>

<template>
  <div class="ct-window-search__results">
    <ul class="ct-window-search__list">
      <li
        v-for="item in samples"
        :key="item.path"
        class="ct-window-search__result"
      >
        <span class="ct-window-search__result-label">{{ t(item.label) }}</span>
        <span class="ct-window-search__result-path">{{ item.path }}</span>
      </li>
    </ul>
    <p class="ct-window-search__hint">{{ t('window.searchHint') }}</p>
  </div>
</template>
