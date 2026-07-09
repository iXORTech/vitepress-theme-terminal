// =============================================================================
// callouts.ts — TUI-card-style callout containers (MD-002)
// =============================================================================
// Node-side markdown setup. Renders `::: <name>` containers as TUI cards
// (`.ct-callout`, styled in styles/_callouts.scss): a title bar + separator +
// body, colored by the Carbon semantic layer. Types and aliases per the plan:
// info, note (info-colored), tip, warning, danger, caution (danger-colored),
// important, and details (collapsible <details>).
//
// VitePress itself registers info/tip/warning/danger/details — for those we
// override the renderer rules it installed; note/caution/important are
// registered fresh via markdown-it-container.
//
// Titles: a custom title (`::: tip My title`) renders as inline markdown; the
// default title comes from the locale table for the site's default language
// and carries `data-ct-callout-title="<name>"` so the client re-localizes it
// when the UI language switches (useCalloutTitles).

import container from 'markdown-it-container'
import { resolveLocaleStrings } from '../locales'
import type { ThemeLocaleKey } from '../locales'

// Minimal structural typing for the markdown-it instance (markdown-it is a
// transitive dependency; its types are not resolvable from the project root).
interface MarkdownItLike {
  use: (plugin: unknown, ...params: unknown[]) => MarkdownItLike
  renderInline: (src: string, env?: unknown) => string
  renderer: { rules: Record<string, unknown> }
}
type ContainerRender = (
  tokens: { nesting: number; info: string }[],
  idx: number,
  options: unknown,
  env: { references?: unknown },
) => string

// Callout name → color kind (the `--ct-callout-accent` variant in SCSS).
// `note` and `caution` are style aliases of info/danger but keep own titles.
const CALLOUTS: Record<string, string> = {
  info: 'info',
  note: 'info',
  tip: 'tip',
  warning: 'warning',
  danger: 'danger',
  caution: 'danger',
  important: 'important',
  details: 'details',
}

/** Wire all callout containers; `lang` picks the build-time default titles. */
export function calloutsPlugin(md: MarkdownItLike, lang: string): void {
  const strings = resolveLocaleStrings(lang)

  for (const [name, kind] of Object.entries(CALLOUTS)) {
    const render: ContainerRender = (tokens, idx, _options, env) => {
      const token = tokens[idx]
      if (token.nesting !== 1) {
        return name === 'details' ? '</details>\n' : '</div>\n'
      }

      // Custom title (rest of the info line) or localized default.
      const custom = token.info.trim().slice(name.length).trim()
      const title = custom
        ? md.renderInline(custom, { references: env?.references })
        : strings[`callout.${name}` as ThemeLocaleKey]
      const titleAttr = custom ? '' : ` data-ct-callout-title="${name}"`

      if (name === 'details') {
        return (
          `<details class="ct-callout ct-callout--details">` +
          `<summary class="ct-callout__title"${titleAttr}>${title}</summary>\n`
        )
      }
      return (
        `<div class="ct-callout ct-callout--${kind}">` +
        `<p class="ct-callout__title"${titleAttr}>${title}</p>\n`
      )
    }

    if (md.renderer.rules[`container_${name}_open`]) {
      // Built-in VitePress container — replace its renderer with ours.
      md.renderer.rules[`container_${name}_open`] = render
      md.renderer.rules[`container_${name}_close`] = render
    } else {
      md.use(container, name, { render })
    }
  }
}
