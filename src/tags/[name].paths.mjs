// Build-time route loader for `/tags/<slug>` (POST-001). One page per tag any
// post declares; `params.name` is the URL slug, `params.term` the display name.
// Series articles contribute their tags only when `themeConfig.series.inTags`
// opts them in (POST-002) — the same filter TagsIndex/TermPosts apply, so the
// generated routes match what is displayed.
import { createContentLoader } from 'vitepress'
import { themeConfig } from '../../.vitepress/config.mts'
import { resolveThemeConfig } from '../../.vitepress/theme/config'
import {
  filterListablePosts,
  groupByTag,
  normalizePosts,
} from '../../.vitepress/theme/posts'

export default {
  async paths() {
    const raw = await createContentLoader(['posts/**/*.md', 'series/**/*.md'], {
      excerpt: false,
    }).load()
    const posts = filterListablePosts(
      normalizePosts(raw),
      resolveThemeConfig(themeConfig).series,
      'tags',
    )
    return groupByTag(posts).map((group) => ({
      params: { name: group.slug, term: group.name },
    }))
  },
}
