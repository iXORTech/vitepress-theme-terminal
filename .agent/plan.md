# Plan — VitePress Theme Terminal

Task board for this repository. Full workflow rules live in [`AGENTS.md`](../AGENTS.md)
§4; in short: every requirement becomes a task **before** implementation; a task has an
ID (`TYPE-###`), a category, dependencies, and acceptance criteria; **no task starts
until all its dependencies are `[x]`**; tasks with no dependency relationship may run in
parallel; tick `[x]` only when every acceptance criterion is met.

## Tasks

### Documentation

- [x] **DOC-001** — Foundational documentation & agent memory
  - **Category:** Documentation · **Deps:** —
  - **Acceptance criteria:** `AGENTS.md` is the single agent-instruction source with
    session protocol, workflow rules, conventions, and compliance code; `CLAUDE.md` and
    `.github/copilot-instructions.md` are pure references to it; `.agent/plan.md` and
    `.agent/context-cache.md` exist and are usable; `docs/design/` records all design
    decisions known so far; `docs/README.md` indexes everything.

- [x] **DOC-002** — User-facing configuration documentation
  - **Category:** Documentation · **Deps:** CONF-001
  - **Acceptance criteria:** every `themeConfig` option is documented with type,
    default, and an example.
    *Landed 2026-07-28: `docs/configuration/theme-config.md` — the complete
    `themeConfig` surface. Opens with where the object lives (and why it is
    exported: the `.paths.mjs` loaders import it), the `LocalizableText`
    contract with its fallback chain, and a quick-reference table of all 17
    top-level options with type + default. Then one section per option with
    type, default, a field table for every nested interface
    (`author`/`license`/`toolbar.nav`+`.actions`+`TerminalNavChild`/`explorer`
    items/`toc`/`footer`+`TerminalSocialLink`/`taxonomy`/`series`/`home`+
    `TerminalPageLink`/`friends`/`search`/`comments`), a runnable example, and
    the resolution behavior a user can trip over (custom `license.name` does
    NOT inherit the CC url/icons; partial Algolia credentials or a blank Waline
    `serverURL` count as unconfigured; TOC levels clamped 1–6 with a reversed
    pair swapped; `siteName` trimmed; blank values fall back). Closes with the
    three documented non-`themeConfig` surfaces (frontmatter/`explorer.json`,
    `series.yml`, `linksData.mjs`) and why each lives with the content —
    satisfying the CONF-001 "no user-configurable value outside the config
    without a documented reason" clause. Companion reference
    `docs/configuration/frontmatter.md` covers the per-page half. Indexed from
    `docs/README.md`.*

- [x] **DOC-003** — UI design sketch
  - **Category:** Documentation · **Deps:** DOC-001
  - **Acceptance criteria:** `docs/design/ui-sketch.md` contains wireframes for the
    desktop layout, the floating utility window, the mobile layout including the
    explorer drawer, and paper mode; regions map to their design docs and build tasks;
    linked from `docs/README.md` and `docs/design/design-language.md`.

- [x] **DOC-004** — User Documentation
  - **Category:** Documentation · **Deps:** ALL-TASKS
  - **Acceptance criteria:** a full documentations set for users, including a
    getting-started guide, configuration reference, etc.
    *Landed 2026-07-28 (all other tasks complete, so the ALL-TASKS dependency
    was satisfied). Task-oriented guide set in `docs/guide/`:
    **getting-started** (requirements, clone with `--recurse-submodules`,
    `pnpm dev/build/preview`, repo layout, the five config edits that make the
    demo yours, first page + first post, a demo-removal checklist, and a
    where-next table); **writing-content** (page-type table, everyday
    frontmatter, heading anchors, code-block cards + `[file]` info-string,
    the eight callouts, the MD-001 extension table, LaTeX vs Typst math,
    lightbox + `data-no-lightbox` + swiper decks, `::: lang`, Vue in markdown
    via the `@` alias + `Card` + the globally registered listing components);
    **blogging** (post frontmatter, taxonomy authored-name/display-label
    split, the listing pages ↔ component table + the three generated route
    families, series folder/`series.yml`/`<SeriesArticles/>`/order + the
    `series` inclusion toggles, covers, license & comment cards, drafts
    convention); **navigation** (toolbar nav/submenus/actions + measured
    overflow drawer, explorer auto vs explicit with the source-local metadata
    table and expansion/persistence/resize/drawer behavior, TOC + anchor copy,
    find palette, status-bar segment order, settings window, keyboard table,
    and the `ct-*` localStorage table); **internationalization** (client-side
    language model, canonical tag rule, the one fallback chain, `::: lang`,
    taxonomy labels, `localeStrings` overrides + adding a language via
    `lang.label` with English backfill, SSR-language consequences);
    **customization** (main color + derivation rule, the three modes, the
    stylesheet-loaded font/icon table in `head.ts`, the three styling rules,
    authored views + `@` alias + `.ct-cardgrid` span modifiers, the
    `pre-footer` slot wrapper, `linksData.mjs` merge model, favicon +
    no-branding rule); **deployment** (build/preview + the preview-restart
    caveat, hosting requirements, cleanUrls, `base` subpath deploys, the
    auto-gzipped Typst WASM, CI needing `fetch-depth: 0` + recursive
    submodules with a sample workflow, Algolia/Waline setup order, pre-launch
    checklist). Reference half: `docs/configuration/theme-config.md` (DOC-002)
    and `docs/configuration/frontmatter.md` (every frontmatter field plus the
    `explorer.json` and `series.yml` schemas). All indexed from
    `docs/README.md` (new "User guide" section; `configuration/` retitled
    "Configuration reference"); `AGENTS.md` §8 repo map gained `docs/guide/`
    and `docs/configuration/`. Doc-only change — no code touched.*

- [x] **DOC-007** — Publish the documentation on the site
  - **Category:** Documentation · **Deps:** DOC-002, DOC-004
  - **Acceptance criteria:** the `docs/` tree is served as site content under
    `/docs/` without duplicating a single file — `src/docs` is a **symlink** to
    `../docs`, so the repository documentation and the published documentation
    are the same files; `/docs/` itself resolves to the documentation index
    (the index file is named so that VitePress treats it as the folder index,
    and every existing reference to it is updated); every relative link
    *between* documentation files resolves on the site as well as in the
    repository; links to repo-only files outside `src/` (`AGENTS.md`,
    `.agent/*`) are explicitly allowed to be site-dead rather than rewritten,
    and the build does not fail on them; the docs appear in the auto-discovered
    explorer and are reachable from the tool bar; `docs/index.md` no longer
    claims `docs/` is not site content; build is green and the rendered pages
    are verified (index, a guide page, a configuration page, a design page).
    *Landed 2026-07-28. **The symlink points root → src, not src → root.** The
    obvious direction (`src/docs` → `../docs`) builds but is wrong: Vite
    resolves symlinks to their real path, so every doc page's `relativePath`
    came out as `../docs/…` — VitePress emitted the right output paths, but
    link rewriting produced `href="/../docs/design/design-language"` and the
    auto-explorer grew a `/../docs/` row (84 dead links, verified in the
    build). So the files were moved to **`src/docs/`** (`git mv docs
    src/docs`, real files inside `srcDir`) and the repo root got a tracked
    `docs` → `src/docs` symlink (mode 120000), which keeps every `docs/…`
    path in AGENTS.md, the task board, the design docs, and the plan history
    resolving. `docs/README.md` → `src/docs/index.md` so VitePress serves the
    index at `/docs/` and the explorer gives the folder a link. The 6 links to
    repo files outside `srcDir` (`AGENTS.md`, `.agent/*`) stay relative to the
    real location (depth +1) and are skipped by
    `ignoreDeadLinks: [/(^|\/)AGENTS(\.md)?$/, /(^|\/)\.agent\//]` — note the
    optional extension: the checker strips `.md` before matching. Tool-bar
    "Docs" tab (Getting Started · Configuration · Markdown Demo · Explorer
    Demo) replaces the old Guide tab; home CTA → `/docs/`. Each doc subfolder
    got an `explorer.json` (localized label + order) so the tree reads
    Documentation → User Guide · Configuration · Design. Docs updated for the
    arrangement: `src/docs/index.md` intro, `guide/getting-started.md` layout
    +demo-removal, AGENTS.md §1/§8, and content-architecture.md §2 (which now
    records the direction rule). Verified headless on the built site 16/17 —
    the one FAIL was a bad assertion (it looked for `advanced-2` while its
    parent folder was collapsed; checked separately at
    `/demo/advanced/advanced-2/deep-dive`, where the label, the route-aware
    ancestor expansion, and the active row are all correct).*

- [x] **CONTENT-001** — `src/` content cleanup
  - **Category:** Content · **Deps:** DOC-004, DOC-007
  - **Acceptance criteria:** no VitePress scaffold leftovers remain in `src/`
    (`api-examples.md` removed); no page duplicates what the published
    documentation now covers — the demo `guide/getting-started.md`
    documentation prose is removed rather than left to drift; the remaining
    demo tree is renamed to say what it is (`src/guide/` → `src/demo/`, an
    explorer/feature playground) with every internal link, prose reference,
    tool-bar entry, and home call-to-action updated to the new paths; the
    regression fixtures those pages provide are **preserved** — folder index +
    nested folder (THEME-011), index-less folder via `explorer.json`
    (THEME-013), hidden page and hidden folder (ARCH-002), a negative `order`
    pinned above an unnumbered sibling (ARCH-004), and the `::: lang` localized
    body (I18N-007); the demo pages point readers at the real documentation
    instead of re-explaining it; build green and the explorer/tool-bar/home
    links verified on the rendered site.
    *Landed 2026-07-28. Removed: `src/api-examples.md` (VitePress scaffold —
    it dumped `useData()` JSON) and `src/guide/getting-started.md` (its
    explorer/i18n/posts prose is now `src/docs/guide/*`, so keeping it would
    have been a second, drifting copy). Renamed `src/guide/` → **`src/demo/`**
    — the folder was never a guide, it is the explorer playground, and
    "guide" now belongs to the documentation. **Earlier task notes that cite
    `src/guide/...` paths refer to these files at their new `src/demo/...`
    location.** `src/demo/index.md` rewritten: it says what it is, links to
    `/docs/`, and carries a table mapping each demo page to the behavior it
    exercises. New `src/demo/pinned-page.md` replaces the deleted page as the
    ARCH-004 fixture (`order: -1` pinning a file above the unnumbered
    `advanced/` folder) — every other fixture kept: folder-with-index +
    nested folder (THEME-011), `advanced-2` index-less folder via
    `explorer.json` (THEME-013, still `order: 1` below its file sibling),
    `hidden-page.md` + `drafts/` (ARCH-002), `deep-dive.md`'s `::: lang`
    bodies (I18N-007). Link/reference updates: demo page bodies, the two
    `markdown-examples.md` internal links, the tool-bar tab set, the home CTA
    and body copy (en + zh-Hans), and the `cleanUrls` comment example in
    `config.mts`. Verified on the built site: `/demo/*` and `/docs/*` all 200,
    old `/guide/*` and `/api-examples` 404, explorer order Demo → Pinned Page
    → Advanced, hidden page absent from the tree but served, single visible
    `::: lang` block.

- [x] **DOC-008** — Simplified Chinese user documentation
  - **Category:** Documentation · **Deps:** DOC-004, DOC-007
  - **Acceptance criteria:** every **user-facing** documentation page — the
    `/docs/` index, all seven `guide/` pages, and all three `configuration/`
    pages — carries a complete `zh-Hans` version beside its English one
    (`docs/design/` stays English: those are internal decision records, not
    user documentation); the translation uses the theme's own per-language
    content mechanism (`::: lang` blocks, I18N-007) rather than a second URL or
    a second file, so one page keeps one URL and switches with the reader's UI
    language; each page's explorer label and browser-tab title localize too
    (localized `title` frontmatter, ARCH-003/I18N-006); the Chinese text is a
    faithful full translation, not a summary — every section, table row, and
    example is present; intra-page anchor links resolve **within** the reader's
    own language (the reference pages' quick-reference tables must not jump
    into the hidden English block); the build stays green (no duplicate
    explicit heading ids, which fail the VitePress build) and the result is
    verified on the rendered site in both languages.
    *Landed 2026-07-28. All 11 user-facing pages (index + 7 `guide/` + 3
    `configuration/`) now hold an English body and a full `zh-Hans` body in
    `::: lang` blocks — ~2,000 translated lines, every section, table row and
    example carried over. `design/` stays English (internal decision records).
    Each file also gained localized `title` frontmatter (so the explorer label
    and tab title switch too) plus an `order`, which puts the guide in reading
    order — 快速开始 · 撰写内容 · 文章、分类与系列 · 导航与外壳界面 · 国际化 ·
    自定义 · 构建与部署 — instead of alphabetically.
    **Gotcha, and the reason the wrappers use five colons:**
    markdown-it-container matches its closing marker line by line and does
    **not** skip fenced code. The first `::::` wrapper attempt was closed early
    by a `::::` line inside `writing-content.md`'s swiper example, which left
    the tail of the English body outside the block; because the two `.ct-lang`
    divs were then no longer adjacent siblings, `useLocalizedContent` treated
    them as two groups and revealed BOTH (a literal `<p>::::</p>` in the output
    was the tell). Wrappers are now `::::: lang en` / `::::: lang zh-Hans` with
    `:::::` closers — longer than any sample inside — and the rule is documented
    in `guide/internationalization.md` (both languages). Anchor handling: the
    two reference pages link heavily within the page, so every Chinese heading
    carries an explicit `{#…-zh}` id and the Chinese quick-reference tables
    point at those — no duplicate ids (which would fail the build) and no jumps
    into the hidden English block; verified by scanning the built HTML (23/23
    and 17/17 zh links resolve to zh headings, zero duplicate ids site-wide).
    Verified headless 22/22 after fixing two bad assertions of my own: `innerText`
    on a `display:none` block returns its textContent (so H1 checks must be
    scoped to `.ct-lang:not([hidden])`), and a collapsed explorer subtree has no
    rows to assert on. Both languages checked on all 11 pages (single visible
    block, Chinese H1, Chinese TOC entries, Chinese tab title, in-page anchor
    landing on a visible Chinese heading, switch back to English in place, 360px
    no overflow, no page errors).*

