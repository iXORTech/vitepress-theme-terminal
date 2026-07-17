<script setup lang="ts">
// ============================================================================
// TermPosts.vue — posts under one tag or category (POST-001)
// ============================================================================
// The body of the dynamic listing routes `src/tags/[name].md` and
// `src/categories/[name].md`. The `field` prop selects the taxonomy; the active
// term comes from the route params the `[name].paths.mjs` loaders emit
// (`{ name: <slug>, term: <display name> }`). Posts are matched by slug (so a
// term's display spelling can vary) and shown with PostList. The heading's
// term resolves through `themeConfig.taxonomy` (I18N-008), falling back to
// the authored name from the route params.
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'
import { filterListablePosts, slugify } from '../posts'
import { useTaxonomy } from '../composables/useTaxonomy'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'
import PostList from './PostList.vue'

const props = defineProps<{ field: 'tags' | 'categories' }>()

const { params } = useData()
const { t } = useThemeLocale()
const { tagLabel, categoryLabel } = useTaxonomy()
const config = useThemeConfig()

const routeParams = computed(
  () => (params.value as { name?: string; term?: string } | null) ?? {},
)
const slug = computed(() => routeParams.value.name ?? '')
const term = computed(() => routeParams.value.term ?? slug.value)

// Series articles match only when opted in (POST-002) — the [name].paths.mjs
// loaders apply the same filter, so the generated term routes agree.
const matches = computed(() =>
  filterListablePosts(posts, config.value.series, props.field).filter((post) =>
    post[props.field].some((v) => slugify(v) === slug.value),
  ),
)

// "Posts tagged #x" vs "Posts in category x" — localized, with the term's
// display label interpolated into the `{term}` placeholder.
const heading = computed(() => {
  const key = props.field === 'tags' ? 'post.taggedWith' : 'post.inCategory'
  const marker = props.field === 'tags' ? '#' : ''
  const label = (props.field === 'tags' ? tagLabel : categoryLabel)(term.value)
  return t(key).replace('{term}', `${marker}${label}`)
})

const indexHref = computed(() =>
  withBase(props.field === 'tags' ? '/tags' : '/categories'),
)
const indexLabel = computed(() =>
  t(props.field === 'tags' ? 'post.allTags' : 'post.allCategories'),
)
</script>

<template>
  <div class="ct-listing ct-term-posts">
    <h1 class="ct-listing__title">{{ heading }}</h1>
    <p class="ct-listing__back">
      <a :href="indexHref">{{ indexLabel }}</a>
    </p>

    <!-- Series articles admitted by the toggles carry their series name in
         the card title (POST-002 follow-up) -->
    <PostList :posts="matches" series-in-title />
  </div>
</template>
