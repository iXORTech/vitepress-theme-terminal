<script setup lang="ts">
// ============================================================================
// CategoriesIndex.vue — all categories with counts (POST-001)
// ============================================================================
// The category index: every category that any post declares, each a link to its
// `/categories/<slug>` listing with a post count. Display names resolve
// through `themeConfig.taxonomy.categories` (I18N-008); slugs/URLs stay
// derived from the authored names. Rendered by `src/categories.md`.
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'
import { filterListablePosts, groupByCategory } from '../posts'
import { useTaxonomy } from '../composables/useTaxonomy'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'

const { t } = useThemeLocale()
const { categoryLabel } = useTaxonomy()
const config = useThemeConfig()

// Series articles count only when opted in (POST-002).
const categories = computed(() =>
  groupByCategory(filterListablePosts(posts, config.value.series, 'categories')),
)
</script>

<template>
  <div class="ct-listing ct-terms ct-terms--categories">
    <h1 class="ct-listing__title">{{ t('post.categoriesTitle') }}</h1>

    <p v-if="!categories.length" class="ct-postlist__empty">
      {{ t('post.empty') }}
    </p>

    <ul v-else class="ct-terms__list">
      <li v-for="group in categories" :key="group.slug" class="ct-terms__item">
        <a class="ct-terms__link" :href="withBase(`/categories/${group.slug}`)">
          <span class="ct-terms__name">{{ categoryLabel(group.name) }}</span>
          <span class="ct-terms__count">{{ group.posts.length }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>
