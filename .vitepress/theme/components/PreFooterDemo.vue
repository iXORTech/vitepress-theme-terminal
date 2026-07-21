<script setup lang="ts">
// ============================================================================
// PreFooterDemo.vue — temporary demo for the custom pre-footer slot (THEME-006)
// ============================================================================
// Illustrates what a user-supplied `pre-footer` Vue file can render: a brand
// cluster on the left (the official site mark + the localized theme name,
// THEME-032) and, on the right, a Font Awesome icon, a Nerd Font icon, and a
// localized text label — showing that arbitrary content, both icon systems, and
// localized strings all work inside the slot. Demo only: a real site replaces
// this with its own component (see the wiring note in design-language.md §4,
// footer).
import { useSiteText } from '../composables/useSiteText'
import { useThemeLocale } from '../composables/useThemeLocale'
import SiteMark from './SiteMark.vue'

// Theme name = the localized site title (I18N-004)
const { title } = useSiteText()

// All UI text resolves through the locale layer (AGENTS.md §6.7)
const { t } = useThemeLocale()
</script>

<template>
  <div class="ct-prefooter-demo">
    <!-- Left: the official site mark (favicon, THEME-032) + theme name -->
    <span class="ct-prefooter-demo__brand">
      <SiteMark />
      <span class="ct-prefooter-demo__name">{{ title }}</span>
    </span>

    <!-- Right: a Font Awesome icon, a Nerd Font icon, and a text label -->
    <span class="ct-prefooter-demo__extras">
      <i class="fa-solid fa-palette" aria-hidden="true"></i>
      <span class="ct-prefooter-demo__nf" aria-hidden="true"></span>
      <span class="ct-prefooter-demo__label">{{ t('footer.demoCustom') }}</span>
    </span>
  </div>
</template>
