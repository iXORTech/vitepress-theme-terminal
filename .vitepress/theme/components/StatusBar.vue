<script setup lang="ts">
// ============================================================================
// StatusBar.vue — bottom status bar / statusline (THEME-001)
// ============================================================================
// The statusline of the TUI shell (design-language.md §4–5, ui-sketch.md §1):
// a modal-editor-flavored mode chip and the current location on the left;
// on the right a reading-progress + back-to-top cluster, the permanent
// language switcher, and a read-only color-mode indicator (switching lives
// in the tool bar — THEME-010). Thin separators divide the top-level
// segments (_statusbar.scss). Language switching stays in place — same URL,
// no /<lang>/ trees (I18N-003, design-language.md §9).
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useColorMode } from '../composables/useColorMode'
import { useReadingProgress } from '../composables/useReadingProgress'
import { useThemeLocale } from '../composables/useThemeLocale'

const { page } = useData()
const { mode } = useColorMode() // indicator only — the switcher is in the tool bar
const { t, language, languages, setLanguage } = useThemeLocale()
const progress = useReadingProgress()

// Current location as a home-relative TUI path: index.md → ~, otherwise
// ~/<path without extension> (path data, not translatable UI text).
const location = computed(() => {
  const path = page.value.relativePath
    .replace(/(^|\/)index\.md$/, '')
    .replace(/\.md$/, '')
  return path ? `~/${path}` : '~'
})

// The language switcher cycles through the available languages in place
const cycleLanguage = (): void => {
  const tags = languages.value.map((entry) => entry.tag)
  const next = tags[(tags.indexOf(language.value) + 1) % tags.length]
  setLanguage(next)
}

// Back to top (THEME-009): smooth-scroll the viewport panel — the shell's
// only scroll container (THEME-008) — back to the top.
const scrollToTop = (): void => {
  document
    .querySelector('.ct-viewport')
    ?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="ct-statusbar">
    <!-- Left: editor-mode chip (TUI flavor) + current location -->
    <div class="ct-statusbar__group">
      <span class="ct-statusbar__chip">{{ t('status.read') }}</span>
      <span class="ct-statusbar__location">{{ location }}</span>
    </div>

    <!-- Right: progress+back-to-top cluster · language switcher · mode indicator -->
    <div class="ct-statusbar__group">
      <!-- Reading progress and back-to-top belong together: one tight cluster -->
      <span class="ct-statusbar__cluster">
        <span class="ct-statusbar__segment" :title="t('status.progress')">
          {{ progress }}%
        </span>
        <button
          class="ct-statusbar__control ct-statusbar__control--icon"
          :title="t('status.backToTop')"
          :aria-label="t('status.backToTop')"
          @click="scrollToTop"
        >
          <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
        </button>
      </span>

      <button
        v-if="languages.length > 1"
        class="ct-statusbar__control"
        :title="t('lang.switch')"
        :aria-label="t('lang.switch')"
        @click="cycleLanguage"
      >
        {{ language }}
      </button>

      <!-- Read-only mode indicator — the switcher lives in the tool bar -->
      <span class="ct-statusbar__segment">{{ t(`mode.${mode}`).toLowerCase() }}</span>
    </div>
  </footer>
</template>
