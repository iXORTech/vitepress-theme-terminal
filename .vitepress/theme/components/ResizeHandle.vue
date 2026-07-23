<script setup lang="ts">
// ============================================================================
// ResizeHandle.vue — draggable width handle for a sidebar (THEME-025/026)
// ============================================================================
// A thin, keyboard-operable grabber that sits on a sidebar's inner edge, in the
// gap between the panel and the viewport (rendered as a flex item of `.ct-main`
// by Layout — see _resize.scss for the gap math). Dragging or arrow-keying it
// adjusts the panel width live via `useResizableSidebar`, clamped to the shared
// min/max and persisted. It is an ARIA `separator` with a localized name and
// `aria-valuemin/max/now`, so screen-reader and keyboard users can resize too.
import { useResizableSidebar } from '../composables/useResizableSidebar'
import type { SidebarWidthSpec } from '../utils/sidebarWidth'

const props = defineProps<{
  /** Bounds + storage/CSS-var target for this panel. */
  spec: SidebarWidthSpec
  /** Default (fallback) width in px, matching the panel SCSS. */
  defaultWidth: number
  /** +1 = dragging right widens (explorer), -1 = dragging left widens (TOC). */
  sign: 1 | -1
  /** Localized accessible name for the handle. */
  label: string
}>()

const { width, min, max, startDrag, onKeydown } = useResizableSidebar({
  spec: props.spec,
  defaultWidth: props.defaultWidth,
  sign: props.sign,
})
</script>

<template>
  <div
    class="ct-resize-handle"
    role="separator"
    tabindex="0"
    aria-orientation="vertical"
    :aria-label="label"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="Math.round(width)"
    @pointerdown="startDrag"
    @keydown="onKeydown"
  ></div>
</template>
