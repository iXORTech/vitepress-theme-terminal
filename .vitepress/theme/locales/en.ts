// =============================================================================
// en.ts — built-in English locale (I18N-001)
// =============================================================================
// The source of truth for the theme's UI string set: every other locale (and
// the `localeStrings` config override) is typed against this table, so adding
// a key here is what "adding a theme string" means. Keys are flat, dotted by
// feature area. The set grows as features land (STYLE-004 copy button, MD-002
// callout titles, THEME-* chrome, …).

export const en = {
  // Self-description: how this language names itself in the switcher
  'lang.label': 'English',

  // Color modes (STYLE-002 switcher; tool bar / status bar later)
  'mode.dark': 'Dark',
  'mode.light': 'Light',
  'mode.paper': 'Paper',
  'mode.switch': 'Switch color mode',

  // Language switching (I18N-002 temporary switcher; status bar / settings later)
  'lang.switch': 'Switch language',
} as const satisfies Record<string, string>

/** The complete theme string table — all locales provide exactly these keys. */
export type ThemeLocaleStrings = Record<keyof typeof en, string>

/** A single theme string key, e.g. `'mode.dark'`. */
export type ThemeLocaleKey = keyof ThemeLocaleStrings
