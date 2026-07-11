<script setup lang="ts">
// ============================================================================
// Explorer.vue — file-explorer navigation sidebar (THEME-002)
// ============================================================================
// The tree-style site navigation panel (design-language.md §4, ui-sketch.md
// §1/§3): on desktop a fixed-width floating panel beside the viewport with
// its own scroll, retracted/extended by the tool-bar toggle; at mobile widths
// an off-canvas drawer over a dimmed backdrop, dismissed by its explicit
// close control, tapping the backdrop, `Esc` (design-language.md §7), or
// navigating. Contents come from `themeConfig.explorer`; the layout does not
// render this component at all in paper mode or when the tree is empty.
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import ExplorerTree from './ExplorerTree.vue'
import { useExplorer } from '../composables/useExplorer'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'

const config = useThemeConfig()
const { t } = useThemeLocale()
const { desktopOpen, drawerOpen, closeDrawer } = useExplorer()

// Navigating closes the drawer — the target page is behind it
const { page } = useData()
watch(() => page.value.relativePath, closeDrawer)

// `Esc` dismisses the drawer (keyboard-friendly UX, design-language.md §7)
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && drawerOpen.value) closeDrawer()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- Backdrop dims the content behind the mobile drawer; tap dismisses -->
  <div v-if="drawerOpen" class="ct-explorer-backdrop" @click="closeDrawer"></div>

  <nav
    class="ct-explorer"
    :class="{
      'ct-explorer--closed': !desktopOpen,
      'ct-explorer--drawer-open': drawerOpen,
    }"
    :aria-label="t('explorer.label')"
  >
    <!-- Drawer header — title + explicit close control, mobile only -->
    <div class="ct-explorer__header">
      <span class="ct-explorer__title">{{ t('explorer.label') }}</span>
      <button
        class="ct-explorer__close"
        :title="t('explorer.close')"
        :aria-label="t('explorer.close')"
        @click="closeDrawer"
      >
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>

    <!-- The navigation tree (recursive) -->
    <ExplorerTree :items="config.explorer" />
  </nav>
</template>
