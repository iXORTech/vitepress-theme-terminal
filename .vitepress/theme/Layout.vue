<script setup lang="ts">
// ============================================================================
// Layout.vue — the TUI shell: tool bar · viewport · status bar (THEME-001)
// ============================================================================
// Composes the persistent terminal chrome around the page content
// (design-language.md §4–5, ui-sketch.md §1): the top tool bar, the floating
// content viewport, and the bottom status bar. The explorer sidebar
// (THEME-002), floating utilities (THEME-003), and in-viewport footer
// (THEME-004/006) attach to this frame later.
import { ref } from 'vue'
import { useData } from 'vitepress'
import StatusBar from './components/StatusBar.vue'
import ToolBar from './components/ToolBar.vue'
import { useCalloutTitles } from './composables/useCalloutTitles'
import { useNerdFont } from './composables/useNerdFont'
import { useSiteText } from './composables/useSiteText'
import { useViewportScroll } from './composables/useViewportScroll'

const { frontmatter } = useData()

// The viewport panel is the scroll container of the fixed shell frame
// (THEME-008); this wires the router-facing scroll behaviors onto it.
const viewport = ref<HTMLElement | null>(null)
useViewportScroll(viewport)

// Localized site title/description (I18N-004); also syncs the browser tab.
const { title, description } = useSiteText()

// Re-localize callout default titles on language switch (MD-002)
useCalloutTitles()

// Flag <html> once the symbols Nerd Font is usable — gates the PUA glyphs in
// callouts and TUI chrome with a tofu-safe fallback (FONT-002 / MD-003)
useNerdFont()
</script>

<template>
  <div class="ct-shell">
    <!-- Top tool bar / tabline -->
    <ToolBar />

    <!-- Content viewport — the floating editor panel and scroll container -->
    <main ref="viewport" class="ct-viewport">
      <div class="ct-content">
        <template v-if="frontmatter.home">
          <!-- Placeholder home content until the home page lands (PAGE-001) -->
          <h1>{{ title }}</h1>
          <p>{{ description }}</p>
          <ul>
            <li><a href="/markdown-examples.html">Markdown Examples</a></li>
            <li><a href="/api-examples.html">API Examples</a></li>
          </ul>
        </template>
        <Content v-else />
      </div>
    </main>

    <!-- Bottom status bar / statusline -->
    <StatusBar />
  </div>
</template>
