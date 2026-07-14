<script setup lang="ts">
// ============================================================================
// HomePage.vue — the home page type (ARCH-001)
// ============================================================================
// The `home` page type (frontmatter `home: true`, `src/index.md`). For now this
// is the localized welcome placeholder lifted out of Layout.vue's old inline
// branch; PAGE-001 replaces it with the prompt-card welcome. It deliberately
// does not render `<Content/>` or any article chrome.
import { withBase } from 'vitepress'
import { useSiteText } from '../composables/useSiteText'

const { title, description } = useSiteText()
</script>

<template>
  <div class="ct-home">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <ul>
      <li><a :href="withBase('/posts')">Posts</a></li>
      <li><a :href="withBase('/markdown-examples')">Markdown Examples</a></li>
      <li><a :href="withBase('/api-examples')">API Examples</a></li>
    </ul>
  </div>
</template>
