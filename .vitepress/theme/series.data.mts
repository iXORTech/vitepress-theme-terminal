// =============================================================================
// series.data.mts — build-time series metadata (POST-002)
// =============================================================================
// A VitePress data loader that reads every `src/series/<slug>/series.yml`
// (content-architecture.md §5) and exposes the parsed, sorted series list as
// `data`. Consumed by the series index (SeriesIndex), the series-article
// banner (SeriesArticlePage), and the post cards' series chip (PostList).
//
// Schema (all fields optional): `icon` / `title` / `description` are
// LocalizableText — a plain string or a per-language map, validated by the
// shared `asLocalizableText()` so malformed values degrade to the defaults —
// and `order` is a finite number (default 0, smaller = higher; ties sort
// alphabetically by slug). A series folder without a `series.yml` still works:
// consumers fall back to the folder name (see `SeriesIndex.vue`).
import fs from 'node:fs'
import path from 'node:path'
import { defineLoader } from 'vitepress'
import { load as parseYaml } from 'js-yaml'
import { asLocalizableText } from './locales'
import { compareSeries, toOrder, type SeriesEntry } from './posts'

declare const data: SeriesEntry[]
export { data }

export default defineLoader({
  // Watch globs resolve relative to this file — `src/` is two levels up.
  watch: ['../../src/series/*/series.yml'],
  load(files: string[]): SeriesEntry[] {
    return files
      .map((file): SeriesEntry => {
        const slug = path.basename(path.dirname(file))
        // A YAML syntax error must not break the whole build — the series
        // then just falls back to its folder-name defaults.
        let raw: unknown
        try {
          raw = parseYaml(fs.readFileSync(file, 'utf-8'))
        } catch {
          raw = undefined
        }
        const meta = (
          raw && typeof raw === 'object' ? raw : {}
        ) as Record<string, unknown>
        return {
          slug,
          url: `/series/${slug}/`,
          icon: asLocalizableText(meta.icon) ?? '',
          title: asLocalizableText(meta.title) ?? slug,
          description: asLocalizableText(meta.description) ?? '',
          order: toOrder(meta.order),
        }
      })
      .sort(compareSeries)
  },
})
