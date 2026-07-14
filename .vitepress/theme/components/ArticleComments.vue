<script setup lang="ts">
// ============================================================================
// ArticleComments.vue — end-of-article Waline comment card (COMP-004)
// ============================================================================
// Rendered at the bottom of every article (Layout.vue) inside the reusable
// Card WITH the shell-prompt decoration (design-language.md §4, cards). The
// Waline comment widget is mounted into `.ct-comments__waline` by the
// useWaline composable (called once from Layout); this component only supplies
// the framed card, the localized heading, and that mount point. The Waline
// server is configured through `themeConfig.comments.waline` (COMP-004).
import { computed } from 'vue'
import { useData } from 'vitepress'
import Card from './Card.vue'
import { useThemeLocale } from '../composables/useThemeLocale'
import { formatPageLocation } from '../utils/pagePath'

const { page } = useData()
const { t } = useThemeLocale()

// Shell prompt: `user@host:~/path$ comments ~/path` (like the license card).
const prompt = computed(() => ({
  command: 'comments',
  // args: formatPageLocation(page.value.relativePath),
}))
</script>

<template>
  <Card class="ct-comments" show-prompt :prompt="prompt">
    <h2 class="ct-comments__title">{{ t('comments.title') }}</h2>
    <!-- Waline mounts its comment UI here (useWaline, from Layout) -->
    <div class="ct-comments__waline"></div>
  </Card>
</template>
