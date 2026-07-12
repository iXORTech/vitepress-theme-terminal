// =============================================================================
// useCodeCopy.ts — code-block COPY behavior + label localization (STYLE-004)
// =============================================================================
// The code-block card's title bar is static markdown output: its COPY button
// carries a build-time label tagged `data-ct-code-copy-label`
// (theme/markdown/codeblock.ts). This composable, called once from the layout:
//   - re-localizes every COPY label (and its aria-label/title) from the locale
//     table on mount, on content updates, and on a UI-language switch — the
//     same pattern as useCalloutTitles;
//   - copies the block's source to the clipboard when a COPY button is pressed,
//     flashing a localized "Copied" confirmation.
// Click handling is delegated to one document-level listener, so freshly
// rendered code blocks (page navigation) need no re-binding.

import { onBeforeUnmount, onMounted, watch } from 'vue'
import { onContentUpdated } from 'vitepress'
import { useThemeLocale } from './useThemeLocale'

// Buttons currently flashing "Copied" — skipped by the re-localizer so a
// language switch mid-flash doesn't revert the confirmation early.
const flashing = new WeakSet<HTMLElement>()
const RESET_MS = 1500

export function useCodeCopy(): void {
  const { strings } = useThemeLocale()

  // Set a COPY button's visible label and accessible name to `text`.
  const label = (button: HTMLElement, text: string): void => {
    const span = button.querySelector('[data-ct-code-copy-label]')
    if (span) span.textContent = text
    button.setAttribute('aria-label', text)
    button.setAttribute('title', text)
  }

  // Restore every idle COPY button to the active language's "Copy".
  const relabel = (): void => {
    if (typeof document === 'undefined') return
    for (const button of document.querySelectorAll<HTMLElement>(
      '[data-ct-code-copy]',
    )) {
      if (!flashing.has(button)) label(button, strings.value['code.copy'])
    }
  }

  // Copy the block source and flash the localized confirmation.
  const copy = async (button: HTMLElement): Promise<void> => {
    const code = button
      .closest('.ct-code')
      ?.querySelector('pre code')?.textContent
    if (code == null) return

    try {
      await navigator.clipboard.writeText(code)
    } catch {
      return // clipboard unavailable (insecure context, denied) — no feedback
    }

    flashing.add(button)
    label(button, strings.value['code.copied'])
    button.classList.add('ct-code__copy--copied')
    window.setTimeout(() => {
      flashing.delete(button)
      button.classList.remove('ct-code__copy--copied')
      label(button, strings.value['code.copy'])
    }, RESET_MS)
  }

  // One delegated listener survives content swaps (no per-button binding).
  const onClick = (event: MouseEvent): void => {
    const button =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-ct-code-copy]')
        : null
    if (button) void copy(button)
  }

  onMounted(() => {
    document.addEventListener('click', onClick)
    relabel()
  })
  onBeforeUnmount(() => document.removeEventListener('click', onClick))
  onContentUpdated(relabel) // fresh markdown DOM after navigation
  watch(strings, relabel) // language switch / per-language overrides
}
