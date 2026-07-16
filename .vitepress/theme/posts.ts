// =============================================================================
// posts.ts — post aggregation helpers (POST-001)
// =============================================================================
// Framework-free helpers shared by the post data loader (`posts.data.mts`), the
// dynamic-route path loaders (`src/tags/[name].paths.mjs`,
// `src/categories/[name].paths.mjs`, `src/page/[num].paths.mjs`), and the
// listing components. No vue/vitepress imports, so it is safe to import from
// both build-time Node loaders and client components.
//
// A "post" is a Markdown page under `src/posts/`. Each declares its taxonomy in
// frontmatter — `tags` and `categories` (string or string[]) — plus a `date`
// and optional `description`/`order`. The content architecture
// (docs/design/content-architecture.md) keeps series articles separate; POST-002
// owns whether series posts join these listings, so this module aggregates
// `src/posts/**` only.
//
// Displayed frontmatter fields (`title`, `description`) may be per-language
// maps (ARCH-003, design-language.md §9); entries keep them as LocalizableText
// and the listing components resolve them against the active UI language.

import { asLocalizableText, resolveLocalizedText } from './locales'
import type { LocalizableText } from './locales'

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

/** Normalize + date-sort (newest first) the loader's raw output into posts. */
export function normalizePosts(raw: RawContentEntry[]): PostEntry[] {
  return raw
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
      }
    })
    .sort((a, b) => b.timestamp - a.timestamp)
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
