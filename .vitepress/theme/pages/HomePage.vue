<script setup lang="ts">
// ============================================================================
// HomePage.vue — the home page type (ARCH-001 / PAGE-001)
// ============================================================================
// The `home` page type (frontmatter `home: true`, `src/index.md`). It renders
// the personal-website welcome as a single reusable Card WITH the shell-prompt
// decoration (design-language.md §4, cards — "the home-page welcome card
// carries it"). Content comes from `themeConfig.home` (PAGE-001), every field
// localizable; an unset greeting/tagline falls back to the localized site
// title/description, so a site gets a sensible home page with no config. It
// deliberately renders no `<Content/>` or article chrome.
import { computed } from 'vue'
import { withBase } from 'vitepress'
import Card from '../components/Card.vue'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'
import { useSiteText } from '../composables/useSiteText'
import { resolveLocalizedText } from '../locales'
import { isExternalLink } from '../utils/pagePath'

const config = useThemeConfig()
const { language } = useThemeLocale()
const { title: siteTitle, description: siteDescription } = useSiteText()

const home = computed(() => config.value.home)

// Resolve a LocalizableText against the active UI language (empty when unset).
const localized = (text: unknown): string =>
  resolveLocalizedText(text as never, language.value) ?? ''

// Greeting/tagline fall back to the localized site title/description.
const greeting = computed(() => localized(home.value.greeting) || siteTitle.value)
const tagline = computed(() => localized(home.value.tagline) || siteDescription.value)
const body = computed(() => localized(home.value.body))
const links = computed(() => home.value.links ?? [])

// The card's shell prompt: `admin@host:~$ whoami` by default; the command is a
// literal (like the license card's `license`), overridable via config.
const prompt = computed(() => ({
  command: home.value.command?.trim() || 'whoami',
}))

// Internal links honor the site base; external URLs pass through and open in a
// new tab.
const href = (link: string): string => (isExternalLink(link) ? link : withBase(link))
</script>

<template>
  <div class="ct-page ct-home">
    <Card class="ct-home__card" show-prompt :prompt="prompt">
      <h1 class="ct-home__greeting">{{ greeting }}</h1>
      <p v-if="tagline" class="ct-home__tagline">{{ tagline }}</p>
      <p v-if="body" class="ct-home__body">{{ body }}</p>

      <!-- Call-to-action links (config-driven, localized) -->
      <ul v-if="links.length" class="ct-home__links">
        <li v-for="(link, index) in links" :key="index">
          <a
            class="ct-home__link"
            :href="href(link.link)"
            :target="isExternalLink(link.link) ? '_blank' : undefined"
            :rel="isExternalLink(link.link) ? 'noopener' : undefined"
          >
            <i v-if="link.icon" :class="link.icon" aria-hidden="true"></i>
            <span>{{ localized(link.text) }}</span>
          </a>
        </li>
      </ul>
    </Card>
  </div>
</template>
