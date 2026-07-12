<script setup lang="ts">
// ============================================================================
// SettingsLanguage.vue — settings panel: language pane (THEME-007)
// ============================================================================
// The second settings pane: a list of the available UI languages (built-in +
// any added via themeConfig.localeStrings), each self-described by its
// `lang.label`. Selecting one switches the UI language in place and persists it
// — the same client-side mechanism as the status-bar switcher (I18N-003, no
// `/<lang>/` URL trees). Reuses useThemeLocale(); nothing hardcoded.
import { useThemeLocale } from '../composables/useThemeLocale'

const { language, languages, setLanguage } = useThemeLocale()
</script>

<template>
  <ul class="ct-settings__langs">
    <li v-for="entry in languages" :key="entry.tag">
      <button
        type="button"
        class="ct-settings__lang"
        :class="{ 'ct-settings__lang--active': language === entry.tag }"
        :aria-pressed="language === entry.tag"
        @click="setLanguage(entry.tag)"
      >
        <span class="ct-settings__lang-label">{{ entry.label }}</span>
        <span class="ct-settings__lang-tag">{{ entry.tag }}</span>
      </button>
    </li>
  </ul>
</template>
