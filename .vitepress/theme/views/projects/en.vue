<script setup lang="ts">
// ============================================================================
// projects/en.vue — English projects content (PAGE-002)
// ============================================================================
// Hand-authored demo content for the projects page, rendered by
// `views/Projects.vue` for English. Card width is a span modifier on the grid
// item — `--third` (1/3), `--half` (1/2), `--two-thirds` (2/3), `--full`
// (whole row) — mixed per row; the shell prompt is set per Card with
// `show-prompt`. This layout shows a full lead over a 1/3 + 2/3 row. Uses the
// theme's Card component and the shared card grid (styles in _pages.scss).
import Card from '../../components/Card.vue'
</script>

<template>
  <section class="ct-page ct-projects">
    <h1 class="ct-page__title">Projects</h1>

    <ul class="ct-cardgrid">
      <!-- Full-row featured project, with the shell prompt -->
      <li class="ct-cardgrid__item ct-cardgrid__item--full">
        <Card class="ct-project" show-prompt :prompt="{ command: 'open' }">
          <h2 class="ct-project__name">
            <i class="fa-solid fa-terminal ct-project__icon" aria-hidden="true"></i>
            <a
              href="https://github.com/iXORTech/vitepress-theme-terminal"
              target="_blank"
              rel="noopener"
            >VitePress Theme Terminal</a>
          </h2>
          <p class="ct-project__desc">
            This theme — a modern TUI/terminal environment for VitePress, built
            incrementally from a binding design system: editor-style tool bar,
            status bar, file explorer, floating windows, and prompt-decorated
            cards.
          </p>
          <ul class="ct-project__tags">
            <li class="ct-project__tag">vitepress</li>
            <li class="ct-project__tag">vue</li>
            <li class="ct-project__tag">scss</li>
          </ul>
        </Card>
      </li>

      <!-- Row: 1/3 + 2/3 -->
      <li class="ct-cardgrid__item ct-cardgrid__item--third">
        <Card class="ct-project">
          <h2 class="ct-project__name">
            <i class="fa-solid fa-font ct-project__icon" aria-hidden="true"></i>
            <a href="https://www.ibm.com/plex/" target="_blank" rel="noopener">IBM Plex</a>
          </h2>
          <p class="ct-project__desc">
            The typeface family used across the UI, reading, and code surfaces.
          </p>
          <ul class="ct-project__tags">
            <li class="ct-project__tag">fonts</li>
          </ul>
        </Card>
      </li>

      <li class="ct-cardgrid__item ct-cardgrid__item--two-thirds">
        <Card class="ct-project">
          <h2 class="ct-project__name">
            <i class="fa-solid fa-palette ct-project__icon" aria-hidden="true"></i>
            <a
              href="https://github.com/nyoom-engineering/oxocarbon.nvim"
              target="_blank"
              rel="noopener"
            >Oxocarbon</a>
          </h2>
          <p class="ct-project__desc">
            The IBM Carbon-derived color palette that powers the theme's code
            highlighting across all three modes — a dark and a light palette for
            the screen modes, and a print-oriented palette for paper mode.
          </p>
          <ul class="ct-project__tags">
            <li class="ct-project__tag">colors</li>
            <li class="ct-project__tag">nvim</li>
          </ul>
        </Card>
      </li>
    </ul>
  </section>
</template>
