// =============================================================================
// codeblock.ts — code blocks as TUI card-style windows (STYLE-004)
// =============================================================================
// Node-side markdown setup. Wraps VitePress's Shiki-highlighted fence output in
// the card visual language (design-language.md §4, cards; ui-sketch.md §6, code
// block variant): a `.ct-code` frame headed by a TITLE BAR — the file name
// (when given), the language name, and a COPY button — NOT a shell-prompt
// decoration. The highlighting itself stays Shiki-powered with the STYLE-003
// oxocarbon palettes; this plugin only reframes the block and adds the header.
//
// The header is emitted at build time in the site's default language; its COPY
// label is tagged `data-ct-code-copy-label` so the client re-localizes it when
// the UI language switches, and wires the copy behavior (composables/useCodeCopy).
//
// A file name is taken from the fence info string in square brackets, e.g.
// ` ```scss [main.scss] ` — chosen so it never collides with VitePress's own
// `{highlight}` / `:line-numbers` info-string modifiers.

import { resolveLocaleStrings } from '../locales'

// Minimal structural typing for the markdown-it instance (markdown-it is a
// transitive dependency; its types are not resolvable from the project root —
// same approach as callouts.ts).
interface RendererLike {
  renderToken: (tokens: unknown[], idx: number, options: unknown) => string
}
type FenceRule = (
  tokens: { info: string }[],
  idx: number,
  options: unknown,
  env: unknown,
  self: RendererLike,
) => string
// Structural typing kept loose so the shared markdown-it instance from
// createMarkdownConfig (rules typed as `Record<string, unknown>`) passes in.
interface MarkdownItLike {
  renderer: { rules: Record<string, unknown> }
}

/** Escape a raw string for safe interpolation into HTML text/attributes. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Language subtag = the leading word of the info string (before space/`{`/`:`). */
function parseLanguage(info: string): string {
  return (/^([\w-]+)/.exec(info.trim())?.[1] ?? '').toLowerCase()
}

/** Optional file name = the first `[...]` group in the info string. */
function parseFileName(info: string): string {
  return /\[([^\]]+)\]/.exec(info)?.[1]?.trim() ?? ''
}

/**
 * Wrap every fenced code block in the code-block card. `lang` is the site's
 * default language — it picks the build-time COPY label (re-localized on the
 * client). Preserves VitePress's fence rendering (Shiki, line highlighting,
 * line numbers) untouched inside the card.
 */
export function codeBlockCardsPlugin(md: MarkdownItLike, lang: string): void {
  const copyLabel = escapeHtml(resolveLocaleStrings(lang)['code.copy'])
  // VitePress installs its Shiki fence rule before the markdown.config hook
  // runs, so this captures it; the fallback keeps plain output if it is absent.
  const defaultFence = md.renderer.rules.fence as FenceRule | undefined

  const fence: FenceRule = (tokens, idx, options, env, self): string => {
    // Read the info string BEFORE delegating: VitePress's own fence rule strips
    // the `[title]` bracket out of `token.info` as it renders, so the file name
    // must be parsed from the original value first.
    const info = tokens[idx].info
    const language = parseLanguage(info)
    const fileName = parseFileName(info)

    const rendered = defaultFence
      ? defaultFence(tokens, idx, options, env, self)
      : self.renderToken(tokens as unknown[], idx, options)

    // Title-bar meta: file name (when given) then the language name. Either may
    // be absent; the COPY button is always present.
    const meta =
      (fileName ? `<span class="ct-code__name">${escapeHtml(fileName)}</span>` : '') +
      (language ? `<span class="ct-code__lang">${escapeHtml(language)}</span>` : '')

    // Text-based COPY control, TUI style (`[copy]`), matching the window's
    // `[x]`. The label span is re-localized client-side; the copy behavior is
    // delegated from useCodeCopy() via the data-ct-code-copy hook.
    const copy =
      `<button class="ct-code__copy" type="button" data-ct-code-copy ` +
      `aria-label="${copyLabel}" title="${copyLabel}">` +
      `[<span class="ct-code__copy-label" data-ct-code-copy-label>${copyLabel}</span>]` +
      `</button>`

    return (
      `<div class="ct-code">` +
      `<div class="ct-code__titlebar">` +
      `<span class="ct-code__meta">${meta}</span>${copy}` +
      `</div>` +
      `${rendered}` +
      `</div>\n`
    )
  }

  md.renderer.rules.fence = fence
}
