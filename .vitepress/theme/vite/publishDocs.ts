// =============================================================================
// publishDocs.ts — publish the user documentation as site content (DOC-009/010)
// =============================================================================
// Node-side. The repository's documentation lives in ONE place: `docs/` at the
// repository root (DOC-009). That directory is the documentation home for
// readers and agents alike — but VitePress can only serve pages from `srcDir`,
// and not every document belongs on the public site.
//
// So the site's copy is *generated*: this module mirrors the user-facing part
// of `docs/` into `src/docs/` (git-ignored, never edited by hand), leaving the
// agent-facing part behind (DOC-010):
//
//   docs/index.md          → published   the documentation index
//   docs/guide/            → published   task-oriented user guide
//   docs/configuration/    → published   configuration reference
//   docs/design/           → NOT published — binding decision records, written
//                            for agents and contributors, kept in the repo
//   AGENTS.md, .agent/*    → never were site content
//
// Links are the subtle part. In the source, documents link each other — and the
// repository's own files — with plain relative paths, so they work in an editor
// and on the repository host. A published page cannot: half of those targets
// are not on the site. The mirror therefore REWRITES any link that resolves
// outside the published set into a repository URL, so a site reader following
// "see the design record" lands on the real document instead of a 404. Source
// files stay untouched and repository-relative.
//
// The mirror runs from `.vitepress/config.mts` at config load — before
// VitePress discovers pages, in dev and build alike — and again on every change
// while the dev server is running (see `docsPublishPlugin`).

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, posix, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// -----------------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------------

const THEME_DIR = dirname(dirname(fileURLToPath(import.meta.url))) // .vitepress/theme
const ROOT = resolve(THEME_DIR, '../..')

/** The documentation home — the single source of truth (DOC-009). */
export const DOCS_DIR = join(ROOT, 'docs')

/** The generated copy VitePress serves, at `/docs/`. Git-ignored. */
export const PUBLISHED_DIR = join(ROOT, 'src', 'docs')

/**
 * What the site publishes, relative to `docs/`. Everything else in `docs/` is
 * repository-internal (DOC-010) — today that is `design/`.
 */
const PUBLISHED_ENTRIES = ['index.md', 'guide', 'configuration']

/** Where a link that is not published should point instead. */
const REPO_BLOB_URL =
  'https://github.com/iXORTech/vitepress-theme-terminal/blob/main/'

/** Marker inserted into every generated file, after its frontmatter. */
const GENERATED_MARKER =
  '<!-- GENERATED FILE — do not edit. Source: docs/%s (see theme/vite/publishDocs.ts). -->'

// -----------------------------------------------------------------------------
// Link rewriting
// -----------------------------------------------------------------------------

/** Is this path (relative to `docs/`) part of the published set? */
function isPublished(docsRelativePath: string): boolean {
  return PUBLISHED_ENTRIES.some(
    (entry) => docsRelativePath === entry || docsRelativePath.startsWith(`${entry}/`),
  )
}

/** Links the rewriter must leave alone: external, protocol-relative, absolute. */
function isExternalTarget(target: string): boolean {
  return /^([a-z][a-z0-9+.-]*:|\/\/|\/|#)/i.test(target)
}

/**
 * Rewrite one link target found in `sourceFile` (a path relative to `docs/`).
 * Targets inside the published set keep their relative form — they resolve the
 * same way on the site. Anything else becomes a repository URL.
 */
function rewriteTarget(target: string, sourceFile: string): string {
  if (isExternalTarget(target)) return target

  const [path, anchor = ''] = target.split(/(?=#)/, 2)
  // Resolve against the source file's directory, as a `docs/`-relative path.
  const fromDocs = posix.normalize(posix.join(posix.dirname(sourceFile), path))

  // Still inside `docs/` and published → keep the relative link.
  if (!fromDocs.startsWith('../') && isPublished(fromDocs)) return target

  // Outside the published set: point at the repository. `docs/`-relative paths
  // that climbed out of `docs/` (`../AGENTS.md`) are already repo-relative.
  const fromRepo = fromDocs.startsWith('../')
    ? fromDocs.replace(/^(\.\.\/)+/, '')
    : posix.join('docs', fromDocs)
  return `${REPO_BLOB_URL}${fromRepo}${anchor}`
}

/**
 * Rewrite every markdown link in a document, skipping code: fenced blocks and
 * inline code spans are shown to the reader verbatim (the docs contain sample
 * links like `[x](./other.md)`), so they must not be touched.
 */
function rewriteLinks(source: string, sourceFile: string): string {
  const lines = source.split('\n')
  let fence: number | null = null

  return lines
    .map((line) => {
      const fenceMatch = /^\s*(`{3,})/.exec(line)
      if (fenceMatch) {
        const length = fenceMatch[1].length
        if (fence === null) fence = length
        else if (length >= fence) fence = null
        return line
      }
      if (fence !== null) return line

      return line.replace(/\]\(([^)\s]+)\)/g, (match, target: string, offset: number) => {
        // Inside an inline code span (odd number of backticks before it)?
        const backticks = (line.slice(0, offset).match(/`/g) ?? []).length
        if (backticks % 2 === 1) return match
        return `](${rewriteTarget(target, sourceFile)})`
      })
    })
    .join('\n')
}

