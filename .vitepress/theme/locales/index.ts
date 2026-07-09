// =============================================================================
// locales/index.ts — locale registry & string resolution (I18N-001/003)
// =============================================================================
// Framework-free (pure data + functions). The UI language is a CLIENT-SIDE
// preference — no `/<lang>/` URL trees (design-language.md §9). Resolution
// order for every string:
//   1. built-in English (complete by definition),
//   2. the built-in table matching the active UI language,
//   3. the site's `themeConfig.localeStrings[tag]` overrides (per-language
//      map) — a complete entry under a new tag adds a whole language.
// Components access the result through the useThemeLocale() composable and
// therefore never contain literal UI strings; adding a locale means adding a
// data file here and registering it — no component edits.

import { en } from './en'
import type { ThemeLocaleKey, ThemeLocaleStrings } from './en'
import { zhHans } from './zh-Hans'

export type { ThemeLocaleKey, ThemeLocaleStrings }

/** Per-language string overrides from `themeConfig.localeStrings`. */
export type LocaleOverrides = Record<string, Partial<ThemeLocaleStrings>>

/**
 * A user-facing text value in the config surface (I18N-004): a plain string
 * used for every language, or a per-language map keyed by BCP 47 tag. THE
 * pattern for all configurable text (design-language.md §9).
 */
export type LocalizableText = string | Record<string, string>

/** A language offered by the switcher. */
export interface ThemeLanguage {
  /** BCP 47 tag (`en`, `zh-Hans`, …). */
  tag: string
  /** Self-described display name (the table's `lang.label`). */
  label: string
}

// -----------------------------------------------------------------------------
// Registry — keys are BCP 47 tags, matched case-insensitively. Tag rule
// (I18N-005): the minimal canonical tag — language subtag plus a script
// subtag only where the script disambiguates (`zh-Hans`), never a region
// (English's suppressed script Latn makes it bare `en`).
// -----------------------------------------------------------------------------
export const builtInLocales: Record<string, ThemeLocaleStrings> = {
  en,
  'zh-Hans': zhHans,
}

// -----------------------------------------------------------------------------
// Resolution
// -----------------------------------------------------------------------------

/** Case-insensitive exact-tag lookup in a record of tag-keyed tables. */
function findTag<T>(record: Record<string, T>, tag: string): T | undefined {
  const wanted = tag.toLowerCase()
  const match = Object.keys(record).find((key) => key.toLowerCase() === wanted)
  return match === undefined ? undefined : record[match]
}

/**
 * Pick the built-in table for a language tag: exact match first
 * (case-insensitive), then primary-subtag match (`zh-CN` → `zh-Hans`),
 * falling back to English.
 */
function matchBuiltInLocale(tag: string): ThemeLocaleStrings {
  const exact = findTag(builtInLocales, tag)
  if (exact) return exact

  const primary = tag.toLowerCase().split('-')[0]
  const partial = Object.keys(builtInLocales).find(
    (key) => key.toLowerCase().split('-')[0] === primary,
  )
  if (partial) return builtInLocales[partial]

  return en
}

/**
 * Full string table for a language tag, with the site's per-language
 * overrides applied on top. English backfills any missing key.
 */
export function resolveLocaleStrings(
  tag: string,
  overrides?: LocaleOverrides,
): ThemeLocaleStrings {
  return {
    ...en,
    ...matchBuiltInLocale(tag),
    ...(overrides ? findTag(overrides, tag) : undefined),
  }
}

/**
 * Canonical available tag for any language tag: exact match (case-insensitive)
 * against built-ins and override-added languages, then primary subtag, then
 * `en`. Keeps the active-language state aligned with switcher entries (e.g.
 * a site `lang` of `en-US` resolves to the `en` table's tag).
 */
export function matchLanguageTag(tag: string, overrides?: LocaleOverrides): string {
  const known = availableLanguages(overrides).map((language) => language.tag)
  const wanted = tag.toLowerCase()

  const exact = known.find((candidate) => candidate.toLowerCase() === wanted)
  if (exact) return exact

  const primary = wanted.split('-')[0]
  const partial = known.find(
    (candidate) => candidate.toLowerCase().split('-')[0] === primary,
  )
  return partial ?? 'en'
}

/**
 * Resolve a {@link LocalizableText} for a language tag: plain strings pass
 * through; maps resolve exact tag (case-insensitive) → primary subtag →
 * `en` → first entry. `undefined` stays `undefined` so callers can fall back
 * (e.g. to the site config's `title`).
 */
export function resolveLocalizedText(
  text: LocalizableText | undefined,
  tag: string,
): string | undefined {
  if (text === undefined || typeof text === 'string') return text

  const exact = findTag(text, tag)
  if (exact !== undefined) return exact

  const primary = tag.toLowerCase().split('-')[0]
  const partial = Object.keys(text).find(
    (key) => key.toLowerCase().split('-')[0] === primary,
  )
  if (partial !== undefined) return text[partial]

  return findTag(text, 'en') ?? Object.values(text)[0]
}

/**
 * All languages the switcher offers: built-in tables plus any tag added via
 * `localeStrings`, each labeled by its resolved `lang.label` (an override
 * entry without one falls back to its tag).
 */
export function availableLanguages(overrides?: LocaleOverrides): ThemeLanguage[] {
  const tags = [...Object.keys(builtInLocales)]
  for (const tag of Object.keys(overrides ?? {})) {
    if (!findTag(builtInLocales, tag)) tags.push(tag)
  }
  return tags.map((tag) => ({
    tag,
    label:
      (overrides && findTag(overrides, tag)?.['lang.label']) ??
      (findTag(builtInLocales, tag) ?? {})['lang.label'] ??
      tag,
  }))
}
