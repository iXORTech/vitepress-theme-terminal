<script setup lang="ts">
// ============================================================================
// Projects.vue — the projects page view (PAGE-002)
// ============================================================================
// Imported by `src/projects.md` (`@/views/Projects.vue`). Same shape as
// `views/About.vue`: a thin language dispatcher rendering the hand-authored
// per-language content component for the active UI language, switching in place
// on a language change. Projects are authored as Vue (using the theme's Card
// component and the shared card grid) rather than from a config schema, so a
// featured project can carry the shell prompt and richer copy while the rest
// sit in the grid. Styles live in `styles/_pages.scss`.
import { computed } from 'vue'
import { useThemeLocale } from '../composables/useThemeLocale'
import ProjectsEn from './projects/en.vue'
import ProjectsZhHans from './projects/zh-Hans.vue'

const { language } = useThemeLocale()

const isZhHans = computed(() => language.value.toLowerCase().startsWith('zh'))
</script>

<template>
  <ProjectsZhHans v-if="isZhHans" />
  <ProjectsEn v-else />
</template>
