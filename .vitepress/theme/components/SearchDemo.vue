<script setup lang="ts">
// ============================================================================
// SearchDemo.vue — search demo input pane (THEME-018, temporary)
// ============================================================================
// The find-palette-shaped demo's first section: a static search field with a
// prompt glyph (ui-sketch.md §2). No query logic — the real find palette lands
// with SEARCH-002, which retires this whole demo. Opened via the `/` shortcut
// (composables/useWindowDemo.ts).
import { useThemeLocale } from '../composables/useThemeLocale'

const { t } = useThemeLocale()
</script>

<template>
  <div class="ct-window-search__input">
    <span class="ct-window-search__prompt" aria-hidden="true">&gt;</span>
    <input
      class="ct-window-search__field"
      type="search"
      :placeholder="t('window.searchPlaceholder')"
      :aria-label="t('window.searchInputTitle')"
    />
  </div>
</template>
