<script setup lang="ts">
// ============================================================================
// SeriesArticles.vue — the current series' articles, in reading order (POST-002)
// ============================================================================
// Placed on a series landing page (`src/series/<slug>/index.md`) to list that
// series' articles automatically — no hand-written link list. The slug comes
// from the page path; articles sort by their frontmatter `order` (default 0,
// smaller = higher), ties alphabetical by URL. Rendered with the shared
// PostList cards, so covers (POST-003) and taxonomy links come along.
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../posts.data.mts'
import { seriesArticles } from '../posts'
import PostList from './PostList.vue'

const { page } = useData()

// `series/<slug>/index.md` (or any page inside the folder) → the series slug.
const slug = computed(() => {
  const segments = page.value.relativePath.split('/')
  return segments[0] === 'series' ? segments[1] ?? '' : ''
})

const articles = computed(() => seriesArticles(posts, slug.value))
</script>

<template>
  <PostList :posts="articles" />
</template>
