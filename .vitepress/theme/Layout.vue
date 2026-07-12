<script setup lang="ts">
// ============================================================================
// Layout.vue — the TUI shell: tool bar · viewport · status bar (THEME-001)
// ============================================================================
// Composes the persistent terminal chrome around the page content
// (design-language.md §4–5, ui-sketch.md §1): the top tool bar, the middle
// row — explorer sidebar (THEME-002) beside the floating content viewport,
// which holds the content column and the in-viewport footer (THEME-004) —
// the bottom status bar, and the shared floating utility window (THEME-003).
// The custom pre-footer section (THEME-006) attaches to this frame later.
import { ref } from 'vue'
import { useData } from 'vitepress'
import Explorer from './components/Explorer.vue'
import FloatingWindow from './components/FloatingWindow.vue'
import SiteFooter from './components/SiteFooter.vue'
import StatusBar from './components/StatusBar.vue'
import ToolBar from './components/ToolBar.vue'
import { useCalloutTitles } from './composables/useCalloutTitles'
import { useExplorer } from './composables/useExplorer'
import { useNerdFont } from './composables/useNerdFont'
import { useSiteText } from './composables/useSiteText'
import { useViewportScroll } from './composables/useViewportScroll'
import { useWindowDemoShortcuts } from './composables/useWindowDemo'

const { frontmatter } = useData()

// The explorer exists only when a tree is configured and the mode isn't
// paper (THEME-002) — then it is not rendered at all, not merely hidden.
const { available: explorerAvailable } = useExplorer()

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

// `~` opens the window demo, `/` the search demo (THEME-003/018, temporary
// until SEARCH-002)
useWindowDemoShortcuts()
</script>

<template>
  <div class="ct-shell">
    <!-- Top tool bar / tabline -->
    <ToolBar />

    <!-- Middle row: explorer sidebar beside the content viewport -->
    <div class="ct-main">
      <!-- File-explorer navigation — absent in paper mode and when
           unconfigured (THEME-002) -->
      <Explorer v-if="explorerAvailable" />

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

        <!-- In-viewport footer — scrolls with the content (THEME-004); the
             user-supplied custom section slots in above it later (THEME-006) -->
        <SiteFooter />
      </main>
    </div>

    <!-- Bottom status bar / statusline -->
    <StatusBar />

    <!-- Shared floating utility window — hidden until a utility opens it
         (THEME-003) -->
    <FloatingWindow />
  </div>
</template>
