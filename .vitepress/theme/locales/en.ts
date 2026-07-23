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
  'nav.menu': 'Menu',
  'nav.menuClose': 'Close menu',
  'nav.label': 'Site navigation',
  'nav.home': 'home',

  // File explorer (THEME-002)
  'explorer.label': 'Explorer',
  'explorer.toggle': 'Toggle explorer',
  'explorer.close': 'Close explorer',
  // Explorer width drag handle (THEME-025) — accessible name for the separator
  'explorer.resize': 'Resize explorer',

  // Floating utility window (THEME-003) — the shared window's own chrome.
  'window.close': 'Close window',

  // Find palette (SEARCH-002): the search trigger, the two pane titles, the
  // input field, and the result-state messages (idle/loading/empty/error/
  // unconfigured). Opened from the tool-bar icon or the `/` shortcut.
  'search.open': 'Search',
  'search.title': 'Search',
  'search.inputTitle': 'Find',
  'search.resultsTitle': 'Results',
  'search.placeholder': 'Search the site…',
  'search.hint': '[enter] open · [esc] close · [↑↓] move',
  'search.idle': 'Type to search',
  'search.loading': 'Searching…',
  'search.empty': 'No results found',
  'search.error': 'Search failed — please try again',
  'search.unconfigured': 'Search is not configured',
  'search.poweredBy': 'Search by Algolia',

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

  // Heading anchor permalinks (THEME-023) — the hover/focus `#` control's
  // accessible name; `{title}` is interpolated with the heading text.
  'anchor.permalink': 'Permalink to {title}',

  // Article table of contents (THEME-024) — the right-side "on this page" panel.
  'toc.title': 'On this page',
  // TOC width drag handle (THEME-026) + desktop retract controls (THEME-027).
  'toc.resize': 'Resize table of contents',
  'toc.collapse': 'Hide table of contents',
  'toc.expand': 'Show table of contents',

  // Image containers (COMP-002) — the card deck's arrow controls. (The
  // lightbox chrome localizes through Fancybox's own shipped l10n tables —
  // design-language.md §4.)
  'swiper.prev': 'Previous image',
  'swiper.next': 'Next image',

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

  // End-of-article license card (COMP-003). The `{license}` placeholder in
  // the statement is interpolated by ArticleLicense.vue with a deed link.
  'license.author': 'Author',
  'license.published': 'Published',
  'license.updated': 'Updated',
  'license.permalink': 'Permalink',
  'license.statement': 'This article is licensed under {license}.',

  // End-of-article comments & counts (COMP-004). The comment form's own UI is
  // localized by Waline's shipped tables (design-language.md §4 exception).
  'comments.title': 'Comments',
  'comments.views': 'Views',

  // Posts, taxonomy & listing pages (POST-001). `{term}` is interpolated with
  // the active tag/category name by TermPosts.vue.
  'post.postsTitle': 'Posts',
  'post.archivesTitle': 'Archives',
  'post.categoriesTitle': 'Categories',
  'post.tagsTitle': 'Tags',
  'post.categories': 'Categories',
  'post.tags': 'Tags',
  'post.empty': 'No posts yet',
  'post.undated': 'Undated',
  'post.taggedWith': 'Posts tagged {term}',
  'post.inCategory': 'Posts in {term}',
  'post.allTags': 'All tags',
  'post.allCategories': 'All categories',
  'post.pagination': 'Pagination',
  'post.prevPage': 'Previous',
  'post.nextPage': 'Next',

  // Series (ARCH-001 breadcrumb label; POST-002 index & article count —
  // `{count}` is interpolated with the number of articles by SeriesIndex.vue)
  'series.label': 'Series',
  'series.indexTitle': 'Series',
  'series.articleCount': '{count} articles',
  'series.empty': 'No series yet',

  // Friends page (PAGE-004) — the random-visit control and the no-data
  // notice. The link data itself is authored content and renders verbatim
  // (docs/design/friend-links.md §4).
  'friends.random': 'Random visit',
  'friends.empty': 'No friend links yet',

  // 404 page type (ARCH-001)
  'notFound.title': 'Page not found',
  'notFound.home': 'Back to home',

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
