# Repository Documentation

Documentation of **VitePress Theme Terminal** for human developers and AI agents alike.
This directory is repo documentation only — it is **not** site content (the published
site's pages live in `src/`, the VitePress `srcDir`).

## Index

### Design decisions (binding) — `design/`

| Document | Contents |
| --- | --- |
| [`design/design-language.md`](design/design-language.md) | Identity, TUI/editor design language (NeoVim/LazyVim-inspired), no-branding rule, iconic components, modern finish, color-mode list, keyboard UX, mobile, i18n principles |
| [`design/color-system.md`](design/color-system.md) | Main color (`#80E0A7` default) and the derivation-only rule, IBM Carbon supporting palette, Oxocarbon code colors, the three color modes |
| [`design/typography-and-icons.md`](design/typography-and-icons.md) | IBM Plex family allocation, Font Awesome vs Nerd Font usage, stylesheet-based loading rule |
| [`design/ui-sketch.md`](design/ui-sketch.md) | ASCII wireframes: desktop layout, floating find window, mobile layout with explorer drawer, paper mode; region → spec → task map |
| [`design/content-architecture.md`](design/content-architecture.md) | `src/` directory layout (normal pages flat in `src/`, `posts/`, `series/`, listing & dynamic-route pages, `public/`) and the per-page-type Vue component dispatch; modeled on `vitepress-theme-arch` |

### Process & agent files (outside `docs/`)

| File | Contents |
| --- | --- |
| [`AGENTS.md`](../AGENTS.md) | Agent instructions: session protocol, planning workflow, engineering conventions, compliance code. Single content source — `CLAUDE.md` and `.github/copilot-instructions.md` only point to it |
| [`.agent/plan.md`](../.agent/plan.md) | Task board: IDs, categories, dependencies, acceptance criteria |
| [`.agent/context-cache.md`](../.agent/context-cache.md) | Brief per-file summaries of the repository |

## Documentation rules

- Design documents are **binding**: change the document first, then the code.
- One home per piece of content — cross-link rather than duplicate.
- Readability is a first-class requirement, for documentation as much as for code.
