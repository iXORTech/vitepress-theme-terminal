// =============================================================================
// useResizableSidebar.ts — drag/keyboard width control for a side panel
// (THEME-025 explorer, THEME-026 TOC)
// =============================================================================
// Powers the `ResizeHandle.vue` that sits on a sidebar's inner edge. Dragging
// (or arrow-keying) the handle updates a CSS custom property on <html> live —
// the panel SCSS reads it, so the panel resizes without a Vue re-render — and
// persists the clamped pixel width to localStorage. The pre-paint restore lives
// in `head.ts`; this composable re-reads and clamps on mount so `aria-valuenow`
// and the keyboard step start from the stored value.
//
// The handle sits on the panel's INNER edge, which differs by side: the
// explorer is left of the viewport, so dragging right widens it (`sign: 1`);
// the TOC is right of the viewport, so dragging left widens it (`sign: -1`).
// The same sign maps a rightward arrow key press to the correct width change.

import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import type { SidebarWidthSpec } from '../utils/sidebarWidth'

interface ResizableOptions {
  spec: SidebarWidthSpec
  /** Default width (px) used when nothing is persisted — matches the SCSS fallback. */
  defaultWidth: number
  /** +1 when dragging RIGHT widens the panel (explorer), -1 when LEFT widens it (TOC). */
  sign: 1 | -1
}

// Width step per arrow-key press (px) — a comfortable keyboard increment.
const KEY_STEP = 16

export function useResizableSidebar(options: ResizableOptions): {
  /** Current width in px (for `aria-valuenow`). */
  width: Ref<number>
  min: number
  max: number
  /** Begin a pointer drag from the handle. */
  startDrag: (event: PointerEvent) => void
  /** Arrow / Home / End keyboard resizing on the focused handle. */
  onKeydown: (event: KeyboardEvent) => void
} {
  const { spec, defaultWidth, sign } = options
  const width = ref(defaultWidth)

  const clamp = (value: number): number =>
    Math.max(spec.min, Math.min(spec.max, value))

  // Apply live to <html> so the panel SCSS `var()` picks it up immediately.
  const apply = (value: number): void => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(spec.cssVar, `${Math.round(value)}px`)
    }
  }

  const persist = (value: number): void => {
    try {
      localStorage.setItem(spec.key, String(Math.round(value)))
    } catch {
      // Persistence unavailable — the width still applies to this session.
    }
  }

  // The single width mutator: clamp, reflect on <html>, remember.
  const set = (value: number): void => {
    width.value = clamp(value)
    apply(width.value)
    persist(width.value)
  }

  // Restore the persisted width post-mount (the head script already applied it
  // pre-paint; this keeps the ref/aria in sync and re-clamps a stale value).
  onMounted(() => {
    try {
      const raw = localStorage.getItem(spec.key)
      const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN
      if (Number.isFinite(parsed)) {
        width.value = clamp(parsed)
        apply(width.value)
      }
    } catch {
      // Unreadable — keep the default.
    }
  })

  // --------------------------------------------------------------------------
  // Pointer drag (with pointer capture so a fast drag off the thin handle keeps
  // tracking)
  // --------------------------------------------------------------------------
  let startX = 0
  let startWidth = 0
  let handle: HTMLElement | null = null

  const onPointerMove = (event: PointerEvent): void => {
    // `sign` turns cursor X-movement into the correct widen/narrow direction.
    set(startWidth + (event.clientX - startX) * sign)
  }

  const endDrag = (event: PointerEvent): void => {
    handle?.releasePointerCapture?.(event.pointerId)
    handle?.removeEventListener('pointermove', onPointerMove)
    handle?.removeEventListener('pointerup', endDrag)
    handle?.removeEventListener('pointercancel', endDrag)
    handle = null
    document.body.classList.remove('ct-resizing')
  }

  const startDrag = (event: PointerEvent): void => {
    event.preventDefault()
    handle = event.currentTarget as HTMLElement
    startX = event.clientX
    startWidth = width.value
    handle.setPointerCapture?.(event.pointerId)
    handle.addEventListener('pointermove', onPointerMove)
    handle.addEventListener('pointerup', endDrag)
    handle.addEventListener('pointercancel', endDrag)
    // Global cursor + no text selection while dragging.
    document.body.classList.add('ct-resizing')
  }

  onBeforeUnmount(() => {
    document.body.classList.remove('ct-resizing')
  })

  // --------------------------------------------------------------------------
  // Keyboard (the handle is a focusable role="separator")
  // --------------------------------------------------------------------------
  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Home') {
      set(spec.min)
    } else if (event.key === 'End') {
      set(spec.max)
    } else if (event.key === 'ArrowLeft') {
      // A leftward press with `sign` applied resolves to widen/narrow per side.
      set(width.value + -1 * KEY_STEP * sign)
    } else if (event.key === 'ArrowRight') {
      set(width.value + 1 * KEY_STEP * sign)
    } else {
      return
    }
    event.preventDefault()
  }

  return { width, min: spec.min, max: spec.max, startDrag, onKeydown }
}
