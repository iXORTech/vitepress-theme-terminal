// =============================================================================
// typst.ts — Typst math container + inline form (MD-004)
// =============================================================================
// Node-side markdown setup. Lets an author write **Typst** math alongside the
// LaTeX (`$…$` / `$$…$$`, theme/markdown/math.ts) path, with its own unambiguous
// syntax so the two never collide:
//
//   Block:   ::: typst
//            sum_(k=1)^n k = (n(n+1))/2
//            :::
//
//   Inline:  the identity :typst[e^(i pi) + 1 = 0] closes the loop
//
// Both emit inert, SSR-safe markup carrying the RAW Typst source — no WASM runs
// in Node/at build. The `.ct-typst__src` element shows that source as the
// no-JS / pre-hydration fallback; the client composable useTypst() compiles it
// to SVG on mount and after navigation (typst.ts + IBM Plex Math, FONT-005),
// swapping the source for the rendered math, or a visible error for malformed
// input (styles/_math.scss). See design-language.md §4 (Typst math) and the
// markdown demo (DEMO-001).

// Minimal structural typing for the markdown-it instance — markdown-it is a
// transitive dependency; its types are not resolvable from the project root
// (see callouts.ts).
/* eslint-disable @typescript-eslint/no-explicit-any */
interface MarkdownItLike {
  block: {
    ruler: {
      before: (name: string, rule: string, fn: unknown, opts?: unknown) => void
    }
  }
  inline: {
    ruler: { after: (name: string, rule: string, fn: unknown) => void }
  }
  renderer: { rules: Record<string, unknown> }
}

/** Escape a raw string for safe embedding as HTML text content. */
function escapeHtml(src: string): string {
  return src
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Wrap raw Typst source in the inert block/inline scaffold useTypst() reads. */
function typstMarkup(source: string, block: boolean): string {
  const escaped = escapeHtml(source)
  if (block) {
    return (
      '<div class="ct-typst ct-typst--block" data-ct-typst="block">' +
      `<pre class="ct-typst__src">${escaped}</pre>` +
      '<span class="ct-typst__view" hidden></span>' +
      '</div>\n'
    )
  }
  return (
    '<span class="ct-typst ct-typst--inline" data-ct-typst="inline">' +
    `<code class="ct-typst__src">${escaped}</code>` +
    '<span class="ct-typst__view" hidden></span>' +
    '</span>'
  )
}

// Opening fence: a line of 3+ colons immediately followed by `typst` (optionally
// spaced), e.g. `::: typst` or `:::typst`.
const OPEN_RE = /^(:{3,})\s*typst\s*$/
// Closing fence: a line of only colons (3+), e.g. `:::`.
const CLOSE_RE = /^:{3,}\s*$/

/**
 * Block rule: capture the RAW lines between `::: typst` and the closing `:::`
 * (never parsed as markdown — Typst source is not markdown) and emit the block
 * scaffold.
 */
function typstBlock(
  state: any,
  startLine: number,
  endLine: number,
  silent: boolean,
): boolean {
  const start = state.bMarks[startLine] + state.tShift[startLine]
  const max = state.eMarks[startLine]
  const openLine = state.src.slice(start, max)
  if (!OPEN_RE.test(openLine)) return false
  // Fast-path validation for the paragraph-terminator check.
  if (silent) return true

  // Scan for the closing fence; without one, consume to the end of the block.
  let nextLine = startLine
  let haveClose = false
  for (;;) {
    nextLine++
    if (nextLine >= endLine) break
    const lineStart = state.bMarks[nextLine] + state.tShift[nextLine]
    const lineMax = state.eMarks[nextLine]
    if (
      state.tShift[nextLine] < state.blkIndent // dedented out of the block
    ) {
      break
    }
    if (CLOSE_RE.test(state.src.slice(lineStart, lineMax))) {
      haveClose = true
      break
    }
  }

  // Raw source = the lines strictly between the fences.
  const source = state.getLines(startLine + 1, nextLine, 0, false).trimEnd()

  const token = state.push('typst_block', '', 0)
  token.map = [startLine, nextLine + (haveClose ? 1 : 0)]
  token.content = source
  token.markup = ':::'
  token.block = true

  state.line = nextLine + (haveClose ? 1 : 0)
  return true
}

/**
 * Inline rule: `:typst[ … ]`, with the content running to the bracket-balanced
 * closing `]` (Typst math rarely uses raw `[`, and balancing handles the rest).
 * Distinct opener (`:typst[`) — no overlap with the LaTeX `$` rule.
 */
function typstInline(state: any, silent: boolean): boolean {
  const src: string = state.src
  const start: number = state.pos
  const marker = ':typst['
  if (src.slice(start, start + marker.length) !== marker) return false

  // Balance brackets so `:typst[lr([x])]` closes at the right `]`.
  let pos = start + marker.length
  let depth = 1
  while (pos < state.posMax) {
    const ch = src[pos]
    if (ch === '\\') {
      pos += 2 // skip an escaped character
      continue
    }
    if (ch === '[') depth++
    else if (ch === ']') {
      depth--
      if (depth === 0) break
    }
    pos++
  }
  if (depth !== 0) return false // no matching close — not Typst inline
  const content = src.slice(start + marker.length, pos)
  if (content.length === 0) return false

  if (!silent) {
    const token = state.push('typst_inline', '', 0)
    token.content = content
    token.markup = ':typst[]'
  }
  state.pos = pos + 1 // consume the closing `]`
  return true
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Wire the `::: typst` block container and the `:typst[…]` inline form. */
export function typstPlugin(md: MarkdownItLike): void {
  // Before `fence` so `::: typst` is claimed before any container plugin.
  md.block.ruler.before('fence', 'typst_block', typstBlock, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  })
  // After `escape` so a leading backslash still escapes the colon if needed.
  md.inline.ruler.after('escape', 'typst_inline', typstInline)

  md.renderer.rules.typst_block = (tokens: { content: string }[], idx: number) =>
    typstMarkup(tokens[idx].content, true)
  md.renderer.rules.typst_inline = (
    tokens: { content: string }[],
    idx: number,
  ) => typstMarkup(tokens[idx].content, false)
}
