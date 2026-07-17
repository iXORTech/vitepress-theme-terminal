<script setup lang="ts">
// ============================================================================
// SeriesArticlePage.vue — the series-article page type (ARCH-001 / POST-002)
// ============================================================================
// Articles under `src/series/<series-name>/`. It is the post type plus a series
// banner: the same article chrome (reused via <PostPage/>) preceded by a
// breadcrumb back to the series. POST-002: the banner shows the series'
// `series.yml` icon, localized title, and description (falling back to the
// bare folder name when the yml is absent).
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as seriesMeta } from '../series.data.mts'
import { resolveLocalizedText } from '../locales'
import { useThemeLocale } from '../composables/useThemeLocale'
import PostPage from './PostPage.vue'

const { page } = useData()
const { t, language } = useThemeLocale()

// `series/<name>/...` → the series slug, its landing URL, and — when a
// `series.yml` exists — the localized icon/title/description (POST-002).
const series = computed(() => {
  const slug = page.value.relativePath.split('/')[1] ?? ''
  const meta = seriesMeta.find((entry) => entry.slug === slug)
  const localized = (text: Parameters<typeof resolveLocalizedText>[0]) =>
    resolveLocalizedText(text, language.value) ?? ''
  return {
    slug,
    url: withBase(`/series/${slug}/`),
    icon: meta ? localized(meta.icon) : '',
    title: (meta && localized(meta.title)) || slug,
    description: meta ? localized(meta.description) : '',
  }
})
</script>

<template>
  <nav v-if="series.slug" class="ct-series-banner" :aria-label="t('series.label')">
    <p class="ct-series-banner__row">
      <span class="ct-series-banner__label">{{ t('series.label') }}</span>
      <a class="ct-series-banner__name" :href="series.url">
        <!-- Optional series.yml icon — Font Awesome or an `nf-*` class -->
        <i
          v-if="series.icon"
          class="ct-series-icon"
          :class="series.icon"
          aria-hidden="true"
        ></i>
        {{ series.title }}
      </a>
    </p>
    <p v-if="series.description" class="ct-series-banner__desc">
      {{ series.description }}
    </p>
  </nav>

  <PostPage />
</template>
