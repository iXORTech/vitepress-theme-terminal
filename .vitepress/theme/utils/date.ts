// =============================================================================
// date.ts — deterministic date formatting for listings (POST-001)
// =============================================================================
// The listing surfaces (post cards, archives timeline) format dates in UTC so
// SSR and the first client render agree — no hydration mismatch. The end-of-
// article license card has its own reader-timezone formatter (COMP-003/005);
// this one stays deliberately instant-stable.

/** Format an ISO date string as a localized `long` date in UTC (empty on fail). */
export function formatListDate(iso: string, locale: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/**
 * Normalize a frontmatter date (string / number / `Date`) to an ISO string,
 * treating a bare `YYYY-MM-DD` as UTC. Empty string when unusable. Mirrors the
 * post loader's parsing so header and card dates agree.
 */
export function toIsoDate(raw: unknown): string {
  if (raw == null || raw === '') return ''
  if (raw instanceof Date) {
    return Number.isNaN(raw.getTime()) ? '' : raw.toISOString()
  }
  if (typeof raw === 'number') {
    const date = new Date(raw)
    return Number.isNaN(date.getTime()) ? '' : date.toISOString()
  }
  const value = String(raw).trim()
  if (!value) return ''
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

/** The UTC calendar year of an ISO date string (0 when unusable). */
export function yearOf(iso: string): number {
  if (!iso) return 0
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? 0 : date.getUTCFullYear()
}
