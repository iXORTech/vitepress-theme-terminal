<script setup lang="ts">
// ============================================================================
// TagsIndex.vue — all tags with counts (POST-001)
// ============================================================================
// The tag index: a cloud of every tag any post declares, each a `#tag` link to
// its `/tags/<slug>` listing with a post count. Rendered by `src/tags.md`.
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'
import { groupByTag } from '../posts'
import { useThemeLocale } from '../composables/useThemeLocale'

const { t } = useThemeLocale()

const tags = computed(() => groupByTag(posts))
</script>

<template>
  <div class="ct-listing ct-terms ct-terms--tags">
    <h1 class="ct-listing__title">{{ t('post.tagsTitle') }}</h1>

    <p v-if="!tags.length" class="ct-postlist__empty">{{ t('post.empty') }}</p>

    <ul v-else class="ct-terms__cloud">
      <li v-for="group in tags" :key="group.slug" class="ct-terms__chip">
        <a class="ct-terms__link" :href="withBase(`/tags/${group.slug}`)">
          <span class="ct-terms__name">#{{ group.name }}</span>
          <span class="ct-terms__count">{{ group.posts.length }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>
