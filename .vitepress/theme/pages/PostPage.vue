<script setup lang="ts">
// ============================================================================
// PostPage.vue — the post page type (ARCH-001 + POST-001)
// ============================================================================
// Regular posts under `src/posts/`. It renders the full article chrome that
// used to live inline in Layout.vue: the view/comment counters (ArticleMeta,
// when comments are configured), the page content, and the end-of-article
// license (COMP-003) and comment (COMP-004) cards — each dropped by its
// frontmatter escape hatch (`license: false` / `comments: false`).
//
// POST-001 adds the post byline above the content: the publish date and the
// post's categories/tags as links to their listing pages (PostTaxonomy). The
// series article type (SeriesArticlePage) reuses this whole component.
import { computed } from 'vue'
import { useData } from 'vitepress'
import ArticleComments from '../components/ArticleComments.vue'
import ArticleLicense from '../components/ArticleLicense.vue'
import ArticleMeta from '../components/ArticleMeta.vue'
import PostTaxonomy from '../components/PostTaxonomy.vue'
import { isCommentsConfigured } from '../config'
import { toStringList } from '../posts'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'
import { formatListDate, toIsoDate } from '../utils/date'

const { frontmatter } = useData()
const config = useThemeConfig()
const { language } = useThemeLocale()

const tags = computed(() => toStringList(frontmatter.value.tags))
const categories = computed(() => toStringList(frontmatter.value.categories))
const date = computed(() =>
  formatListDate(toIsoDate(frontmatter.value.date), language.value),
)

const showLicense = computed(() => frontmatter.value.license !== false)
const showComments = computed(
  () =>
    frontmatter.value.comments !== false &&
    isCommentsConfigured(config.value.comments),
)
</script>

<template>
  <!-- Article view/comment counts (COMP-004) -->
  <ArticleMeta v-if="showComments" />

  <!-- Post byline: publish date + categories/tags links (POST-001) -->
  <div
    v-if="date || tags.length || categories.length"
    class="ct-post-header"
  >
    <p v-if="date" class="ct-post-header__date">{{ date }}</p>
    <PostTaxonomy :categories="categories" :tags="tags" />
  </div>

  <Content />

  <!-- End-of-article cards: license then comments, both prompt-decorated -->
  <ArticleLicense v-if="showLicense" />
  <ArticleComments v-if="showComments" />
</template>