- [x] **I18N-009** — Fully localized explorer labels
  - **Category:** i18n · **Deps:** I18N-006, DOC-008
  - **Acceptance criteria:** switching the UI language to `zh-Hans` leaves **no**
    English row in the explorer tree — every page the tree can show carries a
    localized `title` (or `explorerTitle`) map, including the listing pages
    (`posts`, `archives`, `categories`, `tags`, `series`), the demo posts, the
    series landing page and its parts, and the `docs/design/` records (whose
    *labels* localize even though those documents stay English by the DOC-008
    scoping decision — a tree row is navigation UI, not documentation content);
    the design records also get a reading `order` so the folder lists like the
    documentation index rather than alphabetically; a post's `description` is
    localized wherever its title is, so post cards and listings do not end up
    half-translated; slugs, URLs, dates, and taxonomy terms are untouched
    (display-only change); build green and the full tree verified row by row on
    the rendered site in both languages.
    *Landed 2026-07-28, from user feedback on DOC-008 ("explorer not fully
    i18ned"): after that task the tree mixed Chinese documentation rows with
    English demo/listing rows. Localized `title` maps added to the five listing
    pages (文章 · 归档 · 分类 · 标签 · 系列), the four remaining demo posts, the
    series landing page and both parts, and the six `docs/design/` records —
    the design records also got `order: 1…6` so the folder lists like the
    documentation index (设计语言 · 色彩系统 · 字体与图标 · 界面草图 · 内容架构 ·
    友链设计). Design **bodies** stay English per the DOC-008 scoping; only
    their labels localize, since a tree row is navigation UI. Post
    `description`s were localized alongside their titles so post cards,
    archives rows, and meta descriptions don't come out half-translated.
    Worth remembering about the listing nodes: `src/posts.md` and the
    `src/posts/` folder merge into ONE explorer branch (`sourceSegments` gives
    both the `posts` segment), so the FILE's frontmatter title is what labels
    the folder — same for `series`. One collision: in Chinese `friends.md` and
    the friend-links design record both wanted 友链, so the record is labeled
    友链设计. Verified on the rendered site by walking eight routes per language
    to force every subtree open: 44 rows in English, 44 in Chinese, zero
    untranslated rows (the only ASCII left is deliberate — `themeConfig`,
    `Frontmatter`, `Markdown`, `advanced-2`), plus post cards/excerpts,
    archives, series index and tab titles localized while URLs/slugs stay put
    (`/posts/color-system`, `/tags/color`, `/categories/design`). The two page
    errors on post pages are the demo's placeholder `waline.example.com`
    failing to resolve — identical in English, unrelated to this change.*

- [x] **DOC-009** — Root `docs/` is the documentation home; the site publishes a generated subset
  - **Category:** Documentation · **Deps:** DOC-007, DOC-008, I18N-009
  - **Acceptance criteria:** `docs/` at the repository root is a **real
    directory** holding every document (no symlink, no split across two
    locations) — it is the single place a reader or an agent goes for
    documentation, and every `docs/…` path in `AGENTS.md`, the task board, and
    the design records resolves to it directly; the site still serves the user
    documentation at `/docs/` **without a second hand-maintained copy**: the
    published tree under `src/docs/` is generated from `docs/` at config load
    (so it exists before VitePress discovers pages, in dev and build alike),
    re-synced on change while `pnpm dev` runs, and git-ignored; documentation
    links stay repository-relative in the source and are rewritten in the
    generated copy so nothing on the site points at a file that is not
    published; the arrangement is recorded in the content-architecture design
    doc and the user guide (both languages); build green, `/docs/` and its pages
    verified on the rendered site.
    *Landed 2026-07-28, reversing the DOC-007 arrangement on request. `docs/` is
    a real directory again (`git mv src/docs docs`, root symlink removed) and
    every out-of-tree link inside it went back one level (`../../../AGENTS.md`
    → `../../AGENTS.md`, etc.). The site's copy is generated: new
    `theme/vite/publishDocs.ts` exports `publishDocs()` — called at module scope
    from `config.mts`, so it runs before VitePress discovers pages in BOTH dev
    and build — plus `docsPublishPlugin()`, a `serve`-only Vite plugin that adds
    `docs/` to the dev watcher and re-mirrors on change (verified live: editing
    a source doc updates the copy within ~3s; adding/removing a page still needs
    a restart, since routes resolve at startup). The mirror writes only changed
    files, deletes stale ones, and inserts a "GENERATED FILE — do not edit"
    marker after each file's frontmatter; `/src/docs/` is git-ignored. Why a
    copy and not a symlink: `src/docs` → `../docs` builds but Vite resolves
    symlinks to their real path, so every doc page gets a `../docs/…`
    relativePath — broken routes, a `/../docs/` explorer row, ~84 false dead
    links (measured under DOC-007); a copy also makes a PARTIAL publish possible
    at all, which DOC-010 needs. Docs updated for the new arrangement:
    `docs/index.md` intro + `guide/getting-started.md` layout (both languages),
    `design/content-architecture.md` §2 (tree + a rewritten note recording both
    decisions), AGENTS.md §1 and the §8 repo map.*

- [x] **DOC-010** — Agent-facing documents excluded from the deployed site
  - **Category:** Documentation · **Deps:** DOC-009
  - **Acceptance criteria:** the built site contains **no** page for the
    agent-facing documents — `docs/design/**` (binding decision records) is not
    published, and neither are `AGENTS.md` or `.agent/*` (they never were); the
    explorer, the tool bar, and the sitemap of built pages show only the user
    documentation (index · guide · configuration); references to the excluded
    documents from published pages resolve for the reader instead of 404ing
    (rewritten to the repository), so no dead links are introduced and the
    dead-link check can run without blanket ignores; the excluded documents
    remain fully available in the repository and unchanged in content.
    *Landed 2026-07-28 with DOC-009. The published set is
    `index.md` + `guide/` + `configuration/` (`PUBLISHED_ENTRIES` in
    `publishDocs.ts`); `docs/design/**` is never mirrored, so the build emits
    11 documentation pages and no design page — `/docs/design/color-system`
    404s on the built site, and the explorer shows only 使用指南/配置 under
    文档. The link problem this creates is solved at publish time, not in the
    sources: `rewriteLinks()` resolves every relative markdown link against the
    file's location in `docs/` and, when the target falls outside the published
    set, rewrites it to
    `https://github.com/iXORTech/vitepress-theme-terminal/blob/main/<path>` —
    so the guide's ~15 "see the design record" pointers, plus its `AGENTS.md`,
    `.agent/*` and `.vitepress/**` references, land on the real file for a site
    reader while staying plain relative paths in the repository. Code fences and
    inline code spans are skipped, so documented sample links (`[x](./other.md)`
    in clean-urls.md) survive verbatim. With no dead links left, `config.mts`
    dropped its `ignoreDeadLinks` list entirely — the checker now runs
    unmuzzled. `docs/index.md` gained a line in both languages telling readers
    the design records are repository-only. Verified 16/18 headless in both
    languages (the 2 "failures" were the selector catching a heading's own
    `#…-design` permalink; all six design links are GitHub URLs), plus
    404/200 checks on the built site.*

- [x] **DOC-005** — Footer design documentation
  - **Category:** Documentation · **Deps:** DOC-001, DOC-003
  - **Acceptance criteria:** footer structure (custom Vue region · separator ·
    copyright/social row · powered-by/RSS/license row, at the bottom of the main
    viewport) recorded in `docs/design/design-language.md` §4 and wireframed in
    `docs/design/ui-sketch.md` §5; added to the region → spec → task map; explicitly
    notes that further implementation details follow later (THEME-004).

- [x] **DOC-006** — Feature-set requirements recorded (2026-07-07 batch)
  - **Category:** Documentation · **Deps:** DOC-005
  - **Acceptance criteria:** the 21-requirement feature batch is captured as plan tasks
    with IDs, categories, dependencies, and acceptance criteria; the card component and
    shell-prompt decoration are documented in `design-language.md` §4 and sketched in
    `ui-sketch.md` §6; the footer task and documentation are expanded with
    configurability and the author & license system; the context cache is updated.

### Infrastructure

- [x] **INFRA-001** — SCSS toolchain
  - **Category:** Infrastructure · **Deps:** —
  - **Acceptance criteria:** `sass` added as a devDependency; `.vitepress/theme/styles/`
    established with a `main.scss` entry imported by the theme; `style.css` retired;
    `pnpm dev` and `pnpm build` succeed.

- [x] **INFRA-002** — Deployable Typst WASM under host asset-size limits
  - **Category:** Infrastructure · **Deps:** MD-004
  - **Acceptance criteria:** the built site contains no file over 25 MiB, so a
    Cloudflare Pages deploy no longer fails on
    `assets/typst_ts_web_compiler_bg.*.wasm` (27 MiB); the Typst compiler stays
    self-hosted (the MD-004 no-runtime-CDN decision is unchanged) — the
    oversized WASM ships as a compressed build asset and is decompressed
    client-side before compiler init; dev mode keeps serving the raw WASM
    unchanged; a decompression-path failure surfaces the existing visible
    Typst error (never a blank render); Typst math still renders on the built
    site, verified headless.
    *Landed 2026-07-20: a build-only Vite plugin
    (`theme/vite/gzipWasm.ts`, wired in `config.mts` `vite.plugins`) re-emits
    any bundled `.wasm` asset over 24 MiB gzipped (level 9) as `<name>.wasm.gz`
    (28.3 MB → 10.7 MB) and rewrites every chunk reference to the new file
    name; `useTypst`'s `getModule` fetches the URL and, when it ends in `.gz`
    AND the bytes carry the gzip magic (content check — a server that
    transparently decodes `Content-Encoding` still works), pipes them through
    `DecompressionStream('gzip')` before handing the `ArrayBuffer` to the
    compiler init. Dev URLs keep the plain `.wasm` path (plugin is
    `apply: "build"`). Verified: dist has no file ≥ 25 MiB; headless on the
    built site, block + inline Typst compile to SVG with no page errors.*

- [x] **INFRA-003** — Fix dev-mode Typst WASM instantiation regression
  - **Category:** Infrastructure · **Deps:** INFRA-002
  - **Acceptance criteria:** `pnpm run dev` renders Typst math without the
    `WebAssembly.instantiate(): Argument 0 must be a buffer source or a
    WebAssembly.Module object` error; the production `.gz` decompression path
    is preserved; verified headless against the dev server (block + inline
    Typst compile to SVG, no page errors).
    *Landed 2026-07-20: INFRA-002 routed the compiler `getModule` through an
    `async fetchWasmModule()`, so the dev path returned a `Promise<string>`
    (the raw `.wasm` URL). typst.ts's init only auto-`fetch`es a value that is
    literally a string (`typeof r == "string"`); the Promise slipped that check
    and its resolved URL string was passed straight to `WebAssembly.instantiate`
    → crash. Fix (`theme/composables/useTypst.ts`): renamed to
    `resolveWasmModule()` and made it return the dev URL as a **bare string**
    (non-Promise, like the renderer's `getModule`) so typst.ts fetches +
    stream-compiles it; only the `.gz` build asset returns a
    `Promise<ArrayBuffer>`. Verified headless on the dev server: all 3
    `.ct-typst` blocks reached `withSvg`, 0 errored, no WASM error.*

### Configuration

- [x] **CONF-001** — Theme configuration surface
  - **Category:** Configuration · **Deps:** —
  - **Acceptance criteria:** a typed `themeConfig` schema (main color with default
    `#80E0A7`, locale-strings hook, feature toggles as they appear) read from
    `.vitepress/config.mts`; defaults applied when unset; no user-configurable value
    lives outside the config without a documented reason.

- [x] **CONF-002** — Author & license system
  - **Category:** Configuration · **Deps:** CONF-001
  - **Acceptance criteria:** `themeConfig` carries the author identity — full/display
    name plus a username, with a normalized shell-safe username derived automatically
    when not set explicitly — and the content license, default **CC BY-NC-SA 4.0**.
    All consuming surfaces read from this single source: footer copyright & license
    icons (THEME-004), author info displays, shell-prompt decorations (COMP-001), and
    the license card (COMP-003).
    *Landed 2026-07-09: `themeConfig.author`/`.license` + `normalizeUsername()` in
    `theme/config.ts`; rule documented in design-language.md §4. The consuming
    surfaces are later tasks — each reads the resolved config via
    `useThemeConfig()` when it lands.*

- [x] **CONF-003** — Configurable normalized site name
  - **Category:** Configuration · **Deps:** CONF-001, COMP-001
  - **Acceptance criteria:** `themeConfig.siteName` can override the shell prompt
    host used by `Card.vue`; an unset or blank value falls back to the automatically
    normalized active site title; the resolved config, demo configuration, and card
    prompt behavior remain type-safe and documented.
    *Landed 2026-07-13: `siteName` is resolved as a trimmed shell-host override;
    `Card.vue` normalizes it for the prompt and falls back to the active site title
    when unset. The config example and card/design docs describe the option;
    build and rendered browser checks cover both paths.*

### Styling

- [x] **STYLE-001** — Design tokens: Carbon palette + main color
  - **Category:** Styling · **Deps:** INFRA-001, CONF-001
  - **Acceptance criteria:** Carbon palette and the main color exposed as CSS custom
    properties from SCSS; all main-color derivatives (hover/dim/subtle/border/selection)
    computed from the configured value per `docs/design/color-system.md` §3; no
    hardcoded derivative hex values anywhere.

- [x] **STYLE-002** — Color modes: dark / light / paper
  - **Category:** Styling · **Deps:** STYLE-001
  - **Acceptance criteria:** three switchable modes with dark as default; user choice
    persisted; paper mode reader-optimized and also applied via `@media print`; token
    values per `docs/design/color-system.md` §6.

- [x] **STYLE-003** — Oxocarbon syntax highlighting
  - **Category:** Styling · **Deps:** STYLE-002
  - **Acceptance criteria:** Shiki custom themes wired in the VitePress config:
    oxocarbon.nvim dark/light palettes for dark/light modes, vscode-oxocarbon light
    palette for paper mode; code blocks follow the active mode.

- [x] **STYLE-004** — Code block cards
  - **Category:** Styling · **Deps:** STYLE-003, I18N-001, COMP-001
  - **Acceptance criteria:** code blocks render as card-style floating windows in the
    card component's visual language (`docs/design/ui-sketch.md` §6, code block
    variant): a **title bar** — not a shell-prompt decoration — shows the file name
    (when given) and the language name and holds a COPY button; highlighting stays
    Shiki-powered with the STYLE-003 palettes; labels localized; styles in dedicated
    SCSS.
    *Landed 2026-07-12: a markdown-it fence wrapper (`theme/markdown/codeblock.ts`)
    wraps VitePress's Shiki output in a `.ct-code` card headed by a
    `.ct-code__titlebar` (file name · language · text `[copy]` control); the file
    name comes from an info-string `[name]` bracket (VitePress's `[title]`
    convention, read before VitePress strips it). Highlighting is untouched inside
    the card. The COPY label is emitted in the build language, tagged
    `data-ct-code-copy-label`, and re-localized by `useCodeCopy()` (called from
    Layout), which also copies the source and flashes a localized "Copied"; styles
    in `styles/_code.scss`; demo `[main.scss]` block in `markdown-examples.md`.
    Verified headless.*

- [x] **STYLE-005** — Base markdown content styling
  - **Category:** Styling · **Deps:** STYLE-001, FONT-001
  - **Acceptance criteria:** all standard markdown output (headings, paragraphs,
    lists, tables, blockquotes, rules, links, images, inline code) styled to the
    design language across the three color modes; readable measure; mobile-safe.

- [x] **STYLE-006** — Neutral body text; main color as emphasis only (rework)
  - **Category:** Styling · **Deps:** STYLE-002, STYLE-005
  - **Acceptance criteria:** body text renders in neutral Carbon colors in every mode
    (near-white on dark, near-black on light/paper) — never in the main color; the
    main color (or its contrast-safe derivatives) appears only on emphasis and
    visual-appeal elements: links, bold, headings, inline code, buttons,
    active/selected states, selection highlight; `docs/design/color-system.md` §2/§6
    and `docs/design/ui-sketch.md` record the decision.

### Typography & icons

- [x] **FONT-001** — IBM Plex font loading
  - **Category:** Typography · **Deps:** —
  - **Acceptance criteria:** Plex Sans/Serif/Mono load via stylesheet `<link>`s injected
    into `<head>` from the VitePress config; fallback stacks defined; no npm font
    packages.

- [x] **FONT-002** — Icon systems: Font Awesome + Nerd Font
  - **Category:** Typography · **Deps:** —
  - **Acceptance criteria:** Font Awesome `all.css` and a symbols-only Nerd Font
    stylesheet injected into `<head>` from the VitePress config; both render; Nerd Font
    use restricted to TUI chrome per `docs/design/typography-and-icons.md` §2; no npm
    icon packages.

- [x] **FONT-003** — Reliable Nerd Font readiness
  - **Category:** Typography · **Deps:** FONT-002
  - **Acceptance criteria:** the runtime Nerd Font gate waits until the external
    symbols stylesheet has had an opportunity to register its face before checking
    the CSS Font Loading API; a temporarily early check cannot permanently leave
    explorer/callout icons in fallback mode; failed font loads still preserve the
    tofu-safe fallback; the behavior is covered by repeated rendered-surface checks.
    *Landed 2026-07-10: `useNerdFont()` waits for the Nerd Font stylesheet's
    load/error lifecycle before calling `document.fonts.ready/load`, preventing
    an early empty-face result from becoming permanent; repeated browser loads
    show explorer icons consistently and a blocked stylesheet retains the
    fallback glyphs.*

- [x] **FONT-004** — jsDelivr Nerd Font stylesheet
  - **Category:** Typography · **Deps:** FONT-003
  - **Acceptance criteria:** the theme loads the generated Nerd Font stylesheet
    from jsDelivr's GitHub mirror of `ryanoasis/nerd-fonts` at the latest
    `master` revision; runtime stylesheet detection matches the new URL; the
    documented family and fallback behavior remain unchanged; the generated
    stylesheet's legacy missing font path is paired with a working jsDelivr
    Symbols font face so the icons still render.
    *Landed 2026-07-10: the generated CSS now loads from jsDelivr's `master`
    branch, and `_fonts.scss` supplies a valid jsDelivr Symbols font face under
    the theme alias used by the CSS gate and TUI tokens; repeated browser loads
    show explorer icons consistently.*

- [x] **FONT-005** — IBM Plex Math for rendered math
  - **Category:** Typography · **Deps:** FONT-001, MD-001, MD-004
  - **Acceptance criteria:** both math renderers use **IBM Plex Math** as the
    math typeface — LaTeX (the `$`/`$$` MathJax path from MD-001) and the Typst
    math container/inline (MD-004) — instead of each renderer's default math
    font; IBM Plex Math loads via stylesheet, consistent with the FONT-001
    loading rule and the no-npm-font-packages rule
    (`docs/design/typography-and-icons.md`), with a documented fallback stack;
    the change is applied through configuration/styling, not by editing rendered
    output; both LaTeX and Typst formulas render in IBM Plex Math across the
    three color modes and on mobile, verified on the rendered site; the math-font
    decision is recorded in `docs/design/typography-and-icons.md`.
    *Landed 2026-07-20 (with MD-004): IBM Plex Math loads via a `<head>`
    stylesheet `<link>` (`@ibm/plex-math@1.1.0` on jsDelivr, family
    `"IBM Plex Math"`, SIL OFL 1.1) added in `theme/head.ts` — the FONT-001
    rule, no npm font package. Fallback stack `"IBM Plex Math", math,
    "IBM Plex Serif", serif` in `styles/_math.scss`. **LaTeX side:** SVG bakes
    glyphs into vector paths (un-restylable) and MathJax has no IBM Plex Math
    build, so the `$`/`$$` path was switched from mathjax3 SVG to **MathML**
    (`theme/markdown/math.ts`, `mathjax-full` serialized MathML at build time,
    SSR-clean) — the browser renders `<math>` natively and honors
    `math { font-family: "IBM Plex Math" }`. `markdown-it-mathjax3` +
    `math: true` removed. **Typst side:** renders to SVG, so IBM Plex Math is
    fed to the WASM compiler as OTF bytes
    (`assets/fonts/IBMPlexMath-Regular.otf`, converted once from the OFL woff2 —
    a stylesheet cannot font a compiler) and selected via
    `#show math.equation: set text(font: "IBM Plex Math")`. Decision +
    both-sides rationale in typography-and-icons.md §2a. Verified headless on
    the rendered site: MathML and Typst both render in IBM Plex Math in
    dark/light/paper (`math` computed font-family + Typst SVG `currentColor`
    → near-white on dark, near-black on light/paper), 360px no overflow.*

### Markdown

- [x] **MD-001** — markdown-it plugin suite
  - **Category:** Markdown · **Deps:** —
  - **Acceptance criteria:** the following plugins are wired into the VitePress
    markdown config and render correctly: markdown-it-emoji, markdown-it-sub,
    markdown-it-sup, markdown-it-ins, markdown-it-mark, markdown-it-footnote,
    markdown-it-deflist, markdown-it-abbr, markdown-it-container, and
    markdown-it-mathjax3 (math formulas); a sample-usage demo file exercises every
    plugin. (Plugin packages are regular devDependencies — the no-npm rule covers only
    fonts/icons.)

- [x] **MD-002** — Callouts (admonition containers)
  - **Category:** Markdown · **Deps:** MD-001, STYLE-001
  - **Acceptance criteria:** custom containers render minimal left-bar callouts
    (revised 2026-07-09: a colored bar on the left with an accent-colored title —
    no background fill, no frame/outline): `info`, `note` (alias of `info`), `tip`,
    `warning`, `danger`, `caution` (alias of `danger`), `important`, and `details`
    (collapsible, with an animated expand/collapse chevron); semantic colors from
    the Carbon layer; default titles localized; custom titles supported.

- [x] **MD-003** — Nerd Font icons in callouts
  - **Category:** Markdown · **Deps:** FONT-002, MD-002
  - **Acceptance criteria:** callout title lines gain a per-type Nerd Font glyph,
    and the details chevron's placeholder unicode `❯` is replaced by a Nerd Font
    chevron (keeping the expand/collapse rotation animation); glyphs render from
    the FONT-002 symbols-only Nerd Font stylesheet with a safe fallback when it
    fails to load; `docs/design/typography-and-icons.md` §2 is updated first to
    extend the Nerd Font scope to callout chrome (currently tool bar / status bar /
    explorer only).

- [x] **MD-004** — Typst math container (block + inline)
  - **Category:** Markdown · **Deps:** MD-001
  - **Acceptance criteria:** authors can write **Typst** math and have it
    rendered, alongside the existing MathJax path — the `$`/`$$` delimiters stay
    **LaTeX** (unchanged MD-001 behavior); a markdown container renders a block of
    Typst math, and ideally an inline form lets Typst math sit within a
    paragraph; the Typst and LaTeX delimiters/containers are unambiguous (no
    collision — e.g. `$$…$$` never routes to Typst); rendering works during SSR
    and after client navigation; malformed Typst input fails gracefully (no build
    crash, a visible error/fallback rather than blank); the container/inline
    syntax is documented and exercised in the markdown demo
    (`src/markdown-examples.md`, DEMO-001); any new dependency is a regular
    devDependency (the no-npm rule covers only fonts/icons) and its licence is
    noted. Math-font styling for both renderers is handled by FONT-005.
    *Landed 2026-07-20: `theme/markdown/typst.ts` registers a **block**
    container `::: typst … :::` (a raw-source block rule — Typst is not parsed
    as markdown) and an **inline** form `:typst[…]` (bracket-balanced, distinct
    opener — no overlap with the LaTeX `$` rule, so `$$…$$` never routes to
    Typst). Both emit inert, SSR-safe markup carrying the raw source in
    `.ct-typst__src` (the no-JS / pre-hydration fallback) beside an empty
    `.ct-typst__view`. `theme/composables/useTypst.ts` (called once from Layout,
    like useSwipers) lazily loads the `@myriaddreamin/typst.ts` WASM
    compiler/renderer (bundled via Vite `?url`, no runtime CDN) + the IBM Plex
    Math OTF, compiles each `.ct-typst` to SVG on mount and `onContentUpdated`,
    normalizes glyph fills to `currentColor`, and swaps the source for the
    render; a compile failure shows a visible error beside the kept source
    (never blank), and nothing runs during SSR/build (no crash possible).
    Styles in `styles/_math.scss` (block centered + h-scroll, inline scaled to
    text, `:not([hidden])` guard so the hidden source's `display` isn't
    out-specified). Demo: LaTeX and Typst math sections in
    `src/markdown-examples.md` (Input/Output, block + inline). Deps:
    `@myriaddreamin/typst.ts` + `-ts-web-compiler` + `-ts-renderer` (Apache-2.0)
    devDeps. Verified headless: block + inline compile to SVG, block source
    hidden post-render, malformed `:typst[…]` → `ct-typst--error` with visible
    message + kept source, no page errors, dark/light/paper, 360px no overflow.*

### i18n

- [x] **I18N-001** — Locale system scaffolding
  - **Category:** i18n · **Deps:** CONF-001
  - **Acceptance criteria:** all theme UI strings resolve through a locale layer
    integrated with VitePress `locales`; English defaults built in; adding a locale
    requires no component edits. The theme also ships with Chinese (Simplified) locale.

- [x] **I18N-002** — Temporary language switcher (placeholder shell)
  - **Category:** i18n · **Deps:** I18N-001
  - **Acceptance criteria:** the demo site configures VitePress `locales` (root
    `en-US` + `zh` with `lang: zh-CN`); the placeholder shell shows a language
    switcher when two or more locales are configured (hidden otherwise), with labels
    taken from the locale config and a localized `aria-label`; switching navigates to
    the equivalent path under the target locale (best effort — untranslated pages may
    404, as in the default theme); the built `/zh/` page renders the built-in zh-CN
    theme strings. Temporary: retired when the permanent switcher lands in the status
    bar (THEME-001, design-language.md §4) and settings panel (THEME-007).
    *Retired 2026-07-09: THEME-001's status-bar language switcher replaced it.*

- [x] **I18N-003** — URL-free language switching (rework of I18N-001/002 integration)
  - **Category:** i18n · **Deps:** I18N-001, I18N-002
  - **Acceptance criteria:** no `/<lang>/` URL segment anywhere — the VitePress
    `locales` trees and `src/zh/` are removed; the UI language is a client-side
    preference persisted in `localStorage` (`ct-lang`), defaulting to the site `lang`;
    switching updates theme strings in place (and `<html lang>`) with no navigation;
    `themeConfig.localeStrings` becomes a per-language map (`{ [tag]: partial table }`)
    so config can override or add whole languages; locale tables self-describe via a
    `lang.label` key; the temporary switcher operates on this mechanism; documented in
    design-language.md §9.

- [x] **I18N-004** — Localizable site/config text
  - **Category:** i18n · **Deps:** I18N-003
  - **Acceptance criteria:** a `LocalizableText` type (`string | { [tag]: string }`)
    with a resolver (exact tag → primary subtag → `en` → first entry) is the
    documented pattern for every user-facing text value in the config surface;
    `themeConfig.title`/`.description` accept it, falling back to the site config's
    `title`/`description` when unset; the shell and home placeholder render the
    localized values, and `document.title` + `meta[name=description]` follow the
    active language client-side (best effort — SSR head keeps the site-config
    defaults); the demo config exercises a per-language description; the misplaced
    top-level `localeStrings` is moved into `themeConfig`; recorded in
    design-language.md §9.

- [x] **I18N-005** — Canonical locale tags (`zh-CN` → `zh-Hans`, `en-US` → `en`)
  - **Category:** i18n · **Deps:** I18N-004
  - **Acceptance criteria:** built-in locale tags follow one rule — the minimal
    canonical BCP 47 tag: language subtag plus script subtag only where the script
    disambiguates (`zh-Hans`), never a region subtag (English's suppressed script
    makes it bare `en`); the Chinese table file, export, and registry key are renamed
    to `zh-Hans`; the demo site `lang` and per-language config maps use `en` /
    `zh-Hans`; region-tagged inputs (`zh-CN`, `en-US`) still resolve to the right
    table via the existing primary-subtag matching; docs and examples updated.

- [x] **I18N-006** — Localized auto-explorer titles
  - **Category:** i18n · **Deps:** THEME-012
  - **Acceptance criteria:** auto-discovered labels resolve `LocalizableText`
    from source-local JSON metadata first, then a page's frontmatter title
    metadata; plain VitePress string titles remain valid; resolution follows
    the existing exact-tag → primary-subtag → English → first-entry fallback,
    and no component contains hardcoded page labels.
    *Landed 2026-07-10: adjacent `explorer.json` metadata supplies folder
    overrides; localized `title` frontmatter is read from VitePress
    `__pageData`, and `ExplorerTree` resolves every generated label through
    the existing language resolver.*

- [x] **I18N-007** — Localized page content (`::: lang` blocks)
  - **Category:** i18n · **Deps:** I18N-003, MD-001
  - **Acceptance criteria:** an author can supply per-language versions of a
    page's body — the rendered content switches with the client-side UI
    language (`ct-lang`), no URL change, exactly like the localized `title`
    frontmatter drives the explorer label; a `::: lang <tag>` markdown
    container wraps each language's content, content left **outside** any
    `::: lang` block always shows, and the active block is chosen by the
    theme's standard fallback (exact tag → primary subtag → site default →
    first block); the site-default block is server-rendered visible (no flash,
    correct with JS off); `deep-dive.md` demonstrates it (English + Simplified
    Chinese bodies); recorded in `design-language.md` §9 and the user guide.
    *Landed 2026-07-12: `theme/markdown/localized-content.ts` registers the
    `::: lang <tag>` container → `<div class="ct-lang" data-ct-lang="tag">`
    (non-default-language blocks emitted `hidden` for a flash-free, JS-off-safe
    SSR); `useLocalizedContent()` (called once from Layout) groups adjacent
    `.ct-lang` siblings and reveals one per group via the shared fallback on
    mount / content update / language switch; `.ct-lang` is layout-neutral
    (`display: contents`) in `_content.scss`; `deep-dive.md` ships en +
    zh-Hans bodies; documented in design-language.md §9 and
    guide/getting-started.md. Verified headless.*

