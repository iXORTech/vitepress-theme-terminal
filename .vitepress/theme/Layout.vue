<script setup lang="ts">
// Placeholder layout — replaced by the real TUI shell in THEME-001. It only
// provides what the styling foundation needs to be exercised: a mode switcher
// (STYLE-002) and a `.ct-content` wrapper for markdown styling (STYLE-005).
import { useData } from 'vitepress'
import { useColorMode } from './composables/useColorMode'
import { useSiteText } from './composables/useSiteText'
import { useThemeLocale } from './composables/useThemeLocale'

// https://vitepress.dev/reference/runtime-api#usedata
const { frontmatter } = useData()

// Localized site title/description (I18N-004); also syncs the browser tab.
const { title, description } = useSiteText()

// Temporary switch controls; the permanent color-mode switcher lands in the
// tool bar (THEME-005), the permanent language switcher in the status bar
// (THEME-001) and settings panel (THEME-007). Labels resolve through the
// locale layer (I18N-001) — no hardcoded UI strings (AGENTS.md §6.7).
// Language switching is in-place — same URL, no /<lang>/ trees (I18N-003).
const { mode, cycleMode } = useColorMode()
const { t, language, languages, setLanguage } = useThemeLocale()
</script>

<template>
  <div class="ct-shell">
    <!-- Temporary chrome placeholder — real tool bar comes with THEME-001 -->
    <header class="ct-shell__bar">
      <span>{{ title }}</span>
      <div class="ct-shell__actions">
        <!-- Temporary language switcher (I18N-002/003): switches in place -->
        <nav
          v-if="languages.length > 1"
          class="ct-lang-switch"
          :aria-label="t('lang.switch')"
        >
          <template v-for="(lang, i) in languages" :key="lang.tag">
            <span v-if="i" class="ct-lang-switch__sep" aria-hidden="true">·</span>
            <button
              class="ct-lang-switch__option"
              :class="{ 'ct-lang-switch__option--active': lang.tag === language }"
              :disabled="lang.tag === language"
              @click="setLanguage(lang.tag)"
            >
              {{ lang.label }}
            </button>
          </template>
        </nav>

        <button
          class="ct-mode-switch"
          :title="t('mode.switch')"
          :aria-label="t('mode.switch')"
          @click="cycleMode"
        >
          ◐ {{ t(`mode.${mode}`) }}
        </button>
      </div>
    </header>

    <!-- Content viewport -->
    <main class="ct-content">
      <template v-if="frontmatter.home">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
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
