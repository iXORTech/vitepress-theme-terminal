<script setup lang="ts">
// ============================================================================
// WindowDemoHints.vue — demo hints pane (THEME-003/017, temporary)
// ============================================================================
// The demo utility's second pane: the sketch palette's keyboard hint row
// (ui-sketch.md §2), living in its own framed pane to exercise the THEME-017
// multi-pane window. Removed with the rest of the demo when the find palette
// lands (SEARCH-002).
import { useThemeLocale } from '../composables/useThemeLocale'

const { t } = useThemeLocale()
</script>

<template>
  <p class="ct-window-demo__hint">{{ t('window.demoHint') }}</p>
</template>