- [x] **I18N-008** — Localizable taxonomy term labels (tags & categories)
  - **Category:** i18n · **Deps:** POST-001, I18N-004
  - **Acceptance criteria:** tag (and category) *display* labels can be localized
    through a dedicated config — `themeConfig.taxonomy = { tags?, categories? }`,
    each a map of authored term name → `LocalizableText` — while slugs, URLs, and
    grouping identity stay derived from the authored frontmatter strings (terms
    without an entry render verbatim, the default); every surface that displays a
    term resolves the label against the active UI language and re-localizes in
    place (post byline/cards, tag & category indexes, per-term listing headings);
    documented in the i18n spec and the content architecture; verified on the
    rendered site.
    *Landed 2026-07-16 (same day as ARCH-002/003): `themeConfig.taxonomy =
    { tags?, categories? }` (config.ts — `TerminalTaxonomyConfig`, resolved to
    `{ tags: {}, categories: {} }` defaults), each an authored-term-name →
    `LocalizableText` map. Display-only: the framework-free `termLabel(term,
    labels, language)` in `theme/posts.ts` matches a term to its entry by exact
    name or shared slug (case-insensitive) and resolves against the active
    language, falling back to the verbatim term when unconfigured; slugs, URLs,
    and grouping identity always use the authored strings. The `useTaxonomy()`
    composable (`tagLabel`/`categoryLabel`, reactive on `language`) is consumed
    by `PostTaxonomy` (post byline + cards), `TagsIndex`, `CategoriesIndex`, and
    the `TermPosts` per-term heading, so every surface re-localizes in place on a
    language switch. Demo config localizes the `theme`/`color` tags and
    `Guides`/`Design` categories. Documented in design-language.md §9
    (localizable taxonomy labels) and content-architecture.md §7, plus
    guide/getting-started.md. Build green; rendered dist shows configured terms
    with their labels (`#color`, `Design`), unconfigured terms verbatim
    (`#vitepress`, `Ops`), and slugs unchanged (`/tags/color`,
    `/categories/design`).*

### Theme components

- [x] **THEME-001** — Layout shell: tool bar · viewport · status bar
  - **Category:** Theme · **Deps:** STYLE-001, FONT-001, FONT-002, I18N-001
  - **Acceptance criteria:** top tool bar, content viewport, and bottom status bar per
    `docs/design/design-language.md` §4–5 (rounded, floating finish); no third-party
    branding; all strings localized; major sections commented; styles in dedicated SCSS
    files.

- [x] **THEME-002** — File-explorer navigation sidebar
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** tree-style navigation of site content with TUI look;
    retractable/extendable on desktop via an explicit control, with collapsible tree
    nodes; contents easily configured via `themeConfig`; behaves as an off-canvas
    drawer on mobile; not rendered at all in paper mode.
    *Landed 2026-07-10: `themeConfig.explorer` tree (`{ text, link?, items? }`,
    LocalizableText labels); `Explorer.vue` + recursive
    `ExplorerTree.vue` in a new `.ct-main` shell row beside the viewport;
    tool-bar `[=]` toggle — desktop retract persisted as `ct-explorer`,
    ≤640px an off-canvas drawer with backdrop / close button / Esc /
    navigation dismissal; active page accent-highlighted; chevron & file
    glyphs Nerd-Font-gated; not rendered at all in paper mode or when
    unconfigured; styles in `styles/_explorer.scss`, state in
    `composables/useExplorer.ts`; spec note in design-language.md §4.*

- [x] **THEME-003** — Floating-window utilities (search / command palette)
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** floating panel component for search, command center, or other
    utilities; TUI-window look with rounded/floating finish; a single instance of (this type
    of) component is shared across all utilities; the component is hidden by default and can
    be opened programmatically; the component is dismissible via an explicit close control,
    clicking outside, or pressing `Esc`; presents as a full/near-full-screen sheet on mobile.
    This task only includes the implementation of the floating-window visual component
    and its interative behavior. Add a demo page that can be opened via `~` keyboard and
    a button in the tool bar. No actual logic needed behind the demo.
    *Landed 2026-07-12: shared `FloatingWindow.vue` instance rendered once from
    the layout, driven by the `useFloatingWindow()` singleton with
    `{ id, title(), component }` utility payloads (opening replaces the current
    utility, so at most one window exists); `role="dialog"` panel with focus
    moved in on open / restored on close, dismissed via title-bar close button,
    backdrop click, or `Esc`; ≤640px it becomes a near-full-screen sheet;
    styles in `styles/_window.scss` (z-40/50, above the explorer drawer; hidden
    in print). Temporary logic-free demo (`WindowDemo.vue` + `useWindowDemo`)
    opens via the `~` shortcut — ignored inside inputs/editable regions — and a
    tool-bar button; demo strings/button/wiring retire with SEARCH-002.
    Verified headless 18/18 incl. zh-Hans localization and modal backdrop
    blocking.*

- [x] **THEME-012** — Auto-discovered source file explorer
  - **Category:** Theme · **Deps:** THEME-011
  - **Acceptance criteria:** when enabled, the explorer discovers every Markdown
    page under `src/` without a hand-written tree;
    nested directories become folders, `index.md` becomes the folder link,
    standalone Markdown files become leaves, ordering is deterministic, and
    explicit `themeConfig.explorer` trees remain supported for backwards
    compatibility; the generated tree is available during SSR and client
    navigation and includes newly added source files after a rebuild.
    *Landed 2026-07-10: `explorer: "auto"` uses an eager Vite glob of
    `src/**/*.md` metadata, builds deterministic folder/file nodes with
    `index.md` links, and feeds the resolved tree through `useExplorer()` for
    SSR and hydration; explicit arrays remain unchanged.*

- [x] **THEME-013** — Source-local JSON explorer metadata
  - **Category:** Theme · **Deps:** THEME-012, I18N-006
  - **Acceptance criteria:** an adjacent `explorer.json` can configure an
    auto-discovered folder without adding a Markdown index or editing the
    VitePress site config; its localized `title` applies to that folder;
    removing `advanced-2/index.md` leaves
    `advanced-2/deep-dive.md` discoverable as a non-linked folder child; the
    JSON schema and example are documented.
    *Landed 2026-07-10: `useExplorer()` eagerly loads adjacent
    `explorer.json` metadata, the demo `advanced-2` index was removed, and the
    source/docs/config surfaces now describe the non-site-config contract;
    build and browser checks confirm the localized, index-less folder.*

- [x] **THEME-014** — Route-aware transient explorer expansion
  - **Category:** Theme · **Deps:** THEME-011, THEME-012
  - **Acceptance criteria:** when the active page is a folder index or a
    descendant leaf, every required ancestor folder is visibly expanded;
    route-driven expansion is not written to `ct-explorer-nodes` and is
    recalculated after navigation; explicit user toggles still use the existing
    persisted behavior and can override the temporary route reveal for the
    current page.
    *Landed 2026-07-10: active-link ancestry is derived recursively in
    `ExplorerTree`; route reveals and folder-index link navigation are not
    stored, navigation clears temporary overrides, and user chevron toggles
    remain persisted and can close a route-open folder for the current view.*

