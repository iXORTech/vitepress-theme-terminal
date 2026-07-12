<script setup lang="ts">
// ============================================================================
// DemoLayout.vue — demo wrapper filling the pre-footer slot (THEME-006)
// ============================================================================
// The exact pattern a consuming site uses to supply a custom pre-footer
// section: extend the theme, wrap its `Layout`, and fill the named `pre-footer`
// slot with a Vue component (design-language.md §4, footer). This demo site
// registers this wrapper as its Layout in `theme/index.ts`; a real site would
// provide its own wrapper and section instead. Temporary demo content.
import Layout from './Layout.vue'
import PreFooterDemo from './components/PreFooterDemo.vue'
</script>

<template>
  <Layout>
    <template #pre-footer>
      <PreFooterDemo />
    </template>
  </Layout>
</template>
