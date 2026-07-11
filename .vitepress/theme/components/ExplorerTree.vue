<script setup lang="ts">
// ============================================================================
// ExplorerTree.vue — one recursive level of the explorer tree (THEME-002/011/014)
// ============================================================================
// Renders a level of the `themeConfig.explorer` tree and recurses into folder
// children (the SFC references itself by filename), in the NeoVim
// file-browser idiom: chevron + folder/file glyph + label. Expanded state
// lives in the shared useExplorer() store (persisted, THEME-011); the default
// is depth-based — first-layer folders open, deeper folders collapsed. The
// active route temporarily reveals its ancestor folders without persisting that
// expansion; clicking the
// label of a folder with a link (its index page) navigates and lets route
// awareness expand it; the chevron only toggles. Labels are LocalizableText
// resolved against the active UI language (I18N-004); glyphs come from
// styles/_explorer.scss.
import { useData, withBase } from 'vitepress'
import type { TerminalExplorerItem } from '../config'
import type { LocalizableText } from '../locales'
import { resolveLocalizedText } from '../locales'
import { useExplorer } from '../composables/useExplorer'
import { useThemeLocale } from '../composables/useThemeLocale'

const props = withDefaults(
  defineProps<{
    items: TerminalExplorerItem[]
    /** Nesting level — 0 is the first layer, the only one open by default. */
    depth?: number
    /** Key prefix of the parent folder, for the persisted-state node keys. */
    parentKey?: string
  }>(),
  { depth: 0, parentKey: '' },
)

const { page } = useData()
const { language } = useThemeLocale()
const { isNodeExpanded, setNodeExpanded } = useExplorer()

const label = (item: TerminalExplorerItem): string =>
  resolveLocalizedText(item.text, language.value) ?? ''

// Persisted-state key: the node's raw config-text path — stable across UI
// language switches (labels localize, the key doesn't).
const rawText = (text: LocalizableText): string =>
  typeof text === 'string' ? text : Object.values(text)[0] ?? ''
const nodeKey = (item: TerminalExplorerItem): string =>
  `${props.parentKey}/${rawText(item.text)}`

// Default expansion (THEME-011): only the first layer (depth 0) starts open.
// The visitor's remembered toggle and active-route reveal are applied by the
// useExplorer store.
const defaultOpen = (): boolean => props.depth === 0

const isExternal = (link: string): boolean => /^[a-z][a-z0-9+.-]*:/i.test(link)

// Map a site-absolute link onto the page `relativePath` form so the current
// page can be highlighted without caring about `base` or clean-URL settings;
// external URLs never match.
function linkRelativePath(link: string): string | null {
  if (isExternal(link)) return null
  let path = link
    .replace(/[?#].*$/, '')
    .replace(/^\//, '')
    .replace(/\.html$/, '')
  if (path === '' || path.endsWith('/')) path += 'index'
  return `${path}.md`
}

const isActive = (link?: string): boolean =>
  !!link && linkRelativePath(link) === page.value.relativePath

// A route reveal is derived from links anywhere below the folder. It is
// intentionally computed rather than persisted, so navigation makes the
// active row visible without changing the visitor's saved tree preferences.
const containsActiveRoute = (item: TerminalExplorerItem): boolean =>
  (item.link !== undefined && isActive(item.link)) ||
  item.items?.some(containsActiveRoute) === true

const isOpen = (item: TerminalExplorerItem): boolean =>
  isNodeExpanded(
    nodeKey(item),
    defaultOpen(),
    containsActiveRoute(item),
  )

const toggleNode = (item: TerminalExplorerItem): void =>
  setNodeExpanded(nodeKey(item), !isOpen(item))
</script>

<template>
  <ul class="ct-explorer__list">
    <li v-for="(item, index) in items" :key="index" class="ct-explorer__node">
      <!-- Row: chevron (folders) / dash spacer (leaves) + NF icon + label -->
      <div
        class="ct-explorer__row"
        :class="{ 'ct-explorer__row--active': isActive(item.link) }"
      >
        <!-- The chevron is the pure expand/collapse toggle; never navigates -->
        <button
          v-if="item.items?.length"
          class="ct-explorer__chevron"
          :class="{ 'ct-explorer__chevron--open': isOpen(item) }"
          :aria-expanded="isOpen(item)"
          :aria-label="label(item)"
          @click="toggleNode(item)"
        ></button>
        <span v-else class="ct-explorer__leaf-mark" aria-hidden="true"></span>

        <!-- Nerd Font folder/file glyph — rendered only under the font gate -->
        <span
          class="ct-explorer__icon"
          :class="
            item.items?.length
              ? isOpen(item)
                ? 'ct-explorer__icon--folder-open'
                : 'ct-explorer__icon--folder'
              : 'ct-explorer__icon--file'
          "
          aria-hidden="true"
        ></span>

        <!-- Label: a link when the node has one (a folder's link is its index
             page — route awareness expands it without persistence), a toggle
             for plain folders -->
        <a
          v-if="item.link"
          class="ct-explorer__label"
          :class="{ 'ct-explorer__label--folder': item.items?.length }"
          :href="isExternal(item.link) ? item.link : withBase(item.link)"
          :target="isExternal(item.link) ? '_blank' : undefined"
          :rel="isExternal(item.link) ? 'noreferrer' : undefined"
        >{{ label(item) }}</a>
        <button
          v-else-if="item.items?.length"
          class="ct-explorer__label ct-explorer__label--folder"
          @click="toggleNode(item)"
        >{{ label(item) }}</button>
        <span v-else class="ct-explorer__label">{{ label(item) }}</span>
      </div>

      <!-- Children indent one level; unmounted while the folder is collapsed -->
      <ExplorerTree
        v-if="item.items?.length && isOpen(item)"
        class="ct-explorer__children"
        :items="item.items"
        :depth="depth + 1"
        :parent-key="nodeKey(item)"
      />
    </li>
  </ul>
</template>