- [x] **THEME-015** — Remove explicit folder collapsed configuration
  - **Category:** Theme · **Deps:** THEME-014, THEME-013
  - **Acceptance criteria:** `collapsed` is removed from
    `TerminalExplorerItem`, source-local explorer JSON, and all folder
    resolution logic; folder expansion uses only depth defaults, transient
    active-route reveals, and persisted user toggles; the `advanced-2` demo,
    user guide, design specification, context cache, and task descriptions no
    longer document an explicit collapsed option.
    *Landed 2026-07-10: removed the field from the explorer item and JSON
    contracts, switched default expansion to depth only, updated documentation
    and cache entries, and verified build plus depth-based and route-aware
    browser behavior.*

- [x] **THEME-004** — Footer component
  - **Category:** Theme · **Deps:** THEME-001, CONF-001, CONF-002
  - **Acceptance criteria:** footer renders at the bottom of the main viewport, below
    the content, per `docs/design/design-language.md` §4 (footer) and
    `docs/design/ui-sketch.md` §5: separator rule, copyright row, and attribution row
    (“Powered by VitePress and VitePress Theme Terminal”); on desktop the attribution
    row's text is lighter than the copyright row's (ui-sketch.md §5 note), with the
    lighter tone derived per the color rules. Configurable via `themeConfig`: RSS link
    (icon shown only when a feed is configured) and an easily editable social-icon
    list (Font Awesome); the copyright author and the license icons are driven by the
    author & license system (CONF-002). Fixed strings localized; dedicated SCSS; rows
    stack on mobile per the sketch caption. The fully-custom section above the footer
    is THEME-006.
    *Landed 2026-07-10: `SiteFooter.vue` inside `.ct-viewport` after `.ct-content`
    (viewport is now a flex column so the footer pins to the panel bottom on short
    pages); `themeConfig.footer = { rss?, social? }`; localized `{year}/{author}` +
    `{vitepress}/{theme}` placeholder strings; desktop-lighter attribution tone
    derived via `color-mix`; styles in `styles/_footer.scss`; RSS renders as an
    orange icon + "RSS" wordmark (`--ct-rss` over Carbon orange) with the license
    glyphs as one tight cluster; implemented note in design-language.md §4.*

- [x] **THEME-005** — Tool bar configurability & extras
  - **Category:** Theme · **Deps:** THEME-001, CONF-001
  - **Acceptance criteria:** navigation entries are easy to configure via
    `themeConfig`; the color-mode (theme) switcher lives in the tool bar
    (landed early via THEME-010); an
    extensible icon-slot mechanism lets extra feature icons (e.g. search trigger,
    important social links) be added from configuration without component edits.
    *Landed 2026-07-13: `themeConfig.toolbar = { nav?, actions? }` (config.ts —
    `TerminalNavItem` `{ text: LocalizableText, link }` + `TerminalToolbarAction`
    `{ icon, link, label? }`, both defaulting to `[]`). `ToolBar.vue` renders the
    `nav` tabs after the built-in `~/home` tab (localized labels, active when the
    link maps to the current page via the shared `linkRelativePath()`, external =
    `_blank`) and the `actions` as extra Font Awesome icon anchors **before** the
    built-in search + color-mode controls (which stay anchored at the right edge).
    The active-matcher/external-link helpers were extracted to
    `utils/pagePath.ts` (`isExternalLink`/`linkRelativePath`) and shared with
    `ExplorerTree.vue`. Demo config adds a `guide` tab + a GitHub action icon;
    documented in design-language.md §4 (tool bar note) and ui-sketch.md §1.
    Verified headless 11/11 (nav/action render, active state on navigation,
    zh-Hans tab localization, external target, no underline) + explorer
    regression.*

- [x] **THEME-006** — Fully-custom section above the footer
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** a section directly above the footer whose entire content
    is rendered from a user-supplied Vue file; renders nothing when the user provides
    none; the wiring mechanism is documented.
    *Landed 2026-07-12: the footer is wrapped in `.ct-footer-region` (Layout.vue),
    which owns the **full separator** (edge-to-edge `--ct-border` `border-top`, before
    the entire footer section) and pins the region to the viewport bottom. The custom
    section is the named `pre-footer` Vue **layout slot** — a user supplies it by
    extending the theme with a wrapper Layout that fills `#pre-footer` (`Layout` is now
    exported from `theme/index.ts`); unfilled it renders nothing. When filled, Layout
    passes `divided` to `SiteFooter`, adding the **subtler inner separator**
    (`.ct-footer--divided`: a `--ct-border` pseudo-element rule **inset** by the
    footer's horizontal padding so it does not reach the panel edges — matching the
    search window's hint rule) between the custom section and the standard footer.
    Documented in design-language.md §4 and ui-sketch.md §5. Verified
    headless: default = region + full separator only (no `.ct-prefooter`, footer not
    `--divided`); filled = `.ct-prefooter` + `.ct-footer--divided`, with the inner
    `::before` rule inset 24px (1.5rem) on each side while the region full separator
    spans edge to edge. A temporary demo ships the pattern: `DemoLayout.vue` (the demo site's
    registered Layout) fills `#pre-footer` with `PreFooterDemo.vue` — a Nerd-Font logo
    glyph + localized theme name on the left, and a Font Awesome icon, a Nerd Font icon,
    and a localized `footer.demoCustom` label on the right; styles in
    `styles/_prefooter-demo.scss`. Verified headless: renders in the slot, left/right
    split, accent glyphs with NF gating + fallback, label/name re-localize on switch.*

- [x] **THEME-007** — Settings panel (floating window)
  - **Category:** Theme · **Deps:** THEME-001, CONF-001, I18N-001, FONT-001
  - **Acceptance criteria:** a hovering TUI-window settings panel **without** shell
    prompt; the first version only offers font configuration and language switching;
    choices persisted; full/near-full-screen sheet on mobile; strings localized.
    *Landed 2026-07-12: `useSettings()` opens a prompt-less two-pane utility in the
    shared floating window from the tool-bar gear — a **Fonts** pane (content font
    family Default/Sans/Serif/Mono + size Small/Medium/Large, `SettingsFonts.vue`)
    and a **Language** pane (in-place UI-language switch, `SettingsLanguage.vue`).
    Font preferences persist in `localStorage` (`ct-font-family`/`ct-font-size`),
    restored pre-paint onto `<html data-ct-font-*>` by the head script (no flash),
    and mapped in `styles/_settings.scss` to `--ct-content-font`/`-font-size` on
    `.ct-content`; state in `composables/useFontSettings.ts`. Mobile = the window's
    near-full-screen sheet; all strings localized. Verified headless 25/25 with
    STYLE-004.*

- [x] **THEME-008** — Fixed shell frame: viewport-contained scrolling (THEME-001 fix)
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** the shell is a fixed full-height frame — the tool
    bar, the status bar, and the viewport panel's rounded frame never scroll;
    article content scrolls **inside** `.ct-viewport` and clips at its edges,
    never showing through the gaps between panels; reading progress tracks the
    panel scroll; navigating resets the panel to the top, and URL-hash /
    in-page anchor links scroll to their target inside the panel; printing
    still outputs the full article (the frame releases its fixed height);
    decision recorded in design-language.md §5.

- [x] **THEME-009** — Status bar: back-to-top button
  - **Category:** Theme · **Deps:** THEME-001, THEME-008
  - **Acceptance criteria:** an icon-only button (Font Awesome, general-icon
    context per `docs/design/typography-and-icons.md` §2) in the status bar's
    right segment cluster smooth-scrolls the viewport panel back to the top;
    accessible name/tooltip localized (`status.backToTop`); styled in the
    status bar's dedicated SCSS; remains available in the reduced mobile
    segment set; recorded in `design-language.md` §4 (status bar role).

- [x] **THEME-010** — Status bar polish & tool-bar mode switcher (rework)
  - **Category:** Theme · **Deps:** THEME-001, THEME-009
  - **Acceptance criteria:** thin visual separators divide the top-level
    segments of both status-bar clusters; the reading-progress % and the
    back-to-top button form one tight sub-cluster with no divider between
    them; the status bar's color-mode element becomes a non-interactive
    indicator; an icon-only color-mode cycle button lives in the tool bar's
    right action area (its permanent home per THEME-005), localized;
    `design-language.md` §4 table rows updated for both bars.

- [x] **THEME-011** — Explorer rework: NeoVim-style file browser
  - **Category:** Theme · **Deps:** THEME-002
  - **Acceptance criteria:** explorer rows render in the NeoVim file-browser
    idiom — chevron plus Nerd Font folder (closed/open) and file glyphs, gated
    behind the font-loaded flag with the plain `❯`/`-` fallback; default
    expansion is depth-based: first-layer folders open, deeper folders
    collapsed; every folder's
    expanded state is remembered (persisted and restored across reloads); a
    folder node that carries a `link` (its index page) navigates there **and**
    expands on label click, while its chevron only toggles; demo pages exercise
    all of it (a `guide/` section with an index page, a child page, and a
    nested folder with its own index) and the demo explorer config covers them;
    documented in design-language.md §4.
    *Landed 2026-07-10: icon column (`nf-fa-folder`/`folder_open`/`file_o`)
    NF-gated with the plain-marker fallback; per-folder state store in
    `useExplorer` persisted as `ct-explorer-nodes` (keyed by raw config-text
    path, stable across language switches), precedence stored > depth default;
    folder-link label navigation expands transiently (never
    persists), while the chevron remains the remembered user toggle; demo pages
    `src/guide/{index,getting-started,advanced/index,
    advanced/deep-dive}.md` + demo tree in config.mts; verified headless
    25/25.*

- [x] **THEME-016** — Floating-window title-bar icons
  - **Category:** Theme · **Deps:** THEME-003
  - **Acceptance criteria:** a utility opened in the shared floating window can
    supply an optional icon (Font Awesome classes, general-icon context per
    `docs/design/typography-and-icons.md` §2) rendered in the title bar before
    the title; utilities without an icon render exactly as before; the icon is
    decorative (hidden from assistive tech — the dialog keeps its text label);
    the demo utility exercises it; documented in the THEME-003 notes in
    `design-language.md` §4; styles stay in `styles/_window.scss`.
    *Landed 2026-07-12: optional `icon` on `FloatingWindowUtility`, rendered
    in `FloatingWindow.vue` as an `aria-hidden` accent glyph inside
    `.ct-window__title`; `.ct-window__icon` styles in `_window.scss`; the
    demo passes `fa-solid fa-window-restore` (matching its tool-bar trigger).
    Verified headless 5/5 — glyph drawn from the FA face, dialog label stays
    the text title.*

- [x] **THEME-017** — TUI window chrome rework: border titles, panes, text controls
  - **Category:** Theme · **Deps:** THEME-003, THEME-016
  - **Acceptance criteria:** the floating window renders in the Unicode-frame TUI
    idiom — a utility is composed of one or more **panes**, each its own bordered
    box whose title (with the optional THEME-016 icon) sits **on the top border
    line** (text-over-border, like the sketch frames); panes stack with the
    floating gap and carry separate titles and content components, so a utility
    like the find palette can pair an input box with a results box; the close
    control renders text-based (`[x]` on the first pane's border) instead of an
    icon button; dismissal (close/backdrop/`Esc`), focus handling, and the mobile
    near-full-screen sheet are unchanged (on mobile the last pane grows to fill
    the sheet); the demo exercises two panes; documented in
    `design-language.md` §4 and `ui-sketch.md` §2.
    *Landed 2026-07-12: utility payload reworked to
    `{ id, label(), panes: [{ title(), icon?, component }] }`; the window
    container is an invisible flex stack (gap = `--ct-gap`) of framed pane
    `<section>`s; `.ct-window__pane-title` and the literal `[x]`
    `.ct-window__close` sit on the border via absolute positioning +
    `translateY(-50%)` with a surface backing masking the line; pane bodies
    are the scroll regions; demo split into WindowDemo (description) +
    WindowDemoHints (hints pane, new `window.demoHintsTitle` string).
    Verified headless 15/15 — border-centered captions, text `[x]`, 12px
    inter-pane gap, all dismissals, mobile sheet with the last pane filling.*

- [x] **THEME-018** — Search-shaped floating-window demo (`/`)
  - **Category:** Theme · **Deps:** THEME-003, THEME-016, THEME-017
  - **Acceptance criteria:** a second temporary demo utility, opened via the `/`
    keyboard shortcut (ignored while typing in inputs/editable regions, like
    `~`), renders the find-palette shape from `ui-sketch.md` §2 — two panes: a
    **search input** pane (static field with a prompt glyph and a magnifier
    border-title icon) over a **results** pane (illustrative static rows plus a
    keyboard hint row); it shares the one floating-window instance (opening it
    replaces the window demo and vice versa); all labels localized (result
    paths are literal identifiers, like the shell prompt); documented in the
    THEME-003 notes in `design-language.md` §4 and `ui-sketch.md` §2; retired
    with the rest of the demo when the find palette lands (SEARCH-002).
    *Landed 2026-07-12: `useSearchDemo()` opens a two-pane utility — `SearchDemo.vue`
    (static `<input type=search>` + `>` prompt, magnifier border-title icon) over
    `SearchDemoResults.vue` (three localized-label/literal-path rows + hint row);
    `/` bound via a shared `useKeyShortcut()` helper in `useWindowDemo.ts`
    (`useWindowDemoShortcut` → `useWindowDemoShortcuts`, now binding `~` and `/`);
    9 new `window.search*` strings; styles in the temporary block of
    `_window.scss`. Verified headless 16/16 — `/` open + input guard, two panes,
    single-instance swap with the `~` demo, zh-Hans localization, mobile sheet.*

- [x] **THEME-019** — Status bar: live state chip, blinking cursor, clock, settings gear
  - **Category:** Theme · **Deps:** THEME-001, THEME-007, THEME-009, THEME-010
  - **Acceptance criteria:** the left mode chip reflects the real page state —
    `HOME` on the home page, `404` on the not-found page, `READ` on a regular
    article (labels localized, with a per-state modifier class so `404` can take
    the error tint); a blinking block cursor trails the current location (a hard
    steps blink, disabled under `prefers-reduced-motion`); a live `HH:MM:SS`
    clock sits at the right end of the status bar, client-only and SSR-safe
    (empty until mounted, interval cleared on unmount); the settings gear moves
    out of the tool bar into the status bar's right controls (`useSettings` →
    `openSettings`); all strings localized; on mobile the path/cursor/clock are
    hidden while the settings control stays reachable; recorded in
    `design-language.md` §4 (status bar row + note) and `ui-sketch.md` §1.
    *Landed 2026-07-12: `StatusBar.vue` computes a `state` from
    `page.isNotFound` / `frontmatter.home` (→ `status.notFound`/`.home`/`.read`,
    localized) driving `.ct-statusbar__chip--{notfound,home,read}` (404 = error
    tint). The location now sits in a `.ct-statusbar__path` wrapper (single
    divided segment) trailed by `.ct-statusbar__cursor` — a main-color
    underscore bar (baseline-aligned) with a hard `ct-cursor-blink` steps
    animation, held steady under `prefers-reduced-motion`. New `composables/useClock.ts` (SSR-safe, empty
    until mounted, interval cleared on unmount) feeds a `v-if`-gated
    `.ct-statusbar__clock` (`HH:MM:SS`, tabular-nums) at the far right. The
    settings gear moved from `ToolBar.vue` into the status bar's right controls
    (`useSettings` → `openSettings`). Mobile hides `.ct-statusbar__path` +
    `.ct-statusbar__clock`, keeps the gear. New strings
    `status.home/.notFound/.clock` (en + zh-Hans). Verified headless 20/20.*

- [x] **THEME-020** — Tool bar nav expansion customization: allow submenus instead of just a flat list of links
  - **Category:** Theme · **Deps:** THEME-005
  - **Acceptance criteria:** the tool bar's navigation can be configured with a
    tree instead of a flat array, so a top-level tab, if it is only a link, it stays
    with current behavior, but if it has children links, it requires a link but also an array of
    child text, link, and icon, and shows a dropdown with its children when it's
    being hovered above; the submenu is a floating panel with a TUI-window look (rounded/floating
    finish) and a small drop shadow; the submenu closes when the user no longer hovers over the
    top-level tab or the submenu.
    *Landed 2026-07-16: `TerminalNavItem` gained optional `items?:
    TerminalNavChild[]` (`{ text, link, icon? }` — pure links, no deeper
    nesting; the parent tab still requires its own `link`). `ToolBar.vue` wraps
    each nav tab in a `.ct-toolbar__navitem` anchor; a tab with children gets a
    decorative FA caret and a `.ct-toolbar__submenu` dropdown — a floating TUI
    panel (`--ct-border` frame, `--ct-radius`, surface bg, small drop shadow,
    z-30) of icon + localized-label child rows. Open/close is pure CSS
    `:hover`/`:focus-within` on the wrapper (an invisible `::before` bridge
    spans the floating gap so the pointer can travel into the panel), so
    leaving both the tab and the panel closes it and keyboard focus reveals it.
    The parent tab highlights when its own link OR any child's maps to the
    current page; flat tabs render exactly as before; mobile hides the whole
    tabline (explorer drawer takes over), making the hover submenu desktop-only.
    Demo: the `guide` tab carries Getting Started + Advanced children.
    Documented in design-language.md §4 (tool bar + nav-submenu note, which
    also catches up the `icon` field) and ui-sketch.md §1 (dropdown sketch).
    Verified headless 21/21 (structure, hidden-by-default, hover open/panel
    hover/close, TUI look, child navigation + parent/child active accents,
    focus-within, zh-Hans re-localization, mobile) + dark/light screenshots.*

- [x] **THEME-021** — Concise explorer drawer rows (density rework of the MOBILE-001 explorer growth)
  - **Category:** Theme · **Deps:** THEME-011, MOBILE-001
  - **Acceptance criteria:** the mobile explorer drawer returns to the desktop
    tree's tight column layout — chevron, leaf-marker, and icon columns at
    their compact desktop widths (1.25rem), same indentation, no 44px-wide
    marker columns — while every interactive row element keeps a ≥44px tap
    box: rows stay ≥44px tall, and the chevron's box reaches 44×44 via the
    documented §8 padding + negative-margin pattern (its grown box may overlay
    the adjacent non-interactive icon column and the label's leading edge
    only); the desktop tree is unchanged; the MOBILE-001 overflow + touch
    target audits stay green; recorded in the explorer spec
    (design-language.md §4); verified on the rendered site.
    *Landed 2026-07-19: the `_explorer.scss` mobile block's chevron is
    tap-box wide (`width: var(--ct-tap)`) with `margin-inline-end:
    calc(1.25rem - var(--ct-tap))`, laying the icon/label out as if the
    column were its visual 1.25rem; `position: relative; z-index: 1` floats
    the button's grown box over the decorative icon column, and
    `text-align: start` + `padding-inline-start: 0.35rem` keeps the glyph in
    the desktop column position. The MOBILE-001 44px-wide leaf-mark override
    was removed (back to the base 1.25rem). Verified headless at 360px:
    chevron rect 44×44, icon at +22px, labels at +44px (previously +68px),
    leaf and folder labels aligned, rows 44.2px, a real mouse click on the
    visual chevron strip toggles the folder, and a folder-label click still
    navigates (the overlay steals only the leading pixels); full-site
    overflow + touch-target audits re-run green (33/33 pages).*

- [x] **THEME-022** — Tool-bar overflow drawer: right-side nav/actions drawer
  - **Category:** Theme · **Deps:** THEME-001, THEME-005, THEME-020, MOBILE-001
  - **Acceptance criteria:** when the tool bar cannot display the title, nav
    tabs, and action icons in full, the nav (including submenu children,
    rendered as indented rows) and ALL action icons (configured slots plus the
    built-in search and color-mode controls) move into a dedicated right-side
    off-canvas drawer opened by a localized expander control at the bar's
    right edge — the bar then shows only the explorer toggle, the brand, and
    the expander; the collapse is driven by measured overflow (works at any
    width, e.g. many tabs on a mid-size window), with ≤640px always collapsed
    as the CSS/no-JS floor so SSR shows no mobile flash; the drawer mirrors
    the explorer drawer's TUI presentation on the right side (fixed panel over
    a dimmed backdrop, explicit close control, Esc / backdrop / navigation
    dismissal, ≥44px rows); opening either side's drawer closes the other;
    active page rows carry the accent; the mode row applies immediately
    without closing the drawer, the search row opens the find palette; widths
    re-checked on resize, language switch, and font readiness; strings
    localized; styles in dedicated SCSS; documented in design-language.md
    §4/§8 and ui-sketch.md; verified headless at 360px and at a mid-width
    forced-overflow case, plus a desktop no-regression check.
    *Landed 2026-07-19: new `composables/useNavDrawer.ts` singleton
    (`collapsed` + `drawerOpen`; `openDrawer()` closes the explorer drawer —
    one side at a time, the reverse handled by the tool bar's explorer
    toggle). `ToolBar.vue` owns the measurement: the bar's flex items SHRINK
    (brand truncates) before anything overflows, so a momentary
    `--measuring` class (flex-shrink 0 + visible title overflow, added and
    removed within one synchronous layout read — never painted) yields the
    natural width; the bar collapses when it exceeds the client width,
    remembers `requiredWidth`, and re-expands optimistically (render, then
    rAF re-confirm) once the width could fit again. Re-evaluated via
    ResizeObserver, a `language` watch (label widths change), and
    `document.fonts.ready`; ≤640px is forced-collapsed via matchMedia + CSS
    floor (`_toolbar.scss` hides nav+actions and shows `.ct-toolbar__more`
    pre-hydration — the expander is always in the SSR markup). The base
    `.ct-toolbar__more{display:none}` must FOLLOW the `.ct-toolbar__action`
    rule (the expander carries both classes; source-order tie). New
    `NavDrawer.vue` (rendered from Layout) — MENU header + close, `~/home` +
    nav rows with THEME-020 children as indented rows (children carry their
    own accent; the parent highlights on its own link only), divided actions
    section (configured slots + built-in Search and Switch-color-mode rows);
    navigation/Esc/backdrop dismiss, mode row cycles and keeps the drawer
    open, search row closes it and opens the palette, and the drawer
    auto-closes if the bar re-expands (its trigger disappears). New
    `nav.menu`/`nav.menuClose` strings (en + zh-Hans); styles in new
    `styles/_navdrawer.scss` (mirrors `_explorer.scss` on the right,
    width-independent, `--ct-tap` rows, print-hidden). Verified headless
    31/31 — 360px bar composition/tap boxes, drawer behaviors incl. zh-Hans,
    720px measured collapse over the docked explorer, 1280px expanded
    tabline + hover submenus intact, resize collapse/re-expand cycle, and
    the full-site MOBILE-001 audits re-run green (33/33).*

