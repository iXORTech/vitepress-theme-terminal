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

// Family name defined by the official webfont stylesheet (nerdfonts.com),
// and a sample PUA glyph (nf-fa-circle_info) to load/check against.
const NERD_FONT_FACE = '1em "NerdFontsSymbols Nerd Font"'
const NERD_FONT_SAMPLE = '\uf05a'

/** Set `<html data-ct-nerdfont>` once the symbols Nerd Font has loaded. */
export function useNerdFont(): void {
  onMounted(async () => {
    if (!document.fonts) return // no Font Loading API — keep the fallback
    try {
      // Wait for stylesheets to settle so the @font-face is registered, then
      // load the face. `load()` resolves with the faces that matched — an
      // empty array means the stylesheet (hence the family) never arrived.
      await document.fonts.ready
      const faces = await document.fonts.load(NERD_FONT_FACE, NERD_FONT_SAMPLE)
      if (faces.length > 0) {
        document.documentElement.setAttribute('data-ct-nerdfont', '')
      }
    } catch {
      // Font fetch failed — keep the fallback rendering.
    }
  })
}
