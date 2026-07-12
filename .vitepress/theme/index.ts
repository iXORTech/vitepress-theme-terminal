// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
// This demo site's Layout is the wrapper that fills the `pre-footer` slot with
// demo content (THEME-006) — the same pattern a consuming site uses. A real
// consumer keeps the theme's own `Layout` (exported below) or wraps it itself.
import DemoLayout from './DemoLayout.vue'
// Theme styles: single SCSS entry; all styling lives in `styles/` partials.
import './styles/main.scss'

// Export the reusable card for future theme components (COMP-001).
export { default as Card } from './components/Card.vue'

// Export the shell Layout so users can wrap it to fill named slots — notably
// the `pre-footer` slot for the fully-custom pre-footer section (THEME-006).
export { default as Layout } from './Layout.vue'

export default {
  // Demo wrapper (THEME-006 example); the theme's own Layout is the named
  // export above — swap this back to it to ship without the demo section.
  Layout: DemoLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
