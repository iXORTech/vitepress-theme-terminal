<script setup lang="ts">
// ============================================================================
// FloatingWindow.vue — shared floating utility window (THEME-003/016/017)
// ============================================================================
// The theme's single TUI floating-window instance (design-language.md §4,
// ui-sketch.md §2), rendered once from Layout.vue. Hidden by default; opened
// programmatically via useFloatingWindow(), which supplies the utility to
// show as one or more framed panes — each its own bordered box whose title
// (+ optional icon) sits on the top border line, with the text-based `[x]`
// close control on the first pane's border (THEME-017). A dimmed backdrop
// floats it above the shell; dismissed by `[x]`, clicking outside, or `Esc`
// (design-language.md §7). At mobile widths it presents as a near-full-screen
// sheet (design-language.md §8; styles in styles/_window.scss).
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useFloatingWindow } from '../composables/useFloatingWindow'
import { useThemeLocale } from '../composables/useThemeLocale'

const { t } = useThemeLocale()
const { active, isOpen, close } = useFloatingWindow()

// Move focus into the dialog when it opens (so `Esc` and tabbing operate on
// the window) and hand it back to the previously focused element on close.
const panel = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null
watch(isOpen, async (open) => {
  if (open) {
    lastFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    await nextTick()
    panel.value?.focus()
  } else {
    lastFocused?.focus()
    lastFocused = null
  }
})

// `Esc` dismisses the window (keyboard-friendly UX, design-language.md §7)
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isOpen.value) close()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <template v-if="active">
    <!-- Backdrop dims the shell behind the window; clicking outside dismisses -->
    <div class="ct-window-backdrop" @click="close"></div>

    <section
      ref="panel"
      class="ct-window"
      role="dialog"
      aria-modal="true"
      :aria-label="active.label()"
      tabindex="-1"
    >
      <!-- Framed panes, stacked with the floating gap (THEME-017) -->
      <section
        v-for="(pane, index) in active.panes"
        :key="`${active.id}-${index}`"
        class="ct-window__pane"
        :aria-label="pane.title()"
      >
        <!-- Pane title on the top border line, TUI style; the icon is
             decorative (THEME-016) -->
        <span class="ct-window__pane-title">
          <i
            v-if="pane.icon"
            class="ct-window__icon"
            :class="pane.icon"
            aria-hidden="true"
          ></i>
          {{ pane.title() }}
        </span>

        <!-- Text-based close control on the first pane's border -->
        <button
          v-if="index === 0"
          class="ct-window__close"
          :title="t('window.close')"
          :aria-label="t('window.close')"
          @click="close"
        >[<i class="fa-solid fa-xmark" aria-hidden="true"></i>]</button>

        <!-- The pane's content -->
        <div class="ct-window__pane-body">
          <component :is="pane.component" />
        </div>
      </section>
    </section>
  </template>
</template>
