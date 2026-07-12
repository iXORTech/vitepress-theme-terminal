<script setup lang="ts">
// ============================================================================
// SettingsFonts.vue — settings panel: font configuration pane (THEME-007)
// ============================================================================
// The first settings pane: two segmented controls choosing the content font
// family (Default / Sans / Serif / Mono) and size (Small / Medium / Large).
// State + persistence live in useFontSettings(); every label is localized.
import type { FontFamily, FontSize } from '../composables/useFontSettings'
import { useFontSettings } from '../composables/useFontSettings'
import { useThemeLocale } from '../composables/useThemeLocale'
import type { ThemeLocaleKey } from '../locales'

const { t } = useThemeLocale()
const { family, size, families, sizes, setFamily, setSize } = useFontSettings()

// Option value → locale key for its label.
const familyLabels: Record<FontFamily, ThemeLocaleKey> = {
  default: 'settings.fontDefault',
  sans: 'settings.fontSans',
  serif: 'settings.fontSerif',
  mono: 'settings.fontMono',
}
const sizeLabels: Record<FontSize, ThemeLocaleKey> = {
  small: 'settings.sizeSmall',
  medium: 'settings.sizeMedium',
  large: 'settings.sizeLarge',
}
</script>

<template>
  <div class="ct-settings">
    <!-- Font family -->
    <div class="ct-settings__row">
      <span class="ct-settings__label">{{ t('settings.fontFamily') }}</span>
      <div class="ct-settings__options" role="group" :aria-label="t('settings.fontFamily')">
        <button
          v-for="value in families"
          :key="value"
          type="button"
          class="ct-settings__option"
          :class="{ 'ct-settings__option--active': family === value }"
          :aria-pressed="family === value"
          @click="setFamily(value)"
        >{{ t(familyLabels[value]) }}</button>
      </div>
    </div>

    <!-- Font size -->
    <div class="ct-settings__row">
      <span class="ct-settings__label">{{ t('settings.fontSize') }}</span>
      <div class="ct-settings__options" role="group" :aria-label="t('settings.fontSize')">
        <button
          v-for="value in sizes"
          :key="value"
          type="button"
          class="ct-settings__option"
          :class="{ 'ct-settings__option--active': size === value }"
          :aria-pressed="size === value"
          @click="setSize(value)"
        >{{ t(sizeLabels[value]) }}</button>
      </div>
    </div>
  </div>
</template>
