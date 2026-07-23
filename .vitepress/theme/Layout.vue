<script setup lang="ts">
// ============================================================================
// Layout.vue — the TUI shell: tool bar · viewport · status bar (THEME-001)
// ============================================================================
// Composes the persistent terminal chrome around the page content
// (design-language.md §4–5, ui-sketch.md §1): the top tool bar, the middle
// row — explorer sidebar (THEME-002) beside the floating content viewport,
// which holds the content column and the in-viewport footer region (THEME-004)
// with its optional user-supplied custom pre-footer section (THEME-006) — the
// bottom status bar, and the shared floating utility window (THEME-003).
//
// The content column is a single page-type dispatch (ARCH-001): the active page
// is classified into one of six types (resolvePageType) and rendered by its own
// component (theme/pages/*Page.vue), replacing the old inline home placeholder
// and `isArticle` branching (content-architecture.md §3–4).
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import ArticleToc from './components/ArticleToc.vue'
import Explorer from './components/Explorer.vue'
import FloatingWindow from './components/FloatingWindow.vue'
import NavDrawer from './components/NavDrawer.vue'
import NotificationStack from './components/NotificationStack.vue'
import ResizeHandle from './components/ResizeHandle.vue'
import SiteFooter from './components/SiteFooter.vue'
import StatusBar from './components/StatusBar.vue'
import ToolBar from './components/ToolBar.vue'
import HomePage from './pages/HomePage.vue'
import ListingPage from './pages/ListingPage.vue'
import NormalPage from './pages/NormalPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'
import PostPage from './pages/PostPage.vue'
import SeriesArticlePage from './pages/SeriesArticlePage.vue'
import { useCalloutTitles } from './composables/useCalloutTitles'
import { useCleanUrls } from './composables/useCleanUrls'
import { useCodeCopy } from './composables/useCodeCopy'
import { useHeadingAnchors } from './composables/useHeadingAnchors'
import { useExplorer } from './composables/useExplorer'
import { useToc } from './composables/useToc'
import { EXPLORER_WIDTH, TOC_WIDTH } from './utils/sidebarWidth'
import { useLightbox } from './composables/useLightbox'
import { useLocalizedContent } from './composables/useLocalizedContent'
import { useNerdFont } from './composables/useNerdFont'
import { useSearchShortcut } from './composables/useSearch'
import { useSwipers } from './composables/useSwipers'
import { useThemeLocale } from './composables/useThemeLocale'
import { useTypst } from './composables/useTypst'
import { useViewportScroll } from './composables/useViewportScroll'
import { useWaline } from './composables/useWaline'
import type { PageType } from './utils/pageType'
import { resolvePageType } from './utils/pageType'

const { frontmatter, page } = useData()

// The explorer exists only when a tree is configured and the mode isn't
// paper (THEME-002) — then it is not rendered at all, not merely hidden. Its
// desktop retract state also gates the width drag handle (THEME-025).
const { available: explorerAvailable, desktopOpen: explorerOpen } = useExplorer()

// TOC on-screen + retract state, so the TOC's width handle (THEME-026) renders
// only while the outline is actually docked (expanded, not the reopen rail).
const { visible: tocVisible, collapsed: tocCollapsed } = useToc()
const { t } = useThemeLocale()

// Page-type dispatch (ARCH-001): resolve the type from the page's location
// under `src/` + frontmatter, then pick its dedicated component. Each type owns
// its own chrome (home welcome, article footer cards, generated listings, …).
const PAGE_COMPONENTS: Record<PageType, unknown> = {
  home: HomePage,
  normal: NormalPage,
  post: PostPage,
  series: SeriesArticlePage,
  listing: ListingPage,
  notFound: NotFoundPage,
}
const pageComponent = computed(
  () =>
    PAGE_COMPONENTS[
      resolvePageType({
        relativePath: page.value.relativePath,
        isNotFound: page.value.isNotFound,
        frontmatter: frontmatter.value,
      })
    ],
)

// The viewport panel is the scroll container of the fixed shell frame
// (THEME-008); this wires the router-facing scroll behaviors onto it.
const viewport = ref<HTMLElement | null>(null)
useViewportScroll(viewport)

// Strip a legacy `.html` suffix from the address bar in place (THEME-033)
useCleanUrls()

// Re-localize callout default titles on language switch (MD-002)
useCalloutTitles()

