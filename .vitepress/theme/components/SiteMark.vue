<script setup lang="ts">
// ============================================================================
// SiteMark.vue — the theme's official mark (THEME-032)
// ============================================================================
// Renders the project favicon (`/favicon.svg`, the TUI-window glyph — THEME-031)
// as an inline image, so the same official mark shown in the browser tab also
// stands in for the brand icon inside the UI: the tool-bar brand cluster and the
// structurally identical pre-footer brand cluster. Being a local asset there is
// no webfont tofu to guard against (unlike the Nerd-Font glyph it replaces), so
// it needs no gated fallback. It is sized in `em` by `_site-mark.scss` so it
// scales with the surrounding text, and `withBase` keeps the source correct
// under a deployed `base` path. Decorative — the adjacent site title carries the
// accessible name.
import { withBase } from 'vitepress'
</script>

<template>
  <img
    class="ct-site-mark"
    :src="withBase('/favicon.svg')"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
</template>
