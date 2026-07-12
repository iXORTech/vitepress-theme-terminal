// ============================================================================
// useClock.ts — live wall-clock time for the status bar (THEME-019)
// ============================================================================
// A ticking `HH:MM:SS` string for the status bar's right end, in the terminal
// statusline idiom. Client-only and SSR-safe: the value starts empty so the
// server render and the first client render agree (no hydration mismatch), then
// the interval fills and updates it once mounted. The interval is cleared on
// unmount so it never leaks across navigations.
import { onBeforeUnmount, onMounted, ref } from 'vue'

/** Zero-pad a clock field to two digits (`7` → `07`). */
const pad = (value: number): string => String(value).padStart(2, '0')

/** Reactive `HH:MM:SS` (24-hour) local time, empty until mounted. */
export function useClock() {
  const time = ref('')
  let timer: ReturnType<typeof setInterval> | undefined

  const update = (): void => {
    const now = new Date()
    time.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  }

  onMounted(() => {
    update()
    timer = setInterval(update, 1000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return time
}
