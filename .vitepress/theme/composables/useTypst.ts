// =============================================================================
// useTypst.ts — client-side Typst math rendering (MD-004 / FONT-005)
// =============================================================================
// The `::: typst` block and `:typst[…]` inline forms (theme/markdown/typst.ts)
// emit inert markup carrying the raw Typst source in `.ct-typst__src` (shown as
// the no-JS / pre-hydration fallback). Called once from the layout — like
// useSwipers / useLightbox — this composable compiles each `.ct-typst` to SVG
// with the typst.ts WASM compiler and swaps in the result, on mount and after
// every content swap. Malformed source shows a visible error (never a blank),
// and the raw source stays available so JS-off readers still see it.
//
// The compiler/renderer WASM and the IBM Plex Math font (FONT-005) load lazily
// on first use — nothing runs during SSR and pages without Typst cost nothing.
// The math font is fed to the compiler as OTF bytes and selected in the Typst
// preamble (a stylesheet cannot font a WASM compiler — typography-and-icons.md
// §2a); glyph fills are normalized to `currentColor` so the math tracks the
// active color mode without recompiling.

import { onBeforeUnmount, onMounted } from 'vue'
import { onContentUpdated } from 'vitepress'
// Bundled WASM + font as URLs (Vite copies them to dist and hands back a hashed
// URL — just strings in the bundle; the bytes are fetched only when Typst runs).
// @ts-expect-error Vite `?url` asset import (no ambient types in this project)
import compilerWasmUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url'
// @ts-expect-error Vite `?url` asset import
import rendererWasmUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url'
// @ts-expect-error Vite `?url` asset import
import mathFontUrl from '../assets/fonts/IBMPlexMath-Regular.otf?url'

// Marks an element as already handled (success or error) so re-runs skip it.
const DONE_ATTR = 'data-ct-typst-done'

// The typst.ts singleton, configured once (lazy). `null` until first use.
type TypstSnippet = {
  setCompilerInitOptions: (o: unknown) => void
  setRendererInitOptions: (o: unknown) => void
  svg: (o: { mainContent: string }) => Promise<string>
}
let typstReady: Promise<TypstSnippet> | null = null

/**
 * Resolve a bundled WASM URL to something the compiler/renderer init accepts.
 * In production the oversized compiler module ships gzipped as `.wasm.gz`
 * (Cloudflare Pages rejects files over 25 MiB — the build plugin
 * theme/vite/gzipWasm.ts re-emits it compressed, INFRA-002), so it is fetched
 * and piped through `DecompressionStream` here before init. The gzip magic
 * bytes are checked rather than trusting the extension, so a server that
 * transparently decodes `Content-Encoding: gzip` still works. Plain `.wasm`
 * URLs (dev, and the small renderer module) pass through untouched.
 */
async function fetchWasmModule(url: string): Promise<string | ArrayBuffer> {
  if (!url.endsWith('.gz')) return url // raw wasm — let the init fetch it
  const compressed = await (await fetch(url)).arrayBuffer()
  const head = new Uint8Array(compressed, 0, 2)
  if (head[0] !== 0x1f || head[1] !== 0x8b) return compressed // already decoded
  const stream = new Response(compressed)
    .body!.pipeThrough(new DecompressionStream('gzip'))
  return await new Response(stream).arrayBuffer()
}

/** Lazily import and configure typst.ts (WASM modules + IBM Plex Math font). */
function getTypst(): Promise<TypstSnippet> {
  if (typstReady) return typstReady
  typstReady = (async () => {
    const mod = await import('@myriaddreamin/typst.ts')
    const $typst = mod.$typst as unknown as TypstSnippet
    // Point the compiler and renderer at the bundled WASM (no runtime CDN), and
    // feed the compiler the IBM Plex Math OTF as the only font — enough for math
    // and it forces the FONT-005 typeface (loadFonts replaces the default font
    // set, so nothing else is fetched).
    $typst.setCompilerInitOptions({
      getModule: () => fetchWasmModule(compilerWasmUrl as string),
      beforeBuild: [mod.loadFonts([mathFontUrl as string])],
    })
    $typst.setRendererInitOptions({ getModule: () => rendererWasmUrl })
    return $typst
  })()
  return typstReady
}