// Wire code-block COPY buttons and re-localize their labels (STYLE-004)
useCodeCopy()

// Re-localize heading permalink (`#`) labels on nav / language switch (THEME-023)
useHeadingAnchors()

// Reveal the active language's `::: lang` content block, switch on language
// change (I18N-007)
useLocalizedContent()

// Flag <html> once the symbols Nerd Font is usable — gates the PUA glyphs in
// callouts and TUI chrome with a tofu-safe fallback (FONT-002 / MD-003)
useNerdFont()

// `/` opens the find palette (SEARCH-002)
useSearchShortcut()

// Content images: enlarge-on-click gallery + `:::: swiper` card decks
// (COMP-002); both lazy-load their libraries client-side
useLightbox()
useSwipers()

// Compile `::: typst` / `:typst[…]` math to SVG client-side (MD-004); the
// typst.ts WASM + IBM Plex Math font load lazily on first use
useTypst()

// Waline comment widget + article view/comment counts (COMP-004); lazy-loaded
// client-side, and a no-op unless a comment server is configured
useWaline()
</script>

<template>
  <div class="ct-shell">
    <!-- Top tool bar / tabline -->
    <ToolBar />

    <!-- Middle row: explorer sidebar beside the content viewport -->
    <div class="ct-main">
      <!-- File-explorer navigation — absent in paper mode and when
           unconfigured (THEME-002) -->
      <Explorer v-if="explorerAvailable" />

      <!-- Explorer width handle (THEME-025) — only while the explorer is docked
           and extended; desktop-only (CSS floor at ≤640px in _resize.scss) -->
      <ResizeHandle
        v-if="explorerAvailable && explorerOpen"
        class="ct-resize-handle--explorer"
        :spec="EXPLORER_WIDTH"
        :default-width="240"
        :sign="1"
        :label="t('explorer.resize')"
      />

      <!-- Content viewport — the floating editor panel and scroll container -->
      <main ref="viewport" class="ct-viewport">
        <div class="ct-content">
          <!-- Page-type dispatch (ARCH-001): one component per page type -->
          <component :is="pageComponent" />
        </div>

        <!-- Footer region (THEME-004 + THEME-006) — scrolls with the content.
             A full separator opens the whole region; the optional user-supplied
             custom section renders above the standard footer, and a subtler
             inner separator divides the two only when that section is present. -->
        <div class="ct-footer-region">
          <!-- Fully-custom pre-footer section: a user-supplied Vue file dropped
               into the `pre-footer` slot (fill it from a Layout wrapper — see
               design-language.md §4, footer). Renders nothing when unfilled. -->
          <section v-if="$slots['pre-footer']" class="ct-prefooter">
            <slot name="pre-footer" />
          </section>

          <SiteFooter :divided="!!$slots['pre-footer']" />
        </div>
      </main>

      <!-- TOC width handle (THEME-026) — only while the outline is docked
           (on screen and not retracted to its rail); desktop-only (CSS floor
           at ≤1023px in _resize.scss). Sits on the TOC's left inner edge, so a
           leftward drag widens it (sign -1). -->
      <ResizeHandle
        v-if="tocVisible && !tocCollapsed"
        class="ct-resize-handle--toc"
        :spec="TOC_WIDTH"
        :default-width="224"
        :sign="-1"
        :label="t('toc.resize')"
      />

      <!-- Right-side article table of contents (THEME-024) — a fixed panel
           mirroring the explorer; renders itself only on article pages with
           enough headings, never in paper mode, and collapses out on narrow
           viewports (ArticleToc.vue / _toc.scss). Retractable on desktop to a
           reopen rail (THEME-027). -->
      <ArticleToc />
    </div>

    <!-- Transient status notifications (THEME-029) — a zero-height shell row
         holding the toast stack in the bottom-right corner, just above the
         status bar; empty until a feature calls `notify()` -->
    <NotificationStack />

    <!-- Bottom status bar / statusline -->
    <StatusBar />

    <!-- Right-side nav drawer — holds the collapsed tool bar's nav + actions
         behind the `[⋮]` expander (THEME-022); off-canvas until opened -->
    <NavDrawer />

    <!-- Shared floating utility window — hidden until a utility opens it
         (THEME-003) -->
    <FloatingWindow />
  </div>
</template>
