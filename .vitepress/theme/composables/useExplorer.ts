// =============================================================================
// useExplorer.ts — file-explorer state and source discovery (THEME-002/012/013/014)
// =============================================================================
// Module-singleton state shared by the tool-bar toggle and the explorer panel.
// Two independent states, because the explorer is two things (design-
// language.md §4/§8): on desktop a retractable side panel whose extended/
// retracted choice persists in localStorage (`ct-explorer`, alongside
// `ct-mode`/`ct-lang`), on mobile a transient off-canvas drawer that always
// starts closed. The single tool-bar control drives whichever applies to the
// current viewport width.

import { computed, onMounted, readonly, ref } from 'vue'
import type { ComputedRef, DeepReadonly, Ref } from 'vue'
import type { PageData } from 'vitepress'
import type { LocalizableText } from '../locales'
import type { TerminalExplorerItem } from '../config'
import { useColorMode } from './useColorMode'
import { useThemeConfig } from './useThemeConfig'

const STORAGE_KEY = 'ct-explorer'
const NODES_KEY = 'ct-explorer-nodes'

// Must match the drawer breakpoint in styles/_explorer.scss.
const DRAWER_QUERY = '(max-width: 640px)'

// VitePress page modules expose their build-time metadata as `__pageData`.
// Importing only that named export keeps the explorer independent from the
// current route while still making the complete source tree available during
// SSR and client builds.
const sourcePages = import.meta.glob<PageData>('../../../src/**/*.md', {
  eager: true,
  import: '__pageData',
})

// Folder metadata is source content metadata, not theme/site configuration.
// Keeping it beside the Markdown it describes lets an index-less folder still
// provide a localized label and an explicit initial expansion state.
const sourceExplorerConfigs = import.meta.glob<ExplorerJsonConfig>(
  '../../../src/**/explorer.json',
  {
    eager: true,
    import: 'default',
  },
)

interface ExplorerPage {
  data: PageData
  url: string
}

interface ExplorerJsonConfig {
  title?: LocalizableText
}

interface ExplorerBranch {
  name: string
  page?: ExplorerPage
  children: Map<string, ExplorerBranch>
}

function asLocalizableText(value: unknown): LocalizableText | undefined {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined
  }

  const localized: Record<string, string> = {}
  for (const [tag, text] of Object.entries(value)) {
    if (typeof text !== 'string') return undefined
    localized[tag] = text
  }
  return Object.keys(localized).length > 0 ? localized : undefined
}

function pageUrl(relativePath: string): string {
  const withoutExtension = relativePath.replace(/\.md$/, '')
  if (withoutExtension === 'index') return '/'
  if (withoutExtension.endsWith('/index')) {
    const directory = withoutExtension.slice(0, -'/index'.length)
    return `/${directory}/`
  }
  return `/${withoutExtension}`
}

function sourceSegments(relativePath: string): string[] {
  const withoutExtension = relativePath.replace(/\.md$/, '')
  const segments = withoutExtension.split('/')
  return segments.at(-1) === 'index' ? segments.slice(0, -1) : segments
}

function sourceRelativePath(sourcePath: string): string {
  const normalized = sourcePath.replace(/\\/g, '/')
  const marker = '/src/'
  const markerIndex = normalized.lastIndexOf(marker)
  if (markerIndex >= 0) return normalized.slice(markerIndex + marker.length)

  const srcIndex = normalized.lastIndexOf('src/')
  return srcIndex >= 0 ? normalized.slice(srcIndex + 'src/'.length) : normalized
}

function explorerConfigUrl(sourcePath: string): string {
  const relativePath = sourceRelativePath(sourcePath).replace(
    /\/explorer\.json$/,
    '',
  )
  return relativePath ? `/${relativePath}/` : '/'
}

const explorerConfigs = new Map<string, ExplorerJsonConfig>()
for (const [sourcePath, config] of Object.entries(sourceExplorerConfigs)) {
  explorerConfigs.set(explorerConfigUrl(sourcePath), config)
}

function pageLabel(page: ExplorerPage): LocalizableText {
  const frontmatter = page.data.frontmatter ?? {}
  const frontmatterExplorerTitle = asLocalizableText(
    frontmatter.explorerTitle,
  )
  if (frontmatterExplorerTitle !== undefined) return frontmatterExplorerTitle

  const frontmatterTitle = asLocalizableText(frontmatter.title)
  if (frontmatterTitle !== undefined) return frontmatterTitle

  return page.data.title || page.url
}

function compareBranches(left: ExplorerBranch, right: ExplorerBranch): number {
  const leftIsFolder = left.children.size > 0
  const rightIsFolder = right.children.size > 0
  if (leftIsFolder !== rightIsFolder) return leftIsFolder ? -1 : 1
  return left.name.localeCompare(right.name, 'en', {
    numeric: true,
    sensitivity: 'base',
  })
}

function branchFor(
  root: ExplorerBranch,
  segments: string[],
): ExplorerBranch {
  let branch = root
  for (const segment of segments) {
    const existing = branch.children.get(segment)
    if (existing) {
      branch = existing
      continue
    }
    const child: ExplorerBranch = { name: segment, children: new Map() }
    branch.children.set(segment, child)
    branch = child
  }
  return branch
}

function toExplorerItem(
  branch: ExplorerBranch,
  directorySegments: string[],
): TerminalExplorerItem {
  const childItems = [...branch.children.values()]
    .sort(compareBranches)
    .map((child) =>
      toExplorerItem(child, [...directorySegments, branch.name]),
    )
  const url =
    branch.page?.url ??
    `/${[...directorySegments, branch.name].join('/')}/`
  const config = explorerConfigs.get(url)
  const text =
    config?.title ??
    (branch.page ? pageLabel(branch.page) : branch.name)

  return {
    text,
    ...(branch.page ? { link: branch.page.url } : {}),
    ...(childItems.length > 0 ? { items: childItems } : {}),
  }
}

