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
import { resolveLocalizedText } from './locales'

export type {
  LocaleOverrides,
  LocalizableText,
  ThemeLocaleKey,
  ThemeLocaleStrings,
} from './locales'

// -----------------------------------------------------------------------------
// Schema
// -----------------------------------------------------------------------------

/**
 * The site author's identity (CONF-002) — the single source for the footer
 * copyright, shell-prompt decorations, author displays, and the license card
 * (docs/design/design-language.md §4, author & license system).
 */
export interface TerminalAuthorConfig {
  /** Full/display name, shown e.g. in the footer copyright (I18N-004 text). */
  name?: LocalizableText

  /**
   * Shell-safe username used as the `user` in shell-prompt decorations
   * (COMP-001). When unset, derived from {@link name} via
   * {@link normalizeUsername}; falls back to `user`.
   */
  username?: string
}

/**
 * The content license (CONF-002), consumed by the footer license icons
 * (THEME-004) and the license card (COMP-003). Default: CC BY-NC-SA 4.0.
 * A custom `name` replaces the default as a whole — the CC `url`/`icons`
 * are not inherited (design-language.md §4).
 */
export interface TerminalLicenseConfig {
  /** License display name, e.g. `CC BY-NC-SA 4.0`. */
  name?: string

  /** URL of the license deed / full text. */
  url?: string

  /** Font Awesome class lists for the footer license icons. */
  icons?: string[]
}

/**
 * One social icon in the footer's copyright row (THEME-004). The list is
 * plain data so adding/removing an entry never requires component edits.
 */
export interface TerminalSocialLink {
  /** Font Awesome class list, e.g. `fa-brands fa-github`. */
  icon: string

  /** Destination URL. */
  link: string

  /**
   * Accessible name (tooltip / `aria-label`), localizable (I18N-004).
   * Falls back to the link URL when unset.
   */
  label?: LocalizableText
}

/**
 * Footer options (THEME-004): the social-icon list and the RSS feed
 * (design-language.md §4, footer). The copyright author and the license
 * icons are NOT configured here — they come from the central author &
 * license system ({@link TerminalAuthorConfig} / {@link TerminalLicenseConfig}).
 */
export interface TerminalFooterConfig {
  /** RSS/Atom feed URL — the footer RSS icon renders only when this is set. */
  rss?: string

  /** Social icons shown at the right of the copyright row. */
  social?: TerminalSocialLink[]
}

/**
 * One node of the explorer navigation tree (THEME-002). A node with `items`
 * renders as a collapsible folder; a node with `link` navigates; a node may
 * be both. Plain data, so reorganizing the tree never requires component
 * edits (design-language.md §4, file explorer).
 */
export interface TerminalExplorerItem {
  /** Label shown in the tree, localizable (I18N-004). */
  text: LocalizableText

  /**
   * Destination — a site-absolute path (`/posts/hello`) or an external URL.
   * On a folder node this is its index page: clicking the label opens it and
   * expands the folder (THEME-011); the chevron only toggles.
   */
  link?: string

  /** Child nodes; their presence makes this node a collapsible folder. */
  items?: TerminalExplorerItem[]

  /**
   * Explicit initial state, overriding the depth default (THEME-011: only
   * first-layer folders start open, deeper ones start collapsed). The
   * visitor's own toggles are persisted and win over both.
   */
  collapsed?: boolean
}

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
   * `{ "zh-Hans": { "mode.paper": "阅读" } }`. Applied on top of the built-in
   * tables (theme/locales/) for the active UI language — a complete table
   * under a new tag adds a whole language to the switcher (I18N-003; no
   * `/<lang>/` URL trees, design-language.md §9).
   */
  localeStrings?: LocaleOverrides

  /** Author identity (CONF-002); see {@link TerminalAuthorConfig}. */
  author?: TerminalAuthorConfig

  /** Content license (CONF-002); see {@link TerminalLicenseConfig}. */
  license?: TerminalLicenseConfig

  /** Footer options (THEME-004); see {@link TerminalFooterConfig}. */
  footer?: TerminalFooterConfig

  /**
   * File-explorer navigation tree (THEME-002); see {@link TerminalExplorerItem}.
   * Unset or empty hides the explorer and its tool-bar toggle entirely.
   */
  explorer?: TerminalExplorerItem[]

  // Feature toggles are added here as their features land (e.g. POST-002
  // series inclusion, SEARCH-001 DocSearch keys).
}

