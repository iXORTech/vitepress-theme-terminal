// =============================================================================
// useWindowDemo.ts — floating-window demos (THEME-003/017/018, temporary)
// =============================================================================
// Wires the two logic-free demos of the shared floating window (both retire
// when the find palette lands, SEARCH-002):
//   - the window demo — description + hints panes (THEME-017), opened by the
//     tool-bar button (`openDemo`) and the `~` shortcut;
//   - the search demo — a find-palette-shaped input + results (THEME-018),
//     opened by the `/` shortcut.
// These are setup-time composables because the localized title getters need
// useThemeLocale()'s component context. This whole file — plus the demo
// components, their strings, and the tool-bar button — is removed with the
// demo (SEARCH-002).

import { onBeforeUnmount, onMounted } from 'vue'
import SearchDemo from '../components/SearchDemo.vue'
import SearchDemoResults from '../components/SearchDemoResults.vue'
import WindowDemo from '../components/WindowDemo.vue'
import WindowDemoHints from '../components/WindowDemoHints.vue'
import { useFloatingWindow } from './useFloatingWindow'
import { useThemeLocale } from './useThemeLocale'

/** The window demo opener — call from setup, use `openDemo` in handlers. */
export function useWindowDemo(): { openDemo: () => void } {
  const { t } = useThemeLocale()
  const { open } = useFloatingWindow()

  // Two panes to exercise the multi-pane window (THEME-017): the description
  // box plus a separately titled hints box (title getters so both follow a
  // language switch while open).
  const openDemo = (): void =>
    open({
      id: 'demo',
      label: () => t('window.demoTitle'),
      panes: [
        {
          title: () => t('window.demoTitle'),
          // Border-title icon (THEME-016) — matches the tool-bar demo trigger
          icon: 'fa-solid fa-window-restore',
          component: WindowDemo,
        },
        {
          title: () => t('window.demoHintsTitle'),
          component: WindowDemoHints,
        },
      ],
    })

  return { openDemo }
}

/** The search demo opener — call from setup, use `openSearch` in handlers. */
export function useSearchDemo(): { openSearch: () => void } {
  const { t } = useThemeLocale()
  const { open } = useFloatingWindow()

  // The find-palette shape (THEME-018, ui-sketch.md §2): a search-input pane
  // over a results pane, each its own framed box.
  const openSearch = (): void =>
    open({
      id: 'search-demo',
      label: () => t('window.searchTitle'),
      panes: [
        {
          title: () => t('window.searchInputTitle'),
          icon: 'fa-solid fa-magnifying-glass',
          component: SearchDemo,
        },
        {
          title: () => t('window.searchResultsTitle'),
          component: SearchDemoResults,
        },
      ],
    })

  return { openSearch }
}

// A global single-key shortcut that stays out of the way while the visitor is
// typing (design-language.md §7): plain key only — no command modifiers, not
// while composing, and never stolen from inputs or editable regions.
function useKeyShortcut(key: string, run: () => void): void {
  function onKeydown(event: KeyboardEvent): void {
    if (event.key !== key || event.isComposing) return
    if (event.ctrlKey || event.metaKey || event.altKey) return

    const target = event.target
    if (
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    ) {
      return
    }

    event.preventDefault()
    run()
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
}

/** Bind `~` (window demo) and `/` (search demo) shortcuts (design-language.md §7). */
export function useWindowDemoShortcuts(): void {
  const { openDemo } = useWindowDemo()
  const { openSearch } = useSearchDemo()
  useKeyShortcut('~', openDemo)
  useKeyShortcut('/', openSearch)
}