function discoverExplorer(): TerminalExplorerItem[] {
  const root: ExplorerBranch = { name: '', children: new Map() }
  const pages = Object.values(sourcePages)
    .filter(
      (page) =>
        page.relativePath.endsWith('.md') &&
        !page.isNotFound &&
        // Skip dynamic-route source templates (e.g. `tags/[name].md`,
        // `page/[num].md`) — only their generated pages are real routes, and
        // those are listing routes, not file-tree entries (POST-001).
        !page.relativePath.includes('['),
    )
    .sort((left, right) => left.relativePath.localeCompare(right.relativePath))

  for (const data of pages) {
    const segments = sourceSegments(data.relativePath)
    const page = { data, url: pageUrl(data.relativePath) }
    branchFor(root, segments).page = page
  }

  const items: TerminalExplorerItem[] = []
  if (root.page) {
    const rootConfig = explorerConfigs.get('/')
    items.push({
      text: rootConfig?.title ?? pageLabel(root.page),
      link: root.page.url,
    })
  }
  items.push(
    ...[...root.children.values()]
      .sort(compareBranches)
      .map((branch) => toExplorerItem(branch, [])),
  )
  return items
}

// Module-level singletons so every component shares the same state.
// Desktop defaults to extended; SSR renders it that way.
const desktopOpen = ref(true)
const drawerOpen = ref(false)

// Per-folder expanded states the visitor has touched, keyed by the node's
// raw config-text path (THEME-011). Only deviations live here — untouched
// folders follow the depth default (first layer open, deeper collapsed).
// Persisted as JSON and restored post-mount.
const nodeStates = ref<Record<string, boolean>>({})
// Route-driven reveals are temporary: they make the active link visible
// without changing the visitor's persisted folder preferences (THEME-014).
const transientNodeStates = ref<Record<string, boolean>>({})
let nodesRestored = false

function isDrawerViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(DRAWER_QUERY).matches
}

/** Explorer availability and open state, plus the toggle the tool bar uses. */
export function useExplorer(): {
  /** Whether the explorer exists at all: a tree is available and not paper mode. */
  available: ComputedRef<boolean>
  /** Explicit or source-discovered tree items. */
  items: ComputedRef<TerminalExplorerItem[]>
  desktopOpen: DeepReadonly<Ref<boolean>>
  drawerOpen: DeepReadonly<Ref<boolean>>
  toggle: () => void
  closeDrawer: () => void
  /**
   * A folder's expanded state: a user override, else a route reveal, else the
   * remembered toggle/default.
   */
  isNodeExpanded: (
    key: string,
    defaultOpen: boolean,
    routeOpen?: boolean,
  ) => boolean
  /** Remember (and persist) a folder's expanded state. */
  setNodeExpanded: (key: string, open: boolean) => void
  /** Clear route-local user overrides after navigation. */
  clearTransientNodeStates: () => void
} {
  const config = useThemeConfig()
  const { mode } = useColorMode()

  const items = computed(() =>
    config.value.explorer === 'auto'
      ? discoverExplorer()
      : config.value.explorer,
  )

  // The explorer is not part of the UI in paper mode (design-language.md §4)
  // and doesn't exist without configured contents — the layout skips rendering
  // it and the tool bar hides the toggle.
  const available = computed(
    () => items.value.length > 0 && mode.value !== 'paper',
  )

  // Restore the persisted desktop preference and the remembered per-folder
  // states post-mount (avoids SSR mismatch).
  onMounted(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'closed') desktopOpen.value = false
    } catch {
      // Persistence unavailable — keep the default.
    }
    if (!nodesRestored) {
      nodesRestored = true
      try {
        const raw = localStorage.getItem(NODES_KEY)
        const parsed: unknown = raw ? JSON.parse(raw) : null
        if (parsed && typeof parsed === 'object') {
          nodeStates.value = parsed as Record<string, boolean>
        }
      } catch {
        // Unreadable state — folders keep their defaults.
      }
    }
  })

  /** The tool-bar control: opens the drawer on mobile, retracts/extends on desktop. */
  const toggle = (): void => {
    if (isDrawerViewport()) {
      drawerOpen.value = !drawerOpen.value
      return
    }
    desktopOpen.value = !desktopOpen.value
    try {
      localStorage.setItem(STORAGE_KEY, desktopOpen.value ? 'open' : 'closed')
    } catch {
      // Persistence unavailable — the choice still applies to this session.
    }
  }

  const closeDrawer = (): void => {
    drawerOpen.value = false
  }

  const isNodeExpanded = (
    key: string,
    defaultOpen: boolean,
    routeOpen = false,
  ): boolean =>
    transientNodeStates.value[key] ??
    (routeOpen ? true : nodeStates.value[key] ?? defaultOpen)

  const setNodeExpanded = (key: string, open: boolean): void => {
    transientNodeStates.value[key] = open
    nodeStates.value[key] = open
    try {
      localStorage.setItem(NODES_KEY, JSON.stringify(nodeStates.value))
    } catch {
      // Persistence unavailable — the state still applies to this session.
    }
  }

  const clearTransientNodeStates = (): void => {
    transientNodeStates.value = {}
  }

  return {
    available,
    items,
    desktopOpen: readonly(desktopOpen),
    drawerOpen: readonly(drawerOpen),
    toggle,
    closeDrawer,
    isNodeExpanded,
    setNodeExpanded,
    clearTransientNodeStates,
  }
}
