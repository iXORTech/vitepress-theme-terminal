// =============================================================================
// useTaxonomy.ts — localized taxonomy term labels (I18N-008)
// =============================================================================
// The one way display components turn an authored tag/category name into its
// displayed label: `themeConfig.taxonomy` supplies per-term LocalizableText
// maps, resolved against the active UI language; terms without an entry render
// verbatim. Shared by the post byline/cards (PostTaxonomy), the tag & category
// indexes, and the per-term listing headings (TermPosts). Slugs/URLs are never
// affected — they stay derived from the authored term (posts.ts).

import { termLabel } from '../posts'
import { useThemeConfig } from './useThemeConfig'
import { useThemeLocale } from './useThemeLocale'

/** Label resolvers for the two taxonomies, following the active language. */
export function useTaxonomy(): {
  tagLabel: (term: string) => string
  categoryLabel: (term: string) => string
} {
  const config = useThemeConfig()
  const { language } = useThemeLocale()

  return {
    tagLabel: (term) =>
      termLabel(term, config.value.taxonomy.tags, language.value),
    categoryLabel: (term) =>
      termLabel(term, config.value.taxonomy.categories, language.value),
  }
}
