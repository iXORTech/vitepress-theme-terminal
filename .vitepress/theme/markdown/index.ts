// =============================================================================
// markdown/index.ts — theme markdown pipeline setup (MD-001, MD-002)
// =============================================================================
// Node-side. Builds the `markdown.config` hook for `.vitepress/config.mts`:
// the markdown-it plugin suite (MD-001) plus the callout containers (MD-002),
// the LaTeX math pipeline (mathPlugin, MD-001/FONT-005), the Typst math syntax
// (typstPlugin, MD-004), and the pull-quote container (quotePlugin, MD-005).
// Syntax-highlighting themes are wired separately
// via `markdown.theme` (theme/shiki/) — see config.mts.
//
// Math typeface (FONT-005): the LaTeX path emits MathML (not MathJax SVG) so it
// can adopt IBM Plex Math via CSS; Typst renders client-side to SVG with the
// same font. VitePress's built-in `markdown.math` option (which would wire
// markdown-it-mathjax3's SVG output) is therefore NOT used — see
// theme/markdown/math.ts and docs/design/typography-and-icons.md §2a.

import abbr from 'markdown-it-abbr'
import deflist from 'markdown-it-deflist'
// v3 of markdown-it-emoji ships named presets; `full` is the complete set.
import { full as emoji } from 'markdown-it-emoji'
import footnote from 'markdown-it-footnote'
import ins from 'markdown-it-ins'
import mark from 'markdown-it-mark'
import sub from 'markdown-it-sub'
import sup from 'markdown-it-sup'
import { calloutsPlugin } from './callouts'
import { codeBlockCardsPlugin } from './codeblock'
import { localizedContentPlugin } from './localized-content'
import { mathPlugin } from './math'
import { quotePlugin } from './quote'
import { swiperPlugin } from './swiper'
import { typstPlugin } from './typst'

/**
 * Build the `markdown.config` hook. `lang` is the site's default language —
 * it picks the build-time default callout titles (the client re-localizes
 * them when the UI language switches).
 */
export function createMarkdownConfig(lang: string) {
  // Parameter typed loosely: markdown-it's types are not resolvable from the
  // project root (transitive dependency), see callouts.ts. The intersection
  // covers the members each plugin touches (callouts' use/renderInline/renderer
  // plus the math/typst rulers); the real markdown-it satisfies all of them.
  return (
    md: Parameters<typeof calloutsPlugin>[0] &
      Parameters<typeof mathPlugin>[0] &
      Parameters<typeof typstPlugin>[0],
  ): void => {
    // MD-001 plugin suite (emoji :tada:, ~sub~, ^sup^, ++ins++, ==mark==,
    // footnotes, definition lists, abbreviations)
    md.use(emoji)
      .use(sub)
      .use(sup)
      .use(ins)
      .use(mark)
      .use(footnote)
      .use(deflist)
      .use(abbr)

    // MD-001 LaTeX math ($…$ / $$…$$) → MathML, styled in IBM Plex Math
    // (FONT-005). Replaces VitePress's built-in mathjax3 SVG wiring.
    mathPlugin(md)

    // MD-004 Typst math — `::: typst` block + `:typst[…]` inline; inert markup
    // compiled client-side by useTypst (never collides with the LaTeX `$`/`$$`)
    typstPlugin(md)

    // MD-002 callouts (markdown-it-container based)
    calloutsPlugin(md, lang)

    // MD-005 pull quotes — `::: quote` framed by the 「 」 corner marks
    quotePlugin(md)

    // COMP-002 image slider containers (`:::: swiper` decks of
    // `::: swiper-slide-no-shadow` cards; client-initialized by useSwipers)
    swiperPlugin(md)

    // I18N-007 per-language content blocks (`::: lang <tag>`) — the matching
    // block is emitted visible at build time, the client switches on language
    localizedContentPlugin(md, lang)

    // STYLE-004 code-block cards — wrap VitePress's Shiki fence output in the
    // card frame + title bar (file name · language · COPY)
    codeBlockCardsPlugin(md, lang)
  }
}
