// Build-time route loader for the post-index pagination (POST-001). Page 1 is
// `/posts`; this generates `/page/2` … `/page/N` for the remaining pages.
// Series articles count toward the total only when `themeConfig.series.inPosts`
// opts them in (POST-002) — the same filter PostsIndex applies, so the page
// count and the generated routes agree.
import { createContentLoader } from 'vitepress'
import { themeConfig } from '../../.vitepress/config.mts'
import { resolveThemeConfig } from '../../.vitepress/theme/config'
import {
  filterListablePosts,
  normalizePosts,
  pageCount,
} from '../../.vitepress/theme/posts'

export default {
  async paths() {
    const raw = await createContentLoader(['posts/**/*.md', 'series/**/*.md'], {
      excerpt: false,
    }).load()
    const posts = filterListablePosts(
      normalizePosts(raw),
      resolveThemeConfig(themeConfig).series,
      'posts',
    )
    const pages = pageCount(posts.length)
    const paths = []
    for (let n = 2; n <= pages; n++) paths.push({ params: { num: String(n) } })
    return paths
  },
}
