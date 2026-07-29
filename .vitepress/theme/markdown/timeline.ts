// =============================================================================
// timeline.ts — chronological timeline entries (MD-006)
// =============================================================================
// Node-side markdown setup. Registers a `::: timeline <label>` container that
// renders ONE entry of a vertical timeline:
//
//   ::: timeline 2021-01-10
//   The site was founded, on VuePress.
//   :::
//
//   ::: timeline 2025-07-04
//   Rebuilt on **VitePress Theme Terminal**.
//   :::
//
// Each entry emits its own `<div class="ct-timeline">`; the rail and node are
// drawn in CSS (styles/_timeline.scss) on the entry itself, so a run of
// adjacent containers reads as one continuous rail without the author having
// to wrap them in an outer container. That keeps the source shape identical to
// the plain callout containers — one `:::` block per entry, no nesting.
//
// The label is authored text (a date, a version, a milestone name), so it is
// never locale-derived: unlike a callout title there is no default to
// translate, and the client has nothing to re-localize. It is rendered as
// inline Markdown so a label can carry emphasis or a link.

import container from 'markdown-it-container'

// Minimal structural typing for the markdown-it instance — see callouts.ts for
// why markdown-it's own types are not resolvable from the project root.
interface MarkdownItLike {
  use: (plugin: unknown, ...params: unknown[]) => MarkdownItLike
  renderInline: (src: string, env?: unknown) => string
}
interface ContainerToken {
  nesting: number
  info: string
}

/** Wire the `::: timeline <label>` container. */
export function timelinePlugin(md: MarkdownItLike): void {
  md.use(container, 'timeline', {
    render: (
      tokens: ContainerToken[],
      idx: number,
      _options: unknown,
      env: { references?: unknown },
    ): string => {
      const token = tokens[idx]
      if (token.nesting !== 1) return '</div>\n</div>\n'

      // Everything after the container name is the entry label; an entry
      // without one still renders (node + body, no label row).
      const label = token.info.trim().replace(/^timeline\s*/, '').trim()
      const heading = label
        ? `<div class="ct-timeline__label">${md.renderInline(label, env)}</div>\n`
        : ''

      // The node marker is a presentational element, not a text node: it must
      // stay out of copied selections and out of the accessibility tree, which
      // reads the label and the body instead.
      return (
        '<div class="ct-timeline">\n' +
        '<span class="ct-timeline__node" aria-hidden="true"></span>\n' +
        heading +
        '<div class="ct-timeline__body">\n'
      )
    },
  })
}