- [x] **THEME-023** — Heading anchor links (jump-to via URL hash)
  - **Category:** Theme · **Deps:** THEME-008, STYLE-005
  - **Acceptance criteria:** every article heading (`h1`–`h6` in `.ct-content`)
    carries a stable slug `id` and a clickable anchor permalink — a `#`-style
    control revealed on hover/focus and keyboard-reachable — that, when activated,
    sets the URL hash to that heading; loading or navigating to a URL with a
    `#slug` scrolls the target heading into view **inside the viewport panel**
    (THEME-008's fixed-frame scrolling — never the window), both on first load and
    after client-side navigation; the anchor control's accessible label is
    localized and it presents a ≥44px tap target on mobile (§8); styling follows
    the design language across the three color modes, uses only derived accent
    colors, and lives in dedicated SCSS; the behavior is recorded in
    `docs/design/design-language.md`.
    *Landed 2026-07-20: VitePress already emits the slug `id` + `.header-anchor`
    link; the theme adds the presentation and localization. `styles/_anchors.scss`
    draws a `#` (`::before`) hidden at `opacity: 0` until the heading is
    `:hover`ed or the anchor is `:focus-visible` (accent `--ct-link`/`--ct-link-hover`
    only), and at ≤640px keeps it visible with a ≥44px tap box via the §8
    padding + negative-margin pattern (print-hidden). `composables/useHeadingAnchors.ts`
    (called once from Layout, like useCodeCopy) re-writes each anchor's
    `aria-label`/`title` from the locale `anchor.permalink` (`{title}` = heading
    text minus the anchor) on mount / `onContentUpdated` / language switch.
    In-panel hash scrolling was already handled by `useViewportScroll` (THEME-008)
    since the anchors live inside `.ct-viewport`. New `anchor.permalink` string
    (en + zh-Hans). Verified headless: localized aria-label, hover reveal
    (0→1 opacity), anchor click scrolls the panel + sets `#hash` while the window
    stays unscrolled, `#slug` deep-link scrolls the panel on load, zh-Hans
    re-localization, 360px anchor tap box 44px + no overflow.*

- [x] **THEME-024** — Article table of contents (right-side, clickable & jumpable)
  - **Category:** Theme · **Deps:** THEME-001, THEME-008, THEME-023
  - **Acceptance criteria:** article pages render a table of contents to the right
    of the content, built from the page's headings (default `h2`–`h3`, depth
    configurable via `themeConfig`); each entry is a link that jumps to its heading
    using the THEME-023 anchors, scrolling within the viewport panel; the entry for
    the section currently in view is highlighted as the reader scrolls (scroll-spy),
    updating on scroll and after navigation; the panel presents in the theme's TUI
    idiom with derived accent colors across the three modes; it renders only when
    the page has enough headings and can be disabled via config; it is not rendered
    in paper mode / print; on narrow viewports it collapses out of the reading
    column per `docs/design/design-language.md` §8 (hidden or relocated, never
    overflowing); the "on this page" label and any controls are localized; styles
    live in dedicated SCSS; documented in `design-language.md` §4 and
    `docs/design/ui-sketch.md`.
    *Landed 2026-07-20: new `components/ArticleToc.vue`, placed in the `.ct-main`
    row after the viewport (Layout) so it renders as a fixed panel to the right
    of the content, mirroring the explorer on the left (`styles/_toc.scss` — mono
    TUI panel, own scroll, depth-indented entries, the active row's left rail lit
    `--ct-main-border`). It reads the headings from the rendered `.ct-content` DOM
    (so it follows localized `::: lang` bodies) on mount / `onContentUpdated` /
    language switch; scroll-spy listens to `.ct-viewport` scroll (rAF-throttled,
    getBoundingClientRect vs the panel top + a bottom-of-panel = last-heading
    guard). Entry clicks `scrollIntoView` smooth inside the panel + `history.
    replaceState` the `#hash` (never a router window scroll). New
    `themeConfig.toc = { enabled?, minLevel?, maxLevel?, minHeadings? }`
    (config.ts — `TerminalTocConfig`, `resolveToc()` clamps levels to 1–6, swaps a
    reversed pair; defaults `true`/`2`/`3`/`2`). Renders only on post/series/normal
    page types (via `resolvePageType`) with ≥`minHeadings` headings and `mode !==
    paper`; hidden ≤1023px (CSS) and in print. New `toc.title` string (en +
    zh-Hans). config.mts carries a commented `toc` example. Verified headless:
    TOC + items at 1400px, "On this page" title, click jumps + active class,
    scroll-spy active updates on scroll, deep-link scroll, zh-Hans "本页目录",
    absent in paper mode / at 900px / on the home page, 360px no overflow.*

- [x] **THEME-025** — Adjustable explorer width (drag handle, min/max, persisted)
  - **Category:** Theme · **Deps:** THEME-002, THEME-011
  - **Acceptance criteria:** on desktop the file-explorer sidebar's width can be
    adjusted by dragging a handle on its inner edge; the width is clamped between a
    documented **minimum and maximum** (never collapsing the tree unreadably nor
    crowding the viewport); the chosen width persists across reloads and navigation
    (localStorage, alongside the existing `ct-explorer` retract state) and is
    applied pre-paint without a flash; the resize handle is keyboard-operable with a
    localized accessible name; the default width is unchanged until the user resizes;
    the mobile ≤640px off-canvas drawer behavior and the not-rendered-in-paper-mode
    rule are unaffected; styles live in dedicated SCSS and the feature is recorded
    in the explorer spec (`design-language.md` §4).
    *Landed 2026-07-23: a shared drag handle (`components/ResizeHandle.vue` +
    `composables/useResizableSidebar.ts`, styles `styles/_resize.scss`) placed
    by Layout on the explorer's inner (right) edge widens it on drag-right,
    clamped **180–420px** (default 15rem/240px). The width persists as
    `ct-explorer-width` (px int) and applies pre-paint via the `head.ts` restore
    script setting `--ct-explorer-width` on `<html>` (read by `_explorer.scss`
    with a rem fallback). Handle is an ARIA `separator` (localized
    `explorer.resize`, `aria-valuemin/max/now`, `←`/`→`/`Home`/`End`
    keyboard). Bounds shared via `utils/sidebarWidth.ts` (imported by both the
    composable and head script). The handle is a zero-width `.ct-main` flex item
    with a negative inline margin to cancel the extra flex gap; hidden ≤640px and
    in print; only rendered while the explorer is docked and extended. Verified
    headless 22/22 (drag widen, persist, pre-paint restore, clamp over-max→420,
    keyboard widen + aria, hidden @360, no overflow).*

- [x] **THEME-026** — Adjustable TOC width (drag handle, min/max, persisted)
  - **Category:** Theme · **Deps:** THEME-024
  - **Acceptance criteria:** on desktop the article table-of-contents sidebar's
    width can be adjusted by dragging a handle on its inner edge; the width is
    clamped between a documented **minimum and maximum** (never collapsing the TOC
    unreadably nor crowding the viewport); the chosen width persists across reloads
    and navigation (localStorage) and is applied pre-paint without a flash; the
    resize handle is keyboard-operable with a localized accessible name; the default
    width is unchanged until the user resizes; the mobile ≤640px off-canvas drawer
    behavior and the not-rendered-in-paper-mode rule are unaffected; styles live in
    dedicated SCSS and the feature is recorded in the TOC spec (`design-language.md`
    §4).
    *Landed 2026-07-23: reuses the THEME-025 handle machinery on the TOC's inner
    (left) edge with the opposite drag sign (drag-left widens), clamped
    **160–400px** (default 14rem/224px), persisted `ct-toc-width` and applied
    pre-paint as `--ct-toc-width` on `<html>` (read by `_toc.scss`). Localized
    `toc.resize`, keyboard-operable, hidden ≤1023px + print. Layout renders the
    handle only while the outline is docked (visible and not retracted), for
    which `ArticleToc` shares its on-screen state via the new
    `composables/useToc.ts`. Verified headless: drag-left widen (224→274),
    persist, hidden @900.*

- [x] **THEME-027** — Retractable TOC on Desktop (toggle button, persisted, pre-paint)
  - **Category:** Theme · **Deps:** THEME-024
  - **Acceptance criteria:** on desktop the article table-of-contents sidebar can be
    retracted via a toggle button; the retracted state persists across reloads and
    navigation (localStorage) and is applied pre-paint without a flash; the toggle
    button is keyboard-operable with a localized accessible name; the default state
    is unchanged until the user toggles; the mobile ≤640px off-canvas drawer behavior
    and the not-rendered-in-paper-mode rule are unaffected; styles live in dedicated
    SCSS and the feature is recorded in the TOC spec (`design-language.md` §4).
    *Landed 2026-07-23: a `[«]` control in the TOC header (`ArticleToc.vue`)
    collapses the outline to a slim vertical **reopen rail** (`.ct-toc-rail`,
    "on this page" caption) on the reading column's right edge; clicking the rail
    restores it. State persists in `localStorage` (`ct-toc`) and is mirrored
    pre-paint by the head script as `<html data-ct-toc="closed">`; `useToc` seeds
    its ref from that attribute synchronously, so a retracted outline paints as
    the rail with no expanded flash (TOC is client-rendered — no SSR mismatch).
    Controls localized (`toc.collapse`/`toc.expand`), keyboard-operable; rail
    hidden ≤1023px + print. Verified headless: collapse→rail, persist=closed,
    reload paints rail (no flash) with `data-ct-toc` set pre-paint, rail
    reopens=open.*

- [x] **THEME-028** — Link anchor copy: copy the full URL of a heading anchor to the clipboard
  - **Category:** Theme · **Deps:** THEME-023
  - **Acceptance criteria:** when a heading anchor is clicked, the full URL of that
    heading (including the `#slug`) is copied to the clipboard; a temporary
    notification appears confirming the copy action; the notification is accessible
    and localized; styles live in dedicated SCSS and the feature is recorded in the
    anchor link spec (`design-language.md` §4).
    *Landed 2026-07-23: `composables/useHeadingAnchors.ts` (already the anchors'
    label localizer) gained one **delegated** document click listener matching
    `.ct-content .header-anchor`; it copies the anchor element's resolved
    `href` — the fragment-only attribute resolved against the document, so
    origin + path + query + `#slug`, correct under `base` and either URL style
    (THEME-030) — via `navigator.clipboard`, then raises the localized
    `anchor.copied` notification through the THEME-029 queue. The copy is purely
    additive (no `preventDefault`): the hash still lands in the URL and
    `useViewportScroll` still scrolls the panel. A clipboard failure (insecure
    context / denied) copies nothing and shows nothing — never a false
    confirmation. New string `anchor.copied` (en + zh-Hans); spec in
    design-language.md §4 (heading anchors → link copy). Verified headless:
    clipboard holds the exact absolute `…#slug` URL, hash still set, second
    anchor copies its own URL, zh-Hans message.*

