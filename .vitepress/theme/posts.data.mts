// =============================================================================
// posts.data.mts — build-time post index (POST-001)
// =============================================================================
// A VitePress data loader (the `*.data.*` convention): it globs every post
// under `src/posts/`, reads frontmatter/excerpts at build time, and exposes the
// normalized, date-sorted list as `data`. Listing components import it directly
// (`import { data as posts } from '../posts.data.mts'`); the value is inlined at
// build, so no post frontmatter is read in the browser.
//
// The glob is resolved relative to `srcDir` (`src/`), so `posts/**/*.md` means
// `src/posts/**/*.md`. Series articles (`src/series/`) are intentionally NOT
// aggregated here — POST-002 owns whether they join these listings.
import { createContentLoader } from 'vitepress'
import { normalizePosts, type PostEntry } from './posts'

declare const data: PostEntry[]
export { data }

export default createContentLoader('posts/**/*.md', {
  excerpt: true,
  transform(raw) {
    return normalizePosts(raw)
  },
})
