<script setup lang="ts">
// ============================================================================
// SeriesArticlePage.vue — the series-article page type (ARCH-001)
// ============================================================================
// Articles under `src/series/<series-name>/`. It is the post type plus a series
// breadcrumb: the same article chrome (reused via <PostPage/>) preceded by a
// banner linking back to the series. For now the series is identified by its
// folder name; POST-002 upgrades the banner to the series' icon/title/
// description from `series.yml` (content-architecture.md §5).
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { useThemeLocale } from '../composables/useThemeLocale'
import PostPage from './PostPage.vue'

const { page } = useData()
const { t } = useThemeLocale()

// `series/<name>/...` → the series folder name and its index URL.
const series = computed(() => {
  const segments = page.value.relativePath.split('/')
  const name = segments[1] ?? ''
  return { name, url: withBase(`/series/${name}/`) }
})
</script>

<template>
  <nav v-if="series.name" class="ct-series-banner" :aria-label="t('series.label')">
    <span class="ct-series-banner__label">{{ t('series.label') }}</span>
    <a class="ct-series-banner__name" :href="series.url">{{ series.name }}</a>
  </nav>

  <PostPage />
</template>
