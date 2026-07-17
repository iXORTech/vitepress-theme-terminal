<script setup lang="ts">
// ============================================================================
// TagsIndex.vue — all tags with counts (POST-001)
// ============================================================================
// The tag index: a cloud of every tag any post declares, each a `#tag` link to
// its `/tags/<slug>` listing with a post count. Display names resolve through
// `themeConfig.taxonomy.tags` (I18N-008); slugs/URLs stay derived from the
// authored names. Rendered by `src/tags.md`.
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'
import { filterListablePosts, groupByTag } from '../posts'
import { useTaxonomy } from '../composables/useTaxonomy'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'

const { t } = useThemeLocale()
const { tagLabel } = useTaxonomy()
const config = useThemeConfig()

// Series articles count only when opted in (POST-002).
const tags = computed(() =>
  groupByTag(filterListablePosts(posts, config.value.series, 'tags')),
)
</script>

<template>
  <div class="ct-listing ct-terms ct-terms--tags">
    <h1 class="ct-listing__title">{{ t('post.tagsTitle') }}</h1>

    <p v-if="!tags.length" class="ct-postlist__empty">{{ t('post.empty') }}</p>

    <ul v-else class="ct-terms__cloud">
      <li v-for="group in tags" :key="group.slug" class="ct-terms__chip">
        <a class="ct-terms__link" :href="withBase(`/tags/${group.slug}`)">
          <span class="ct-terms__name">#{{ tagLabel(group.name) }}</span>
          <span class="ct-terms__count">{{ group.posts.length }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>