- [x] **THEME-029** — Link anchor copy feedback: show a temporary notification when a heading anchor is copied
  - **Category:** Theme · **Deps:** THEME-028
  - **Acceptance criteria:** when a heading anchor is clicked and the URL is copied
    to the clipboard, a temporary notification appears confirming the copy action;
    the notification is accessible and localized; it disappears after a short
    duration or can be dismissed by the user; styles live in dedicated SCSS and the
    feature is recorded in the anchor link spec (`design-language.md` §4).
    *Landed 2026-07-23: built as the theme's general transient-notification
    ("toast") surface rather than an anchor-only affordance, so later silent
    actions can reuse it. `composables/useNotifications.ts` is a module-singleton
    queue (`notify(localizedMessage)` / `dismiss(id)`, 3s auto-dismiss, max 3
    visible, a repeated message replacing the visible one with a fresh id so it
    re-enters with its animation); `components/NotificationStack.vue` renders it
    once — Layout places it as a **zero-height shell row** between `.ct-main` and
    the status bar (negative top margin cancelling the extra flex gap, the
    `_resize.scss` trick), so the stack anchors bottom-right one gap above the
    status bar and grows upward over the content without changing the fixed
    frame's layout. Each box is a TUI surface with a derived-accent border and a
    text `[x]` control (the THEME-017 idiom). The stack container is a persistent
    `role="status"` / `aria-live="polite"` region (present and empty during SSR —
    nothing to mismatch on hydration). Styles `styles/_notifications.scss`
    (z-35 between the explorer drawer and the window layer, ≤640px full-width
    with a ≥44px dismiss tap box, print-hidden, reduced-motion honored). New
    string `notification.dismiss` (en + zh-Hans); spec in design-language.md §4.
    Verified headless 21/21 with THEME-028/030 (live region empty at rest, toast
    above the status bar bottom-right, manual dismiss, ~3s auto-dismiss, zh-Hans
    strings, frame still non-scrollable, 360px 44px tap box + no overflow,
    `display:none` in print, no page errors).*

- [x] **THEME-030** — No `.html` suffix in URLs: configure the site to generate clean URLs without the `.html` suffix
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** the site is configured to generate clean URLs without the
    `.html` suffix; all internal links are updated accordingly; external links to
    the site should still work with or without the `.html` suffix; document
    the feature in the site configuration guide (`docs/configuration/clean-urls.md`)
    when implementing.
    *Landed 2026-07-23: `cleanUrls: true` in `.vitepress/config.mts`. The theme
    needed no code change — its own surfaces (tool-bar `nav`, explorer tree,
    `PostsIndex` pagination) already emit extensionless links, active-page
    matching goes through `linkRelativePath()` (`utils/pagePath.ts`), which
    strips `.html` before comparing, and the content-loader URLs the post/series
    data build on follow the option automatically. `.html` files are still
    written to `dist`, so old `/page.html` links resolve directly while `/page`
    resolves through the host's standard extension fallback (Cloudflare Pages /
    Netlify / Vercel / GitHub Pages, `pnpm preview`'s sirv, and `pnpm dev`).
    Documented in the new `docs/configuration/clean-urls.md`, indexed from
    `docs/README.md`. Verified: dist links carry no `.html` (34 checked on a
    rendered page), and both `/guide/getting-started` and
    `/guide/getting-started.html` return 200 on the preview server **and** the
    dev server.*

- [x] **THEME-033** — Strip a `.html` suffix from the address bar automatically
  - **Category:** Theme · **Deps:** THEME-030
  - **Acceptance criteria:** when a reader arrives on a URL that still carries the
    `.html` suffix (an old external link, a bookmark, a hand-written
    `./page.html` markdown link), the address bar is rewritten to the clean form
    with **no navigation and no extra history entry** — the page already
    rendered is the right one, only its URL is normalized; the query string and
    the `#hash` are preserved (so a THEME-028 copy from such a page yields the
    clean URL and a `#slug` deep link still lands); `…/index.html` normalizes to
    the folder form (`/guide/index.html` → `/guide/`, `/index.html` → `/`); the
    deployed `base` path is untouched; it also applies after client-side
    navigation, not just on first load; the rewrite happens **only** when the
    site is configured with `cleanUrls` (with `cleanUrls: false` the `.html`
    form is the canonical one and must be left alone), so it is safe on hosts
    without extension fallback; documented in
    `docs/configuration/clean-urls.md`.
    *Landed 2026-07-23: new `composables/useCleanUrls.ts`, called once from
    Layout. `cleanPathname()` (exported, framework-free) returns the clean form
    of a pathname or `null` when there is nothing to strip, mapping
    `…/index.html` to the folder form; the composable applies it via
    `history.replaceState(history.state, '', cleaned + search + hash)` on
    `onMounted` **and** `onContentUpdated` — the latter catches an in-content
    link written explicitly as `./page.html`, which VitePress's link normalizer
    leaves alone. Reusing the existing `history.state` keeps the router's
    bookkeeping intact. Guarded by `useData().site.cleanUrls`, so the whole
    behavior is inert when the `.html` form is canonical. Documented in
    `docs/configuration/clean-urls.md` (new section). Verified headless 14/14:
    `/guide/getting-started.html` → clean URL with the right page rendered;
    `?query` + `#hash` preserved and the deep link still scrolls the panel; a
    THEME-028 copy from such an arrival yields the clean URL;
    `/guide/index.html` → `/guide/` and `/index.html` → `/`; an injected
    `.html` link click normalizes after navigation, adds exactly one history
    entry, and Back still returns to the previous page; already-clean URLs
    untouched; no page errors. The gate was verified by temporarily building
    with `cleanUrls: false` — `/about.html` is then left as-is.*

- [x] **THEME-031** — Official favicon
  - **Category:** Theme · **Deps:** THEME-001
  - **Acceptance criteria:** the project's official favicon (the theme's TUI-window
    glyph) ships as a static asset and is linked from the site `<head>`; it is served
    at `/favicon.svg` and appears as `<link rel="icon" type="image/svg+xml">` on every
    page; consumer sites can override it via their own `head` config.
    *Landed 2026-07-20: `src/public/favicon.svg` (the TERM window glyph — Carbon
    chrome, chevron shell prompt), linked as the first entry of `themeHead()` in
    `theme/head.ts` (`rel="icon"`, `type="image/svg+xml"`, `/favicon.svg`). Verified
    on the built + served site: asset returns HTTP 200 `image/svg+xml`, and the head
    link is present in the served markup.*

- [x] **THEME-032** — Reuse the favicon as the in-UI brand mark
  - **Category:** Theme · **Deps:** THEME-031
  - **Acceptance criteria:** the official favicon also stands in for the brand icon
    inside the rendered UI — the tool-bar brand and the structurally identical
    pre-footer brand cluster show the favicon (not the old Nerd-Font `::`/terminal
    glyph); the mark is a single reusable component, scales with its surrounding
    text, and stays correct under a deployed `base` path; verified headless that both
    render the image.
    *Landed 2026-07-20: `theme/components/SiteMark.vue` renders `/favicon.svg`
    (`withBase`) as a decorative inline `<img>`, styled by `styles/_site-mark.scss`
    (`.ct-site-mark`, em-scaled, rounded); replaces the `.ct-toolbar__glyph`
    Nerd-Font glyph in `ToolBar.vue` and the `.ct-prefooter-demo__logo` glyph in
    `PreFooterDemo.vue` (their glyph SCSS removed). Verified on the built + served
    site: both brand clusters render `img.ct-site-mark` pointing at `/favicon.svg`.*

### Components

- [x] **COMP-001** — Card component: TUI floating window + shell-prompt decoration
  - **Category:** Components · **Deps:** STYLE-001, FONT-001, FONT-002, CONF-002
  - **Acceptance criteria:** a reusable card styled as a TUI floating window
    (Unicode-frame flavor, rounded/floating finish) per
    `docs/design/design-language.md` §4 (cards) and `docs/design/ui-sketch.md` §6; an
    optional shell-prompt decoration line (`user@host:path$ command args`) is
    enabled explicitly with `showPrompt`; `prompt` supplies the required command
    and optional host/path/args, `user` is the normalized author username from
    CONF-002, `host` defaults to the shell-normalized active site title, and `path`
    defaults to the current page's home-relative location; all prompt values remain
    overridable; prompt segments use mode-aware Oxocarbon role tokens; serves as
    the base for the license card, comment card, and page cards/grids.
    *Landed 2026-07-10: `theme/components/Card.vue` accepts `showPrompt` plus a
    typed `prompt` object (`command`, optional `host`/`path`/`args`), derives the
    normalized prompt user from `useThemeConfig().author.username`, default host
    from the active site title, and default path from the current page; exports the
    reusable component; `styles/_card.scss` provides the responsive floating-window
    finish, softened shadow, and mode-aware Oxocarbon prompt coloring.*

- [x] **COMP-002** — Image containers: lightbox + Swiper
  - **Category:** Components · **Deps:** MD-001, STYLE-001
  - **Acceptance criteria:** content images gain enlarge-on-click, and all images on a
    page can be browsed as slides (Fancybox); a `:::: swiper` container with nested
    `::: swiper-slide-no-shadow` blocks renders images as SwiperJS slides with the
    cards effect (cards stacked on top of each other), supporting exactly the block
    syntax documented in the requirement.
    *Landed 2026-07-13: `useLightbox()` marks every `.ct-content img` (skipping
    linked / `data-no-lightbox` images) as one `ct-gallery` Fancybox group on
    mount/navigation — one delegated bind, re-bound on language switch with
    Fancybox's own shipped l10n tables mapped from the theme tags (`en`,
    `zh-Hans` → `zh_CN`; the documented vendor-chrome exception to the locale
    rule). The `:::: swiper` / `::: swiper-slide-no-shadow` containers
    (`theme/markdown/swiper.ts`) emit inert `.ct-swiper.swiper` markup that
    `useSwipers()` upgrades to a cards-effect Swiper (`slideShadows: false`,
    stale instances destroyed after navigation); both libraries lazy-load
    client-side only. Vendor CSS + theme overrides in `styles/_lightbox.scss`
    / `_swiper.scss`; three palette SVGs in `src/public/images/`; demo section
    in `markdown-examples.md`. 2026-07-13 follow-up: prev/next arrow buttons
    (Navigation module wired to `<button>`s emitted by the container, TUI
    `❮`/`❯` text chevrons replacing the vendor SVG, ≥44px targets, localized
    `swiper.prev`/`swiper.next` labels re-applied on language switch) and
    native image dragging disabled on slides (`draggable=false` +
    `-webkit-user-drag: none`) so a real mouse drag slides the deck instead
    of starting a ghost-image drag; verified headless 14/14. Second follow-up
    same day: the arrows moved fully OUTSIDE the images — the container now
    emits a `.ct-swiper` flex row (prev button · `.ct-swiper__deck.swiper` ·
    next button, deck shrinking between them on mobile; vendor navigation CSS
    dropped) — and closing the lightbox no longer scrolls the article back to
    top: `useViewportScroll` (THEME-008) now resets the panel only when
    `page.relativePath` actually changed, since `onContentUpdated` also fires
    on same-page re-renders (dev-server zoom/fullscreen close paths reproduced
    it; in-place language switches keep their position too). Verified headless
    13/13 build + dev repro paths. **`@fancyapps/ui` pinned to v5** — the last
    GPLv3/commercial dual-licensed line (v6 is commercial-only); Swiper is
    MIT. Verified headless 16/16 + SPA-navigation regression.*

