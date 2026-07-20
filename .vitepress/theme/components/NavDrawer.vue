<script setup lang="ts">
// ============================================================================
// NavDrawer.vue — right-side tool-bar overflow drawer (THEME-022)
// ============================================================================
// The dedicated drawer holding everything a collapsed tool bar cannot show in
// full (design-language.md §4, tool bar overflow drawer; ui-sketch.md §3): the
// navigation — the built-in `~/home` tab, the configured nav tabs, and their
// submenu children as indented rows — followed by a divided actions section
// with the configured icon slots and the built-in search + color-mode
// controls. Mirrors the explorer drawer's presentation and dismissals on the
// opposite side: fixed TUI panel over a dimmed backdrop, explicit close
// control, `Esc` (design-language.md §7), tapping the backdrop, or navigating.
// The color-mode row applies immediately and keeps the drawer open (the
// change is its own feedback); the search row closes the drawer and opens the
// find palette.
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useData, withBase } from 'vitepress'
import type { TerminalNavItem } from '../config'
import type { LocalizableText } from '../locales'
import { resolveLocalizedText } from '../locales'
import { isExternalLink, linkRelativePath } from '../utils/pagePath'
import { useColorMode } from '../composables/useColorMode'
import { useNavDrawer } from '../composables/useNavDrawer'
import { useSearch } from '../composables/useSearch'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'

const { page } = useData()
const { collapsed, drawerOpen, closeDrawer } = useNavDrawer()
const { cycleMode } = useColorMode()
const { openSearch } = useSearch()
const config = useThemeConfig()
const { t, language } = useThemeLocale()

// Same nav data and matchers as the tool bar (THEME-005/020)
const navItems = computed(() => config.value.toolbar.nav)
const actions = computed(() => config.value.toolbar.actions)
const isHome = computed(() => page.value.relativePath === 'index.md')

const isTabActive = (link: string): boolean =>
  linkRelativePath(link) === page.value.relativePath

// A parent row is active on its own link only — its children are visible
// right below it, so they carry their own accent (unlike the hover tabline,
// where the closed parent has to represent them).
const hasChildren = (item: TerminalNavItem): boolean =>
  (item.items?.length ?? 0) > 0

const localize = (text: LocalizableText): string =>
  resolveLocalizedText(text, language.value) ?? ''
const actionLabel = (label: LocalizableText | undefined, link: string): string =>
  resolveLocalizedText(label, language.value) || link
const href = (link: string): string =>
  isExternalLink(link) ? link : withBase(link)

// Navigating dismisses the drawer, like the explorer drawer
watch(
  () => page.value.relativePath,
  () => closeDrawer(),
)

// When the bar re-expands (window grew), the expander disappears — the drawer
// must not stay open without its trigger.
watch(collapsed, (isCollapsed) => {
  if (!isCollapsed) closeDrawer()
})

// The search row hands over to the find palette (the drawer's job is done)
const onSearch = (): void => {
  closeDrawer()
  openSearch()
}

// `Esc` dismisses (keyboard-friendly UX, design-language.md §7)
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && drawerOpen.value) closeDrawer()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- Backdrop dims the content behind the drawer; tap dismisses -->
  <div v-if="drawerOpen" class="ct-navdrawer-backdrop" @click="closeDrawer"></div>

  <aside
    id="ct-navdrawer"
    class="ct-navdrawer"
    :class="{ 'ct-navdrawer--open': drawerOpen }"
    :aria-label="t('nav.menu')"
  >
    <!-- Drawer header — title + explicit close control -->
    <div class="ct-navdrawer__header">
      <span class="ct-navdrawer__title">{{ t('nav.menu') }}</span>
      <button
        class="ct-navdrawer__close"
        :title="t('nav.menuClose')"
        :aria-label="t('nav.menuClose')"
        @click="closeDrawer"
      >
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Navigation rows: home tab, then the configured tabs with their
         submenu children as indented rows (THEME-020 children, flattened) -->
    <nav class="ct-navdrawer__nav" :aria-label="t('nav.label')">
      <a
        class="ct-navdrawer__link"
        :class="{ 'ct-navdrawer__link--active': isHome }"
        :href="withBase('/')"
      >~/{{ t('nav.home') }}</a>

      <template v-for="(item, index) in navItems" :key="index">
        <a
          class="ct-navdrawer__link"
          :class="{ 'ct-navdrawer__link--active': isTabActive(item.link) }"
          :href="href(item.link)"
          :target="isExternalLink(item.link) ? '_blank' : undefined"
          :rel="isExternalLink(item.link) ? 'noreferrer' : undefined"
        >
          <i v-if="item.icon" :class="item.icon" class="ct-navdrawer__icon" aria-hidden="true"></i>
          {{ localize(item.text) }}
        </a>
        <template v-if="hasChildren(item)">
          <a
            v-for="(child, childIndex) in item.items"
            :key="childIndex"
            class="ct-navdrawer__link ct-navdrawer__link--child"
            :class="{ 'ct-navdrawer__link--active': isTabActive(child.link) }"
            :href="href(child.link)"
            :target="isExternalLink(child.link) ? '_blank' : undefined"
            :rel="isExternalLink(child.link) ? 'noreferrer' : undefined"
          >
            <i v-if="child.icon" :class="child.icon" class="ct-navdrawer__icon" aria-hidden="true"></i>
            {{ localize(child.text) }}
          </a>
        </template>
      </template>
    </nav>

    <!-- Actions: the configured icon slots, then the built-in search and
         color-mode controls — every collapsed bar icon, as labeled rows -->
    <div class="ct-navdrawer__actions">
      <a
        v-for="(action, index) in actions"
        :key="index"
        class="ct-navdrawer__link"
        :href="href(action.link)"
        :target="isExternalLink(action.link) ? '_blank' : undefined"
        :rel="isExternalLink(action.link) ? 'noreferrer' : undefined"
      >
        <i :class="action.icon" class="ct-navdrawer__icon" aria-hidden="true"></i>
        {{ actionLabel(action.label, action.link) }}
      </a>

      <button class="ct-navdrawer__link" @click="onSearch">
        <i class="fa-solid fa-magnifying-glass ct-navdrawer__icon" aria-hidden="true"></i>
        {{ t('search.open') }}
      </button>
      <button class="ct-navdrawer__link" @click="cycleMode">
        <i class="fa-solid fa-circle-half-stroke ct-navdrawer__icon" aria-hidden="true"></i>
        {{ t('mode.switch') }}
      </button>
    </div>
  </aside>
</template>
