// =============================================================================
// posts.data.mts — build-time post index (POST-001 / POST-002)
// =============================================================================
// A VitePress data loader (the `*.data.*` convention): it globs every post
// under `src/posts/` and every series article under `src/series/` (POST-002),
// reads frontmatter/excerpts at build time, and exposes the normalized,
// date-sorted list as `data`. Listing components import it directly
// (`import { data as posts } from '../posts.data.mts'`); the value is inlined at
// build, so no post frontmatter is read in the browser.
//
// The globs are resolved relative to `srcDir` (`src/`). Series articles carry
// their series slug in `PostEntry.series` (landing `index.md` pages are
// dropped by `normalizePosts`); whether they appear in a general listing is
// decided per surface by `filterListablePosts` against the `themeConfig.series`
// toggles — this loader stays toggle-agnostic so every surface (including the
// series' own listings) reads from one dataset.
import { createContentLoader } from 'vitepress'
import { normalizePosts, type PostEntry } from './posts'

declare const data: PostEntry[]
export { data }

export default createContentLoader(['posts/**/*.md', 'series/**/*.md'], {
  excerpt: true,
  transform(raw) {
    return normalizePosts(raw)
  },
})