// -----------------------------------------------------------------------------
// Mirror
// -----------------------------------------------------------------------------

/** Insert the generated-file marker after the frontmatter block, if any. */
function withMarker(content: string, docsRelativePath: string): string {
  const marker = GENERATED_MARKER.replace('%s', docsRelativePath)
  const frontmatter = /^---\n[\s\S]*?\n---\n/.exec(content)
  if (!frontmatter) return `${marker}\n\n${content}`
  const end = frontmatter[0].length
  return `${content.slice(0, end)}${marker}\n${content.slice(end)}`
}

/** Write only when the content actually changed — a no-op run must not touch mtimes. */
function writeIfChanged(file: string, content: string): boolean {
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return false
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
  return true
}

/** Collect every file below `dir`, as paths relative to `DOCS_DIR`. */
function collect(dir: string, docsRelativeDir: string, into: string[]): void {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const rel = docsRelativeDir ? posix.join(docsRelativeDir, entry) : entry
    if (statSync(full).isDirectory()) collect(full, rel, into)
    else into.push(rel)
  }
}

/**
 * Mirror the published part of `docs/` into `src/docs/`. Returns the number of
 * files written, so the dev-server watcher can stay quiet when nothing changed.
 */
export function publishDocs(): number {
  const files: string[] = []
  for (const entry of PUBLISHED_ENTRIES) {
    const full = join(DOCS_DIR, entry)
    if (!existsSync(full)) continue
    if (statSync(full).isDirectory()) collect(full, entry, files)
    else files.push(entry)
  }

  let written = 0
  for (const file of files) {
    const source = readFileSync(join(DOCS_DIR, file), 'utf8')
    const content = file.endsWith('.md')
      ? withMarker(rewriteLinks(source, file), file)
      : source
    if (writeIfChanged(join(PUBLISHED_DIR, file), content)) written++
  }

  // Drop anything left over from a previous run (a renamed or deleted doc).
  if (existsSync(PUBLISHED_DIR)) {
    const published: string[] = []
    collect(PUBLISHED_DIR, '', published)
    for (const stale of published.filter((file) => !files.includes(file))) {
      rmSync(join(PUBLISHED_DIR, stale))
      written++
    }
  }

  return written
}

// -----------------------------------------------------------------------------
// Dev server integration
// -----------------------------------------------------------------------------

/**
 * Keep the published copy in sync while `pnpm dev` runs: `docs/` sits outside
 * `srcDir`, so Vite does not watch it on its own. Editing a document re-runs
 * the mirror, which rewrites the file inside `srcDir` and lets VitePress's own
 * hot update take it from there. (Adding or removing a page still needs a
 * restart — that changes the route table, which is resolved at startup.)
 */
export function docsPublishPlugin() {
  return {
    name: 'ct-publish-docs',
    apply: 'serve' as const,
    configureServer(server: {
      watcher: { add: (path: string) => void; on: (event: string, cb: (file: string) => void) => void }
    }) {
      server.watcher.add(DOCS_DIR)
      const sync = (file: string) => {
        if (file.startsWith(DOCS_DIR)) publishDocs()
      }
      for (const event of ['add', 'change', 'unlink']) server.watcher.on(event, sync)
    },
  }
}
