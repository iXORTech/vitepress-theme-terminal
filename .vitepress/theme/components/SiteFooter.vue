<script setup lang="ts">
// ============================================================================
// SiteFooter.vue — in-viewport footer (THEME-004)
// ============================================================================
// Sits at the bottom of the main viewport, below the content, and scrolls
// with the article — it is NOT a separate floating bar (design-language.md §4,
// footer; ui-sketch.md §5). Structure: separator rule · copyright row
// (copyright left, social icons right) · attribution row (powered-by left,
// RSS + license icons right). The fully-custom section that sits on top of
// the footer is a separate component (THEME-006).
//
// Configuration: the social-icon list and the RSS feed come from
// `themeConfig.footer`; the copyright author and the license come from the
// central author & license system (CONF-002) via `useThemeConfig()`.
import { computed } from 'vue'
import type { LocalizableText } from '../locales'
import { resolveLocalizedText } from '../locales'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'

const config = useThemeConfig()
const { t, language } = useThemeLocale()

// --------------------------------------------------------------------------
// Copyright row — `Copyright © <year> <author>`, author from CONF-002
// --------------------------------------------------------------------------
const copyright = computed(() => {
  const author =
    resolveLocalizedText(config.value.author.name, language.value) || ''
  return t('footer.copyright')
    .replace('{year}', String(new Date().getFullYear()))
    .replace('{author}', author)
    .trim()
})

const social = computed(() => config.value.footer.social)

// Accessible name for a social link: its localized label, else the URL.
const socialLabel = (
  label: LocalizableText | undefined,
  link: string,
): string => resolveLocalizedText(label, language.value) || link

// --------------------------------------------------------------------------
// Attribution row — localized "Powered by … and …" with linked product names.
// The locale string carries {vitepress}/{theme} placeholders so translations
// can reorder; here it is split into plain-text and link segments.
// --------------------------------------------------------------------------
const POWERED_LINKS: Record<string, { text: string; link: string }> = {
  '{vitepress}': { text: 'VitePress', link: 'https://vitepress.dev' },
  '{theme}': {
    text: 'VitePress Theme Terminal',
    link: 'https://github.com/iXORTech/vitepress-theme-terminal-reforged',
  },
}

const poweredBy = computed(() =>
  t('footer.poweredBy')
    .split(/(\{vitepress\}|\{theme\})/)
    .filter((segment) => segment !== '')
    .map((segment) => POWERED_LINKS[segment] ?? { text: segment, link: '' }),
)

// RSS icon renders only when a feed is configured; license from CONF-002.
const rss = computed(() => config.value.footer.rss)
const license = computed(() => config.value.license)
const licenseLabel = computed(() =>
  `${t('footer.license')}: ${license.value.name}`,
)

// Text fallback when the license ships no icons (custom licenses): the
// localized sentence, split so {license} renders as a link to the deed
// (plain text when there is no URL) — same segment pattern as poweredBy.
const licensedUnder = computed(() =>
  t('footer.licensedUnder')
    .split(/(\{license\})/)
    .filter((segment) => segment !== '')
    .map((segment) =>
      segment === '{license}'
        ? { text: license.value.name, link: license.value.url }
        : { text: segment, link: '' },
    ),
)
</script>

<template>
  <footer class="ct-footer">
    <!-- Copyright row: author (CONF-002) left · social icons right -->
    <span class="ct-footer__copyright">{{ copyright }}</span>

    <span v-if="social.length" class="ct-footer__icons ct-footer__social">
      <a
        v-for="entry in social"
        :key="entry.link"
        class="ct-footer__icon"
        :href="entry.link"
        target="_blank"
        rel="noopener"
        :title="socialLabel(entry.label, entry.link)"
        :aria-label="socialLabel(entry.label, entry.link)"
      >
        <i :class="entry.icon" aria-hidden="true"></i>
      </a>
    </span>

    <!-- Attribution row (lighter on desktop): powered-by left · RSS + license right -->
    <span class="ct-footer__powered">
      <template v-for="(segment, index) in poweredBy" :key="index">
        <a
          v-if="segment.link"
          :href="segment.link"
          target="_blank"
          rel="noopener"
        >{{ segment.text }}</a>
        <template v-else>{{ segment.text }}</template>
      </template>
    </span>

    <span v-if="rss || license.name" class="ct-footer__icons ct-footer__meta">
      <!-- RSS: brand-orange icon + wordmark ("RSS" is a proper noun, like the
           product names above — not a translatable string) -->
      <a
        v-if="rss"
        class="ct-footer__rss"
        :href="rss"
        :title="t('footer.rss')"
        :aria-label="t('footer.rss')"
      >
        <i class="fa-solid fa-rss" aria-hidden="true"></i>
        <span>RSS</span>
      </a>

      <!-- License (CONF-002). With icons: one link holding the glyph
           cluster, never underlined. Without icons: a localized text
           sentence whose license name links to the deed — underlined like
           the other text links (plain text when there is no URL). -->
      <component
        :is="license.url ? 'a' : 'span'"
        v-if="license.icons.length"
        class="ct-footer__license"
        :href="license.url || undefined"
        :target="license.url ? '_blank' : undefined"
        :rel="license.url ? 'noopener' : undefined"
        :title="licenseLabel"
        :aria-label="licenseLabel"
      >
        <i
          v-for="icon in license.icons"
          :key="icon"
          :class="icon"
          aria-hidden="true"
        ></i>
      </component>
      <span v-else-if="license.name" class="ct-footer__license-text">
        <template v-for="(segment, index) in licensedUnder" :key="index">
          <a
            v-if="segment.link"
            :href="segment.link"
            target="_blank"
            rel="noopener"
            :title="licenseLabel"
          >{{ segment.text }}</a>
          <template v-else>{{ segment.text }}</template>
        </template>
      </span>
    </span>
  </footer>
</template>
