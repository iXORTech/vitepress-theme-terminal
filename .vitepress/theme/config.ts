// =============================================================================
// config.ts — theme configuration surface (CONF-001)
// =============================================================================
// The single source of user configuration for the theme. Users configure the
// theme exclusively through `themeConfig` in `.vitepress/config.mts`
// (AGENTS.md §6.5); components never read user options from anywhere else.
// Every option is optional in the site config — defaults are applied here at
// resolution time.
//
// This module is intentionally framework-free (no vue/vitepress imports) so it
// can be imported from both the Node-side site config (`.vitepress/config.mts`)
// and client code. Components access the resolved config through the
// `useThemeConfig()` composable in `composables/useThemeConfig.ts`.

import type { LocaleOverrides, LocalizableText } from './locales'

export type {
  LocaleOverrides,
  LocalizableText,
  ThemeLocaleKey,
  ThemeLocaleStrings,
} from './locales'

// -----------------------------------------------------------------------------
// Schema
// -----------------------------------------------------------------------------

/** User-facing theme configuration, as written in `.vitepress/config.mts`. */
export interface TerminalThemeConfig {
  /**
   * The main (accent) color — the single configurable color of the theme.
   * Every auxiliary tone (hover, dimmed text, subtle backgrounds, borders,
   * selection) is derived from it and never configured separately
   * (docs/design/color-system.md §2–3). Default: `#80E0A7`.
   */
  mainColor?: string

  /**
   * Localized site title, shown in theme chrome and the browser tab. Falls
   * back to the site config's `title` (which also remains the server-rendered
   * default). Plain string or per-language map (I18N-004).
   */
  title?: LocalizableText

  /**
   * Localized site description; same fallback rules as {@link title}, against
   * the site config's `description`.
   */
  description?: LocalizableText

  /**
   * Per-language overrides of theme UI strings, keyed by BCP 47 tag:
   * `{ "zh-CN": { "mode.paper": "阅读" } }`. Applied on top of the built-in
   * tables (theme/locales/) for the active UI language — a complete table
   * under a new tag adds a whole language to the switcher (I18N-003; no
   * `/<lang>/` URL trees, design-language.md §9).
   */
  localeStrings?: LocaleOverrides

  // Feature toggles are added here as their features land (e.g. CONF-002
  // author & license, POST-002 series inclusion, SEARCH-001 DocSearch keys).
}

// -----------------------------------------------------------------------------
// Defaults & resolution
// -----------------------------------------------------------------------------

/** {@link TerminalThemeConfig} with every default applied — what components consume. */
export type ResolvedTerminalThemeConfig = Required<TerminalThemeConfig>

/** Theme defaults, used wherever the user leaves an option unset. */
export const themeConfigDefaults: ResolvedTerminalThemeConfig = {
  mainColor: '#80E0A7',
  // Empty text = unset: consumers fall back to the site config's title/description.
  title: '',
  description: '',
  localeStrings: {},
}

/**
 * Apply defaults over a (possibly partial or absent) user `themeConfig`.
 * Options are copied individually so an explicit `undefined` from the user
 * still falls back to the default.
 */
export function resolveThemeConfig(
  user: TerminalThemeConfig | undefined,
): ResolvedTerminalThemeConfig {
  const resolved = { ...themeConfigDefaults }
  if (user?.mainColor) resolved.mainColor = user.mainColor
  if (user?.title) resolved.title = user.title
  if (user?.description) resolved.description = user.description
  if (user?.localeStrings) resolved.localeStrings = user.localeStrings
  return resolved
}
