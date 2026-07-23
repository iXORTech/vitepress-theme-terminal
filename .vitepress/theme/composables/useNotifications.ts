// =============================================================================
// useNotifications.ts — transient status notifications / "toasts" (THEME-029)
// =============================================================================
// A module-singleton queue of short, self-dismissing status messages, rendered
// once by `components/NotificationStack.vue` (placed by Layout just above the
// status bar). Any feature that completes a silent action — the first being the
// heading-anchor link copy (THEME-028) — calls `notify()` with an already
// localized message; callers own the wording so the strings stay in the locale
// tables (AGENTS.md §6.7), this module only owns the timing and the queue.
//
// Behavior: each notification dismisses itself after NOTIFICATION_MS, or
// immediately when the reader activates its `[x]` control. Re-notifying the
// same message replaces the one on screen (a fresh id, so it re-enters with its
// animation and a full timer) rather than stacking an identical copy, and the
// queue never grows past MAX_VISIBLE — the oldest entry drops off.

import { readonly, ref } from 'vue'
import type { DeepReadonly, Ref } from 'vue'

/** One queued message. `id` is the render key and the dismissal handle. */
export interface ThemeNotification {
  id: number
  message: string
}

/** How long a notification stays on screen before dismissing itself. */
export const NOTIFICATION_MS = 3000

/** Ceiling on the visible stack — beyond it the oldest entry is dropped. */
const MAX_VISIBLE = 3

const items = ref<ThemeNotification[]>([])
const timers = new Map<number, ReturnType<typeof setTimeout>>()
let nextId = 0

/** Remove a notification and cancel its pending auto-dismiss. */
function dismiss(id: number): void {
  const timer = timers.get(id)
  if (timer !== undefined) {
    clearTimeout(timer)
    timers.delete(id)
  }
  items.value = items.value.filter((item) => item.id !== id)
}

/** Queue a localized message; returns nothing — the stack renders it. */
function notify(message: string): void {
  const text = message.trim()
  if (!text) return

  // A repeat of the same message replaces the visible one (see header note).
  const existing = items.value.find((item) => item.message === text)
  if (existing) dismiss(existing.id)

  const id = ++nextId
  items.value = [...items.value, { id, message: text }]
  while (items.value.length > MAX_VISIBLE) dismiss(items.value[0].id)

  timers.set(
    id,
    setTimeout(() => dismiss(id), NOTIFICATION_MS),
  )
}

export function useNotifications(): {
  /** The visible queue, oldest first. */
  notifications: DeepReadonly<Ref<ThemeNotification[]>>
  /** Show a (already localized) message. */
  notify: (message: string) => void
  /** Dismiss one notification early (its `[x]` control). */
  dismiss: (id: number) => void
} {
  return { notifications: readonly(items), notify, dismiss }
}