- [x] **COMP-003** — License card
  - **Category:** Components · **Deps:** THEME-001, COMP-001, CONF-002
  - **Acceptance criteria:** at the end of every article (posts and series), a card
    **with** shell-prompt decoration shows the configured license (default
    CC BY-NC-SA 4.0) and the article info — title, URL, publish date, author — with
    author and license sourced from CONF-002; strings localized.
    *Landed 2026-07-13: `ArticleLicense.vue` renders a `Card` (`showPrompt`,
    command `license`) at the end of every article — a page that is not the home
    or 404 page and not opted out via `article: false`/`license: false`
    frontmatter. It shows the article title (linked to its permalink), a labeled
    meta list (author · localized publish date from frontmatter `date`, UTC-formatted
    to avoid an off-by-one · permalink, upgraded to the absolute URL on the
    client), and the license statement + CC brand icons — author & license from
    CONF-002 via `useThemeConfig()`, the statement's `{license}` linking to the
    deed (footer pattern). New `license.*` locale keys (en + zh-Hans); styles in
    `styles/_license.scss`. Wired in `Layout.vue` under the `isArticle` guard;
    `markdown-examples.md` gained a `date` to exercise the row. Verified headless.
    2026-07-13 follow-up: added a **last-updated** row (`license.updated`) beside
    the release date — an explicit frontmatter `updated`/`lastUpdated` wins, else
    VitePress's git `page.lastUpdated` (`lastUpdated: true` enabled in the site
    config) — and a decorative **CC watermark** shown only for Creative Commons
    licenses (`isCreativeCommons` = deed URL / CC icons); content lifted above it
    with `z-index`. Second follow-up: `formatDate` now accepts any frontmatter
    date shape (bare `YYYY-MM-DD`, full ISO datetime with offset, YAML `Date`,
    numeric timestamp) and formats in UTC (deterministic/SSR-safe, no off-by-one);
    the watermark became a mask-scaled `<span>` (top/bottom insets → height =
    card's native height, CC SVG `mask` + mode-tinted `background-color`, rotated
    CCW, right-cropped) so it fills the card without ever affecting its size.
    Verified headless (ISO datetime → "August 8, 2021"; watermark height = card
    height, square, rotated, doesn't change card height) + dark/light/mobile
    screenshots.*

- [x] **COMP-005** — Timezone-aware article dates
  - **Category:** Components · **Deps:** COMP-003
  - **Acceptance criteria:** explicit date offsets/Z values preserve their source
    instant; frontmatter date values without a timezone are interpreted as UTC;
    valid YAML `Date` objects and numeric timestamps remain instant-based; the
    license card formats release and updated dates in the reader's current
    timezone after hydration, while the SSR/initial-client render remains UTC
    to avoid hydration mismatch; dates that cross a timezone boundary show the
    corresponding local calendar day; the date behavior is documented and
    verified on the rendered site.
    *Landed 2026-07-13: `ArticleLicense.vue` normalizes unzoned ISO strings with
    an explicit UTC suffix, keeps offset-bearing strings/`Date` objects/numeric
    timestamps as instants, and switches the formatter from SSR-safe UTC to the
    browser's resolved timezone after mount. Verified with source-offset and
    quoted unzoned frontmatter pages across UTC−12, UTC, UTC−07, and UTC+14.*

- [x] **COMP-004** — Waline comments & counts
  - **Category:** Components · **Deps:** THEME-001, COMP-001, CONF-001
  - **Acceptance criteria:** a Waline-powered comment section renders at the end of
    every article (posts and series) inside a card **with** shell-prompt decoration;
    the Waline server is configured via `themeConfig`; a viewer count and a comment
    count appear in the article title section; strings localized.
    *Landed 2026-07-13: `themeConfig.comments.waline.serverURL` (config.ts —
    `TerminalCommentsConfig`/`TerminalWalineConfig`, resolved via
    `resolveComments()`: blank URL → `null` = unconfigured, `isCommentsConfigured()`
    helper). `ArticleComments.vue` renders a `Card` (`showPrompt`, command
    `comments`) holding the localized heading + a `.ct-comments__waline` mount
    point; `ArticleMeta.vue` renders the view + comment counters in the article's
    title section (above the content). `useWaline()` (called once from Layout)
    lazy-loads `@waline/client` client-side, mounts the widget (its own count
    displays off), fills the meta counters via `pageviewCount`/`commentCount`,
    re-mounts per navigation, and re-localizes the widget UI on a language switch
    (Waline locale tables mapped from theme tags — `zh-Hans` → `zh-CN`, else `en`;
    the vendor-chrome exception to §9). Dark theme tracks `data-ct-mode` via
    Waline's `dark` selector. Both card + counts render only on articles when
    configured (opt out with `comments: false`/`article: false`). New `comments.*`
    locale keys; styles in `styles/_comments.scss` (Waline CSS + accent reconcile +
    meta strip); `@waline/client` added as a devDependency. Verified headless
    (widget mounts `.wl-comment`/`.wl-panel`, counters + localization).*

### Architecture

- [x] **ARCH-001** — Content architecture: `src/` layout & page-type components
  - **Category:** Architecture · **Deps:** THEME-001, I18N-001
  - **Acceptance criteria:** the `src/` directory follows the content architecture in
    [`docs/design/content-architecture.md`](../docs/design/content-architecture.md)
    (modeled on
    [`vitepress-theme-arch/src`](https://github.com/iXORTech/vitepress-theme-arch/tree/main/src)):
    normal/standalone pages (home `index.md`, `about`, `projects`, `friends`, and
    similar non-article pages) sit **directly in `src/`** with no `pages/` folder;
    regular posts live under `src/posts/`, series articles under
    `src/series/<series-name>/`, static assets under `src/public/`; the listing/route
    pages (`archives.md`, `categories.md`, `tags.md`, `series.md`, and the
    `categories/[name]`, `tags/[name]`, `page/[num]` dynamic routes) occupy their
    documented paths (their content/behavior lands in POST-001/POST-002). The theme
    `Layout` resolves every page to exactly one **page type** — home, normal page,
    post, series article, listing page, 404 — from its location under `src/` plus the
    frontmatter escape hatches (`article`/`license`/`comments: false`), and renders a
    dedicated Vue component per type (e.g. `pages/HomePage.vue`, `pages/NormalPage.vue`,
    `pages/PostPage.vue`, `pages/SeriesArticlePage.vue`, `pages/ListingPage.vue`,
    `pages/NotFoundPage.vue`) so each type's chrome is customizable independently, while
    the shared shell chrome still wraps them; the existing home placeholder and the
    inline `isArticle` branching in `Layout.vue` are folded into this page-type layer.
    Existing demo content keeps rendering (under the normal-page / post types), the
    explorer auto-discovery still works, and `pnpm build` succeeds. The convention is
    recorded in `docs/design/content-architecture.md` and linked from `docs/README.md`
    and `AGENTS.md`.
    *Landed 2026-07-14: `theme/utils/pageType.ts` `resolvePageType()` classifies a
    page from its `src/` path + frontmatter (`pageType` override, `home`, fixed
    listing filenames / `categories|tags|page/` prefixes, `article:false` escape
    hatch, `series/`|`posts/` prefixes) into six types, each a
    `theme/pages/*Page.vue` (Home/Normal/Post/SeriesArticle/Listing/NotFound).
    `Layout.vue` now renders `<component :is=pageComponent>` — the old home
    placeholder + `isArticle` branching folded into HomePage/PostPage. PostPage
    owns the article chrome (ArticleMeta/License/Comments) + the POST-001 byline;
    SeriesArticlePage reuses PostPage under a folder-derived series breadcrumb
    (full series.yml chrome → POST-002); NotFoundPage is client-rendered (404.html
    hydrates through the dispatch). `src/` restructured: `posts/` (5 demo posts),
    `series/terminal-internals/` (index + 2 parts + structural `series.yml`),
    listing pages and dynamic routes. Existing guide/demo pages render as normal
    pages (no article cards — by design). Explorer skips dynamic-route templates
    (`[` in path). Build green; headless-verified.*


- [x] **ARCH-002** — Show in explorer toggle: add field in frontmatter and `explorer.json` configs that controls whether a page (or folder) is shown in the explorer
  - **Category:** Architecture · **Deps:** ARCH-001, THEME-002
  - **Acceptance criteria:** a page or folder can be hidden from the explorer by
    setting `showInExplorer: false` in its frontmatter or in its `explorer.json`
    config; the default is `true`; the toggle is documented in the content architecture
    and in the explorer spec; verified on the rendered site.
    *Landed 2026-07-16: `useExplorer`'s auto-discovery filters pages with
    frontmatter `showInExplorer: false` (hiding a folder's `index.md` drops just
    the folder link; visible children keep the folder alive, link-less) and
    prunes whole subtrees whose `explorer.json` sets `showInExplorer: false`
    (root index honors the `/` config too); branches left with no page and no
    visible children disappear. Hidden pages still build and stay reachable by
    URL; explicit `themeConfig.explorer` trees are unaffected. Demos:
    `src/guide/advanced/hidden-page.md` (frontmatter) + `src/drafts/`
    (`explorer.json`). Documented in design-language.md §4 (visibility toggle),
    content-architecture.md §3, and guide/getting-started.md. Verified headless
    (7/7): hidden rows/links absent with siblings intact, both pages reachable.*

- [x] **ARCH-003** — I18N: localized frontmatter fields
  - **Category:** Architecture · **Deps:** ARCH-001, I18N-001
  - **Acceptance criteria:** frontmatter fields that are displayed to the user (title,
    description, series title/description, etc.) can be localized by providing a
    mapping of locale codes to strings; the default is the string itself; the toggle
    is documented in the content architecture and in the i18n spec; verified on the
    rendered site.
    *Landed 2026-07-16: the untyped-metadata validator `asLocalizableText()`
    moved from `useExplorer` into `theme/locales/index.ts` as the shared
    contract. `PostEntry.title`/`.excerpt` are now `LocalizableText`
    (`theme/posts.ts` keeps frontmatter maps); `PostList`/`ArchivesList`
    resolve them against the active language, `ArticleLicense` and
    `useSiteText`'s tab title resolve a localized frontmatter `title` (a map
    makes VitePress's `page.title` fall back to the body h1). New node-side
    `theme/pageData.ts` `createPageDataTransformer(lang)` wired as
    `transformPageData` in config.mts — required because VitePress escapes
    `pageData.description` into the SSR `<meta>` and a raw map crashes the
    build; SSR resolves to the build language, the client re-resolves in
    place. Series `series.yml` title/description follow the same pattern when
    POST-002 lands its parser. Demo: `posts/hello-terminal.md` localized
    title + description. Documented in design-language.md §9 (localized
    frontmatter fields), content-architecture.md §3, and
    guide/getting-started.md. Verified headless (13/13): en/zh-Hans post
    cards, archives after reload, license-card title, tab title, SSR meta.*

- [x] **ARCH-004** — Explorer ordering: configurable sibling order for auto-discovered entries
  - **Category:** Architecture · **Deps:** ARCH-001, THEME-012, ARCH-002
  - **Acceptance criteria:** the position of an auto-discovered page or folder
    among its explorer siblings can be controlled with an `order` attribute
    (number, default `0`, smaller = higher — the same semantics POST-002 defines
    for series), set in a page's frontmatter or, for a folder, in its
    `explorer.json` or its `index.md` frontmatter (the JSON wins, mirroring the
    ARCH-002/I18N-006 metadata precedence); **negative values are allowed** —
    any finite number (negative or fractional included) is valid, so an entry
    can be pinned above the unconfigured (`0`) siblings without renumbering
    them, while non-numeric or non-finite values (`NaN`, `±Infinity`) are
    ignored and fall back to the default `0`; entries with equal `order` keep the
    current deterministic fallback (folders before files, then case-insensitive
    natural name comparison), so unconfigured trees render exactly as today;
    ordering is display-only (URLs, discovery, and route behavior unchanged) and
    applies consistently during SSR and client navigation; explicit
    `themeConfig.explorer` arrays remain hand-ordered and unaffected; documented
    in the explorer spec (design-language.md §4 auto-discovery), the content
    architecture, and the user guide; verified on the rendered site.
    *Landed 2026-07-18: `discoverExplorer()` in `useExplorer.ts` now sorts each
    sibling level with a context-aware `siblingComparator(directorySegments)` —
    `order` first, then the existing folders-first-then-natural-name
    `compareBranchNames` fallback (the old `compareBranches` renamed). A branch's
    `order` resolves via `branchOrder()`: the folder's `explorer.json` `order`
    wins (new `order?: number` on `ExplorerJsonConfig`), then the page /
    `index.md` frontmatter `order`, else `0`; `toFiniteOrder()` accepts only
    finite numbers so `NaN`/`±Infinity`/non-numbers fall back to `0`, and
    negatives/fractions are honored. Display-only (discovery/URLs/routes
    untouched) and shared by SSR + client since the one discover function feeds
    both. Explicit `themeConfig.explorer` arrays bypass it entirely. Demo:
    `guide/getting-started` frontmatter `order: -1` pins it above the `advanced`
    folder; `guide/advanced/advanced-2/explorer.json` `order: 1` pushes that
    folder below `deep-dive` — both overriding folders-first. Docs:
    design-language.md §4 (sibling ordering), content-architecture.md §3,
    guide/getting-started.md. Build green; headless-verified the two demo cases
    (Guide → `[Getting Started, Advanced, …]`; Advanced → `[Deep Dive,
    advanced-2]`) and that unconfigured subtrees keep their name order.*

### Content & pages

- [x] **POST-001** — Tags & categories
  - **Category:** Content · **Deps:** ARCH-001
  - **Acceptance criteria:** posts/articles declare tags and categories in their
    frontmatter; the listing pages defined by the content architecture
    (`archives.md`, `categories.md` + `categories/[name]`, `tags.md` + `tags/[name]`,
    *posts index*, optional `page/[num]` pagination, and related components — see
    [`docs/design/content-architecture.md`](../docs/design/content-architecture.md))
    list all tags and all categories and the posts under each; post metadata links to
    them; labels localized.
    *Landed 2026-07-14: posts under `src/posts/` declare `tags`/`categories` (string
    or list) + `date`/`description` in frontmatter. `theme/posts.ts` (framework-free:
    `normalizePosts`/`slugify`/`groupByTag`/`groupByCategory`/`pageCount`,
    `POSTS_PER_PAGE=10`) backs both the `theme/posts.data.mts` content loader (globs
    `posts/**/*.md`; series excluded — POST-002 owns their inclusion) and the
    dynamic-route `[name]/[num].paths.mjs` loaders. Listing components (registered
    globally in `theme/index.ts`): `PostsIndex` (rich cards + `/page/[num]`
    pagination, page 1 = `/posts`), `ArchivesList` (by-year timeline),
    `CategoriesIndex`/`TagsIndex` (counts), `TermPosts` (per-tag/-category, slug-
    matched via route params `{name,term}`), `PostList`/`PostTaxonomy` shared.
    PostPage byline links each post's categories→`/categories/<slug>` and tags→
    `/tags/<slug>`. Pages: `posts.md`/`archives.md`/`categories.md`/`tags.md`,
    `{categories,tags}/[name].md`, `page/[num].md` (+ `.paths.mjs`), `series.md`
    placeholder. New `post.*`/`series.label` locale keys (en + zh-Hans); styles in
    `styles/_posts.scss`. Build generated 7 tag / 3 category / page-2 routes;
    headless-verified pagination, filtering, and zh-Hans re-localization.*

- [x] **POST-003** — Post cover support
  - **Category:** Content · **Deps:** POST-001
  - **Acceptance criteria:** posts and series articles can declare an optional cover image
  - in their frontmatter; the cover image, in post list cards and in the article page, is rendered
    on the right side of the card on desktop and above the content on mobile; it should be properly
    styled for a uniform look for the cards. The cover image is optional, and the card layout gracefully degrades when no cover is present; the cover image is responsive and maintains its aspect ratio; the cover image is lazy-loaded and optimized for performance.
    *Landed 2026-07-16 (with POST-002): frontmatter `cover` (image URL;
    root-absolute honors the site base) → `PostEntry.cover`. `PostList` cards
    became a body-beside-cover flex row (`.ct-postcard--cover`): the cover is
    a link-wrapped 11rem 16/10 `object-fit: cover` thumbnail on the right
    (link wrap = lightbox skipped, tap navigates); `PostPage` renders the
    cover in the header region (`.ct-post-header--cover`, 18rem 16/9,
    `data-no-lightbox`) beside the byline. ≤640px both flip to
    `column-reverse` — cover above the text, full width. Lazy everywhere
    (`loading="lazy" decoding="async"`, alt = localized title); no cover =
    exactly the previous layout. Demos: `hello-terminal`/`tui-design`/series
    `part-1` covers from the existing demo SVGs. Documented in
    content-architecture.md §5a + guide/getting-started.md. Verified headless
    (within the 40/40 POST-002/003 run): desktop right placement + ratios,
    mobile stacking/full-width, lazy attrs, lightbox exclusion, no overflow.
    2026-07-17 follow-up: covers enlarged — cards 11rem → 15rem (16/10),
    article header 18rem → 22rem basis (16/9, still shrinkable so the byline
    keeps room in the 72ch column); mobile full-width behavior unchanged.
    Verified headless (240px card cover, ~322px header cover, ratios intact,
    no overflow).
    Second 2026-07-17 follow-up — **seamless integration rework**: covers no
    longer sit beside the text. Cards: the cover is a full-height 15rem panel
    bled over the card padding to the right frame edges (negative margins +
    `overflow: hidden` crop, `min-height: 9.5rem`), faded into the card
    surface by a left-edge `mask-image` gradient; ≤640px it becomes a
    full-width top strip fading downward. Article header: with a cover the
    header turns into a framed hero banner (`--cover`: card frame + radius,
    `min-height`, byline pinned bottom via flex column) with the image
    absolutely filling it at opacity 0.3, masked to fade out toward the
    bottom where the byline sits (readable over text-heavy images; ≤640px
    opacity drops to 0.18 since the byline fills the frame); no cover =
    unchanged separator-rule header. Templates untouched (still lazy `<img>`
    with alt + `data-no-lightbox`/link wrap). Screenshot-reviewed dark/light
    + mobile; verified headless 13/13 (full-height/full-bleed boxes, masks,
    opacity, absolute background, byline position, no-cover fallback, lazy/
    link/alt attrs, mobile strips, no overflow).
    Third 2026-07-17 follow-up — **article-header cover shown in full**: per
    request, the header no longer crops the cover. The image dropped
    `object-fit: cover`/`position:absolute` for normal-flow `width:100%;
    height:auto`, so it renders whole at its natural aspect and drives the
    banner height (with an 8rem floor for very short images); the byline is
    now `position:absolute` bottom, overlaying the image's faded bottom edge
    (mask `#000 55% → transparent 96%`, opacity 0.3, mobile 0.18). Cards are
    unchanged (they still crop to the fixed panel). Screenshot-reviewed
    dark/light/mobile; verified headless 13/13 (natural-aspect render 1.33 =
    uncropped, full width, bottom-fade mask, byline overlay, ~489px banner,
    lazy/alt/no-lightbox, card cover intact, no overflow).
    Fourth 2026-07-17 follow-up — **header cover at full opacity except behind
    the byline**: per request, the blanket `opacity: 0.3` on the header cover
    image was removed — the image now renders at full opacity (vivid), and
    only the bottom strip behind the byline is dimmed by the existing mask
    fading the image into `--ct-surface` (desktop `#000 65% → transparent
    92%`; the mobile opacity override became a higher-starting mask
    `#000 45% → transparent 82%` since the byline covers more there). Cards
    untouched. Screenshot-reviewed dark/light/mobile; verified headless
    (image opacity == 1, fade mask retained, still uncropped natural aspect,
    byline overlay, no overflow).*

- [x] **POST-002** — Posts & post series
  - **Category:** Content · **Deps:** ARCH-001, POST-001, CONF-001
  - **Acceptance criteria:** regular posts live in `src/posts`, series articles in
    `src/series/<series-name>` (per the ARCH-001 content architecture); each series
    folder carries a YAML configuration for its icon, title, and description, each with
    localized versions; series and the articles within a series sort by an `order`
    attribute (default 0, smaller = higher) falling back to alphabetical; `themeConfig`
    toggles control whether series posts are included in the general posts'
    archive/category/tag pages.
    *Landed 2026-07-16: `series.yml` schema finalized (all optional: `icon` FA
    or `nf-*` class, `title`/`description` LocalizableText via
    `asLocalizableText`, `order` finite number — non-finite → 0), parsed by the
    new node-side `theme/series.data.mts` (js-yaml devDep) into sorted
    `SeriesEntry[]` (order asc, ties alphabetical by slug). `posts.data.mts`
    now also globs `series/**/*.md`: entries carry `series` (slug), `order`,
    `cover`; landing `index.md` pages are dropped by `normalizePosts`.
    Articles within a series sort via `seriesArticles()` (order asc, ties
    alphabetical by URL — verified: flipping an `order` reorders the landing
    list). New `themeConfig.series = { inPosts, inArchives, inCategories,
    inTags }` (all default false) gates series articles per listing surface
    through the shared `filterListablePosts()`, applied by
    PostsIndex/ArchivesList/TagsIndex/CategoriesIndex/TermPosts AND the three
    dynamic-route `.paths.mjs` loaders (which import the now-exported site
    `themeConfig`), so routes and display always agree. Surfaces:
    `<SeriesIndex/>` on `series.md` (icon · localized title/description ·
    article count, folder-name fallback for yml-less series),
    `<SeriesArticles/>` on the landing page, the upgraded
    `SeriesArticlePage` banner (icon + localized title + description), and a
    series chip on `PostList` cards. `nf-*` icons render via the gated theme
    Nerd Font face (`.ct-series-icon`, hidden—not tofu—without the font). New
    `series.indexTitle`/`.articleCount`/`.empty` strings (en + zh-Hans);
    styles in `_posts.scss`. Demo: config opts series into archives only;
    Posts nav submenu gained a Series child. Documented in
    content-architecture.md §5 + guide/getting-started.md. Build green;
    verified headless 40/40 (index/landing/banner/toggles/localization/
    mobile) + the order-flip rebuild check.
    2026-07-17 follow-up: an admitted series article now carries its localized
    series name before the title in the general listings — archives rows
    (`.ct-archives__series` dim prefix + `›`) and per-term listing cards
    (`PostList`'s new `seriesInTitle` prop, set by `TermPosts`; the meta-row
    series chip is omitted there to avoid duplication — the series landing
    list keeps bare titles + chip). Shared resolver `seriesDisplayTitle()` in
    `posts.ts` (localized series.yml title, slug fallback). Demo config now
    opts series into categories + tags too (part-1 gained `Design` +
    `tui`/`terminal` frontmatter), exercising the prefix on those pages;
    docs updated (content-architecture.md §5 note, guide). Verified headless
    (prefix in archives/tag/category rows incl. zh-Hans `终端内幕 ›`
    re-localization, chip suppressed with prefix, posts index still
    series-free, landing untouched, tag counts include the part).*

- [x] **PAGE-001** — Home page
  - **Category:** Pages · **Deps:** ARCH-001, COMP-001
  - **Acceptance criteria:** a home page with basic personal-website welcome content
    presented in a card component that **does** carry the shell-prompt decoration;
    content configurable; strings localized; mobile-correct.
    *Landed 2026-07-18: `HomePage.vue` (the `home` page-type component) now
    renders a single reusable `Card` **with** `show-prompt` holding the welcome
    content from new `themeConfig.home` (`TerminalHomeConfig` — `command`
    default `whoami`, `greeting`/`tagline`/`body` LocalizableText, `links`
    call-to-action buttons). `greeting`/`tagline` fall back to the localized
    site title/description when unset, so an unconfigured site still gets a
    sensible home page. All text localizes in place on a language switch;
    styles in new `styles/_pages.scss`. Verified headless: prompt
    `admin@vitepress-theme-terminal:~$ whoami`, 3 links, mobile no-overflow.*

- [x] **PAGE-002** — Projects page
  - **Category:** Pages · **Deps:** ARCH-001, COMP-001
  - **Acceptance criteria:** a page demonstrating all projects with grid/card
    components; cards may or may not carry the shell prompt — more featured content
    carries the extra decoration; data easy to configure; localized; grid adapts on
    mobile.
    *Landed 2026-07-18; reworked same day to authored views (matching the
    reference theme's `views/About.vue` pattern, per user request). `src/projects.md`
    is a normal page importing `@/views/Projects.vue` in a `<script setup>`
    block (the `@` alias → `.vitepress/theme`, added to `config.mts`
    `vite.resolve.alias`). `views/Projects.vue` is a thin language dispatcher
    rendering the hand-authored per-language content `views/projects/en.vue` /
    `views/projects/zh-Hans.vue` by `useThemeLocale().language` (primary-subtag
    match, English fallback) — switching re-renders in place. Each authored
    view uses the `Card` component + shared **fractional** `.ct-cardgrid` — a
    6-col track with span modifiers `--third`/`--half`/`--two-thirds`/`--full`
    mixable per row (`1/3+2/3`, `1/2+1/2`, `2/3+1/3`, full); width and the
    shell prompt (`show-prompt`) are orthogonal. The demo shows a `--full` lead
    (prompt `open`) over a `1/3 + 2/3` row. Styles in `styles/_pages.scss`
    (no SFC `<style>`). The earlier config-driven `themeConfig.projects` +
    `components/ProjectsPage.vue` were removed. Verified headless: fractional
    widths (full 100%, third 32%, two-thirds 66% of the grid), live in-place
    `项目` on the status-bar language toggle, single-column mobile grid, no
    overflow.*

- [x] **PAGE-003** — About Me page
  - **Category:** Pages · **Deps:** ARCH-001, COMP-001
  - **Acceptance criteria:** an About Me page organizing info with grid/card
    components; shell prompt used judiciously — more featured blocks carry the extra
    decoration; localized; mobile-correct.
    *Landed 2026-07-18; reworked same day to authored views (same pattern as
    PAGE-002). `src/about.md` imports `@/views/About.vue`; the dispatcher
    renders `views/about/en.vue` / `views/about/zh-Hans.vue` by UI language.
    Each authored view uses `Card` + the fractional `.ct-cardgrid` (span
    modifiers `--third`/`--half`/`--two-thirds`/`--full`): a `--full` lead card
    (shell prompt `whoami`) over a `2/3 + 1/3` row then a `1/2 + 1/2` row of
    cards holding labeled `<dl>` info rows (now, built-with, elsewhere, contact).
    The earlier config-driven `themeConfig.about` + `components/AboutPage.vue`
    were removed. Verified headless: fractional widths, `关于` on switch,
    lead prompt, mobile single-column no-overflow.*

- [x] **PAGE-004** — Friends page (spec: `docs/design/friend-links.md`)
  - **Category:** Pages · **Deps:** ARCH-001, COMP-001
  - **Acceptance criteria:** per [`docs/design/friend-links.md`](../docs/design/friend-links.md):
    `src/friends.md` (normal page, authored Markdown around a globally registered
    `<FriendLinks />`) renders grouped friend links from every
    `.vitepress/theme/assets/**/linksData.mjs` data module (eager build-time glob,
    SSR-rendered) — the external format is the `blog-friend-links-data-generator`
    output (`{ group, groupName, groupDesc, entries: [{ title, url, description?,
    avatar?, screenshot? (reserved) }] }`); sources sort deterministically (depth,
    then path) and same-`group`-id groups merge (first occurrence fixes
    position/labels, later sources append entries); malformed sources degrade with
    a warning, a missing submodule never breaks the build. Each group renders a
    header (name · dim count · dim description) over a responsive auto-fill grid
    of compact TUI link cards (rounded-square lazy avatar with FA placeholder
    fallback + `data-no-lightbox` · ellipsized title · 2-line-clamped dim
    description; whole card an external link; hover/focus = derived main-color
    accents); a localized `[⇄ random]` control opens a random entry; localized
    empty state. i18n: data strings verbatim by default, `LocalizableText`
    accepted in hand-authored files (`asLocalizableText()` validation, in-place
    re-resolution on switch), generated group labels overridable via
    `themeConfig.friends.groups`; chrome strings through new `friends.*` locale
    keys (en + zh-Hans). `themeConfig.friends = { showCount?, showRandom?,
    groups? }` (defaults true/true/{}). Demo: the
    `blog-friend-links-data-generator-demo` `data`-branch submodule at
    `.vitepress/theme/assets/generatedLinkData` (**added 2026-07-18**) plus a
    hand-authored demo `assets/linksData.mjs` exercising localization, a missing
    avatar, and a group merge; a Friends nav/explorer entry reaches the page.
    Styles in dedicated `styles/_friends.scss`; mobile-correct (single-column
    collapse, ≥44px targets); verified on the rendered site.
    *Landed 2026-07-18 (spec confirmed same day): `theme/friends.ts`
    (`mergeFriendSources()` — validation via `asLocalizableText()` + skip
    warnings; merge refinement: labels come from the first source that
    PROVIDES them, so an unlabeled local group inherits generated labels) +
    globally registered `FriendLinks.vue` (module-scope eager glob = SSR
    HTML; reactive label resolution config override → data → id; `@error`
    avatar fallback to the placeholder glyph; random = `window.open`
    `_blank,noopener`); `TerminalFriendsConfig` in config.ts;
    `friends.random`/`friends.empty` strings; `_friends.scss` (auto-fill
    15rem grid, 1-col ≤640px). Demo: submodule + hand-authored
    `assets/linksData.mjs` + `friends.groups` override for generated
    `group2` + Friends nav tab; `src/friends.md` intro/apply in `::: lang`
    blocks (apply JSON uses `title` — the generator's real issue-template
    field; its design-doc `name` sample is outdated). Verified headless
    17/17 + dark/light/mobile screenshots; full note in friend-links.md §9.*

- [x] **DEMO-001** — Markdown demo pages
  - **Category:** Content · **Deps:** STYLE-005, MD-001, MD-002
  - **Acceptance criteria:** demo files show markdown sources alongside their rendered
    results, covering standard markdown, the plugin suite (MD-001), and callouts
    (MD-002); reachable from the site navigation.
    *Landed 2026-07-19: `src/markdown-examples.md` rewritten into a complete
    **Markdown Demo** — every feature shown as an **Input** (raw source) next to
    its rendered **Output**, organized into Basic Markdown (STYLE-005 scope:
    headings h1–h6, paragraphs + `\` line break, emphasis/strong/bold-italic +
    `~~strikethrough~~`, nested blockquotes, ordered/unordered/nested lists,
    horizontal rules, links incl. reference/autolink/internal, inline code,
    alignment tables, inline HTML + Font Awesome), Code Blocks (STYLE-004
    highlighting + `[name]` title bar), Markdown Extensions (the full MD-001
    suite — emoji, sub/sup, ins/mark, footnotes, definition lists,
    abbreviations, math), Callouts (all MD-002 types + note/caution aliases +
    custom title + nested), Images/galleries (COMP-002 lightbox + `:::: swiper`
    deck), and the Card component (DEMO-002, preserved). Task lists are
    deliberately omitted — the theme ships no task-list plugin and VitePress
    doesn't enable them, so `- [ ]` would render literally (also outside
    STYLE-005 scope). Reachable from the tool bar via a new **Markdown Demo**
    child under the Guide submenu (`config.mts`), on top of the auto-explorer.
    Build green; headless-verified on `/markdown-examples`: 9 callouts, 4 cards,
    25 code cards, swiper deck, alignment table, footnotes, 3 MathJax
    expressions, details callout, single page h1 (example headings start at
    h3), no 360px overflow. Gotcha fixed: the initial write leaked stray
    `</content></invoke>` tokens at EOF → Vue "Invalid end tag" compile failure;
    stripped.*

- [x] **DEMO-002** — Card component demo
  - **Category:** Content · **Deps:** COMP-001
  - **Acceptance criteria:** `src/markdown-examples.md` imports and renders the
    reusable card with a shell-prompt example, documents `showPrompt`, prompt
    defaults, and overrides, and shows that the prompt is optional; the rendered
    demo remains mobile-safe.
    *Landed 2026-07-10: the page imports `Card.vue` and shows defaulted,
    fully overridden, and prompt-free cards with source snippets and rendered
    output.*

### Search

- [x] **SEARCH-001** — Algolia DocSearch preparation
  - **Category:** Search · **Deps:** CONF-001
  - **Acceptance criteria:** `themeConfig` keys for DocSearch (appId, apiKey,
    indexName) exist and are documented; the integration point is stubbed so a site
    with credentials gets a working DocSearch entry (e.g. via the tool bar search
    icon); the relationship with the find palette (THEME-003) is decided and
    documented.
    *Landed 2026-07-12: `themeConfig.search.algolia`
    (`appId`/`apiKey`/`indexName`) added to `theme/config.ts` with
    `resolveSearch()` (a partial credential set resolves to `null` =
    unconfigured) and the `isSearchConfigured()` helper; documented in the
    config JSDoc, a commented example in `config.mts`, and design-language.md §4.
    **Decision:** the find palette (THEME-003 shared window) IS the search UI —
    it queries the Algolia index directly from the browser (no `@docsearch/*`
    dep, no DocSearch modal); the tool-bar magnifier action opens it, and an
    unconfigured site sees a localized notice.*

- [x] **SEARCH-002** — Find palette (floating window)
  - **Category:** Search · **Deps:** SEARCH-001, THEME-003
  - **Acceptance criteria:** a floating-window find palette with a text input and
    a list of results; keyboard shortcut `/` to open and `Esc` to dismiss; presents
    as a full/near-full-screen sheet on mobile; the palette's search is wired to the
    site's Algolia DocSearch index (SEARCH-001) and returns results with titles,
    snippets, and links; strings localized; styles in dedicated SCSS. Also remove the
    included floating-window demo (THEME-003) when this lands.
    *Landed 2026-07-12: `useSearch()` (module-singleton query/results/status/
    activeIndex + debounced, abortable Algolia fetch via `utils/algolia.ts`)
    opens a two-pane `search` utility in the shared window — `SearchPalette.vue`
    (auto-focused `>`-prompt field; `↑`/`↓` move, Enter opens) over
    `SearchResults.vue` (title · breadcrumb · snippet · link rows, real anchors;
    idle/loading/empty/error/unconfigured status; keyboard hint). `/` binds via
    `useSearchShortcut()` (input-guarded) and the tool-bar magnifier; `Esc`/
    backdrop dismiss; mobile last-pane-grows sheet. New `search.*` locale keys
    (en + zh-Hans); styles in `styles/_search.scss`. The THEME-003 demo — its
    four components, `useWindowDemo.ts`, the tool-bar button, the `~` shortcut,
    and the `window.demo*`/`window.search*` strings — is removed. Verified
    headless 16/16 (interactions, localization, mobile) + 11/11 (mocked-Algolia
    results, keyboard nav, navigation).*

### Responsive

- [x] **MOBILE-001** — Mobile adaptation pass
  - **Category:** Responsive · **Deps:** all THEME-*, COMP-*, PAGE-*, POST-* tasks
  - **Acceptance criteria:** no horizontal overflow at 360 px; drawer/condensed/reduced
    behaviors per `docs/design/design-language.md` §8 verified on real viewport sizes;
    touch targets ≥ 44 px.
    *Landed 2026-07-19: full-site audit + fix pass at 360×740 (headless Chromium
    over all 33 built pages, window + viewport-panel overflow scans and a
    bounding-box audit of every visible interactive element). Overflow fixes:
    `.ct-cardgrid` tracks became `minmax(0, 1fr)` with `min-width: 0` on the
    gridded cards, so a card's nowrap shell-prompt line can no longer prop the
    tracks past their fraction (About/Projects overflowed the 334px panel at
    401/409px; desktop fractions are now exact too — full/two-thirds/third/half
    measure 100/66/32/49%); raw inline-HTML `<pre>` in `.ct-content` now scrolls
    (`overflow-x: auto`; api-examples spilled the panel to 1706px). Touch
    targets: new `--ct-tap: 2.75rem` token + a documented §8 rule
    (design-language.md) — at the ≤640px breakpoint every interactive theme
    control presents a ≥44px box in both dimensions via REAL box growth: the
    tool/status bars grow (54/50px) to fit their controls (brand, actions,
    statusline controls), the explorer drawer's close/chevrons/labels (with the
    leaf-mark column matched to the grown chevron column for tree alignment),
    the floating window's `[x]` (padding + `background-clip: content-box`
    preserves the text-on-border mask), settings options + language rows, search
    field/result rows/Algolia link, code-card `[copy]`, collapsible callout
    summaries, all footer links + icon slots, taxonomy chips, archive/term/
    pagination/back links, home CTAs, friends `[⇄ random]`, the license CC icon
    cluster, and the 404 home link; dense in-card lines (post-card title,
    series-banner name) grow their box via padding compensated by negative
    margin. Documented exemptions: prose-inline links (WCAG 2.5.5 inline
    exception) and third-party internals — Waline still gets best-effort
    `.wl-btn`/`.wl-header .wl-input`/`.wl-action`/`.wl-meta-foot a` overrides in
    _comments.scss. §8 behaviors re-verified on the rendered site at 360px:
    explorer off-canvas drawer (fixed + backdrop + Esc), condensed tool bar
    (tabs hidden), reduced status bar (path/clock hidden, gear reachable),
    floating-window sheets at 93%×97% with the last pane growing; the COMP-002
    swiper arrows were already 44×44. Desktop 1280px regression-checked (compact
    44/34px bars, dense 23.4px explorer rows, exact grid fractions, no overflow)
    plus dark/light mobile + desktop screenshots.
    2026-07-19 follow-up (user feedback): the footer's blanket mobile
    `min-height: 44px` on every anchor inflated wrapped SENTENCE lines (the
    two-line powered-by row opened ~44px line gaps) and the centered glyphs
    in 44px icon boxes left the first social icon visually indented. Reworked
    in `_footer.scss`: copyright/powered-by/license-text links now use the
    documented §8 padding + negative-margin pattern (rect stays 44px, line
    boxes back to the 1.6 rhythm — the wrapped powered-by block measures
    exactly 2×20.8px again), while the icon-cluster anchors keep real 44px
    boxes with glyphs flush LEFT (justify-content center dropped), so the
    first icon aligns with the text column (glyph x == text x, verified).
    §8 doc examples updated; verified headless 8/8 (rhythm, rects, glyph
    alignment, RSS/license rows, desktop two-row grid untouched) + full-site
    audit re-run 33/33 green.
    Second 2026-07-19 follow-up (user feedback): the statusline separators
    rendered at inconsistent sizes on mobile — the THEME-010 divider was
    proportional to its segment's box (`top: 15%; height: 70%`), so after
    the tap-box growth the dividers beside 44px controls drew 30.8px tall
    while the one beside the 17px mode-indicator span drew 11.9px, at
    different vertical offsets. The divider is now a FIXED mark centered on
    the row (`top: 50%; translateY(-50%); height: 0.85rem` — the same
    ~13.6px the pre-MOBILE-001 desktop rendered): every segment is
    vertically centered in the flex row, so centering on any child lands
    all dividers at identical size and position regardless of box heights.
    Verified headless: mobile 3/3 and desktop 5/5 dividers all 13.59px on
    one shared row-center; desktop appearance unchanged.
    Third 2026-07-19 follow-up (user feedback — spacing still uneven): with
    the divider MARKS uniform, the space around them still was not — 44px
    tap boxes centered their glyphs while text segments hugged their edges,
    so ink-to-divider distances ran 8–16px (and 7.6–25px in zh-Hans). The
    mobile statusline is now laid out as **cells** (rule recorded in
    design-language.md §4, statusline separator rhythm): segments touch
    (group `gap: 0`, no margins) with each divider drawn on the shared seam
    (`left: 0`), and every divider-facing side carries one shared
    `--ct-status-inset` (0.75rem) — sized so the widest shipped locale
    (zh-Hans: CJK labels + the 7-char `zh-Hans` tag) still fits the 360px
    row. `.ct-statusbar__cluster` gained `flex-shrink: 0` (as the row's only
    flexible cell it had been absorbing every tight-fit pixel alone — the
    zh-Hans 7.6px gap), and controls/segments got `flex-shrink: 0` +
    `white-space: nowrap` so labels can never fold (`zh-Hans` would break at
    its hyphen). Controls keep `min-width/height: var(--ct-tap)`; a label
    narrower than that box centers in it, the one accepted ~4px tolerance.
    Below the 360px reference the read-only color-mode indicator (new
    `--mode` modifier) is dropped — redundant and non-interactive — instead
    of compressing or overflowing the row (§8 updated). Verified headless at
    360px and 320px × en/zh-Hans: every gap 12px (max spread 4.0px, was
    8.4–42.9), no shrunk cells, no bar/document overflow, all controls
    44×44; desktop unchanged (34.2px bar, five 13.59px dividers, indicator
    visible); full-site audit re-run 33/33 green.*
