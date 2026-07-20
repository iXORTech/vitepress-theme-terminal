// =============================================================================
// math.ts — LaTeX math via MathJax → MathML (MD-001 rework for FONT-005)
// =============================================================================
// Node-side markdown setup. Renders `$…$` (inline) and `$$…$$` (block) LaTeX with
// MathJax, but emits **MathML** rather than MathJax's SVG. SVG bakes every glyph
// into a vector path from MathJax's own font, so it cannot adopt IBM Plex Math;
// native MathML `<math>` elements are styled by CSS (`math { font-family }`), so
// the FONT-005 math typeface applies. Conversion runs at build time (SSR-clean —
// no client MathJax, no per-formula <script>/<style>), and the browser renders
// the MathML natively (styles/_math.scss + typography-and-icons.md §2a).
//
// The `$`/`$$` delimiter tokenizer is the well-tested one from
// markdown-it-mathjax3 (v3, MIT); only the render step is swapped from SVG to
// serialized MathML. `$$…$$` always routes here (LaTeX) — Typst uses its own
// `::: typst` / `:typst[…]` syntax (theme/markdown/typst.ts), so the two never
// collide (MD-004).

import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js'
import { STATE } from 'mathjax-full/js/core/MathItem.js'
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js'
import { TeX } from 'mathjax-full/js/input/tex.js'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js'
import { mathjax } from 'mathjax-full/js/mathjax.js'

// Minimal structural typing for the markdown-it instance (markdown-it is a
// transitive dependency; its types are not resolvable from the project root —
// see callouts.ts). The tokenizer touches its inline/block rulers and renderer.
interface MarkdownItLike {
  inline: { ruler: { after: (name: string, rule: string, fn: unknown) => void } }
  block: {
    ruler: {
      after: (name: string, rule: string, fn: unknown, opts?: unknown) => void
    }
  }
  renderer: { rules: Record<string, unknown> }
}

// -----------------------------------------------------------------------------
// TeX → MathML converter (build-time, reused across formulas)
// -----------------------------------------------------------------------------
// A single TeX input jax + LiteAdaptor drives every conversion; each formula gets
// its own throwaway document (mirrors markdown-it-mathjax3). `bussproofs` is
// dropped from AllPackages: it needs an output jax with getBBox() and throws in a
// MathML-only (no output jax) pipeline.
const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor)
const texInput = new TeX({
  packages: AllPackages.filter((name: string) => name !== 'bussproofs'),
})
const mmlVisitor = new SerializedMmlVisitor()

/** Convert a LaTeX string to a serialized MathML `<math>` string. */
function texToMathML(latex: string, display: boolean): string {
  const doc = mathjax.document('', { InputJax: texInput })
  // `end: STATE.CONVERT` stops before an output jax runs — we want the internal
  // MathML tree, which the visitor serializes. MathJax turns parse errors into
  // an `<merror>` node (a visible message), so malformed input degrades
  // gracefully instead of throwing.
  const node = doc.convert(latex, { display, end: STATE.CONVERT })
  return mmlVisitor.visitTree(node)
}

// -----------------------------------------------------------------------------
// `$…$` / `$$…$$` tokenizer (from markdown-it-mathjax3, MIT)
// -----------------------------------------------------------------------------

// Test whether the `$` at `pos` can open / close inline math (whitespace and a
// trailing digit disqualify a delimiter — avoids matching prices like `$5`).
function isValidDelim(
  state: { src: string; posMax: number },
  pos: number,
): { canOpen: boolean; canClose: boolean } {
  const max = state.posMax
  let canOpen = true
  let canClose = true
  const prev = pos > 0 ? state.src.charCodeAt(pos - 1) : -1
  const next = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1

  if (prev === 0x20 || prev === 0x09 || (next >= 0x30 && next <= 0x39)) {
    canClose = false
  }
  if (next === 0x20 || next === 0x09) {
    canOpen = false
  }
  return { canOpen, canClose }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mathInline(state: any, silent: boolean): boolean {
  if (state.src[state.pos] !== '$') return false

  let res = isValidDelim(state, state.pos)
  if (!res.canOpen) {
    if (!silent) state.pending += '$'
    state.pos += 1
    return true
  }

  // Skip escaped delimiters when scanning for the closer.
  const start = state.pos + 1
  let match = start
  while ((match = state.src.indexOf('$', match)) !== -1) {
    let pos = match - 1
    while (state.src[pos] === '\\') pos -= 1
    if ((match - pos) % 2 === 1) break
    match += 1
  }

  if (match === -1) {
    if (!silent) state.pending += '$'
    state.pos = start
    return true
  }
  if (match - start === 0) {
    if (!silent) state.pending += '$$'
    state.pos = start + 1
    return true
  }

  res = isValidDelim(state, match)
  if (!res.canClose) {
    if (!silent) state.pending += '$'
    state.pos = start
    return true
  }

  if (!silent) {
    const token = state.push('math_inline', 'math', 0)
    token.markup = '$'
    token.content = state.src.slice(start, match)
  }
  state.pos = match + 1
  return true
}

function mathBlock(
  state: any,
  start: number,
  end: number,
  silent: boolean,
): boolean {
  let pos = state.bMarks[start] + state.tShift[start]
  let max = state.eMarks[start]
  if (pos + 2 > max) return false
  if (state.src.slice(pos, pos + 2) !== '$$') return false

  pos += 2
  let firstLine = state.src.slice(pos, max)
  if (silent) return true

  let found = false
  let lastLine = ''
  if (firstLine.trim().slice(-2) === '$$') {
    firstLine = firstLine.trim().slice(0, -2)
    found = true
  }

  let next = start
  let lastPos
  while (!found) {
    next++
    if (next >= end) break
    pos = state.bMarks[next] + state.tShift[next]
    max = state.eMarks[next]
    if (pos < max && state.tShift[next] < state.blkIndent) break
    if (state.src.slice(pos, max).trim().slice(-2) === '$$') {
      lastPos = state.src.slice(0, max).lastIndexOf('$$')
      lastLine = state.src.slice(pos, lastPos)
      found = true
    }
  }

  state.line = next + 1
  const token = state.push('math_block', 'math', 0)
  token.block = true
  token.content =
    (firstLine && firstLine.trim() ? firstLine + '\n' : '') +
    state.getLines(start + 1, next, state.tShift[start], true) +
    (lastLine && lastLine.trim() ? lastLine : '')
  token.map = [start, state.line]
  token.markup = '$$'
  return true
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Wire the LaTeX math pipeline: `$…$` / `$$…$$` → MathML (FONT-005). Inline math
 * is wrapped in `<span class="ct-math ct-math--inline">`, block math centered in
 * `<div class="ct-math ct-math--block">`, both styling hooks for _math.scss.
 */
export function mathPlugin(md: MarkdownItLike): void {
  md.inline.ruler.after('escape', 'math_inline', mathInline)
  md.block.ruler.after('blockquote', 'math_block', mathBlock, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  })

  md.renderer.rules.math_inline = (tokens: { content: string }[], idx: number) =>
    `<span class="ct-math ct-math--inline">${texToMathML(
      tokens[idx].content,
      false,
    )}</span>`

  md.renderer.rules.math_block = (tokens: { content: string }[], idx: number) =>
    `<div class="ct-math ct-math--block">${texToMathML(
      tokens[idx].content,
      true,
    )}</div>\n`
}
