---
name: verify
description: Build, serve, and drive this VitePress theme in a headless browser to verify UI changes at the rendered surface (screenshots + DOM checks).
---

# Verify — VitePress Theme Terminal

The surface is the rendered site in a browser. Verify by serving the built site
and driving it with Playwright; never stop at `pnpm build` succeeding.

## Build & serve

```bash
pnpm build                      # ~1s; SSR renders all pages
pnpm preview --port 4310 &      # serves .vitepress/dist with client hydration
```

`grep -o 'ct-[a-z_-]*' .vitepress/dist/<page>.html | sort -u` is a quick
SSR-markup sanity check before launching a browser.

**Restart `pnpm preview` after every rebuild.** Its static server (sirv)
snapshots the asset list at startup, so a rebuild's re-hashed
`assets/style.*.css`/JS 404 silently — pages then render with stale or NO
theme CSS and every style assertion fails confusingly
(`lsof -ti :4310 | xargs kill` first).

## Headless browser (gotchas)

- No playwright in this repo. Install it in a temp dir:
  `mkdir /tmp/vp-verify && cd /tmp/vp-verify && npm i playwright`.
- The ms-playwright browser cache may not match the playwright version
  (`chromium.executablePath()` pointing at a missing build). Workaround that
  avoids a ~150MB download: launch the system browser —
  `chromium.launch({ executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium' })`.

## Flows worth driving

- **Color modes**: click the status-bar mode control; assert
  `html[data-ct-mode]` cycles dark → light → paper, `localStorage['ct-mode']`
  persists across reload, paper mode switches body font to IBM Plex Serif.
- **Language**: click the status-bar language control; strings switch in place
  on the same URL (no `/<lang>/`), `localStorage['ct-lang']` persists; callout
  titles re-localize (`[data-ct-callout-title]`).
  Known nit: after reload, VitePress's own watcher resets `<html lang>` to the
  site `lang` even though the restored UI language applies.
- **Shell chrome (THEME-001/008)**: fixed frame — the window must NOT be
  scrollable (`documentElement.scrollHeight <= clientHeight`); `.ct-viewport`
  is the only scroll container and clips content at its edges (nothing visible
  in the panel gaps). Reading progress `%` tracks the panel's scrollTop
  (0 → 100; 100 when the page fits); location segment mirrors
  `page.relativePath`. Navigation resets the panel to top; footnote/header
  anchor clicks and `#hash` deep links scroll the panel (useViewportScroll).
  Print emulation releases the fixed height (document becomes scrollable).
- **Mobile**: 360px viewport — toolbar nav and status location hide; assert
  `document.documentElement.scrollWidth <= clientWidth` (no horizontal
  overflow).
- **Print**: `page.emulateMedia({ media: 'print' })` — both bars `display:
  none`, paper tokens apply (white body bg).
- **Nerd Font gating**: PUA glyphs only render under `html[data-ct-nerdfont]`
  (set async by `useNerdFont()` after the webfont loads — allow networkidle).
