<script setup lang="ts">
// ============================================================================
// ArticleMeta.vue — article view & comment counts (COMP-004)
// ============================================================================
// A small strip in the article's title section showing the Waline-powered
// view count and comment count. The numbers are filled in by Waline
// (useWaline, called from Layout) into the `__views` / `__comments` elements;
// the placeholder `0` shows until then. Rendered only on articles when
// comments are configured. Icons are decorative; the accessible label carries
// the meaning (localized, I18N-001).
import { useThemeLocale } from '../composables/useThemeLocale'

const { t } = useThemeLocale()
</script>

<template>
  <div class="ct-article-meta" aria-hidden="false">
    <span class="ct-article-meta__item">
      <i class="fa-solid fa-eye" aria-hidden="true"></i>
      <span
        class="ct-article-meta__count ct-article-meta__views"
        :aria-label="t('comments.views')"
      >0</span>
    </span>
    <span class="ct-article-meta__item">
      <i class="fa-solid fa-comment" aria-hidden="true"></i>
      <span
        class="ct-article-meta__count ct-article-meta__comments"
        :aria-label="t('comments.title')"
      >0</span>
    </span>
  </div>
</template>
