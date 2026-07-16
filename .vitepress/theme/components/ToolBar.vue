<script setup lang="ts">
// ============================================================================
// ToolBar.vue — top tool bar / tabline (THEME-001/005)
// ============================================================================
// The editor-style top bar of the TUI shell (design-language.md §4–5,
// ui-sketch.md §1): the explorer toggle (THEME-002) and brand glyph +
// localized site title on the left, site navigation rendered as editor tabs
// beside it, and the global action icons on the right — the find-palette search
// trigger (SEARCH-002) and the color-mode switcher (THEME-010; the status bar
// only indicates the mode). The settings gear moved to the status bar
// (THEME-019).
//
// THEME-005 makes the tabline configurable: the built-in `~/home` tab is
// followed by `themeConfig.toolbar.nav` tabs, and `themeConfig.toolbar.actions`
// adds extra icon slots before the built-in search / mode controls — both from
// configuration, no component edits.
//
// THEME-020 lets a nav tab carry child links (`items`): the tab remains a link
// itself, and hovering it (or focusing within, for keyboard users) reveals a
// floating TUI-panel dropdown of its children — open/close is pure
// CSS :hover/:focus-within on the wrapper, so leaving both the tab and the
// panel closes it (styles in _toolbar.scss).
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import type { TerminalNavItem } from '../config'
import type { LocalizableText } from '../locales'
import { resolveLocalizedText } from '../locales'
import { isExternalLink, linkRelativePath } from '../utils/pagePath'
import { useColorMode } from '../composables/useColorMode'
import { useExplorer } from '../composables/useExplorer'
import { useSearch } from '../composables/useSearch'
import { useSiteText } from '../composables/useSiteText'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'

const { page } = useData()

// Color-mode cycling — the switcher's permanent home is the tool bar
const { cycleMode } = useColorMode()

// Explorer toggle (THEME-002): retract/extend on desktop, drawer on mobile;
// hidden entirely when the explorer doesn't exist (no tree / paper mode).
const { available: explorerAvailable, toggle: toggleExplorer } = useExplorer()

// Find-palette search trigger (SEARCH-002) — also opens via the `/` shortcut
const { openSearch } = useSearch()

// Localized site title (I18N-004)
const { title } = useSiteText()

// Resolved config (THEME-005 nav tabs + extra action icons) and the locale
// layer (AGENTS.md §6.7 — all UI text resolves through it).
const config = useThemeConfig()
const { t, language } = useThemeLocale()

// The built-in home tab; its active state follows the current page.
const isHome = computed(() => page.value.relativePath === 'index.md')

// Configurable navigation tabs (THEME-005), rendered after the home tab.
const navItems = computed(() => config.value.toolbar.nav)

// A nav tab is active when its link maps to the current page (base- and
// clean-URL-proof, shared with the explorer via pagePath.ts).
const isTabActive = (link: string): boolean =>
  linkRelativePath(link) === page.value.relativePath

// A tab with children opens a hover submenu (THEME-020)…
const hasSubmenu = (item: TerminalNavItem): boolean =>
  (item.items?.length ?? 0) > 0

// …and highlights when its own link OR any child's maps to the current page,
// so the parent tab reflects where the reader is inside its section.
const isNavActive = (item: TerminalNavItem): boolean =>
  isTabActive(item.link) ||
  (item.items ?? []).some((child) => isTabActive(child.link))

// Extra action icons (THEME-005), rendered before the built-in controls.
const actions = computed(() => config.value.toolbar.actions)

// Localized label for a nav tab / action icon; the action label falls back to
// its URL when unset.
const localize = (text: LocalizableText): string =>
  resolveLocalizedText(text, language.value) ?? ''
const actionLabel = (label: LocalizableText | undefined, link: string): string =>
  resolveLocalizedText(label, language.value) || link

// Resolve a config link for an <a href>: external URLs pass through untouched,
// site-absolute paths are prefixed with the configured base.
const href = (link: string): string =>
  isExternalLink(link) ? link : withBase(link)
</script>

