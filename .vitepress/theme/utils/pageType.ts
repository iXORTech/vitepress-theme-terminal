// =============================================================================
// pageType.ts — page-type resolution (ARCH-001)
// =============================================================================
// The theme classifies every page into exactly one *type* from its location
// under `src/` plus a little frontmatter, and `Layout.vue` renders a dedicated
// component per type (theme/pages/*Page.vue). This is the single dispatch point
// described in docs/design/content-architecture.md §3–4 — it replaces the ad-hoc
// home placeholder + `isArticle` branching that used to live in Layout.vue.
//
// Framework-free (only a `PageData`-shaped argument), so it can be unit-reasoned
// about without a Vue/VitePress runtime.

/** The six page types (content-architecture.md §3). */
export type PageType =
  | 'home'
  | 'normal'
  | 'post'
  | 'series'
  | 'listing'
  | 'notFound'

const PAGE_TYPES: readonly PageType[] = [
  'home',
  'normal',
  'post',
  'series',
  'listing',
  'notFound',
]

// Fixed listing pages that sit directly in `src/` (content-architecture.md §2).
const LISTING_FILES = new Set([
  'posts.md',
  'archives.md',
  'categories.md',
  'tags.md',
  'series.md',
])

// Dynamic-route namespaces whose generated pages are listings, e.g.
// `categories/foo.md`, `tags/bar.md`, `page/2.md`.
const LISTING_PREFIXES = ['categories/', 'tags/', 'page/']

function isListingPath(relativePath: string): boolean {
  if (LISTING_FILES.has(relativePath)) return true
  return LISTING_PREFIXES.some((prefix) => relativePath.startsWith(prefix))
}

function isPageType(value: unknown): value is PageType {
  return typeof value === 'string' && (PAGE_TYPES as readonly string[]).includes(value)
}

/** The minimal page/frontmatter shape the resolver needs. */
export interface PageTypeInput {
  relativePath: string
  isNotFound?: boolean
  frontmatter: Record<string, unknown>
}

/**
 * Resolve a page's type. Precedence: not-found → explicit `pageType`
 * frontmatter override → home → listing paths → the `article: false` escape
 * hatch (drops a post to a plain page) → `series/` / `posts/` prefixes →
 * normal (any other top-level `src/` file).
 */
export function resolvePageType({
  relativePath,
  isNotFound,
  frontmatter,
}: PageTypeInput): PageType {
  if (isNotFound) return 'notFound'

  const override = frontmatter.pageType
  if (isPageType(override)) return override

  if (frontmatter.home) return 'home'

  if (isListingPath(relativePath)) return 'listing'

  // `article: false` opts a post/series article out of all article chrome —
  // it then renders as a plain normal page (content-architecture.md §3).
  if (frontmatter.article === false) return 'normal'

  if (relativePath.startsWith('series/')) return 'series'
  if (relativePath.startsWith('posts/')) return 'post'

  return 'normal'
}
