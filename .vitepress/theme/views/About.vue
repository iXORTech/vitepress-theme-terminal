<script setup lang="ts">
// ============================================================================
// About.vue — the About page view (PAGE-003)
// ============================================================================
// Imported by `src/about.md` (`@/views/About.vue`) and rendered in that normal
// page's body. This is a thin language dispatcher (the pattern from
// vitepress-theme-arch's `views/About.vue`): it renders the hand-authored
// per-language content component for the active UI language. The content is
// authored as Vue — not driven by a config schema — so an About page can be as
// rich and personal as the owner wants, while still using the theme's Card
// component and the shared card grid. Switching the UI language re-renders the
// matching component in place (no navigation), like the rest of the theme's
// client-side i18n. Styles live in `styles/_pages.scss` (never in an SFC
// `<style>` block — AGENTS.md §6.3).
import { computed } from 'vue'
import { useThemeLocale } from '../composables/useThemeLocale'
import AboutEn from './about/en.vue'
import AboutZhHans from './about/zh-Hans.vue'

const { language } = useThemeLocale()

// Match by primary subtag so region-tagged languages still resolve; anything
// without a Simplified-Chinese authored view falls back to English.
const isZhHans = computed(() => language.value.toLowerCase().startsWith('zh'))
</script>

<template>
  <AboutZhHans v-if="isZhHans" />
  <AboutEn v-else />
</template>
