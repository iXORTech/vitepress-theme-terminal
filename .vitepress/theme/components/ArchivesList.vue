<script setup lang="ts">
// ============================================================================
// ArchivesList.vue — every post, by date (POST-001)
// ============================================================================
// The plain chronological counterpart to the rich post index: a timeline of all
// posts grouped by year, newest first, with no excerpts or cards
// (content-architecture.md §3). Rendered by `src/archives.md`.
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'
import { formatListDate, yearOf } from '../utils/date'
import { useThemeLocale } from '../composables/useThemeLocale'

const { language } = useThemeLocale()
const { t } = useThemeLocale()

// Group the already-date-sorted posts by descending year.
const years = computed(() => {
  const groups = new Map<number, typeof posts>()
  for (const post of posts) {
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
          <a class="ct-archives__link" :href="withBase(post.url)">{{
            post.title
          }}</a>
        </li>
      </ul>
    </section>
  </div>
</template>
