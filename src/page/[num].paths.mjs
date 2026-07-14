// Build-time route loader for the post-index pagination (POST-001). Page 1 is
// `/posts`; this generates `/page/2` … `/page/N` for the remaining pages.
import { createContentLoader } from 'vitepress'
import { normalizePosts, pageCount } from '../../.vitepress/theme/posts'

export default {
  async paths() {
    const raw = await createContentLoader('posts/**/*.md', {
      excerpt: false,
    }).load()
    const pages = pageCount(normalizePosts(raw).length)
    const paths = []
    for (let n = 2; n <= pages; n++) paths.push({ params: { num: String(n) } })
    return paths
  },
}
