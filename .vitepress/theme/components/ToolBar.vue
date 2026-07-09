<script setup lang="ts">
// ============================================================================
// ToolBar.vue — top tool bar / tabline (THEME-001)
// ============================================================================
// The editor-style top bar of the TUI shell (design-language.md §4–5,
// ui-sketch.md §1): brand glyph + localized site title on the left, site
// navigation rendered as editor tabs beside it, and the global action icons
// on the right — currently the color-mode switcher (THEME-010; the status
// bar only indicates the mode). Configurable nav entries and extra action
// icons arrive with THEME-005; the search trigger with THEME-003.
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { useColorMode } from '../composables/useColorMode'
import { useSiteText } from '../composables/useSiteText'
import { useThemeLocale } from '../composables/useThemeLocale'

const { page } = useData()

// Color-mode cycling — the switcher's permanent home is the tool bar
const { cycleMode } = useColorMode()

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

    <!-- Global actions (right): mode switcher; more icons land with THEME-003/005 -->
    <div class="ct-toolbar__actions">
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
