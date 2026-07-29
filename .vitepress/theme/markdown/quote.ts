// =============================================================================
// quote.ts — pull-quote container with CJK corner marks (MD-005)
// =============================================================================
// Node-side markdown setup. Registers a `::: quote` container that renders its
// body as a display quotation framed by the Chinese corner brackets 「 and 」 —
// the opener at the upper-left, the closer at the lower-right, both in the
// theme's main color (styles/_quote.scss).
//
// The element is a real `<blockquote>`, so the quotation is semantic and not
// just decoration; `.ct-quote` out-specifies the base blockquote styling in
// _content.scss (which keeps its left bar for the plain `>` form).
//
// The corner marks themselves are CSS pseudo-elements, never text nodes: they
// stay out of the accessibility tree and out of copied selections, exactly like
// the quotation marks a print typographer would hang in the margin.

import container from 'markdown-it-container'

// Minimal structural typing for the markdown-it instance — see callouts.ts for
// why markdown-it's own types are not resolvable from the project root.
interface MarkdownItLike {
  use: (plugin: unknown, ...params: unknown[]) => MarkdownItLike
}
interface ContainerToken {
  nesting: number
}

/** Wire the `::: quote` container. */
export function quotePlugin(md: MarkdownItLike): void {
  md.use(container, 'quote', {
    render: (tokens: ContainerToken[], idx: number): string =>
      tokens[idx].nesting === 1
        ? '<blockquote class="ct-quote">\n'
        : '</blockquote>\n',
  })
}
