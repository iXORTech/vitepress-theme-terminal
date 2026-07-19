// =============================================================================
// friends.ts — friend-links data model & merging (PAGE-004)
// =============================================================================
// Framework-free helpers for the friends page (docs/design/friend-links.md).
// The data format is the `blog-friend-links-data-generator` output — an array
// of groups, each with its entries — loaded from `linksData.mjs` modules under
// `.vitepress/theme/assets/` (hand-authored and/or git-submodule-synced).
// Hand-authored files may use LocalizableText maps where generated data has
// plain strings (§4 of the spec); validation runs everything through
// `asLocalizableText()` so malformed input degrades to a skip + console
// warning, never a crash.

import type { LocalizableText } from './locales'
import { asLocalizableText } from './locales'

// -----------------------------------------------------------------------------
// Data shapes (validated form of the external format)
// -----------------------------------------------------------------------------

/** One friend link. `title` and `url` are required by the format. */
export interface FriendLinkEntry {
  title: LocalizableText
  url: string
  description?: LocalizableText
  avatar?: string
  // The generated data also carries a `screenshot` field — reserved, ignored.
}

/** One group of links. `group` is the machine id (grouping/merge key). */
export interface FriendLinkGroup {
  group: string
  groupName?: LocalizableText
  groupDesc?: LocalizableText
  entries: FriendLinkEntry[]
}

/** One discovered data module: its glob path plus its default export. */
export interface FriendLinkSource {
  path: string
  data: unknown
}

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

function warn(message: string): void {
  console.warn(`[theme/friends] ${message}`)
}

/** A non-empty LocalizableText, or undefined (so `''` counts as "not provided"). */
function optionalText(value: unknown): LocalizableText | undefined {
  const text = asLocalizableText(value)
  return text === '' ? undefined : text
}

/** Validate one raw entry; invalid entries are skipped with a warning. */
function parseEntry(value: unknown, path: string): FriendLinkEntry | null {
  if (typeof value !== 'object' || value === null) {
    warn(`skipping non-object entry in ${path}`)
    return null
  }
  const raw = value as Record<string, unknown>
  const title = optionalText(raw.title)
  const url = typeof raw.url === 'string' ? raw.url.trim() : ''
  if (!title || !url) {
    warn(`skipping entry without title/url in ${path}`)
    return null
  }
  const entry: FriendLinkEntry = { title, url }
  const description = optionalText(raw.description)
  if (description) entry.description = description
  if (typeof raw.avatar === 'string' && raw.avatar.trim()) {
    entry.avatar = raw.avatar.trim()
  }
  return entry
}

/** Validate one raw group; a group without a `group` id is skipped. */
function parseGroup(value: unknown, path: string): FriendLinkGroup | null {
  if (typeof value !== 'object' || value === null) {
    warn(`skipping non-object group in ${path}`)
    return null
  }
  const raw = value as Record<string, unknown>
  const id = typeof raw.group === 'string' ? raw.group.trim() : ''
  if (!id) {
    warn(`skipping group without a "group" id in ${path}`)
    return null
  }
  const rawEntries = Array.isArray(raw.entries) ? raw.entries : []
  const group: FriendLinkGroup = {
    group: id,
    entries: rawEntries
      .map((entry) => parseEntry(entry, path))
      .filter((entry): entry is FriendLinkEntry => entry !== null),
  }
  const name = optionalText(raw.groupName)
  if (name) group.groupName = name
  const desc = optionalText(raw.groupDesc)
  if (desc) group.groupDesc = desc
  return group
}

// -----------------------------------------------------------------------------
// Merging
// -----------------------------------------------------------------------------

/** Ordering key: path depth first, then the path itself (spec §3). */
function compareSources(a: FriendLinkSource, b: FriendLinkSource): number {
  const depth = (path: string) => path.split('/').length
  return depth(a.path) - depth(b.path) || a.path.localeCompare(b.path)
}

/**
 * Validate and merge every discovered data module into one deterministic
 * group list (spec §3): sources order by depth then path; groups with the
 * same `group` id merge — the first occurrence fixes the position, the
 * labels come from the first source that provides them, and later sources
 * append their entries. A source whose default export is not an array is
 * skipped with a warning.
 */
export function mergeFriendSources(
  sources: FriendLinkSource[],
): FriendLinkGroup[] {
  const byId = new Map<string, FriendLinkGroup>()
  for (const source of [...sources].sort(compareSources)) {
    if (!Array.isArray(source.data)) {
      warn(`skipping ${source.path} — default export is not an array`)
      continue
    }
    for (const raw of source.data) {
      const group = parseGroup(raw, source.path)
      if (!group) continue
      const existing = byId.get(group.group)
      if (!existing) {
        byId.set(group.group, group)
        continue
      }
      if (!existing.groupName && group.groupName) existing.groupName = group.groupName
      if (!existing.groupDesc && group.groupDesc) existing.groupDesc = group.groupDesc
      existing.entries.push(...group.entries)
    }
  }
  return [...byId.values()]
}
