// =============================================================================
// algolia.ts — Algolia DocSearch query helper (SEARCH-001/002)
// =============================================================================
// A tiny, dependency-free client for the Algolia search REST endpoint — the
// theme queries a site's DocSearch index directly from the browser (the same
// public search-only key DocSearch itself uses) and renders the hits in its
// own TUI find palette, so no `@docsearch/*` package or its modal is pulled in
// (AGENTS.md §6.9, minimal dependencies).
//
// Framework-free (no vue/vitepress imports): the request is a plain `fetch`.
// Credentials go in the query string and the body uses the CORS-safelisted
// `application/x-www-form-urlencoded` content type, exactly like Algolia's own
// lite client, so the browser skips the CORS preflight.

import type { TerminalAlgoliaConfig } from '../config'

/** One normalized search hit, ready for the results pane (titles/snippets/links). */
export interface SearchResult {
  /** Algolia record id — a stable list key. */
  objectID: string
  /** Best display title: the deepest DocSearch hierarchy level, else content. */
  title: string
  /** Parent hierarchy joined for context (may be empty). */
  breadcrumb: string
  /** A short content snippet around the match (plain text, may be empty). */
  snippet: string
  /** The record's destination URL (absolute, may include an anchor). */
  url: string
}

/** DocSearch's per-record `hierarchy` object (lvl0…lvl6, any may be null). */
type DocSearchHierarchy = Partial<Record<`lvl${0 | 1 | 2 | 3 | 4 | 5 | 6}`, string | null>>

/** The subset of a DocSearch record we read. */
interface DocSearchHit {
  objectID: string
  url?: string
  content?: string | null
  hierarchy?: DocSearchHierarchy
  _snippetResult?: { content?: { value?: string } }
}

const HIERARCHY_LEVELS = [
  'lvl0',
  'lvl1',
  'lvl2',
  'lvl3',
  'lvl4',
  'lvl5',
  'lvl6',
] as const

/** Collect the non-empty hierarchy levels of a record, shallow → deep. */
function hierarchyLevels(hierarchy: DocSearchHierarchy | undefined): string[] {
  if (!hierarchy) return []
  const levels: string[] = []
  for (const key of HIERARCHY_LEVELS) {
    const value = hierarchy[key]
    if (typeof value === 'string' && value.trim()) levels.push(value.trim())
  }
  return levels
}

/** Map a raw DocSearch record to the theme's normalized {@link SearchResult}. */
function toResult(hit: DocSearchHit): SearchResult {
  const levels = hierarchyLevels(hit.hierarchy)
  // Deepest level is the record's own heading; the rest is its breadcrumb.
  const title = levels[levels.length - 1] ?? hit.content?.trim() ?? hit.url ?? ''
  const breadcrumb = levels.slice(0, -1).join(' › ')
  const snippet = (hit._snippetResult?.content?.value ?? hit.content ?? '').trim()
  return {
    objectID: hit.objectID,
    title,
    breadcrumb,
    snippet,
    url: hit.url ?? '',
  }
}

/**
 * Query an Algolia DocSearch index and return normalized hits. Rejects with an
 * `AbortError` when the given signal aborts (the caller debounces and cancels
 * superseded requests); throws on any non-OK HTTP response.
 */
export async function searchAlgolia(
  algolia: TerminalAlgoliaConfig,
  query: string,
  signal?: AbortSignal,
  hitsPerPage = 8,
): Promise<SearchResult[]> {
  const { appId, apiKey, indexName } = algolia

  // Credentials as query params + a form content type keep this a "simple"
  // CORS request (no preflight), matching Algolia's browser lite client.
  const endpoint =
    `https://${appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(indexName)}/query` +
    `?x-algolia-application-id=${encodeURIComponent(appId)}` +
    `&x-algolia-api-key=${encodeURIComponent(apiKey)}`

  // DocSearch snippets: strip highlight markup by using empty tags so the
  // rendered text stays plain (no dangerouslySetInnerHTML in the results pane).
  const params = new URLSearchParams({
    query,
    hitsPerPage: String(hitsPerPage),
    attributesToSnippet: 'content:24',
    highlightPreTag: '',
    highlightPostTag: '',
  })

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: JSON.stringify({ params: params.toString() }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Algolia search failed: ${response.status}`)
  }

  const data = (await response.json()) as { hits?: DocSearchHit[] }
  return (data.hits ?? []).map(toResult).filter((result) => result.url)
}
