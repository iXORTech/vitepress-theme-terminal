// =============================================================================
// useSearch.ts — find-palette state & behavior (SEARCH-002)
// =============================================================================
// The find palette is a real utility rendered in the shared floating window
// (THEME-003): an input pane over a results pane. Query state, the debounced
// Algolia request (utils/algolia.ts), and result navigation live here as
// module-level singletons so the two pane components — SearchPalette.vue (input)
// and SearchResults.vue (results) — operate on the same state. Opening from
// the tool-bar search icon or the `/` shortcut resets the palette and shows
// the window.
//
// Search wiring decision (SEARCH-001): the palette queries the site's Algolia
// DocSearch index directly and renders hits in this window — there is no
// separate DocSearch modal. When credentials are absent the palette still
// opens but shows a localized "not configured" notice.

import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import { isSearchConfigured } from '../config'
import type { SearchResult } from '../utils/algolia'
import { searchAlgolia } from '../utils/algolia'
import SearchPalette from '../components/SearchPalette.vue'
import SearchResults from '../components/SearchResults.vue'
import { useFloatingWindow } from './useFloatingWindow'
import { useThemeConfig } from './useThemeConfig'
import { useThemeLocale } from './useThemeLocale'

/** The palette's current condition, driving what the results pane renders. */
export type SearchStatus =
  | 'unconfigured' // no Algolia credentials — nothing to query
  | 'idle' // configured but the query is empty
  | 'loading' // a request is in flight
  | 'results' // hits available
  | 'empty' // query ran, no hits
  | 'error' // the request failed

const DEBOUNCE_MS = 200

// Module-level singleton state shared by both pane components.
const query = ref('')
const results = shallowRef<SearchResult[]>([])
const status = ref<SearchStatus>('idle')
const activeIndex = ref(0)

// Request bookkeeping (not reactive): debounce timer + in-flight abort.
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let controller: AbortController | null = null

/**
 * The find palette's state and controls. Call from a component setup (it needs
 * `useThemeConfig()` / `useThemeLocale()` context); the returned state refs are
 * the shared module singletons, so every caller sees the same palette.
 */
export function useSearch(): {
  query: Ref<string>
  results: ShallowRef<SearchResult[]>
  status: Ref<SearchStatus>
  activeIndex: Ref<number>
  /** Update the query and (debounced) run/clear the search. */
  setQuery: (value: string) => void
  /** Move the active-result cursor by `delta`, wrapping around. */
  move: (delta: number) => void
  /** Open the active result (Enter) — navigates and closes the window. */
  openActive: () => void
  /** Navigate to a result's URL and dismiss the palette (row click). */
  openResult: (result: SearchResult) => void
  /** Open the find palette in the shared floating window (resets it first). */
  openSearch: () => void
} {
  const config = useThemeConfig()
  const { t } = useThemeLocale()
  const { open, close } = useFloatingWindow()

  const search = computed(() => config.value.search)
  const configured = computed(() => isSearchConfigured(search.value))

  // Cancel any pending debounce and in-flight request.
  function cancelPending(): void {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
    controller?.abort()
    controller = null
  }

  // Run the actual request for the (already trimmed) query, ignoring the
  // response if the query moved on while it was in flight.
  async function run(term: string): Promise<void> {
    controller?.abort()
    controller = new AbortController()
    status.value = 'loading'
    try {
      const hits = await searchAlgolia(search.value.algolia!, term, controller.signal)
      if (term !== query.value.trim()) return // superseded by a newer query
      results.value = hits
      activeIndex.value = 0
      status.value = hits.length ? 'results' : 'empty'
    } catch (error) {
      if ((error as { name?: string })?.name === 'AbortError') return
      results.value = []
      status.value = 'error'
    }
  }

  function setQuery(value: string): void {
    query.value = value
    activeIndex.value = 0
    const term = value.trim()

    // Unconfigured / empty query never hit the network.
    if (!configured.value) {
      cancelPending()
      results.value = []
      status.value = 'unconfigured'
      return
    }
    if (!term) {
      cancelPending()
      results.value = []
      status.value = 'idle'
      return
    }

    // Debounce keystrokes; show the loading state immediately for feedback.
    if (debounceTimer) clearTimeout(debounceTimer)
    status.value = 'loading'
    debounceTimer = setTimeout(() => {
      debounceTimer = null
      void run(term)
    }, DEBOUNCE_MS)
  }

  function move(delta: number): void {
    const count = results.value.length
    if (count === 0) return
    activeIndex.value = (activeIndex.value + delta + count) % count
  }

  function openResult(result: SearchResult): void {
    if (!result.url) return
    close()
    if (typeof window !== 'undefined') window.location.href = result.url
  }

  function openActive(): void {
    const result = results.value[activeIndex.value]
    if (result) openResult(result)
  }

  function openSearch(): void {
    // Reset to a fresh palette each open.
    cancelPending()
    query.value = ''
    results.value = []
    activeIndex.value = 0
    status.value = configured.value ? 'idle' : 'unconfigured'

    open({
      id: 'search',
      label: () => t('search.title'),
      panes: [
        {
          title: () => t('search.inputTitle'),
          icon: 'fa-solid fa-magnifying-glass',
          component: SearchPalette,
        },
        {
          title: () => t('search.resultsTitle'),
          component: SearchResults,
        },
      ],
    })
  }

  return {
    query,
    results,
    status,
    activeIndex,
    setQuery,
    move,
    openActive,
    openResult,
    openSearch,
  }
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

/** Bind the `/` shortcut to open the find palette (design-language.md §7). */
export function useSearchShortcut(): void {
  const { openSearch } = useSearch()
  useKeyShortcut('/', openSearch)
}
