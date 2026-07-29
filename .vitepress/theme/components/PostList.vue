<script setup lang="ts">
// ============================================================================
// PostList.vue — a list of post cards (POST-001 / POST-002 / POST-003)
// ============================================================================
// The shared presentation for a set of posts, used by the post index
// (PostsIndex), the per-tag / per-category listings (TermPosts), and the
// series landing list (SeriesArticles). Each row is a compact card: title
// link, publish date, a series chip for series articles (POST-002), excerpt,
// the post's categories/tags as links (PostTaxonomy), and — when the post
// declares a `cover` — the cover image on the card's right side on desktop,
// above the text on mobile (POST-003; lazy-loaded, fixed aspect ratio).
// With `seriesInTitle` (used by the general listings a series post joins per
// the POST-002 toggles), a series article's title is prefixed with the
// localized series name instead of showing the meta-row chip.
// Empty lists show a localized "no posts" line.
import { withBase } from 'vitepress'
import { seriesDisplayTitle, type PostEntry } from '../posts'
import { data as seriesMeta } from '../series.data.mts'
import { resolveLocalizedText } from '../locales'
import { formatListDate } from '../utils/date'
import { useThemeLocale } from '../composables/useThemeLocale'
import PostTaxonomy from './PostTaxonomy.vue'

defineProps<{ posts: PostEntry[]; seriesInTitle?: boolean }>()

const { t, language } = useThemeLocale()

// Title/excerpt frontmatter may be per-language maps (ARCH-003).
const localized = (text: PostEntry['title']): string =>
  resolveLocalizedText(text, language.value) ?? ''

// The localized series title from series.yml, else the slug (POST-002).
const seriesTitle = (slug: string): string =>
  seriesDisplayTitle(seriesMeta, slug, language.value)

// A root-absolute cover honors the site base; external URLs pass through.
const coverSrc = (cover: string): string =>
  /^[a-z][a-z0-9+.-]*:/i.test(cover) ? cover : withBase(cover)
</script>

<template>
  <ul v-if="posts.length" class="ct-postlist">
    <li v-for="post in posts" :key="post.url" class="ct-postlist__item">
      <article class="ct-postcard" :class="{ 'ct-postcard--cover': post.cover }">
        <div class="ct-postcard__body">
          <h3 class="ct-postcard__title">
            <!-- Pinned indicator (POST-004): the glyph is decorative, the
                 localized label beside it is what AT reads -->
            <span v-if="post.pinned" class="ct-postcard__pin">
              <i class="fa-solid fa-thumbtack" aria-hidden="true"></i>
              <span class="ct-postcard__pin-label">{{ t('post.pinned') }}</span>
            </span>
            <a :href="withBase(post.url)"
              ><span
                v-if="seriesInTitle && post.series"
                class="ct-postcard__title-series"
                >{{ seriesTitle(post.series) }} › </span
              >{{ localized(post.title) }}</a
            >
          </h3>
          <p v-if="post.date || post.series" class="ct-postcard__meta">
            <span v-if="post.date" class="ct-postcard__date">
              {{ formatListDate(post.date, language) }}
            </span>
            <!-- Series chip (POST-002): links to the series landing page;
                 omitted when the title already carries the series prefix -->
            <a
              v-if="post.series && !seriesInTitle"
              class="ct-postcard__series"
              :href="withBase(`/series/${post.series}/`)"
            >
              <span class="ct-postcard__series-label">{{ t('series.label') }}</span>
              {{ seriesTitle(post.series) }}
            </a>
          </p>
          <p v-if="localized(post.excerpt)" class="ct-postcard__excerpt">
            {{ localized(post.excerpt) }}
          </p>
          <PostTaxonomy :categories="post.categories" :tags="post.tags" />
        </div>

        <!-- Cover (POST-003): wrapped in the post link, so the lightbox skips
             it and a tap navigates; lazy-loaded with a uniform aspect ratio -->
        <a
          v-if="post.cover"
          class="ct-postcard__cover"
          :href="withBase(post.url)"
          tabindex="-1"
          aria-hidden="true"
        >
          <img
            :src="coverSrc(post.cover)"
            :alt="localized(post.title)"
            loading="lazy"
            decoding="async"
          />
        </a>
      </article>
    </li>
  </ul>
  <p v-else class="ct-postlist__empty">{{ t('post.empty') }}</p>
</template>
