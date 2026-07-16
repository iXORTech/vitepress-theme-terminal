// =============================================================================
// pageData.ts — build-time page-data normalization (ARCH-003)
// =============================================================================
// Node-side, wired as `transformPageData` in `.vitepress/config.mts`.
// Displayed frontmatter fields may be per-language maps (design-language.md
// §9, localized frontmatter fields), but VitePress copies frontmatter
// `description` verbatim into `pageData.description` and escapes it into the
// SSR `<meta name="description">` — an object there crashes the build. This
// transformer resolves such maps to the build language's string before
// rendering; the raw map stays in `pageData.frontmatter` for client-side
// re-resolution on a language switch.

import type { PageData } from 'vitepress'
import { asLocalizableText, resolveLocalizedText } from './locales'

/** `transformPageData` hook resolving localized frontmatter for the build language. */
export function createPageDataTransformer(lang: string) {
  return (pageData: PageData): void => {
    if (typeof pageData.description !== 'string') {
      pageData.description =
        resolveLocalizedText(
          asLocalizableText(pageData.frontmatter.description),
          lang,
        ) ?? ''
    }

    // A map `title` makes VitePress fall back to the body h1 (typeof guard in
    // its inferTitle); when a page has no h1 either, resolve the map here so
    // the SSR <title> isn't just the bare site title.
    if (!pageData.title) {
      pageData.title =
        resolveLocalizedText(
          asLocalizableText(pageData.frontmatter.title),
          lang,
        ) ?? ''
    }
  }
}
