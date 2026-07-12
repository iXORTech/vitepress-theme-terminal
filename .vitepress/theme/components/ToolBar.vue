<script setup lang="ts">
// ============================================================================
// ToolBar.vue — top tool bar / tabline (THEME-001)
// ============================================================================
// The editor-style top bar of the TUI shell (design-language.md §4–5,
// ui-sketch.md §1): the explorer toggle (THEME-002) and brand glyph +
// localized site title on the left, site navigation rendered as editor tabs
// beside it, and the global action icons on the right — the temporary
// floating-window demo trigger (THEME-003 — replaced by the find palette's
// search trigger when SEARCH-002 lands) and the color-mode switcher (THEME-010;
// the status bar only indicates the mode). The settings gear moved to the
// status bar (THEME-019). Configurable nav entries and extra action icons
// arrive with THEME-005.
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { useColorMode } from '../composables/useColorMode'
import { useExplorer } from '../composables/useExplorer'
import { useSiteText } from '../composables/useSiteText'
import { useThemeLocale } from '../composables/useThemeLocale'
import { useWindowDemo } from '../composables/useWindowDemo'

const { page } = useData()

// Color-mode cycling — the switcher's permanent home is the tool bar
const { cycleMode } = useColorMode()

// Explorer toggle (THEME-002): retract/extend on desktop, drawer on mobile;
// hidden entirely when the explorer doesn't exist (no tree / paper mode).
const { available: explorerAvailable, toggle: toggleExplorer } = useExplorer()

// Floating-window demo trigger (THEME-003, temporary until SEARCH-002)
const { openDemo } = useWindowDemo()

// Localized site title (I18N-004)
const { title } = useSiteText()

// All UI text resolves through the locale layer (AGENTS.md §6.7)
const { t } = useThemeLocale()

// Home is the only built-in tab until navigation becomes configurable
// (THEME-005); active state follows the current page.
const isHome = computed(() => page.value.relativePath === 'index.md')
</script>

<template>
  <header class="ct-toolbar">
    <!-- Explorer toggle — the explicit retract/extend control on desktop,
         the drawer trigger on mobile (THEME-002, ui-sketch.md §3 `[=]`) -->
    <button
      v-if="explorerAvailable"
      class="ct-toolbar__action"
      :title="t('explorer.toggle')"
      :aria-label="t('explorer.toggle')"
      @click="toggleExplorer"
    >
      <i class="fa-solid fa-bars" aria-hidden="true"></i>
    </button>

    <!-- Brand: decorative TUI glyph + localized site title, links home -->
    <a class="ct-toolbar__brand" :href="withBase('/')">
      <span class="ct-toolbar__glyph" aria-hidden="true"></span>
      <span class="ct-toolbar__title">{{ title }}</span>
    </a>

    <!-- Navigation as editor tabs (configurable entries land with THEME-005) -->
    <nav class="ct-toolbar__nav" :aria-label="t('nav.label')">
      <a
        class="ct-toolbar__tab"
        :class="{ 'ct-toolbar__tab--active': isHome }"
        :href="withBase('/')"
      >~/{{ t('nav.home') }}</a>
    </nav>

    <!-- Global actions (right): floating-window demo + mode switcher; the
         settings gear moved to the status bar (THEME-019); more icons land
         with THEME-005 -->
    <div class="ct-toolbar__actions">
      <!-- Floating-window demo (THEME-003, temporary — SEARCH-002 replaces it
           with the find-palette trigger) -->
      <button
        class="ct-toolbar__action"
        :title="t('window.demoOpen')"
        :aria-label="t('window.demoOpen')"
        @click="openDemo"
      >
        <i class="fa-solid fa-window-restore" aria-hidden="true"></i>
      </button>
      <button
        class="ct-toolbar__action"
        :title="t('mode.switch')"
        :aria-label="t('mode.switch')"
        @click="cycleMode"
      >
        <i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i>
      </button>
    </div>
  </header>
</template>