/**
 * Build a minimal Typst document that renders `body` as math in IBM Plex Math.
 * `block` picks display math (`$ … $`) over inline (`$…$`); the page is sized to
 * the content with a transparent fill so the SVG drops cleanly into the flow.
 */
function buildDocument(body: string, block: boolean): string {
  const equation = block ? `$ ${body} $` : `$${body}$`
  // Block/display math renders larger than body text; the inline SVG is
  // rescaled to the surrounding font by CSS, so its compile size only sets the
  // rasterization detail (the SVG is vector — no quality cost).
  const size = block ? '20pt' : '11pt'
  return [
    '#set page(width: auto, height: auto, margin: 0pt, fill: none)',
    `#set text(font: "IBM Plex Math", size: ${size})`,
    '#show math.equation: set text(font: "IBM Plex Math")',
    equation,
  ].join('\n')
}

/**
 * Normalize a Typst SVG for the theme: black glyph fills AND shape strokes →
 * `currentColor` so the math follows the active mode's text color without
 * recompiling. Both matter — glyphs are filled paths, but rules like the
 * fraction bar are drawn as strokes (`stroke="#000"`, `fill="none"`), which
 * would otherwise stay black (invisible on dark). Sizing is left to CSS, which
 * overrides the intrinsic width/height against the SVG's viewBox
 * (styles/_math.scss).
 */
function normalizeSvg(svg: string): string {
  return svg
    .replace(/(fill|stroke)="#000000"/gi, '$1="currentColor"')
    .replace(/(fill|stroke)="#000"/gi, '$1="currentColor"')
    .replace(/(fill|stroke):\s*#000000/gi, '$1: currentColor')
}

export function useTypst(): void {
  let disposed = false

  const render = async (): Promise<void> => {
    if (typeof document === 'undefined') return
    const nodes = [
      ...document.querySelectorAll<HTMLElement>(
        `.ct-content .ct-typst:not([${DONE_ATTR}])`,
      ),
    ]
    if (nodes.length === 0) return

    // Load + configure the renderer. If this fails (chunk load / WASM init),
    // surface it on every pending block — never leave raw source with no
    // explanation — and clear the cache so a later navigation can retry.
    let $typst: TypstSnippet
    try {
      $typst = await getTypst()
    } catch (err) {
      typstReady = null
      console.error('[useTypst] failed to load the Typst renderer', err)
      for (const node of nodes) {
        const view = node.querySelector<HTMLElement>('.ct-typst__view')
        if (!view) continue
        view.textContent = 'Typst renderer failed to load'
        view.hidden = false
        node.classList.add('ct-typst--error')
      }
      return
    }
    if (disposed) return

    for (const node of nodes) {
      // The content may have swapped again while the compiler loaded.
      if (!node.isConnected || node.hasAttribute(DONE_ATTR)) continue
      const src = node.querySelector<HTMLElement>('.ct-typst__src')
      const view = node.querySelector<HTMLElement>('.ct-typst__view')
      if (!src || !view) continue

      const body = (src.textContent ?? '').trim()
      const block = node.classList.contains('ct-typst--block')

      try {
        const svg = await $typst.svg({ mainContent: buildDocument(body, block) })
        if (disposed || !node.isConnected) return
        if (!svg || !svg.includes('<svg')) throw new Error('empty render')
        view.innerHTML = normalizeSvg(svg)
        view.hidden = false
        src.hidden = true // rendered — hide the raw-source fallback
        node.classList.remove('ct-typst--error')
      } catch (err) {
        // Graceful failure: keep the source visible and show an error note.
        view.textContent =
          err instanceof Error && err.message ? err.message : 'render error'
        view.hidden = false
        node.classList.add('ct-typst--error')
      }
      node.setAttribute(DONE_ATTR, '')
    }
  }

  onMounted(() => void render())
  onContentUpdated(() => void render()) // fresh markdown DOM after navigation
  onBeforeUnmount(() => {
    disposed = true
  })
}
