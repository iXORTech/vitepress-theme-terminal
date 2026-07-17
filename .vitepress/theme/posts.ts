// =============================================================================
// posts.ts — post & series aggregation helpers (POST-001 / POST-002)
// =============================================================================
// Framework-free helpers shared by the data loaders (`posts.data.mts`,
// `series.data.mts`), the dynamic-route path loaders
// (`src/tags/[name].paths.mjs`, `src/categories/[name].paths.mjs`,
// `src/page/[num].paths.mjs`), and the listing components. No vue/vitepress
// imports, so it is safe to import from both build-time Node loaders and
// client components.
//
// A "post" is a Markdown page under `src/posts/`; a "series article" is one
// under `src/series/<series-name>/` (POST-002 — its `series` field carries the
// series slug). Each declares its taxonomy in frontmatter — `tags` and
// `categories` (string or string[]) — plus a `date` and optional
// `description`/`cover` (POST-003)/`order`. Whether series articles join the
// general listings is decided per surface by the `themeConfig.series` toggles
// (filterListablePosts); series landing pages (`series/<name>/index.md`) are
// navigational and never aggregated.
//
// Displayed frontmatter fields (`title`, `description`) may be per-language
// maps (ARCH-003, design-language.md §9); entries keep them as LocalizableText
// and the listing components resolve them against the active UI language.

import { asLocalizableText, resolveLocalizedText } from './locales'
import type { LocalizableText } from './locales'
import type { TerminalSeriesConfig } from './config'

/** Raw entry shape produced by VitePress `createContentLoader`. */
export interface RawContentEntry {
  url: string
  frontmatter: Record<string, unknown>
  excerpt?: string
}

/** A normalized post used by every listing surface. */
export interface PostEntry {
  /** Site-absolute URL, e.g. `/posts/hello`. */
  url: string
  /** Display title (frontmatter `title`, else the URL slug), localizable (ARCH-003). */
  title: LocalizableText
  /** Frontmatter `date` as an ISO string (empty when absent/invalid). */
  date: string
  /** Sort key used by both date sorting and archive grouping. */
  timestamp: number
  /** Short description/excerpt for post cards, localizable (ARCH-003). */
  excerpt: LocalizableText
  /** Declared tags (normalized to a string[]). */
  tags: string[]
  /** Declared categories (normalized to a string[]). */
  categories: string[]
  /** Cover image URL from frontmatter `cover` (POST-003; empty when unset). */
  cover: string
  /** Series slug for `src/series/<slug>/` articles; empty for regular posts. */
  series: string
  /** Sibling sort key inside a series (POST-002; default 0, smaller = higher). */
  order: number
}

/** Coerce a frontmatter value that may be a string, a list, or absent. */
export function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean)
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? [trimmed] : []
  }
  return []
}

/** Parse a frontmatter date into a millisecond timestamp (NaN when unusable). */
function toTimestamp(raw: unknown): number {
  if (raw == null || raw === '') return Number.NaN
  if (raw instanceof Date) return raw.getTime()
  if (typeof raw === 'number') return raw
  const value = String(raw).trim()
  // A bare `YYYY-MM-DD` is interpreted as UTC (matching ArticleLicense.vue), so
  // sorting is stable regardless of the build machine's timezone.
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value
  const time = new Date(normalized).getTime()
  return Number.isNaN(time) ? Number.NaN : time
}

/**
 * Coerce a frontmatter/YAML `order` value to a finite number (POST-002).
 * Any finite number — negative and fractional included — is valid; anything
 * else (missing, non-numeric, `NaN`, `±Infinity`) falls back to the default 0.
 */
export function toOrder(raw: unknown): number {
  const value =
    typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : Number.NaN
  return Number.isFinite(value) ? value : 0
}

/** The slug used in `/tags/<slug>` and `/categories/<slug>` URLs. */
export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9一-鿿-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Localized display label for a taxonomy term (I18N-008). `labels` is the
 * `themeConfig.taxonomy.tags`/`.categories` map keyed by authored term name;
 * a key matches its term case-insensitively through the shared slug (so
 * `Guides` and `guides` share one entry). Display-only — slugs, URLs, and
 * grouping identity always use the authored term; no entry = verbatim term.
 */
export function termLabel(
  term: string,
  labels: Record<string, LocalizableText> | undefined,
  language: string,
): string {
  if (!labels) return term
  const slug = slugify(term)
  const key = Object.keys(labels).find(
    (candidate) => candidate === term || slugify(candidate) === slug,
  )
  return (
    (key !== undefined && resolveLocalizedText(labels[key], language)) || term
  )
}

/** A taxonomy term paired with the posts that carry it. */
export interface TermGroup {
  /** Original display name (first spelling encountered for the slug). */
  name: string
  /** URL slug. */
  slug: string
  /** Posts carrying this term, newest first. */
  posts: PostEntry[]
}

/** The series slug of a `/series/<slug>/…` URL ('' for anything else). */
function seriesSlugOf(url: string): string {
  return /^\/series\/([^/]+)\//.exec(url)?.[1] ?? ''
}

/** Whether a URL is a series landing page (`series/<slug>/index.md`). */
function isSeriesLanding(url: string): boolean {
  return /^\/series\/[^/]+\/$/.test(url)
}

