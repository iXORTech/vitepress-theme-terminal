// Build-time route loader for `/categories/<slug>` (POST-001). One page per
// category any post declares; `params.name` is the URL slug, `params.term` the
// display name. Series articles contribute their categories only when
// `themeConfig.series.inCategories` opts them in (POST-002) — the same filter
// CategoriesIndex/TermPosts apply, so the generated routes match the display.
import { createContentLoader } from 'vitepress'
import { themeConfig } from '../../.vitepress/config.mts'
import { resolveThemeConfig } from '../../.vitepress/theme/config'
import {
  filterListablePosts,
  groupByCategory,
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
      'categories',
    )
    return groupByCategory(posts).map((group) => ({
      params: { name: group.slug, term: group.name },
    }))
  },
}
