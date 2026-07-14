<script setup lang="ts">
// ============================================================================
// NotFoundPage.vue — the 404 page type (ARCH-001)
// ============================================================================
// Rendered when `page.isNotFound` is true. Minimal, localized not-found content
// inside the standard shell (the status bar already shows the `404` chip).
import { withBase } from 'vitepress'
import { useThemeLocale } from '../composables/useThemeLocale'

const { t } = useThemeLocale()
</script>

<template>
  <div class="ct-notfound">
    <h1 class="ct-notfound__code">404</h1>
    <p class="ct-notfound__title">{{ t('notFound.title') }}</p>
    <p class="ct-notfound__home">
      <a :href="withBase('/')">{{ t('notFound.home') }}</a>
    </p>
  </div>
</template>
