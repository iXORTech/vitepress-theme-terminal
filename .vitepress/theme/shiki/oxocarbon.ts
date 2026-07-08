// =============================================================================
// oxocarbon.ts — custom Shiki themes for the three color modes (STYLE-003)
// =============================================================================
// Palette sources (docs/design/color-system.md §5):
//   - dark & light: nyoom-engineering/oxocarbon.nvim (MIT) — palette constants
//     from lua/oxocarbon/init.lua; the HSLuv-blended neutrals use the canonical
//     values published in nyoom-engineering/base16-oxocarbon.
//   - paper: nyoom-engineering/oxocarbon-vscode (MIT) — themes/PRINT.json,
//     vendored as ./oxocarbon-paper.json (renamed `oxocarbon-paper`).
// The TextMate scope → color mapping below transcribes oxocarbon.nvim's
// treesitter/vim highlight groups (e.g. @keyword, @function, @string) to their
// closest TextMate scopes, so web code blocks match the editor theme.

import oxocarbonPaperJson from './oxocarbon-paper.json'

// --- Minimal structural type for a Shiki/VS Code theme registration ----------
// (Avoids importing types from shiki, which is a transitive dependency.)
interface ShikiTheme {
  name: string
  type: 'dark' | 'light'
  colors?: Record<string, string>
  settings?: { scope?: string | string[]; settings: Record<string, string> }[]
  tokenColors?: unknown[]
  [key: string]: unknown
}

// --- oxocarbon.nvim palettes --------------------------------------------------
// Slot numbering follows the nvim source (base00–base15, decimal).
const dark = {
  base00: '#161616', // background
  base01: '#262626',
  base02: '#393939',
  base03: '#525252', // comments
  base04: '#dde1e6', // foreground / variables
  base05: '#f2f4f8',
  base06: '#ffffff',
  base07: '#08bdba', // namespaces, macros, builtins
  base08: '#3ddbd9', // word operators, punctuation
  base09: '#78a9ff', // keywords, numbers, types
  base10: '#ee5396', // properties, headings
  base11: '#33b1ff', // errors
  base12: '#ff7eb6', // functions
  base13: '#42be65', // todo/success accents
  base14: '#be95ff', // strings, constants, links
  base15: '#82cfff', // escapes, labels, attributes
}

const light = {
  base00: '#ffffff', // background
  base01: '#f2f4f8',
  base02: '#dde1e6',
  base03: '#161616', // comments (near-black in the light variant)
  base04: '#37474F', // foreground / variables
  base05: '#90A4AE',
  base06: '#525252',
  base07: '#08bdba',
  base08: '#ff7eb6',
  base09: '#ee5396',
  base10: '#FF6F00',
  base11: '#0f62fe',
  base12: '#673AB7',
  base13: '#42be65',
  base14: '#be95ff',
  base15: '#FFAB91',
}

type OxocarbonPalette = typeof dark

// --- Shared scope mapping (highlight group → TextMate scopes) -----------------
function buildTheme(
  name: string,
  type: 'dark' | 'light',
  p: OxocarbonPalette,
): ShikiTheme {
  return {
    name,
    type,
    colors: {
      'editor.background': p.base00,
      'editor.foreground': p.base04,
    },
    settings: [
      // Default token color (no scope) — Normal fg/bg.
      { settings: { foreground: p.base04, background: p.base00 } },
      // Comment → base03
      {
        scope: ['comment', 'punctuation.definition.comment'],
        settings: { foreground: p.base03 },
      },
      // @variable / @parameter / @field → base04
      {
        scope: ['variable', 'variable.parameter', 'variable.other.object'],
        settings: { foreground: p.base04 },
      },
      // @property → base10
      {
        scope: [
          'variable.other.property',
          'variable.other.member',
          'support.type.property-name',
          'meta.object-literal.key',
        ],
        settings: { foreground: p.base10 },
      },
      // Keyword / Statement / @conditional / @repeat / @include → base09
      {
        scope: [
          'keyword',
          'keyword.control',
          'storage.type',
          'storage.modifier',
          'variable.language',
        ],
        settings: { foreground: p.base09 },
      },
      // @keyword.operator / @keyword.function / @punctuation → base08
      {
        scope: [
          'keyword.operator',
          'punctuation.separator',
          'punctuation.terminator',
          'punctuation.section',
          'meta.brace',
          'punctuation.definition.parameters',
        ],
        settings: { foreground: p.base08 },
      },
      // @function → base12
      {
        scope: [
          'entity.name.function',
          'support.function',
          'meta.function-call',
        ],
        settings: { foreground: p.base12 },
      },
      // @method / @namespace / @function.macro / @constant.builtin → base07
      {
        scope: [
          'entity.name.namespace',
          'entity.name.function.macro',
          'support.constant',
          'entity.name.type.module',
        ],
        settings: { foreground: p.base07 },
      },
      // String / @constant → base14
      {
        scope: [
          'string',
          'punctuation.definition.string',
          'constant.other',
          'variable.other.constant',
          'markup.underline.link',
        ],
        settings: { foreground: p.base14 },
      },
      // @string.escape / @label / @symbol / @tag.attribute → base15
      {
        scope: [
          'constant.character.escape',
          'entity.name.label',
          'entity.other.attribute-name',
          'constant.other.symbol',
        ],
        settings: { foreground: p.base15 },
      },
      // @string.regex → base07
      { scope: ['string.regexp'], settings: { foreground: p.base07 } },
      // @number / Boolean / Type → base09
      {
        scope: [
          'constant.numeric',
          'constant.language',
          'entity.name.type',
          'support.type',
          'entity.other.inherited-class',
        ],
        settings: { foreground: p.base09 },
      },
      // @tag → base09
      { scope: ['entity.name.tag'], settings: { foreground: p.base09 } },
      // @error / invalid → base11
      { scope: ['invalid', 'invalid.illegal'], settings: { foreground: p.base11 } },
      // Todo-style accents → base13
      {
        scope: ['keyword.codetag', 'comment.todo'],
        settings: { foreground: p.base13 },
      },
      // Markup (markdown inside code blocks): @text.title → base10, bold/italic
      {
        scope: ['markup.heading', 'entity.name.section'],
        settings: { foreground: p.base10, fontStyle: 'bold' },
      },
      { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
      { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
      { scope: ['markup.inserted'], settings: { foreground: p.base13 } },
      { scope: ['markup.deleted'], settings: { foreground: p.base10 } },
    ],
  }
}

// --- Exports ------------------------------------------------------------------

/** Dark mode — oxocarbon.nvim dark palette. */
export const oxocarbonDark = buildTheme('oxocarbon-dark', 'dark', dark)

/** Light mode — oxocarbon.nvim light palette. */
export const oxocarbonLight = buildTheme('oxocarbon-light', 'light', light)

/** Paper/print mode — vendored oxocarbon-vscode PRINT theme (grayscale ink). */
export const oxocarbonPaper = oxocarbonPaperJson as unknown as ShikiTheme
