<script setup lang="ts">
// ============================================================================
// SeriesIndex.vue — every series, with icon/title/description (POST-002)
// ============================================================================
// The series index listing, rendered by `src/series.md`. Each row links to the
// series' landing page and shows its `series.yml` icon, localized title and
// description, and the article count. Series without a `series.yml` (but with
// articles) still appear with folder-name defaults. Sorted by the yml `order`
// (default 0, smaller = higher), ties alphabetical by slug.
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'
import { data as seriesMeta } from '../series.data.mts'
import { compareSeries, type SeriesEntry } from '../posts'
import { resolveLocalizedText } from '../locales'
import { useThemeLocale } from '../composables/useThemeLocale'

const { t, language } = useThemeLocale()

// Merge yml-configured series with any article-only series folder, and count
// each series' articles from the shared post dataset.
const series = computed(() => {
  const bySlug = new Map<string, SeriesEntry>(
    seriesMeta.map((entry) => [entry.slug, entry]),
  )
  for (const post of posts) {
    if (post.series && !bySlug.has(post.series)) {
      // No series.yml — synthesize the folder-name defaults.
      bySlug.set(post.series, {
        slug: post.series,
        url: `/series/${post.series}/`,
        icon: '',
        title: post.series,
        description: '',
        order: 0,
      })
    }
  }
  return [...bySlug.values()].sort(compareSeries).map((entry) => ({
    ...entry,
    count: posts.filter((post) => post.series === entry.slug).length,
  }))
})

// Icon/title/description are LocalizableText (ARCH-003 pattern).
const localized = (text: SeriesEntry['title']): string =>
  resolveLocalizedText(text, language.value) ?? ''

const countLabel = (count: number): string =>
  t('series.articleCount').replace('{count}', String(count))
</script>

<template>
  <div class="ct-listing ct-series-index">
    <h1 class="ct-listing__title">{{ t('series.indexTitle') }}</h1>

    <p v-if="!series.length" class="ct-postlist__empty">{{ t('series.empty') }}</p>

    <ul v-else class="ct-series-index__list">
      <li v-for="entry in series" :key="entry.slug" class="ct-series-index__item">
        <a class="ct-series-index__link" :href="withBase(entry.url)">
          <!-- Optional icon from series.yml — Font Awesome or an `nf-*` class -->
          <i
            v-if="localized(entry.icon)"
            class="ct-series-icon"
            :class="localized(entry.icon)"
            aria-hidden="true"
          ></i>
          <span class="ct-series-index__text">
            <span class="ct-series-index__title">{{ localized(entry.title) }}</span>
            <span
              v-if="localized(entry.description)"
              class="ct-series-index__desc"
              >{{ localized(entry.description) }}</span
            >
          </span>
          <span class="ct-series-index__count">{{ countLabel(entry.count) }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>
