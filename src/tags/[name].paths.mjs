// Build-time route loader for `/tags/<slug>` (POST-001). One page per tag any
// post declares; `params.name` is the URL slug, `params.term` the display name.
import { createContentLoader } from 'vitepress'
import { normalizePosts, groupByTag } from '../../.vitepress/theme/posts'

export default {
  async paths() {
    const raw = await createContentLoader('posts/**/*.md', {
      excerpt: false,
    }).load()
    return groupByTag(normalizePosts(raw)).map((group) => ({
      params: { name: group.slug, term: group.name },
    }))
  },
}
