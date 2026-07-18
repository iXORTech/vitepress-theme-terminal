<script setup lang="ts">
// ============================================================================
// about/en.vue — English About content (PAGE-003)
// ============================================================================
// Hand-authored demo content for the About page, rendered by the language
// dispatcher `views/About.vue` when the UI language is English. Built from the
// theme's Card component and the shared card grid (`.ct-cardgrid`; styles in
// styles/_pages.scss). Card width is a span modifier on the grid item —
// `--third` (1/3), `--half` (1/2), `--two-thirds` (2/3), `--full` (whole row)
// — mix them per row; the shell prompt is orthogonal (set with `show-prompt`).
// This layout shows a full lead, a 2/3 + 1/3 row, and a 1/2 + 1/2 row. Replace
// it with your own bio — it is ordinary Vue.
import Card from '../../components/Card.vue'
</script>

<template>
  <section class="ct-page ct-about">
    <h1 class="ct-page__title">About</h1>

    <ul class="ct-cardgrid">
      <!-- Full-row lead card, with the shell prompt (design-language.md §4 —
           more featured content is decorated) -->
      <li class="ct-cardgrid__item ct-cardgrid__item--full">
        <Card class="ct-about-block" show-prompt :prompt="{ command: 'whoami' }">
          <h2 class="ct-about-block__title">
            <i class="fa-solid fa-user-astronaut ct-about-block__icon" aria-hidden="true"></i>
            Hi, I'm the Terminal theme
          </h2>
          <p class="ct-about-block__body">
            This is the demo About page for VitePress Theme Terminal — a modern
            TUI/terminal environment for blogs and personal sites. It doubles as
            a living reference: every feature is exercised somewhere across these
            pages. This page is authored as an ordinary Vue view; edit
            <code>.vitepress/theme/views/about/en.vue</code> to make it your own.
          </p>
        </Card>
      </li>

      <!-- Row: 2/3 + 1/3 -->
      <li class="ct-cardgrid__item ct-cardgrid__item--two-thirds">
        <Card class="ct-about-block">
          <h2 class="ct-about-block__title">
            <i class="fa-solid fa-seedling ct-about-block__icon" aria-hidden="true"></i>
            Now
          </h2>
          <p class="ct-about-block__body">
            Building out the theme's page types and polishing the reading
            experience across the dark, light, and paper color modes. The card
            grid you're looking at is fully fluid: cards can take a third, a
            half, two thirds, or the whole row, mixed however a page needs.
          </p>
        </Card>
      </li>

      <li class="ct-cardgrid__item ct-cardgrid__item--third">
        <Card class="ct-about-block">
          <h2 class="ct-about-block__title">
            <i class="fa-solid fa-screwdriver-wrench ct-about-block__icon" aria-hidden="true"></i>
            Built with
          </h2>
          <dl class="ct-about-block__items">
            <div class="ct-about-block__row ct-about-block__row--stacked">
              <dt class="ct-about-block__label">Framework</dt>
              <dd class="ct-about-block__value">VitePress 2 + Vue 3</dd>
            </div>
            <div class="ct-about-block__row ct-about-block__row--stacked">
              <dt class="ct-about-block__label">Styling</dt>
              <dd class="ct-about-block__value">SCSS</dd>
            </div>
            <div class="ct-about-block__row ct-about-block__row--stacked">
              <dt class="ct-about-block__label">Fonts</dt>
              <dd class="ct-about-block__value">IBM Plex</dd>
            </div>
          </dl>
        </Card>
      </li>

      <!-- Row: 1/2 + 1/2 -->
      <li class="ct-cardgrid__item ct-cardgrid__item--half">
        <Card class="ct-about-block">
          <h2 class="ct-about-block__title">
            <i class="fa-solid fa-link ct-about-block__icon" aria-hidden="true"></i>
            Elsewhere
          </h2>
          <dl class="ct-about-block__items">
            <!-- Stacked: the long repo URL sits on its own line under the label -->
            <div class="ct-about-block__row ct-about-block__row--stacked">
              <dt class="ct-about-block__label">
                <i class="fa-brands fa-github" aria-hidden="true"></i> GitHub
              </dt>
              <dd class="ct-about-block__value">
                <a
                  href="https://github.com/iXORTech/vitepress-theme-terminal"
                  target="_blank"
                  rel="noopener"
                >iXORTech/vitepress-theme-terminal</a>
              </dd>
            </div>
          </dl>
        </Card>
      </li>

      <li class="ct-cardgrid__item ct-cardgrid__item--half">
        <Card class="ct-about-block">
          <h2 class="ct-about-block__title">
            <i class="fa-solid fa-envelope ct-about-block__icon" aria-hidden="true"></i>
            Say hi
          </h2>
          <dl class="ct-about-block__items">
            <div class="ct-about-block__row">
              <dt class="ct-about-block__label">
                <i class="fa-solid fa-at" aria-hidden="true"></i> Email
              </dt>
              <dd class="ct-about-block__value">
                <a href="mailto:hello@example.com">hello@example.com</a>
              </dd>
            </div>
          </dl>
        </Card>
      </li>
    </ul>
  </section>
</template>
