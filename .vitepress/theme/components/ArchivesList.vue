<script setup lang="ts">
// ============================================================================
// ArchivesList.vue — every post, by date (POST-001)
// ============================================================================
// The plain chronological counterpart to the rich post index: a timeline of all
// posts grouped by year, newest first, with no excerpts or cards
// (content-architecture.md §3). Rendered by `src/archives.md`.
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as allPosts } from '../posts.data.mts'
import { data as seriesMeta } from '../series.data.mts'
import { filterListablePosts, seriesDisplayTitle } from '../posts'
import { resolveLocalizedText } from '../locales'
import { formatListDate, yearOf } from '../utils/date'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'

const { language } = useThemeLocale()
const { t } = useThemeLocale()
const config = useThemeConfig()

// Series rows carry their localized series name before the title (POST-002).
const seriesTitle = (slug: string): string =>
  seriesDisplayTitle(seriesMeta, slug, language.value)

// Series articles join only when opted in (POST-002).
const posts = computed(() =>
  filterListablePosts(allPosts, config.value.series, 'archives'),
)

// Group the already-date-sorted posts by descending year.
const years = computed(() => {
  const groups = new Map<number, typeof allPosts>()
  for (const post of posts.value) {
    const year = yearOf(post.date)
    const bucket = groups.get(year)
    if (bucket) bucket.push(post)
    else groups.set(year, [post])
  }
  return [...groups.entries()].sort((a, b) => b[0] - a[0])
})
</script>

<template>
  <div class="ct-listing ct-archives">
    <h1 class="ct-listing__title">{{ t('post.archivesTitle') }}</h1>

    <p v-if="!posts.length" class="ct-postlist__empty">{{ t('post.empty') }}</p>

    <section v-for="[year, group] in years" :key="year" class="ct-archives__year">
      <h2 class="ct-archives__heading">{{ year || t('post.undated') }}</h2>
      <ul class="ct-archives__list">
        <li v-for="post in group" :key="post.url" class="ct-archives__item">
          <time v-if="post.date" class="ct-archives__date">{{
            formatListDate(post.date, language)
          }}</time>
          <!-- Title frontmatter may be a per-language map (ARCH-003); series
               rows are prefixed with the localized series name (POST-002) -->
          <!-- Pinned indicator (POST-004): the archives stay chronological,
               so this only marks the post that leads its year -->
          <span v-if="post.pinned" class="ct-archives__pin">
            <i class="fa-solid fa-thumbtack" aria-hidden="true"></i>
            <span class="ct-archives__pin-label">{{ t('post.pinned') }}</span>
          </span>
          <a class="ct-archives__link" :href="withBase(post.url)"
            ><span v-if="post.series" class="ct-archives__series"
              >{{ seriesTitle(post.series) }} › </span
            >{{ resolveLocalizedText(post.title, language) }}</a
          >
        </li>
      </ul>
    </section>
  </div>
</template>
