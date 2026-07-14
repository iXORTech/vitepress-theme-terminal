<script setup lang="ts">
// ============================================================================
// ListingPage.vue — the generated-listing page type (ARCH-001)
// ============================================================================
// Backs `archives.md`, `categories.md`, `tags.md`, `series.md`, the post index
// (`posts.md` / `page/[num].md`), and the `categories/[name]` / `tags/[name]`
// dynamic routes. Each of those markdown files places the relevant listing
// component (PostsIndex, ArchivesList, CategoriesIndex, TagsIndex, TermPosts —
// registered globally in theme/index.ts), so this type only needs to render the
// page content. It carries no article footer (content-architecture.md §3).
</script>

<template>
  <Content />
</template>