/** Normalize + date-sort (newest first) the loader's raw output into posts. */
export function normalizePosts(raw: RawContentEntry[]): PostEntry[] {
  return raw
    // Series landing pages are navigational, not articles (POST-002).
    .filter((entry) => !isSeriesLanding(entry.url))
    .map((entry): PostEntry => {
      const fm = entry.frontmatter ?? {}
      const timestamp = toTimestamp(fm.date)
      const slug = entry.url.replace(/\/$/, '').split('/').pop() ?? entry.url
      const title = asLocalizableText(fm.title)
      return {
        url: entry.url,
        title: (typeof title === 'string' && !title.trim() ? undefined : title) ?? slug,
        date: Number.isNaN(timestamp) ? '' : new Date(timestamp).toISOString(),
        timestamp: Number.isNaN(timestamp) ? 0 : timestamp,
        excerpt: asLocalizableText(fm.description) || entry.excerpt || '',
        tags: toStringList(fm.tags),
        categories: toStringList(fm.categories),
        cover: typeof fm.cover === 'string' ? fm.cover.trim() : '',
        series: seriesSlugOf(entry.url),
        order: toOrder(fm.order),
      }
    })
    .sort((a, b) => b.timestamp - a.timestamp)
}

// -----------------------------------------------------------------------------
// Series (POST-002)
// -----------------------------------------------------------------------------

/**
 * One series' metadata from its `src/series/<slug>/series.yml`
 * (content-architecture.md §5), loaded by `series.data.mts`. Icon, title, and
 * description are LocalizableText (a plain string or a per-language map).
 */
export interface SeriesEntry {
  /** The series folder name — its identity and URL segment. */
  slug: string
  /** Site-absolute landing URL, `/series/<slug>/`. */
  url: string
  /** Icon class list — Font Awesome or a Nerd Font `nf-*` class ('' = none). */
  icon: LocalizableText
  /** Display title; falls back to the folder name. */
  title: LocalizableText
  /** Short description shown on the series index and article banner. */
  description: LocalizableText
  /** Sort key on the series index (default 0, smaller = higher). */
  order: number
}

/** Series index order: `order` ascending, ties alphabetical by slug. */
export function compareSeries(a: SeriesEntry, b: SeriesEntry): number {
  return a.order - b.order || a.slug.localeCompare(b.slug)
}

/**
 * The localized display title of a series for the active language — the
 * `series.yml` title resolved against `language`, falling back to the slug.
 * Shared by the listing surfaces that name a series next to an article
 * (post-card chip/title prefix, archives rows, series banner).
 */
export function seriesDisplayTitle(
  series: SeriesEntry[],
  slug: string,
  language: string,
): string {
  const entry = series.find((candidate) => candidate.slug === slug)
  return (entry && resolveLocalizedText(entry.title, language)) || slug
}

/**
 * The articles of one series in reading order: `order` ascending (default 0,
 * smaller = higher), ties falling back to alphabetical by URL — deterministic
 * and language-independent.
 */
export function seriesArticles(posts: PostEntry[], slug: string): PostEntry[] {
  return posts
    .filter((post) => post.series === slug)
    .sort((a, b) => a.order - b.order || a.url.localeCompare(b.url))
}

/** A general post-listing surface gated by the series toggles (POST-002). */
export type ListingSurface = 'posts' | 'archives' | 'categories' | 'tags'

const SURFACE_TOGGLE: Record<ListingSurface, keyof TerminalSeriesConfig> = {
  posts: 'inPosts',
  archives: 'inArchives',
  categories: 'inCategories',
  tags: 'inTags',
}

/**
 * Filter a post list for one general listing surface: regular posts always
 * pass; series articles pass only when the surface's `themeConfig.series`
 * toggle opts them in. Shared by the listing components and the build-time
 * dynamic-route loaders so generated routes match what is displayed.
 */
export function filterListablePosts(
  posts: PostEntry[],
  series: Required<TerminalSeriesConfig>,
  surface: ListingSurface,
): PostEntry[] {
  if (series[SURFACE_TOGGLE[surface]]) return posts
  return posts.filter((post) => !post.series)
}

/** Group posts by one taxonomy field, sorted by descending post count. */
function groupBy(
  posts: PostEntry[],
  field: 'tags' | 'categories',
): TermGroup[] {
  const groups = new Map<string, TermGroup>()
  for (const post of posts) {
    for (const term of post[field]) {
      const slug = slugify(term)
      if (!slug) continue
      const existing = groups.get(slug)
      if (existing) existing.posts.push(post)
      else groups.set(slug, { name: term, slug, posts: [post] })
    }
  }
  return [...groups.values()].sort(
    (a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name),
  )
}

/** All tag groups (term → its posts), most-used first. */
export function groupByTag(posts: PostEntry[]): TermGroup[] {
  return groupBy(posts, 'tags')
}

/** All category groups (term → its posts), most-used first. */
export function groupByCategory(posts: PostEntry[]): TermGroup[] {
  return groupBy(posts, 'categories')
}

/** Posts per page for the post index and its `/page/<n>` pagination. */
export const POSTS_PER_PAGE = 10

/** Total number of index pages for a post set (at least 1). */
export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE))
}
