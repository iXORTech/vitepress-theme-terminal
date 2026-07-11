// =============================================================================
// useNerdFont.ts — Nerd Font availability flag (FONT-002 / MD-003)
// =============================================================================
// The symbols-only Nerd Font stylesheet (theme/head.ts) maps its glyphs to
// Private Use Area codepoints, which render as tofu when the font is missing.
// This composable asks the CSS Font Loading API for the face and flags <html>
// with `data-ct-nerdfont` once it is confirmed usable; the SCSS gates every
// PUA glyph behind that attribute, so a failed stylesheet degrades to the
// safe fallback (no title icon, plain `❯` details chevron) instead of tofu
// (typography-and-icons.md §2).

import { onMounted } from 'vue'

// The generated CSS's family points at a legacy missing path, so use the
// working alias registered by styles/_fonts.scss and check a sample PUA glyph.
const NERD_FONT_FACE = '1em "NerdFontsSymbols Nerd Font Terminal"'
const NERD_FONT_SAMPLE = '\uf05a'
const NERD_FONT_STYLESHEET = 'nerd-fonts-generated.min.css'

function findNerdFontStylesheet(): HTMLLinkElement | undefined {
  return [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')]
    .find((link) => link.href.includes(NERD_FONT_STYLESHEET))
}

function waitForWindowLoad(): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve()
  return new Promise((resolve) => {
    window.addEventListener('load', () => resolve(), { once: true })
  })
}

/**
 * Wait until the external stylesheet has registered its @font-face rule.
 * `document.fonts.ready` can resolve before a late stylesheet is parsed.
 */
function waitForNerdFontStylesheet(): Promise<void> {
  const stylesheet = findNerdFontStylesheet()
  if (!stylesheet) return waitForWindowLoad()
  // A cross-origin stylesheet may be loaded while its `sheet` remains
  // inaccessible; the completed document load is still a reliable signal.
  if (document.readyState === 'complete') return Promise.resolve()
  if (stylesheet.sheet) return Promise.resolve()

  return new Promise((resolve) => {
    const finish = (): void => {
      stylesheet.removeEventListener('load', finish)
      stylesheet.removeEventListener('error', finish)
      window.removeEventListener('load', finish)
      resolve()
    }

    stylesheet.addEventListener('load', finish)
    stylesheet.addEventListener('error', finish)
    window.addEventListener('load', finish, { once: true })
    // Cover the small race between the initial sheet check and listener setup.
    if (stylesheet.sheet || document.readyState === 'complete') finish()
  })
}

/** Set `<html data-ct-nerdfont>` once the symbols Nerd Font has loaded. */
export function useNerdFont(): void {
  onMounted(async () => {
    if (!document.fonts) return // no Font Loading API — keep the fallback
    try {
      // Wait for the external stylesheet before asking the Font Loading API.
      // Otherwise a first-paint race can return no matching faces permanently.
      await waitForNerdFontStylesheet()
      await document.fonts.ready
      // `load()` resolves with the faces that matched — an empty array means
      // the stylesheet (hence the family) never arrived.
      const faces = await document.fonts.load(NERD_FONT_FACE, NERD_FONT_SAMPLE)
      if (faces.length > 0) {
        document.documentElement.setAttribute('data-ct-nerdfont', '')
      }
    } catch {
      // Font fetch failed — keep the fallback rendering.
    }
  })
}
