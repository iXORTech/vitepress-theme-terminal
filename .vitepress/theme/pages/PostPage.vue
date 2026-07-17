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
// POST-003: an optional frontmatter `cover` renders in the header region —
// beside the byline on desktop, above it (full width) on mobile.
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import ArticleComments from '../components/ArticleComments.vue'
import ArticleLicense from '../components/ArticleLicense.vue'
import ArticleMeta from '../components/ArticleMeta.vue'
import PostTaxonomy from '../components/PostTaxonomy.vue'
import { isCommentsConfigured } from '../config'
import { toStringList } from '../posts'
import { asLocalizableText, resolveLocalizedText } from '../locales'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'
import { formatListDate, toIsoDate } from '../utils/date'

const { frontmatter, page } = useData()
const config = useThemeConfig()
const { language } = useThemeLocale()

const tags = computed(() => toStringList(frontmatter.value.tags))
const categories = computed(() => toStringList(frontmatter.value.categories))
const date = computed(() =>
  formatListDate(toIsoDate(frontmatter.value.date), language.value),
)

// Cover image (POST-003): a root-absolute URL honors the site base.
const cover = computed(() => {
  const raw = frontmatter.value.cover
  const url = typeof raw === 'string' ? raw.trim() : ''
  if (!url) return ''
  return /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : withBase(url)
})

// Alt text: the (possibly localized, ARCH-003) article title.
const coverAlt = computed(
  () =>
    resolveLocalizedText(asLocalizableText(frontmatter.value.title), language.value) ??
    page.value.title,
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

  <!-- Post header: byline (publish date + categories/tags links, POST-001)
       plus the optional cover image (POST-003) — cover right on desktop,
       on top on mobile; lazy-loaded, skipped by the lightbox -->
  <div
    v-if="date || tags.length || categories.length || cover"
    class="ct-post-header"
    :class="{ 'ct-post-header--cover': cover }"
  >
    <div class="ct-post-header__meta">
      <p v-if="date" class="ct-post-header__date">{{ date }}</p>
      <PostTaxonomy :categories="categories" :tags="tags" />
    </div>
    <img
      v-if="cover"
      class="ct-post-header__cover"
      :src="cover"
      :alt="coverAlt"
      loading="lazy"
      decoding="async"
      data-no-lightbox
    />
  </div>

  <Content />

  <!-- End-of-article cards: license then comments, both prompt-decorated -->
  <ArticleLicense v-if="showLicense" />
  <ArticleComments v-if="showComments" />
</template>
