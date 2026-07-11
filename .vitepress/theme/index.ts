// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import type { Theme } from 'vitepress'
// Theme styles: single SCSS entry; all styling lives in `styles/` partials.
import './styles/main.scss'

// Export the reusable card for future theme components (COMP-001).
export { default as Card } from './components/Card.vue'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
