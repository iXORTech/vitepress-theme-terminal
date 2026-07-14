<script setup lang="ts">
// ============================================================================
// PostList.vue — a list of post cards (POST-001)
// ============================================================================
// The shared presentation for a set of posts, used by the post index
// (PostsIndex), the per-tag / per-category listings (TagPosts / CategoryPosts),
// and any other surface that shows posts. Each row is a compact card: title
// link, publish date, excerpt, and the post's categories/tags as links
// (PostTaxonomy). Empty lists show a localized "no posts" line.
import { withBase } from 'vitepress'
import type { PostEntry } from '../posts'
import { formatListDate } from '../utils/date'
import { useThemeLocale } from '../composables/useThemeLocale'
import PostTaxonomy from './PostTaxonomy.vue'

defineProps<{ posts: PostEntry[] }>()

const { t, language } = useThemeLocale()
</script>

<template>
  <ul v-if="posts.length" class="ct-postlist">
    <li v-for="post in posts" :key="post.url" class="ct-postlist__item">
      <article class="ct-postcard">
        <h3 class="ct-postcard__title">
          <a :href="withBase(post.url)">{{ post.title }}</a>
        </h3>
        <p v-if="post.date" class="ct-postcard__date">
          {{ formatListDate(post.date, language) }}
        </p>
        <p v-if="post.excerpt" class="ct-postcard__excerpt">{{ post.excerpt }}</p>
        <PostTaxonomy :categories="post.categories" :tags="post.tags" />
      </article>
    </li>
  </ul>
  <p v-else class="ct-postlist__empty">{{ t('post.empty') }}</p>
</template>
