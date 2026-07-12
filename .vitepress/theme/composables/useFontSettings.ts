// =============================================================================
// useFontSettings.ts — content font family & size preference (THEME-007)
// =============================================================================
// The settings panel's font configuration. Two reader preferences, applied to
// the content column (.ct-content) via `<html>` attributes that SCSS maps to
// CSS custom properties (styles/_settings.scss):
//   - family: the reading font — Default (follows the color mode), or an
//     explicit Sans / Serif / Mono override;
//   - size:   the reading font size — Small / Medium / Large.
// Both persist in localStorage and, like the color mode (useColorMode), are
// restored onto <html> before first paint by the head script (theme/head.ts),
// so there is no flash or layout shift; this composable only mirrors and
// updates that state. SSR-safe: the refs seed the defaults and sync on mount.

import { onMounted, readonly, ref } from 'vue'
import type { DeepReadonly, Ref } from 'vue'

// `default` carries no attribute — the content font then follows the mode's
// --ct-font-body (sans on screen, serif on paper).
export type FontFamily = 'default' | 'sans' | 'serif' | 'mono'
export type FontSize = 'small' | 'medium' | 'large'

const FAMILIES: FontFamily[] = ['default', 'sans', 'serif', 'mono']
const SIZES: FontSize[] = ['small', 'medium', 'large']

const FAMILY_KEY = 'ct-font-family'
const SIZE_KEY = 'ct-font-size'
const FAMILY_ATTR = 'data-ct-font-family'
const SIZE_ATTR = 'data-ct-font-size'

// Module-level singletons so every component shares the same reactive state.
const family = ref<FontFamily>('default')
const size = ref<FontSize>('medium')

function isFamily(value: unknown): value is FontFamily {
  return FAMILIES.includes(value as FontFamily)
}
function isSize(value: unknown): value is FontSize {
  return SIZES.includes(value as FontSize)
}

// Attribute is present only for a non-default value (default = follow the mode,
// medium = the base size); absence keeps <html> clean and the CSS fallback wins.
function applyAttribute(attr: string, value: string, base: string): void {
  if (typeof document === 'undefined') return
  const el = document.documentElement
  if (value === base) el.removeAttribute(attr)
  else el.setAttribute(attr, value)
}

function persist(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Persistence unavailable (private browsing, etc.) — choice still applies.
  }
}

/** Read, set the content font family and size. Persisted; SSR-safe. */
export function useFontSettings(): {
  family: DeepReadonly<Ref<FontFamily>>
  size: DeepReadonly<Ref<FontSize>>
  families: FontFamily[]
  sizes: FontSize[]
  setFamily: (value: FontFamily) => void
  setSize: (value: FontSize) => void
} {
  // Sync with the attributes the head script applied before hydration.
  onMounted(() => {
    const el = document.documentElement
    const storedFamily = el.getAttribute(FAMILY_ATTR)
    if (isFamily(storedFamily)) family.value = storedFamily
    const storedSize = el.getAttribute(SIZE_ATTR)
    if (isSize(storedSize)) size.value = storedSize
  })

  const setFamily = (value: FontFamily): void => {
    family.value = value
    applyAttribute(FAMILY_ATTR, value, 'default')
    persist(FAMILY_KEY, value)
  }

  const setSize = (value: FontSize): void => {
    size.value = value
    applyAttribute(SIZE_ATTR, value, 'medium')
    persist(SIZE_KEY, value)
  }

  return {
    family: readonly(family),
    size: readonly(size),
    families: FAMILIES,
    sizes: SIZES,
    setFamily,
    setSize,
  }
}
