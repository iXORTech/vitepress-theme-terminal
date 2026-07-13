// =============================================================================
// localized-content.ts — per-language page content blocks (I18N-007)
// =============================================================================
// Node-side markdown setup. Registers a `::: lang <tag>` container so an author
// can write several language versions of a page's body in one file, mirroring
// how a localized `title` frontmatter map drives the explorer label. Each block
// becomes `<div class="ct-lang" data-ct-lang="<tag>">…</div>`; the client
// (useLocalizedContent) reveals only the block matching the active UI language
// and hides the rest — client-side, no URL change (design-language.md §9).
//
// Content left OUTSIDE any `::: lang` block is untouched and always shows.
//
// SSR default visibility: to avoid a flash (and to stay correct with JS off),
// the block whose tag matches the site's default `lang` is emitted visible and
// every other block is emitted `hidden`. The client then refines this with the
// full fallback chain (exact tag → primary subtag → site default → first).

import container from 'markdown-it-container'

// Minimal structural typing for the markdown-it instance — see callouts.ts for
// why markdown-it's own types are not resolvable from the project root.
interface MarkdownItLike {
  use: (plugin: unknown, ...params: unknown[]) => MarkdownItLike
}
interface ContainerToken {
  nesting: number
  info: string
}

/** Does a block's `data-ct-lang` tag satisfy the site's default language? */
function tagMatchesLang(tag: string, lang: string): boolean {
  const a = tag.toLowerCase()
  const b = lang.toLowerCase()
  return a === b || a.split('-')[0] === b.split('-')[0]
}

/**
 * Wire the `::: lang <tag>` container. `lang` is the site's default language —
 * the matching block renders visible at build time, the rest `hidden` (the
 * client re-resolves on load and on every language switch).
 */
export function localizedContentPlugin(md: MarkdownItLike, lang: string): void {
  md.use(container, 'lang', {
    // Accept only `::: lang <tag>` (a non-empty tag is required).
    validate: (params: string): boolean => /^lang\s+\S+/.test(params.trim()),

    render: (tokens: ContainerToken[], idx: number): string => {
      const token = tokens[idx]
      if (token.nesting !== 1) return '</div>\n'

      const tag = token.info.trim().slice('lang'.length).trim()
      const hidden = tagMatchesLang(tag, lang) ? '' : ' hidden'
      return `<div class="ct-lang" data-ct-lang="${tag}"${hidden}>\n`
    },
  })
}