// -----------------------------------------------------------------------------
// Defaults & resolution
// -----------------------------------------------------------------------------

/** {@link TerminalAuthorConfig} after resolution: the username is always filled. */
export interface ResolvedAuthorConfig {
  name: LocalizableText
  username: string
}

/** {@link TerminalThemeConfig} with every default applied — what components consume. */
export type ResolvedTerminalThemeConfig = Required<
  Omit<TerminalThemeConfig, 'author' | 'license' | 'footer'>
> & {
  author: ResolvedAuthorConfig
  license: Required<TerminalLicenseConfig>
  footer: Required<TerminalFooterConfig>
}

/** Theme defaults, used wherever the user leaves an option unset. */
export const themeConfigDefaults: ResolvedTerminalThemeConfig = {
  mainColor: '#80E0A7',
  // Empty text = unset: consumers fall back to the site config's title/description.
  title: '',
  description: '',
  localeStrings: {},
  author: { name: 'Admin', username: 'admin' },
  // Default content license (CONF-002): CC BY-NC-SA 4.0 with the CC brand icons.
  license: {
    name: 'CC BY-NC-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    icons: [
      'fa-brands fa-creative-commons',
      'fa-brands fa-creative-commons-by',
      'fa-brands fa-creative-commons-nc',
      'fa-brands fa-creative-commons-sa',
    ],
  },
  // No feed and no social icons until the user configures them (THEME-004).
  footer: { rss: '', social: [] },
  // No explorer until the user configures a tree (THEME-002).
  explorer: [],
}

/**
 * Derive a shell-safe username from a display name, for the prompt
 * decoration's `user` (CONF-002; rule in design-language.md §4): strip
 * diacritics, lowercase, whitespace → `-`, drop everything outside
 * `a-z 0-9 . _ -`, collapse separator runs, trim edge separators. Empty
 * input yields `user`.
 */
export function normalizeUsername(name: string): string {
  const normalized = name
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/([-._])[-._]+/g, '$1')
    .replace(/^[-._]+|[-._]+$/g, '')
  return normalized || 'user'
}

/** Resolve the author block: explicit username wins, else derive from the name. */
function resolveAuthor(author: TerminalAuthorConfig): ResolvedAuthorConfig {
  const name = author.name ?? ''
  const explicit = author.username?.trim()
  const username =
    explicit || normalizeUsername(resolveLocalizedText(name, 'en') ?? '')
  return { name, username }
}

/**
 * Resolve the license block. The CC BY-NC-SA defaults for `url`/`icons` only
 * apply while the license *name* is the default one — a custom license must
 * bring its own deed URL and icons (unset then means none).
 */
function resolveLicense(
  license: TerminalLicenseConfig,
): Required<TerminalLicenseConfig> {
  const fallback = themeConfigDefaults.license
  if (!license.name || license.name === fallback.name) {
    return {
      name: fallback.name,
      url: license.url ?? fallback.url,
      icons: license.icons ?? fallback.icons,
    }
  }
  return { name: license.name, url: license.url ?? '', icons: license.icons ?? [] }
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
  if (user?.author) resolved.author = resolveAuthor(user.author)
  if (user?.license) resolved.license = resolveLicense(user.license)
  if (user?.footer) {
    resolved.footer = {
      rss: user.footer.rss ?? '',
      social: user.footer.social ?? [],
    }
  }
  if (user?.explorer) resolved.explorer = user.explorer
  return resolved
}
