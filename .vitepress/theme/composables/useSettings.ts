// =============================================================================
// useSettings.ts — settings-panel opener (THEME-007)
// =============================================================================
// Opens the settings panel in the shared floating window (useFloatingWindow),
// as a plain utility WITHOUT a shell prompt (design-language.md §4, cards). Its
// first version offers font configuration (SettingsFonts) and language
// switching (SettingsLanguage) as two framed panes. A setup-time composable
// because the localized pane-title getters need useThemeLocale()'s component
// context — call it from setup and use `openSettings` in a handler (the
// tool-bar gear, ToolBar.vue).

import SettingsFonts from '../components/SettingsFonts.vue'
import SettingsLanguage from '../components/SettingsLanguage.vue'
import { useFloatingWindow } from './useFloatingWindow'
import { useThemeLocale } from './useThemeLocale'

/** The settings opener — call from setup, use `openSettings` in handlers. */
export function useSettings(): { openSettings: () => void } {
  const { t } = useThemeLocale()
  const { open } = useFloatingWindow()

  // Two panes (THEME-017): fonts over languages. Titles are getters so they
  // follow a UI-language switch made from within the panel itself.
  const openSettings = (): void =>
    open({
      id: 'settings',
      label: () => t('settings.title'),
      panes: [
        {
          title: () => t('settings.fonts'),
          icon: 'fa-solid fa-font',
          component: SettingsFonts,
        },
        {
          title: () => t('settings.language'),
          icon: 'fa-solid fa-language',
          component: SettingsLanguage,
        },
      ],
    })

  return { openSettings }
}
