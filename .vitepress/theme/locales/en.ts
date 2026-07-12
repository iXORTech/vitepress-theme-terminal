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

  // Language switching (status bar switcher, THEME-001; settings panel later)
  'lang.switch': 'Switch language',

  // Tool bar navigation (THEME-001; configurable entries: THEME-005)
  'nav.label': 'Site navigation',
  'nav.home': 'home',

  // File explorer (THEME-002)
  'explorer.label': 'Explorer',
  'explorer.toggle': 'Toggle explorer',
  'explorer.close': 'Close explorer',

  // Floating utility window (THEME-003). The demo strings are temporary and
  // retire when the find palette lands (SEARCH-002).
  'window.close': 'Close window',
  'window.demoTitle': 'Floating window',
  'window.demoOpen': 'Open floating window demo',
  'window.demoBody':
    'This is the shared floating utility window — the find palette, the settings panel, and other utilities all render inside this single window as one or more framed panes.',
  'window.demoHintsTitle': 'Hints',
  'window.demoHint': '[~] open · [esc] close',
  // Search demo (THEME-018, temporary — `/` opens it; retires with SEARCH-002).
  // Sample result labels are illustrative; their paths are literal identifiers.
  'window.searchTitle': 'Search',
  'window.searchInputTitle': 'Find',
  'window.searchResultsTitle': 'Results',
  'window.searchPlaceholder': 'Search the site…',
  'window.searchHint': '[enter] open · [esc] close · [↑↓] move',
  'window.searchSample1': 'Color system',
  'window.searchSample2': 'Syntax highlighting',
  'window.searchSample3': 'About this site',

  // Settings panel (THEME-007) — font configuration + language switching.
  // Opened from the tool-bar gear; renders in the shared floating window.
  'settings.title': 'Settings',
  'settings.open': 'Open settings',
  'settings.fonts': 'Fonts',
  'settings.fontFamily': 'Font',
  'settings.fontSize': 'Size',
  'settings.fontDefault': 'Default',
  'settings.fontSans': 'Sans',
  'settings.fontSerif': 'Serif',
  'settings.fontMono': 'Mono',
  'settings.sizeSmall': 'Small',
  'settings.sizeMedium': 'Medium',
  'settings.sizeLarge': 'Large',
  'settings.language': 'Language',

  // Code block cards (STYLE-004) — the title bar's COPY button label and its
  // transient post-copy confirmation.
  'code.copy': 'Copy',
  'code.copied': 'Copied',

  // Status bar segments (THEME-001/009/019). The chip is a live state
  // indicator: READ on an article, HOME on the home page, 404 on not-found.
  'status.read': 'READ',
  'status.home': 'HOME',
  'status.notFound': '404',
  'status.clock': 'Current time',
  'status.progress': 'Reading progress',
  // Vim-style position labels shown instead of 0% / 100%
  'status.top': 'TOP',
  'status.bottom': 'BOT',
  'status.backToTop': 'Back to top',

  // In-viewport footer (THEME-004). {year}/{author} and {vitepress}/{theme}
  // are placeholders interpolated by SiteFooter.vue — translations may
  // reorder them freely.
  'footer.copyright': 'Copyright © {year} {author}',
  'footer.poweredBy': 'Powered by {vitepress} and {theme}',
  'footer.rss': 'RSS feed',
  'footer.license': 'License',
  'footer.licensedUnder': 'Content Licensed Under {license} License',
  // Temporary demo label for the custom pre-footer section (THEME-006) — the
  // shipped `pre-footer` slot example; removed when it is replaced by real
  // example content.
  'footer.demoCustom': 'Customizable Footer Content',

  // Callout default titles (MD-002)
  'callout.info': 'Info',
  'callout.note': 'Note',
  'callout.tip': 'Tip',
  'callout.warning': 'Warning',
  'callout.danger': 'Danger',
  'callout.caution': 'Caution',
  'callout.important': 'Important',
  'callout.details': 'Details',
} as const satisfies Record<string, string>

/** The complete theme string table — all locales provide exactly these keys. */
export type ThemeLocaleStrings = Record<keyof typeof en, string>

/** A single theme string key, e.g. `'mode.dark'`. */
export type ThemeLocaleKey = keyof ThemeLocaleStrings
