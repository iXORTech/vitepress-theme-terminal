<script setup lang="ts">
// ============================================================================
// FriendLinks.vue — grouped friend links (PAGE-004)
// ============================================================================
// The friends-page component, placed by `src/friends.md`. Renders every group
// from the discovered `linksData.mjs` data modules — a header (name · count ·
// description) over a responsive grid of compact link cards — plus the
// random-visit control. Full spec: docs/design/friend-links.md.
import { computed } from 'vue'
import type { FriendLinkEntry, FriendLinkGroup } from '../friends'
import { mergeFriendSources } from '../friends'
import type { LocalizableText } from '../locales'
import { resolveLocalizedText } from '../locales'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useThemeLocale } from '../composables/useThemeLocale'

// Build-time eager glob of every data module under `theme/assets/` — the
// hand-authored root file plus any submodule checkout (e.g. the generator's
// `generatedLinkData/output/`). Eager means the data is bundled and available
// during SSR: the page renders complete HTML with no client-side fetch.
const modules = import.meta.glob('../assets/**/linksData.mjs', {
  eager: true,
  import: 'default',
})

// Validated, deterministically merged groups (friends.ts). The data itself is
// static per build, so this runs once at module scope; only the *display* of
// LocalizableText values below is reactive on the UI language.
const groups: FriendLinkGroup[] = mergeFriendSources(
  Object.entries(modules).map(([path, data]) => ({ path, data })),
)

const { t, language } = useThemeLocale()
const theme = useThemeConfig()
const friends = computed(() => theme.value.friends)

// Resolve a LocalizableText against the active UI language (I18N-004 fallback).
const localized = (text: LocalizableText | undefined): string =>
  text === undefined ? '' : (resolveLocalizedText(text, language.value) ?? '')

// Displayed group labels: config override (themeConfig.friends.groups, for
// generated plain-string data) → the merged data's own label → the id verbatim.
const groupName = (group: FriendLinkGroup): string =>
  localized(friends.value.groups[group.group]?.name) ||
  localized(group.groupName) ||
  group.group

const groupDesc = (group: FriendLinkGroup): string =>
  localized(friends.value.groups[group.group]?.desc) ||
  localized(group.groupDesc)

// Random visit: open one entry from all groups in a new tab.
const allEntries = groups.flatMap((group) => group.entries)

function randomVisit(): void {
  const entry = allEntries[Math.floor(Math.random() * allEntries.length)]
  if (entry) window.open(entry.url, '_blank', 'noopener')
}

// A failed avatar image hides itself, revealing the placeholder glyph behind.
function onAvatarError(event: Event): void {
  ;(event.target as HTMLImageElement).hidden = true
}

const entryKey = (entry: FriendLinkEntry): string => entry.url
</script>

<template>
  <div class="ct-friends">
    <!-- Empty state: no data modules (or none valid) at all -->
    <p v-if="!groups.length" class="ct-friends__empty">{{ t('friends.empty') }}</p>

    <template v-else>
      <!-- Actions row: the random-visit text control -->
      <div
        v-if="friends.showRandom && allEntries.length"
        class="ct-friends__actions"
      >
        <button type="button" class="ct-friends__random" @click="randomVisit">
          [⇄ {{ t('friends.random') }}]
        </button>
      </div>

      <!-- One section per merged group -->
      <section
        v-for="group in groups"
        :key="group.group"
        class="ct-friends__group"
      >
        <h2 class="ct-friends__heading">
          <span class="ct-friends__name">{{ groupName(group) }}</span>
          <span v-if="friends.showCount" class="ct-friends__count"
            >({{ group.entries.length }})</span
          >
        </h2>
        <p v-if="groupDesc(group)" class="ct-friends__desc">
          {{ groupDesc(group) }}
        </p>

        <div v-if="group.entries.length" class="ct-friends__grid">
          <a
            v-for="entry in group.entries"
            :key="entryKey(entry)"
            class="ct-friends__card"
            :href="entry.url"
            target="_blank"
            rel="noopener"
          >
            <!-- Avatar: rounded-square image over a placeholder glyph; the
                 glyph shows when there is no avatar or the image fails.
                 `data-no-lightbox` keeps it out of the COMP-002 gallery. -->
            <span class="ct-friends__avatar" aria-hidden="true">
              <i class="fa-solid fa-link"></i>
              <img
                v-if="entry.avatar"
                :src="entry.avatar"
                alt=""
                loading="lazy"
                decoding="async"
                data-no-lightbox
                @error="onAvatarError"
              />
            </span>
            <span class="ct-friends__data">
              <span class="ct-friends__title">{{ localized(entry.title) }}</span>
              <span v-if="localized(entry.description)" class="ct-friends__blurb">
                {{ localized(entry.description) }}
              </span>
            </span>
          </a>
        </div>
      </section>
    </template>
  </div>
</template>
