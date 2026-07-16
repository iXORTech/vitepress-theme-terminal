<script setup lang="ts">
// ============================================================================
// ArticleLicense.vue — end-of-article license card (COMP-003)
// ============================================================================
// Rendered at the bottom of every article (Layout.vue) inside the reusable
// Card WITH the shell-prompt decoration (design-language.md §4, cards;
// ui-sketch.md §6). Shows the article info — title, permalink, publish date,
// author — plus the configured content license, all sourced from the central
// author & license system (CONF-002). Every label is localized (I18N-001).
import { computed, onMounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import Card from './Card.vue'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'
import { asLocalizableText, resolveLocalizedText } from '../locales'
import { formatPageLocation } from '../utils/pagePath'

const { page, frontmatter, site } = useData()
const route = useRoute()
const config = useThemeConfig()
const { t, language } = useThemeLocale()

// License & author come from CONF-002 (the single source, like the footer).
const license = computed(() => config.value.license)
const author = computed(
  () =>
    resolveLocalizedText(config.value.author.name, language.value) ||
    config.value.author.username,
)

// A Creative Commons license drives the decorative CC watermark (below); a
// custom license (MIT, …) carries no CC branding, so no watermark.
const isCreativeCommons = computed(() => {
  const value = license.value
  return (
    /creativecommons\.org/i.test(value.url || '') ||
    value.icons.some((icon) => icon.includes('creative-commons'))
  )
})

// Article title: a localized frontmatter `title` map first (ARCH-003 — a map
// makes VitePress's own `page.title` fall back to the body h1), then the
// page's resolved title, then the site title.
const title = computed(
  () =>
    resolveLocalizedText(
      asLocalizableText(frontmatter.value.title),
      language.value,
    ) ||
    page.value.title ||
    site.value.title,
)

// Normalize frontmatter values to an instant. ISO values without an explicit
// zone are UTC by contract instead of inheriting the build/runtime timezone.
function parseDate(raw: string | number | Date | undefined): Date | null {
  if (raw == null || raw === '') return null
  if (raw instanceof Date) {
    return Number.isNaN(raw.getTime()) ? null : raw
  }
  if (typeof raw === 'number') {
    const date = new Date(raw)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const value = raw.trim()
  if (!value) return null

  const hasTimeZone = /(?:[zZ]|[+-]\d{2}:?\d{2})$/.test(value)
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00Z`
    : hasTimeZone
      ? value
      : `${value}Z`
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

// Render instants in UTC until hydration completes, then use the reader's
// browser timezone so source offsets can affect the displayed calendar day.
const displayTimeZone = ref('UTC')
function formatDate(raw: string | number | Date | undefined): string {
  const date = parseDate(raw)
  if (!date) return ''
  return new Intl.DateTimeFormat(language.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: displayTimeZone.value,
  }).format(date)
}

// Release date from frontmatter `date`; the row is omitted when unset/invalid.
const published = computed(() =>
  formatDate(frontmatter.value.date as string | number | Date | undefined),
)

// Last-updated date: an explicit frontmatter `updated`/`lastUpdated` wins,
// otherwise VitePress's git-derived `page.lastUpdated` timestamp (enabled by
// `lastUpdated: true` in the site config). Omitted when neither is available.
const updated = computed(() => {
  const explicit = (frontmatter.value.updated ??
    frontmatter.value.lastUpdated) as string | number | Date | undefined
  if (explicit != null && explicit !== '') return formatDate(explicit)
  const timestamp = page.value.lastUpdated
  return typeof timestamp === 'number' ? formatDate(timestamp) : ''
})

// Permalink: the in-site route path is a valid href during SSR; on the client
// the displayed text is upgraded to the absolute URL (best effort — the origin
// is only known in the browser).
const permalink = computed(() => route.path)
const displayUrl = ref('')
onMounted(() => {
  displayTimeZone.value =
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  displayUrl.value = window.location.href.split('#')[0].split('?')[0]
})

// License statement, split so the {license} placeholder renders as a deed link
// (plain text when the license has no URL) — the same segment pattern the
// footer uses for its attribution/license text.
const statement = computed(() =>
  t('license.statement')
    .split(/(\{license\})/)
    .filter((segment) => segment !== '')
    .map((segment) =>
      segment === '{license}'
        ? { text: license.value.name, link: license.value.url }
        : { text: segment, link: '' },
    ),
)

const licenseLabel = computed(() => `${t('license.statement')} ${license.value.name}`)

// Shell prompt: `user@host:~/path$ license ~/path` (ui-sketch.md §6). `user`
// and the host/path defaults come from Card; `license` is the literal verb.
const prompt = computed(() => ({
  command: 'license',
  // args: formatPageLocation(page.value.relativePath),
}))
</script>

<template>
  <Card class="ct-license" show-prompt :prompt="prompt">
    <!-- Decorative Creative Commons watermark: spans the card's native height
         and is clipped by its right edge (CC licenses only; purely ornamental,
         hidden from AT). The CC logo is a mask so it scales to the card height
         and tints with the theme. -->
    <span
      v-if="isCreativeCommons"
      class="ct-license__watermark"
      aria-hidden="true"
    ></span>

    <!-- Article title, linking to its own permalink -->
    <h2 class="ct-license__title">
      <a :href="permalink">{{ title }}</a>
    </h2>

    <!-- Article info: author · release date · last updated · permalink -->
    <dl class="ct-license__meta">
      <div class="ct-license__row">
        <dt>{{ t('license.author') }}</dt>
        <dd>{{ author }}</dd>
      </div>
      <div v-if="published" class="ct-license__row">
        <dt>{{ t('license.published') }}</dt>
        <dd>{{ published }}</dd>
      </div>
      <div v-if="updated" class="ct-license__row">
        <dt>{{ t('license.updated') }}</dt>
        <dd>{{ updated }}</dd>
      </div>
      <div class="ct-license__row">
        <dt>{{ t('license.permalink') }}</dt>
        <dd>
          <a class="ct-license__url" :href="permalink">{{ displayUrl || permalink }}</a>
        </dd>
      </div>
    </dl>

    <!-- License statement + brand icons (CONF-002) -->
    <p class="ct-license__statement">
      <template v-for="(segment, index) in statement" :key="index">
        <a
          v-if="segment.link"
          :href="segment.link"
          target="_blank"
          rel="noopener"
        >{{ segment.text }}</a>
        <template v-else>{{ segment.text }}</template>
      </template>
      <component
        :is="license.url ? 'a' : 'span'"
        v-if="license.icons.length"
        class="ct-license__icons"
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
    </p>
  </Card>
</template>
