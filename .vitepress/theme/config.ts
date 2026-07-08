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

// -----------------------------------------------------------------------------
// Schema
// -----------------------------------------------------------------------------

/**
 * Locale-string overrides: a flat map of theme string key → replacement text.
 * The built-in locale layer (I18N-001) resolves every UI string through its
 * built-in locale files first, then applies these per-site overrides on top.
 * Because VitePress resolves `themeConfig` per locale, a multi-language site
 * can supply different overrides under each entry of its `locales` config.
 * The concrete string keys are defined as theme strings appear (I18N-001).
 */
export type ThemeLocaleStrings = Record<string, string>

/** User-facing theme configuration, as written in `.vitepress/config.mts`. */
export interface TerminalThemeConfig {
  /**
   * The main (accent) color — the single configurable color of the theme.
   * Every auxiliary tone (hover, dimmed text, subtle backgrounds, borders,
   * selection) is derived from it and never configured separately
   * (docs/design/color-system.md §2–3). Default: `#80E0A7`.
   */
  mainColor?: string

  /** Per-site overrides of theme UI strings (see {@link ThemeLocaleStrings}). */
  localeStrings?: ThemeLocaleStrings

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
  if (user?.localeStrings) resolved.localeStrings = user.localeStrings
  return resolved
}
