<script setup lang="ts">
// ============================================================================
// WindowDemo.vue — floating-window demo content (THEME-003, temporary)
// ============================================================================
// Static, logic-free content for the demo utility's first pane: a short
// description of the shared floating window. The keyboard hints live in their
// own second pane (WindowDemoHints.vue) to exercise the THEME-017 multi-pane
// configuration. Opened by the tool-bar demo button and the `~` shortcut
// (composables/useWindowDemo.ts). Removed when the find palette lands
// (SEARCH-002).
import { useThemeLocale } from '../composables/useThemeLocale'

const { t } = useThemeLocale()
</script>

<template>
  <p class="ct-window-demo__text">{{ t('window.demoBody') }}</p>
</template>
