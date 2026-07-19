# AGENTS.md — Agent Instructions · VitePress Theme Terminal

> **Single source of truth.** All instructions, workflow rules, and project context for
> AI coding agents (Claude Code, OpenAI Codex, GitHub Copilot, and any other tool) live
> in **this file only**. `CLAUDE.md` and `.github/copilot-instructions.md` are pure
> pointers to this file and must never contain information of their own. Codex reads
> this file natively. If instructions need to change, change them **here** and nowhere
> else.

## 1. What this project is

**VitePress Theme Terminal** — a custom VitePress theme for blogs and personal
websites, designed as a modern TUI/terminal environment (editor-style tool bar, status
bar, file explorer, floating utility windows). The repo is currently a mostly blank
VitePress scaffold; the theme is built incrementally through the tasks in
`.agent/plan.md`.

- Package manager: **pnpm** · Stack: **VitePress 2 (alpha) + Vue 3**
- Site content lives in `src/` (`srcDir` is set in `.vitepress/config.mts`)
- Repo documentation (not published as site pages) lives in `docs/`

Design decisions are **binding** and recorded in `docs/design/`:

| Topic | Authoritative document |
| --- | --- |
| Identity, TUI/editor design language, layout, no-branding rule, modes, keyboard, mobile, i18n | [`docs/design/design-language.md`](docs/design/design-language.md) |
| Colors: main color & derivation rule, IBM Carbon base, Oxocarbon code colors, the three color modes | [`docs/design/color-system.md`](docs/design/color-system.md) |
| Fonts (IBM Plex) and icons (Font Awesome, Nerd Font), and how they are loaded | [`docs/design/typography-and-icons.md`](docs/design/typography-and-icons.md) |
| Content architecture: `src/` directory layout and the per-page-type component dispatch | [`docs/design/content-architecture.md`](docs/design/content-architecture.md) |
| Friends page: external friend-links data format, submodule sync, page composition | [`docs/design/friend-links.md`](docs/design/friend-links.md) |

## 2. Session protocol — MANDATORY, every session

**At the start of every session:**

1. Read this file **in full**.
2. Read [`.agent/plan.md`](.agent/plan.md) — the task board. Identify which task(s) the
   prompt maps to; add tasks for any new requirements before implementing.
3. Read [`.agent/context-cache.md`](.agent/context-cache.md) — per-file summaries, so
   you can orient without re-reading the whole tree.
4. Read the [`docs/`](docs/README.md) documents relevant to the task — always the design
   docs when touching UI, styling, fonts, or colors.

**While working:**

- Follow the planning workflow (§4): no work outside a task, no task before its
  dependencies are complete.
- Follow the engineering conventions (§6) and the design documents. They are
  requirements, not suggestions.
- Comment major sections and components of code as you write them (§6.2).

**Before ending every prompt (definition of done):**

1. Update `.agent/plan.md` — add tasks for new requirements; tick `[x]` only what fully
   meets its acceptance criteria.
2. Update `.agent/context-cache.md` for every file added, changed, or removed.
3. Update `docs/` if any decision was made or changed (doc first, then code).
4. Append the compliance code (§3) at the very end of your final reply.

## 3. Compliance code

After completing each prompt, always end your **final reply** with this code on its own
line:

```
0x4A0000
```

It signals that this file was read and its protocol followed; the maintainer uses it to
detect when these instructions are being missed. Do not omit it, and do not emit it
without actually having followed the protocol.

## 4. Planning workflow — `.agent/plan.md`

- Every requirement gets a task **before implementation starts**. A task consists of:
  - a check box with a unique **ID** in the form `TYPE-###` (e.g. `STYLE-002`),
  - a general **category**,
  - its **dependencies** (task IDs, or “—”),
  - **acceptance criteria** that make “done” objectively checkable.
- A task is **done** only when all of its acceptance criteria are met; only then may its
  box be ticked `[x]`.
- **No task may start until all of its dependencies are complete.**
- Tasks with no dependency relationship between them may run in parallel.

## 5. Context cache — `.agent/context-cache.md`

One entry per file/module: brief (1–3 lines) but summarizing the file well — its purpose
plus the essential details someone would otherwise have to open it for. Update it
**whenever** a file is added, meaningfully changed, or removed. A stale cache entry is a
bug.

## 6. Engineering conventions (hard rules)

1. **Readability first**, in code and documentation. Prefer clear over clever.
2. **Comment major sections** — every major component, section, or logical block gets a
   short comment. Not line-by-line; enough that a newcomer can navigate the file.
3. **SCSS, not CSS** — all styling lives in dedicated `.scss` files (one per
   concern/component), never in Vue SFC `<style>` blocks and never in plain CSS files.
4. **Fonts & icons load via stylesheets** (e.g. Font Awesome `all.css`, IBM Plex CSS)
   injected into `<head>` through the VitePress config; importing the stylesheet URL
   from an SCSS file is the fallback. **No new npm packages** for fonts or icons.
   Details: [`docs/design/typography-and-icons.md`](docs/design/typography-and-icons.md).
5. **User configuration lives in the VitePress config** (`.vitepress/config.mts`,
   `themeConfig`). Only if genuinely impossible may an option live elsewhere — then
   document where and why in `docs/`.
6. **Derived colors are computed, never configured.** Any auxiliary color that matches
   or varies the main color (hover, dimmed, subtle background, …) must be generated from
   the configured main color. See [`docs/design/color-system.md`](docs/design/color-system.md) §3.
7. **i18n by default** — no hardcoded user-facing strings in components; all UI text
   goes through the locale system.
8. **Mobile is first-class** — every component must adapt correctly to mobile
   viewports (see design-language.md §8).
9. **Minimal dependencies** in general; `sass` is the one expected styling toolchain
   addition (plan task `INFRA-001`).

## 7. Documentation rules

- **Document things.** Decisions, rationale, and usage belong in `docs/`, written for
  both AI agents and human developers. [`docs/README.md`](docs/README.md) is the index.
- `docs/design/` is the design authority. When a design decision changes, **update the
  doc first**, then the code.
- **Single content source:** among the agent-instruction files (this file, `CLAUDE.md`,
  `.github/copilot-instructions.md`), only this file carries content — the others are
  references only. More generally, never duplicate a piece of documentation into
  multiple files; cross-link instead.

## 8. Repository map

```
AGENTS.md                         ← you are here — single source of agent instructions
CLAUDE.md                         → pointer to AGENTS.md (read by Claude Code)
.github/copilot-instructions.md   → pointer to AGENTS.md (read by GitHub Copilot)
.agent/plan.md                    task board: IDs, categories, deps, acceptance criteria
.agent/context-cache.md           per-file summaries (keep current)
docs/README.md                    documentation index
docs/design/                      binding design decision records
.vitepress/config.mts             site + theme configuration (the user-facing config surface)
.vitepress/theme/                 theme implementation (Layout.vue, index.ts, styles)
src/                              site content (VitePress srcDir)
```
