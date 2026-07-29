---
title:
  en: "Friend Links"
  zh-Hans: "友链设计"
order: 6
---
# Friend Links — data format & friends page (PAGE-004)

> **Binding design document.** Specifies the friends page (`src/friends.md`): the
> external friend-links data format, how the theme discovers and merges data
> sources (including the git-submodule sync workflow), the i18n decisions, the
> page composition in the TUI idiom, and the demo setup. Reference
> implementations studied:
> [`vitepress-theme-arch` `views/Links.vue`](https://github.com/iXORTech/vitepress-theme-arch/blob/main/.vitepress/theme/views/Links.vue)
> + [`theme/assets`](https://github.com/iXORTech/vitepress-theme-arch/tree/main/.vitepress/theme/assets)
> (site side) and
> [`blog-friend-links-data-generator`](https://github.com/iXORTech/blog-friend-links-data-generator-demo)
> (external data generator). This theme adopts the reference's **data format and
> submodule workflow** but NOT its localized-data-file scheme (§4) and re-renders
> the page in this theme's TUI design language (§5).
>
> Task: `PAGE-004`. Spec confirmed and **implemented 2026-07-18** — see the
> implemented note in §9.

## 1. Overview & data-source rationale

The friends page lists friend links and recommended sites, organized into
**groups** (e.g. "Friends", "Developers"). Unlike every other configurable
surface, this data does **not** live in `themeConfig`:

- The primary source is **externally generated** — the
  `blog-friend-links-data-generator` project turns GitHub Issues (one issue per
  link, labeled per group) into a data file on a `data` branch, which a website
  consumes as a **git submodule** kept current by CI. Routing that through
  `.vitepress/config.mts` would defeat the automation.
- Hand-maintained links use the **same file format** locally, so there is one
  format, not two.

This is a documented exception to AGENTS.md §6.5 (user configuration lives in
the VitePress config): friend-link **data** is content synced from an external
pipeline, so it lives in data modules under `.vitepress/theme/assets/`
(§3). The small amount of genuine *configuration* (display toggles, group label
overrides) still lives in `themeConfig.friends` (§6).

## 2. External data format (general spec)

Defined by the generator's output (authoritative: the actual files on a
generator fork's `data` branch, plus the reference renderer — note the
generator's own design doc shows `name` in its issue-template sample, but the
generated output emits `title`; this theme reads **`title`**).

The data is an **array of groups**; each group carries its entries:

```js
// linksData.mjs — same structure as linksData.json, exported as an ES module
const linksData = [
  {
    group: "developers",              // machine id (the generator's group label)
    groupName: "Developers",          // display name
    groupDesc: "Fellow Developers",   // display description
    entries: [
      {
        title: "My Blog",                       // required — display name
        url: "https://myblog.com",              // required — link target
        description: "A blog about my stuff.",  // optional — short blurb
        avatar: "https://myblog.com/a.png",     // optional — logo/avatar URL
        screenshot: "",                         // optional — reserved, not rendered
      },
    ],
  },
  // … more groups; a group MAY have zero entries
];
export default linksData;
```

- **Group fields:** `group` (machine id — grouping/merge key, never displayed),
  `groupName`, `groupDesc`, `entries`.
- **Entry fields:** `title` and `url` are required; `description` and `avatar`
  are optional; `screenshot` exists in generated data but is **reserved** — the
  theme does not render it.
- The generator publishes two equivalent files on the `data` branch under
  `output/`: `linksData.json` (raw JSON) and `linksData.mjs` (the same array as
  an ES-module default export). **The theme consumes only `linksData.mjs`** —
  it imports natively with no parsing step.

### The generator workflow (external, for site owners)

Each friend link is a GitHub Issue on a fork of the generator repo whose body
contains one `json` fenced code block between `<!-- DATA_START -->` /
`<!-- DATA_END -->` comments. Issues labeled with the configured active label
(e.g. `active`) are included; a per-group label (from the fork's `config.toml`
`[[groups]]`) assigns the group. A GitHub Action regenerates the `data` branch
on issue changes, and can `repository_dispatch` the website repo to bump the
submodule (see the generator README's "Friend Links Data Auto Sync"). None of
this runs in this theme — the theme only reads the resulting files.

## 3. Data discovery & merging (theme side)

- The friends component eagerly globs **`/.vitepress/theme/assets/**/linksData.mjs`**
  (Vite `import.meta.glob` with `eager: true`). This picks up, without
  configuration:
  - a hand-authored `.vitepress/theme/assets/linksData.mjs` (optional), and
  - any submodule checkout underneath `assets/` — e.g. the demo's
    `assets/generatedLinkData/output/linksData.mjs`.
- Because the glob is build-time and eager, the data is available during **SSR**
  — the friends page renders complete HTML with no client-side fetch (an
  improvement over the reference, which loads on `onMounted`).
- **Deterministic order:** source files sort by path depth, then path
  (lexicographic) — so the hand-authored root file comes first, submodules
  after. Groups render in first-seen order; entries in file order.
- **Merge rule:** groups from different sources with the same `group` id are
  **merged** — the first-seen occurrence fixes the position; the name and
  description come from the first source that *provides* them (so an
  id-and-entries-only local group inherits the generated labels); later
  sources append their entries. (This lets a hand-authored file pin group
  order — or relabel/localize, §4 — while the generated submodule supplies
  the entries. The reference concatenates without merging; the merge is this
  theme's deliberate improvement.)
- A group with zero entries after merging still renders (header with count 0) —
  it signals the category exists and is open.
- Malformed sources (default export not an array, group without a `group` id,
  entry without `title`/`url`) are skipped with a dev-console warning, never a
  crash.

## 4. i18n decisions

Per the PAGE-004 decision, this theme does **not** follow the reference's
localized-data scheme (parallel `linksData.<lang>.mjs` files plus
`linkDataLocales/<lang>.yaml` group-label tables). Instead:

- **Data strings are authored content and render verbatim by default** — same
  precedent as tag/category names (I18N-008). Generated data is inherently
  single-language; there is nothing to resolve.
- **Hand-authored data files may use `LocalizableText`** — because the data
  format is a JS module, `groupName`, `groupDesc`, and entry `title` /
  `description` accept the standard `string | { [tag]: string }` shape
  (validated by `asLocalizableText()`, resolved with the standard fallback,
  re-resolved in place on a language switch). Plain strings remain the default
  and the only form the generator emits.
- **Generated group labels can be localized from config** — the optional
  `themeConfig.friends.groups` override map (§6) supplies per-group
  `LocalizableText` name/desc, mirroring the I18N-008 taxonomy-label pattern
  (display-only; the `group` id and grouping identity stay as generated).
  Merging (§3) offers the same effect from a hand-authored data file.
- **Theme chrome stays fully localized** as usual (AGENTS.md §6.7): the
  random-visit control, entry counts, and the empty state go through the locale
  table (new `friends.*` keys); the page title/description are ordinary
  localized frontmatter (ARCH-003).

## 5. Page composition (TUI idiom)

`src/friends.md` is a **normal page** (content-architecture.md §3). Its body is
authored Markdown around a globally registered component — the same pattern as
the POST-001 listing pages:

```md
---
title: { en: Friends, zh-Hans: 友链 }
---

Optional authored intro (rendered as normal page content).

<FriendLinks />

## How to apply { #apply }

Authored application instructions — e.g. the JSON template for the generator
issue, in a normal code block.
```

The component renders, top to bottom:

1. **Actions row** — a TUI text-button in the code-block-titlebar idiom
   (`[⇄ random]`, localized `friends.random`): opens a random entry from all
   groups in a new tab. Rendered only when at least one entry exists. (The
   reference's "apply" button is NOT ported — application instructions are
   authored Markdown below the component, reachable by normal scrolling; a
   site owner can add their own anchor link in the intro if desired.)
2. **Per group:** a group header — name, a dim `(count)`, and the description
   as a dim sub-line — followed by the entry grid. No `Card` wrapper around a
   group; the header follows the section-heading language of the listing pages.
3. **Entry cards:** a responsive CSS grid
   (`repeat(auto-fill, minmax(≈16rem, 1fr))`, collapsing naturally to one
   column on narrow viewports; card height ≥ 44px touch target). Each card is
   one external `<a target="_blank" rel="noopener">` styled as a compact TUI
   card (surface, `--ct-border` frame, `--ct-radius`) holding:
   - the **avatar** — a rounded-square (`--ct-radius`, not a circle — square
     corners fit the TUI idiom) `<img>`, lazy-loaded, `data-no-lightbox` (must
     not join the COMP-002 gallery), with a neutral Font Awesome link-glyph
     placeholder block when the entry has no avatar or the image fails;
   - the **title** (single line, ellipsized) and the **description** (dim,
     clamped to 2 lines).
   - Hover/focus: main-color-derived border + title accent (derived colors
     only, per color-system.md §3). No reference-style background-flood hover.
4. **Empty state:** when no data files exist at all, a localized dim notice
   (`friends.empty`).

Styles live in a dedicated `styles/_friends.scss` (never SFC `<style>` —
AGENTS.md §6.3). Component: `.vitepress/theme/components/FriendLinks.vue`,
registered globally in `theme/index.ts` like the listing components.

## 6. Configuration surface — `themeConfig.friends`

All optional, resolved with defaults by `resolveThemeConfig()`:

```ts
friends?: {
  /** Show the per-group entry count in headers. Default true. */
  showCount?: boolean;
  /** Show the random-visit control. Default true. */
  showRandom?: boolean;
  /**
   * Display-label overrides for generated (plain-string) groups, keyed by
   * `group` id — mirrors themeConfig.taxonomy (I18N-008). Display-only.
   */
  groups?: {
    [groupId: string]: { name?: LocalizableText; desc?: LocalizableText };
  };
}
```

The link **data** itself intentionally has no `themeConfig` surface (§1).

## 7. Demo & submodule

- The demo site consumes the reference demo generator fork as a git submodule —
  **`.vitepress/theme/assets/generatedLinkData`** →
  `https://github.com/iXORTech/blog-friend-links-data-generator-demo.git`,
  branch **`data`** (added 2026-07-18; provides
  `output/linksData.{json,mjs}`). The path matches the reference theme's
  submodule location.
- The demo additionally ships a hand-authored
  `.vitepress/theme/assets/linksData.mjs` exercising: `LocalizableText` group
  labels, an entry without an avatar, and a group-id merge with the generated
  data (§3).
- Keeping the submodule current in a deployment is the site owner's CI concern
  (the generator README's auto-sync workflow); the theme requires only that the
  files exist at build time. A missing/uninitialized submodule must degrade to
  "no such source" — never break the build.

## 8. Task & document map

| Concern | Where |
| --- | --- |
| Page task, acceptance criteria | `PAGE-004` in [`.agent/plan.md`](../../.agent/plan.md) |
| Page placement (`src/friends.md`, normal page) | [`content-architecture.md`](content-architecture.md) §2–3 |
| Card/TUI visual language, derived colors | [`design-language.md`](design-language.md) §4, [`color-system.md`](color-system.md) §3 |
| Verbatim-content & LocalizableText precedents | [`design-language.md`](design-language.md) §9 (I18N-008, ARCH-003) |
| External generator format & workflow | [generator repo](https://github.com/iXORTech/blog-friend-links-data-generator-demo) (`docs/design.md`, README) |

## 9. Implemented (PAGE-004, 2026-07-18)

- **Data layer** — `.vitepress/theme/friends.ts` (framework-free):
  `mergeFriendSources()` validates (via `asLocalizableText()`, warnings on
  skip) and merges the discovered modules per §3. `FriendLinks.vue` globs
  `../assets/**/linksData.mjs` eagerly at module scope, so the page is fully
  SSR-rendered; a missing/uninitialized submodule simply matches nothing.
- **Component** — `theme/components/FriendLinks.vue`, registered globally
  (like the listing components) and placed by `src/friends.md`. Group label
  resolution: `themeConfig.friends.groups` override → merged data label →
  `group` id verbatim; all `LocalizableText` display re-resolves reactively on
  a language switch. The random control calls
  `window.open(url, "_blank", "noopener")`; a failed avatar `<img>` hides
  itself (`@error`), revealing the placeholder glyph rendered behind it.
- **Config** — `TerminalFriendsConfig` (`showCount`/`showRandom` default
  `true`, `groups` default `{}`) in `theme/config.ts`; new locale keys
  `friends.random` / `friends.empty` (en + zh-Hans).
- **Styles** — `styles/_friends.scss`, scoped under `.ct-content`; the grid is
  `repeat(auto-fill, minmax(15rem, 1fr))` with a forced single column ≤640px.
- **Demo** — the `data`-branch submodule (§7) plus the hand-authored
  `theme/assets/linksData.mjs` (localized `friends` group; a no-avatar entry;
  an unlabeled `group1` that merges into the generated group), a
  `themeConfig.friends.groups` override localizing the generated `group2`,
  and a Friends nav tab. The submodule's avatar URL happens to 404, which
  exercises the error fallback organically. `src/friends.md` authors the
  intro and "How to apply" sections in `::: lang` blocks — the apply JSON
  uses `title` (the generator's real issue template; its design-doc `name`
  sample is outdated).
- **Verified** on the rendered site (17/17 headless): merged order/counts,
  empty-group header, config-override labels, avatar image vs placeholder,
  `_blank`/`noopener`, random-visit URLs (via a `window.open` stub — a real
  popup follows redirects), zh-Hans in-place re-localization of data labels /
  chrome / page body, nav tab, and the 360px single-column no-overflow grid;
  dark/light/mobile screenshots reviewed.
