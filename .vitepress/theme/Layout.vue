<script setup lang="ts">
// Placeholder layout — replaced by the real TUI shell in THEME-001. It only
// provides what the styling foundation needs to be exercised: a mode switcher
// (STYLE-002) and a `.ct-content` wrapper for markdown styling (STYLE-005).
import { useData } from 'vitepress'
import { useColorMode } from './composables/useColorMode'

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()

// Temporary switch control; the real color-mode switcher lands in the tool
// bar/status bar (THEME-001/THEME-005) with localized labels (I18N-001). The
// button shows the raw mode key, not a translated string.
const { mode, cycleMode } = useColorMode()
</script>

<template>
  <div class="ct-shell">
    <!-- Temporary chrome placeholder — real tool bar comes with THEME-001 -->
    <header class="ct-shell__bar">
      <span>{{ site.title }}</span>
      <button class="ct-mode-switch" @click="cycleMode">◐ {{ mode }}</button>
    </header>

    <!-- Content viewport -->
    <main class="ct-content">
      <template v-if="frontmatter.home">
        <h1>{{ site.title }}</h1>
        <p>{{ site.description }}</p>
        <ul>
          <li><a href="/markdown-examples.html">Markdown Examples</a></li>
          <li><a href="/api-examples.html">API Examples</a></li>
        </ul>
      </template>
      <template v-else>
        <p><a href="/">~/home</a></p>
        <Content />
      </template>
    </main>
  </div>
</template>
