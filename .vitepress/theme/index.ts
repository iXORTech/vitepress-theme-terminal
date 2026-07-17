// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
// This demo site's Layout is the wrapper that fills the `pre-footer` slot with
// demo content (THEME-006) — the same pattern a consuming site uses. A real
// consumer keeps the theme's own `Layout` (exported below) or wraps it itself.
import DemoLayout from './DemoLayout.vue'
// Theme styles: single SCSS entry; all styling lives in `styles/` partials.
import './styles/main.scss'

// Listing components (POST-001/POST-002) used inside the generated listing
// pages (`posts.md`, `archives.md`, `categories.md`, `tags.md`, `series.md`,
// series landing pages, and the `categories/[name]` / `tags/[name]` /
// `page/[num]` routes). Registered globally so those markdown files can place
// them without a per-file import.
import ArchivesList from './components/ArchivesList.vue'
import CategoriesIndex from './components/CategoriesIndex.vue'
import PostsIndex from './components/PostsIndex.vue'
import SeriesArticles from './components/SeriesArticles.vue'
import SeriesIndex from './components/SeriesIndex.vue'
import TagsIndex from './components/TagsIndex.vue'
import TermPosts from './components/TermPosts.vue'

// Export the reusable card for future theme components (COMP-001).
export { default as Card } from './components/Card.vue'

// Export the shell Layout so users can wrap it to fill named slots — notably
// the `pre-footer` slot for the fully-custom pre-footer section (THEME-006).
export { default as Layout } from './Layout.vue'

export default {
  // Demo wrapper (THEME-006 example); the theme's own Layout is the named
  // export above — swap this back to it to ship without the demo section.
  Layout: DemoLayout,
  enhanceApp({ app }) {
    // Listing components for the POST-001 content pages (ARCH-001 architecture).
    app.component('PostsIndex', PostsIndex)
    app.component('ArchivesList', ArchivesList)
    app.component('CategoriesIndex', CategoriesIndex)
    app.component('TagsIndex', TagsIndex)
    app.component('TermPosts', TermPosts)
    // Series listing components (POST-002).
    app.component('SeriesIndex', SeriesIndex)
    app.component('SeriesArticles', SeriesArticles)
  }
} satisfies Theme
