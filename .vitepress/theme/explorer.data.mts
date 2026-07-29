// =============================================================================
// explorer.data.mts — build-time source-tree metadata for the explorer
// (PERF-001; feeds THEME-012 discovery, ARCH-001/002/004, I18N-006)
// =============================================================================
// A VitePress data loader (the `*.data.*` convention, like `posts.data.mts` and
// `series.data.mts`): it walks every Markdown file under `src/` at build time
// and exposes only the handful of fields the explorer tree needs — the source
// path, the localized label, a title fallback, and the sibling order.
//
// Why a loader and not `import.meta.glob('src/**/*.md')`: globbing the Markdown
// modules pulls the *page modules* into the shared theme chunk. Asking for the
// `__pageData` export alone does not help — the bundler keeps the rest of each
// module, so every visitor downloaded the rendered HTML of the entire site on
// the first page view (947 kB of shared theme chunk, and the >500 kB Rolldown
// warning that came with it). A loader runs in Node and serializes just this
// metadata, so the payload is a few kB of JSON.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineLoader } from 'vitepress'
import { load as parseYaml } from 'js-yaml'
import { asLocalizableText } from './locales'
import type { LocalizableText } from './locales'

/** One discoverable source page, reduced to what the explorer tree reads. */
export interface ExplorerPageEntry {
  /** Source path relative to `srcDir`, e.g. `demo/advanced/index.md`. */
  relativePath: string
  /**
   * The configured label: `explorerTitle` frontmatter, else `title`
   * frontmatter — validated as LocalizableText so a malformed map degrades to
   * the fallback rather than rendering an object (ARCH-003 / I18N-006).
   */
  label?: LocalizableText
  /** Fallback label: the page's first `#` heading (VitePress's own inference). */
  title: string
  /** Sibling order from frontmatter, when finite (ARCH-004). */
  order?: number
}

declare const data: ExplorerPageEntry[]
export { data }

// `srcDir` — this file sits at `.vitepress/theme/`, so `src/` is two levels up.
const SRC_DIR = path.resolve(fileURLToPath(import.meta.url), '../../../src')

const FRONTMATTER_BLOCK = /^---\r?\n([\s\S]*?)\r?\n---/

/** The YAML frontmatter of a Markdown file, or `{}` when absent/malformed. */
function readFrontmatter(markdown: string): Record<string, unknown> {
  const block = FRONTMATTER_BLOCK.exec(markdown)
  if (!block) return {}

  // A YAML syntax error must not break the whole build — the page then just
  // falls back to its heading/URL label, as an unannotated page would.
  let raw: unknown
  try {
    raw = parseYaml(block[1])
  } catch {
    raw = undefined
  }
  return raw && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : {}
}

/** Inline Markdown removed, so a decorated heading still reads as a label. */
function stripInline(text: string): string {
  return text
    .replace(/\{#[^}]*\}/g, '') // explicit heading id (`## Title {#anchor}`)
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links and images
    .replace(/`([^`]*)`/g, '$1') // inline code
    .replace(/[*_~]/g, '') // emphasis markers
    .trim()
}

/**
 * The page's first `#` heading — VitePress's own title fallback when no
 * frontmatter `title` is set. Fenced code is skipped so a `# comment` line
 * inside a sample block cannot become the label.
 */
function inferTitle(markdown: string): string {
  let fence: string | null = null
  for (const line of markdown.split(/\r?\n/)) {
    const fenceMarker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)
    if (fenceMarker) {
      const marker = fenceMarker[1][0]
      if (fence === null) fence = marker
      else if (fence === marker) fence = null
      continue
    }
    if (fence !== null) continue

    const heading = /^#\s+(.+?)\s*#*\s*$/.exec(line)
    if (heading) return stripInline(heading[1])
  }
  return ''
}

// Same rule as `useExplorer`'s `explorer.json` order (ARCH-004): a value counts
// only when it is a finite number, so `NaN`/strings keep the default `0`.
function toFiniteOrder(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

export default defineLoader({
  // Watch globs resolve relative to this file — `src/` is two levels up.
  // `src/docs/` is part of the tree: it is generated before VitePress starts
  // (DOC-009, `theme/vite/publishDocs.ts`) and re-mirrored on change in dev.
  watch: ['../../src/**/*.md'],
  load(files: string[]): ExplorerPageEntry[] {
    const entries: ExplorerPageEntry[] = []

    for (const file of files) {
      const relativePath = path
        .relative(SRC_DIR, file)
        .split(path.sep)
        .join('/')

      // Skip dynamic-route source templates (e.g. `tags/[name].md`,
      // `page/[num].md`) — only their generated pages are real routes, and
      // those are listing routes, not file-tree entries (ARCH-001) — and the
      // not-found page, which is not a tree entry either.
      if (relativePath.includes('[') || relativePath === '404.md') continue

      const markdown = fs.readFileSync(file, 'utf-8')
      const frontmatter = readFrontmatter(markdown)

      // A page can opt itself out of the tree (ARCH-002). Hiding a folder's
      // `index.md` drops just the folder's link — visible children keep the
      // folder itself alive, now link-less.
      if (frontmatter.showInExplorer === false) continue

      const label =
        asLocalizableText(frontmatter.explorerTitle) ??
        asLocalizableText(frontmatter.title)
      const order = toFiniteOrder(frontmatter.order)

      entries.push({
        relativePath,
        ...(label !== undefined ? { label } : {}),
        // Only ever read when `label` is absent, so a frontmatter title never
        // needs to be repeated here.
        title: inferTitle(markdown),
        ...(order !== undefined ? { order } : {}),
      })
    }

    return entries.sort((left, right) =>
      left.relativePath.localeCompare(right.relativePath),
    )
  },
})
