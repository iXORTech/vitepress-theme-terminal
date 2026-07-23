<script setup lang="ts">
// ============================================================================
// NotificationStack.vue — transient status notifications (THEME-029)
// ============================================================================
// The single on-screen home of the `useNotifications()` queue: a stack of small
// TUI boxes in the shell's bottom-right corner, just above the status bar
// (Layout renders it once, as a zero-height row of the shell — see
// _notifications.scss for the gap math). Each box carries the message and a
// text `[x]` dismiss control, in the same idiom as the floating window's close
// (THEME-017).
//
// Accessibility: the stack container is a persistent `role="status"` live
// region — it is always in the DOM, empty or not, so messages appended to it are
// announced. It is also empty during SSR, so there is nothing to mismatch on
// hydration.
import { useNotifications } from '../composables/useNotifications'
import { useThemeLocale } from '../composables/useThemeLocale'

const { notifications, dismiss } = useNotifications()
const { t } = useThemeLocale()
</script>

<template>
  <!-- Zero-height shell row; the stack itself is positioned inside it -->
  <div class="ct-notifications">
    <div class="ct-notifications__stack" role="status" aria-live="polite">
      <TransitionGroup name="ct-notification">
        <div
          v-for="item in notifications"
          :key="item.id"
          class="ct-notification"
        >
          <span class="ct-notification__message">{{ item.message }}</span>

          <!-- Text-based dismiss control, matching the window's `[x]` -->
          <button
            class="ct-notification__close"
            :title="t('notification.dismiss')"
            :aria-label="t('notification.dismiss')"
            @click="dismiss(item.id)"
          >[<i class="fa-solid fa-xmark" aria-hidden="true"></i>]</button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