<template>
  <header class="ct-toolbar">
    <!-- Explorer toggle — the explicit retract/extend control on desktop,
         the drawer trigger on mobile (THEME-002, ui-sketch.md §3 `[=]`) -->
    <button
      v-if="explorerAvailable"
      class="ct-toolbar__action"
      :title="t('explorer.toggle')"
      :aria-label="t('explorer.toggle')"
      @click="toggleExplorer"
    >
      <i class="fa-solid fa-bars" aria-hidden="true"></i>
    </button>

    <!-- Brand: decorative TUI glyph + localized site title, links home -->
    <a class="ct-toolbar__brand" :href="withBase('/')">
      <span class="ct-toolbar__glyph" aria-hidden="true"></span>
      <span class="ct-toolbar__title">{{ title }}</span>
    </a>

    <!-- Navigation as editor tabs: the built-in home tab plus the configurable
         `themeConfig.toolbar.nav` entries (THEME-005) -->
    <nav class="ct-toolbar__nav" :aria-label="t('nav.label')">
      <a
        class="ct-toolbar__tab"
        :class="{ 'ct-toolbar__tab--active': isHome }"
        :href="withBase('/')"
      >~/{{ t('nav.home') }}</a>
      <div
        v-for="(item, index) in navItems"
        :key="index"
        class="ct-toolbar__navitem"
      >
        <a
          class="ct-toolbar__tab"
          :class="{ 'ct-toolbar__tab--active': isNavActive(item) }"
          :href="href(item.link)"
          :target="isExternalLink(item.link) ? '_blank' : undefined"
          :rel="isExternalLink(item.link) ? 'noreferrer' : undefined"
        >
          <i v-if="item.icon" :class="item.icon" aria-hidden="true"></i>
          {{ localize(item.text) }}
          <!-- Submenu marker (THEME-020) — decorative; the tab text is the name -->
          <i
            v-if="hasSubmenu(item)"
            class="fa-solid fa-caret-down ct-toolbar__caret"
            aria-hidden="true"
          ></i>
        </a>

        <!-- Dropdown submenu (THEME-020): a floating TUI panel of the tab's
             child links, revealed while the tab or the panel itself is
             hovered/focused (CSS-driven — see _toolbar.scss) -->
        <div v-if="hasSubmenu(item)" class="ct-toolbar__submenu">
          <a
            v-for="(child, childIndex) in item.items"
            :key="childIndex"
            class="ct-toolbar__subitem"
            :class="{ 'ct-toolbar__subitem--active': isTabActive(child.link) }"
            :href="href(child.link)"
            :target="isExternalLink(child.link) ? '_blank' : undefined"
            :rel="isExternalLink(child.link) ? 'noreferrer' : undefined"
          >
            <i v-if="child.icon" :class="child.icon" aria-hidden="true"></i>
            {{ localize(child.text) }}
          </a>
        </div>
      </div>
    </nav>

    <!-- Global actions (right): the configurable extra action icons
         (THEME-005) then the built-in find-palette search + mode switcher; the
         settings gear moved to the status bar (THEME-019) -->
    <div class="ct-toolbar__actions">
      <!-- Extensible icon slots — extra feature icons from configuration
           (important social links, external tools, …), no component edits -->
      <a
        v-for="(action, index) in actions"
        :key="index"
        class="ct-toolbar__action"
        :href="href(action.link)"
        :title="actionLabel(action.label, action.link)"
        :aria-label="actionLabel(action.label, action.link)"
        :target="isExternalLink(action.link) ? '_blank' : undefined"
        :rel="isExternalLink(action.link) ? 'noreferrer' : undefined"
      >
        <i :class="action.icon" aria-hidden="true"></i>
      </a>

      <!-- Find palette (SEARCH-002) — opens the shared floating window; also
           reachable via the `/` shortcut -->
      <button
        class="ct-toolbar__action"
        :title="t('search.open')"
        :aria-label="t('search.open')"
        @click="openSearch"
      >
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
      </button>
      <button
        class="ct-toolbar__action"
        :title="t('mode.switch')"
        :aria-label="t('mode.switch')"
        @click="cycleMode"
      >
        <i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i>
      </button>
    </div>
  </header>
</template>
