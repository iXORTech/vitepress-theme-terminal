// =============================================================================
// config.ts — theme configuration surface (CONF-001)
// =============================================================================
// The single source of user-facing theme options. Users configure theme
// behavior through `themeConfig` in `.vitepress/config.mts`; auto-discovered
// explorer metadata is intentionally authored beside source pages instead.
// Every theme option is optional in the site config — defaults are applied
// here at resolution time.
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
 * Algolia DocSearch credentials (SEARCH-001). All three fields are required
 * for search to work; supply the **search-only** (public) API key, never an
 * admin key. The find palette (THEME-003, SEARCH-002) queries this index
 * directly from the browser and renders results in its own TUI window — the
 * theme does not use DocSearch's own modal.
 */
export interface TerminalAlgoliaConfig {
  /** Algolia application ID. */
  appId: string

  /** Search-only (public) API key. */
  apiKey: string

  /** Name of the DocSearch index to query. */
  indexName: string
}

/**
 * Site search options (SEARCH-001). `provider` is reserved for future search
 * back-ends; today only Algolia DocSearch is wired. When {@link algolia} is
 * absent or incomplete, the find palette opens but shows a "not configured"
 * notice instead of querying (design-language.md §4, floating windows).
 */
export interface TerminalSearchConfig {
  /** Search back-end. Reserved — currently only `'algolia'`. */
  provider?: 'algolia'

  /** Algolia DocSearch credentials; see {@link TerminalAlgoliaConfig}. */
  algolia?: TerminalAlgoliaConfig
}

/**
 * One navigation tab in the tool bar's tabline (THEME-005). Plain data, so
 * adding, reordering, or relabeling a tab never requires component edits. Tabs
 * render after the built-in `~/home` tab and highlight when the current page
 * matches their {@link link}.
 */
export interface TerminalNavItem {
  /** Tab label, localizable (I18N-004). */
  text: LocalizableText

  /**
   * Destination — a site-absolute path (`/guide/`) or an external URL. The tab
   * is marked active when it maps to the current page; external links open in a
   * new tab.
   */
  link: string
}

/**
 * One extra action icon in the tool bar's right-side action group (THEME-005).
 * This is the extensible icon-slot mechanism: a site can add feature icons
 * (important social links, external tools, …) beside the theme's built-in
 * search and color-mode controls purely from configuration — no component
 * edits. Each entry renders as a Font Awesome icon linking to {@link link}.
 */
export interface TerminalToolbarAction {
  /** Font Awesome class list, e.g. `fa-brands fa-github`. */
  icon: string

  /** Destination URL — a site-absolute path or an external URL. */
  link: string

  /**
   * Accessible name (tooltip / `aria-label`), localizable (I18N-004). Falls
   * back to the link URL when unset.
   */
  label?: LocalizableText
}

/**
 * Tool bar options (THEME-005): configurable navigation tabs and the extensible
 * extra action-icon slots. The built-in `~/home` tab and the search /
 * color-mode controls are always present — these entries add to them
 * (design-language.md §4, tool bar).
 */
export interface TerminalToolbarConfig {
  /** Navigation tabs shown after the built-in home tab. */
  nav?: TerminalNavItem[]

  /** Extra action icons shown before the built-in search / mode controls. */
  actions?: TerminalToolbarAction[]
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

}

/** Explorer source: an explicit tree or every Markdown page under `src/`. */
export type TerminalExplorerConfig = TerminalExplorerItem[] | 'auto'

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

  /** Tool bar options (THEME-005); see {@link TerminalToolbarConfig}. */
  toolbar?: TerminalToolbarConfig

  /** Footer options (THEME-004); see {@link TerminalFooterConfig}. */
  footer?: TerminalFooterConfig

  /** Site search options (SEARCH-001); see {@link TerminalSearchConfig}. */
  search?: TerminalSearchConfig

  /**
   * File-explorer navigation tree (THEME-002); see {@link TerminalExplorerItem}.
   * Set to `"auto"` to discover Markdown pages below `src/`.
   * Unset or empty hides the explorer and its tool-bar toggle entirely.
   */
  explorer?: TerminalExplorerConfig

  // Feature toggles are added here as their features land (e.g. POST-002
  // series inclusion).
}

// -----------------------------------------------------------------------------
// Defaults & resolution
// -----------------------------------------------------------------------------

/** {@link TerminalAuthorConfig} after resolution: the username is always filled. */
export interface ResolvedAuthorConfig {
  name: LocalizableText
  username: string
}

/**
 * {@link TerminalSearchConfig} after resolution: `provider` is always set and
 * `algolia` is either a complete credential set or `null` (search unconfigured).
 */
export interface ResolvedSearchConfig {
  provider: 'algolia'
  algolia: TerminalAlgoliaConfig | null
}

/** {@link TerminalThemeConfig} with every default applied — what components consume. */
export type ResolvedTerminalThemeConfig = Required<
  Omit<TerminalThemeConfig, 'author' | 'license' | 'footer' | 'search' | 'toolbar'>
> & {
  author: ResolvedAuthorConfig
  license: Required<TerminalLicenseConfig>
  footer: Required<TerminalFooterConfig>
  search: ResolvedSearchConfig
  toolbar: Required<TerminalToolbarConfig>
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
  // No extra nav tabs or action icons until configured (THEME-005) — the
  // built-in home tab and the search / color-mode controls always render.
  toolbar: { nav: [], actions: [] },
  // No explorer until the user configures a tree (THEME-002).
  explorer: [],
  // Search stays unconfigured until Algolia credentials are supplied
  // (SEARCH-001) — the find palette then shows its "not configured" notice.
  search: { provider: 'algolia', algolia: null },
}

/**
 * Normalize a display string for a shell prompt segment: strip diacritics,
 * lowercase, whitespace → `-`, drop everything outside `a-z 0-9 . _ -`,
 * collapse separator runs, and trim edge separators.
 */
export function normalizeShellIdentifier(
  value: string,
  fallback = 'user',
): string {
  const normalized = value
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/([-._])[-._]+/g, '$1')
    .replace(/^[-._]+|[-._]+$/g, '')
  return normalized || fallback
}

/** Derive the shell-safe author username used by prompt decorations. */
export function normalizeUsername(name: string): string {
  return normalizeShellIdentifier(name)
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
 * Resolve the search block: `provider` defaults to `algolia`, and `algolia`
 * is kept only when the credential set is complete — a partial set counts as
 * unconfigured (`null`) so the palette shows its notice instead of failing.
 */
function resolveSearch(search: TerminalSearchConfig): ResolvedSearchConfig {
  const { algolia } = search
  const complete = !!(algolia?.appId && algolia?.apiKey && algolia?.indexName)
  return {
    provider: search.provider ?? 'algolia',
    algolia: complete
      ? {
          appId: algolia!.appId,
          apiKey: algolia!.apiKey,
          indexName: algolia!.indexName,
        }
      : null,
  }
}

/** Whether search has usable credentials (i.e. the palette can query). */
export function isSearchConfigured(search: ResolvedSearchConfig): boolean {
  return search.algolia !== null
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
  if (user?.toolbar) {
    resolved.toolbar = {
      nav: user.toolbar.nav ?? [],
      actions: user.toolbar.actions ?? [],
    }
  }
  if (user?.explorer) resolved.explorer = user.explorer
  if (user?.search) resolved.search = resolveSearch(user.search)
  return resolved
}
