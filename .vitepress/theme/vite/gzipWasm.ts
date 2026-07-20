// =============================================================================
// gzipWasm.ts — build-only Vite plugin: gzip oversized WASM assets (INFRA-002)
// =============================================================================
// Static hosts cap individual file sizes (Cloudflare Pages: 25 MiB), and the
// bundled Typst compiler WASM (MD-004, `useTypst`) is ~27 MiB — a deploy there
// fails outright. Rather than fetching the module from a runtime CDN (which
// MD-004 deliberately avoids), this plugin re-emits any WASM asset over the
// threshold gzipped (28.3 MB → ~10 MB) as `<name>.wasm.gz` and rewrites every
// chunk reference to the new file name. The client side (`useTypst`) detects
// the `.gz` URL, decompresses via `DecompressionStream`, and feeds the raw
// bytes to the compiler init — so the deployed site never carries a file the
// host refuses. Dev is untouched (`apply: "build"`): the dev server streams
// the raw WASM from node_modules as before.

import { gzipSync } from "node:zlib";
import type { Plugin } from "vite";

// Re-emit gzipped only above this size — small WASM (e.g. the ~1 MB Typst
// renderer) deploys fine as-is and skips the client-side decompression cost.
// 24 MiB keeps a safety margin under Cloudflare Pages' 25 MiB limit.
const SIZE_THRESHOLD = 24 * 1024 * 1024;

/** Build-only plugin: gzip `.wasm` bundle assets larger than the host limit. */
export function gzipLargeWasm(): Plugin {
  return {
    name: "ct:gzip-large-wasm",
    apply: "build",
    generateBundle(_options, bundle) {
      for (const [fileName, output] of Object.entries(bundle)) {
        if (output.type !== "asset" || !fileName.endsWith(".wasm")) continue;
        const bytes =
          typeof output.source === "string"
            ? Buffer.from(output.source)
            : Buffer.from(output.source);
        if (bytes.byteLength <= SIZE_THRESHOLD) continue;

        // Swap the asset for its gzipped form under the `.wasm.gz` name.
        // Rolldown (Vite 8) forbids assigning new bundle keys directly —
        // the replacement asset must go through `this.emitFile`.
        const gzName = `${fileName}.gz`;
        delete bundle[fileName];
        this.emitFile({
          type: "asset",
          fileName: gzName,
          source: gzipSync(bytes, { level: 9 }),
        });

        // Rewrite every code reference (the `?url` import resolves to the
        // hashed asset path inside chunks) to the renamed file.
        for (const other of Object.values(bundle)) {
          if (other.type === "chunk" && other.code.includes(fileName)) {
            other.code = other.code.replaceAll(fileName, gzName);
          }
        }
      }
    },
  };
}
