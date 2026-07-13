<script setup lang="ts">
// ============================================================================
// SearchPalette.vue — find-palette input pane (SEARCH-002)
// ============================================================================
// The first pane of the find palette (ui-sketch.md §2): a shell-style prompt
// glyph and a search field bound to the shared search state (useSearch). Typing
// runs the debounced Algolia query; the arrow keys move the active result and
// Enter opens it (the results themselves render in SearchResults.vue). The
// field is focused when the palette opens so the visitor can type immediately.
import { onMounted, ref } from 'vue'
import { useSearch } from '../composables/useSearch'
import { useThemeLocale } from '../composables/useThemeLocale'

const { t } = useThemeLocale()
const { query, setQuery, move, openActive } = useSearch()

const field = ref<HTMLInputElement | null>(null)

// Keyboard-drive the results list from the input (design-language.md §7).
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    move(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    move(-1)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    openActive()
  }
}

// Focus the field once the window is on screen. The floating window focuses its
// own panel on open (after a microtask); a rAF runs after that, so the field
// wins focus (useFloatingWindow / FloatingWindow.vue).
onMounted(() => {
  requestAnimationFrame(() => field.value?.focus())
})
</script>

<template>
  <div class="ct-search__input">
    <span class="ct-search__prompt" aria-hidden="true">&gt;</span>
    <input
      ref="field"
      class="ct-search__field"
      type="search"
      :value="query"
      :placeholder="t('search.placeholder')"
      :aria-label="t('search.inputTitle')"
      autocomplete="off"
      spellcheck="false"
      @input="setQuery(($event.target as HTMLInputElement).value)"
      @keydown="onKeydown"
    />
  </div>
</template>
