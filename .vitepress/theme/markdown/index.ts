// =============================================================================
// markdown/index.ts — theme markdown pipeline setup (MD-001, MD-002)
// =============================================================================
// Node-side. Builds the `markdown.config` hook for `.vitepress/config.mts`:
// the markdown-it plugin suite (MD-001) plus the callout containers (MD-002).
// Math (markdown-it-mathjax3) is wired separately via VitePress's built-in
// `markdown.math: true` option, and syntax-highlighting themes via
// `markdown.theme` (theme/shiki/) — see config.mts.
//
// markdown-it-mathjax3 must stay on ^4: v5 emits a per-formula inline <style>
// inside the content, which is illegal in Vue client templates ("tags with
// side effect") and crashes the dev transform. v4 emits one top-level style
// block that VitePress hoists out of the template.

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

/**
 * Build the `markdown.config` hook. `lang` is the site's default language —
 * it picks the build-time default callout titles (the client re-localizes
 * them when the UI language switches).
 */
export function createMarkdownConfig(lang: string) {
  // Parameter typed loosely: markdown-it's types are not resolvable from the
  // project root (transitive dependency), see callouts.ts.
  return (md: Parameters<typeof calloutsPlugin>[0]): void => {
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

    // MD-002 callouts (markdown-it-container based)
    calloutsPlugin(md, lang)

    // I18N-007 per-language content blocks (`::: lang <tag>`) — the matching
    // block is emitted visible at build time, the client switches on language
    localizedContentPlugin(md, lang)

    // STYLE-004 code-block cards — wrap VitePress's Shiki fence output in the
    // card frame + title bar (file name · language · COPY)
    codeBlockCardsPlugin(md, lang)
  }
}
