---
outline: [2, 3]
title:
  en: "Markdown Demo"
  zh-Hans: "Markdown 演示"
---

<script setup lang="ts">
import Card from '../.vitepress/theme/components/Card.vue'
</script>

# Markdown Demo

A complete reference for everything you can write in this theme's Markdown. Each
feature is shown twice: an **Input** block with the raw source, followed by the
**Output** it renders to. Three families are covered:

- **Basic Markdown** — the standard syntax (headings, text, lists, tables,
  quotes, links, images, code), styled to the terminal design language.
- **Markdown extensions** — the plugin suite (emoji, subscript/superscript,
  inserted/marked text, footnotes, definition lists, abbreviations, math).
- **Callouts** — the admonition containers, plus the theme's card and image
  components.

## Basic Markdown

### Headings

Headings run from level 1 (`#`) to level 6 (`######`). This page's own title is
a level‑1 heading and every section below is a level‑2 heading, so the live
examples here start at level 3.

**Input**

```md
# Heading level 1
## Heading level 2
### Heading level 3
#### Heading level 4
##### Heading level 5
###### Heading level 6
```

**Output**

### Heading level 3

#### Heading level 4

##### Heading level 5

###### Heading level 6

### Paragraphs and line breaks

Blank lines separate paragraphs. To force a line break **inside** a paragraph,
end a line with two trailing spaces or a backslash.

**Input**

```md
The first paragraph of prose. Neutral body text keeps the accent color for
emphasis only.

A second paragraph, separated by a blank line.\
This sentence sits on a new line thanks to a trailing backslash.
```

**Output**

The first paragraph of prose. Neutral body text keeps the accent color for
emphasis only.

A second paragraph, separated by a blank line.\
This sentence sits on a new line thanks to a trailing backslash.

### Emphasis

**Input**

```md
*Italic* and _also italic_, **bold** and __also bold__,
***bold italic***, and ~~strikethrough~~ for removed text.
```

**Output**

*Italic* and _also italic_, **bold** and __also bold__,
***bold italic***, and ~~strikethrough~~ for removed text.

### Blockquotes

Blockquotes can hold any other Markdown and can be nested.

**Input**

```md
> "The terminal is the most honest interface."
>
> > A nested quote replies.
>
> — someone, probably
```

**Output**

> "The terminal is the most honest interface."
>
> > A nested quote replies.
>
> — someone, probably

### Lists

Unordered lists use `-`, `*`, or `+`; ordered lists use `1.`. Indent to nest,
and mix the two freely.

**Input**

```md
- Tool bar
- Explorer
  - Auto-discovered pages
  - Source-local metadata
- Status bar

1. Read the guide
2. Configure the theme
   1. Set the main color
   2. Add your author identity
3. Ship it
```

**Output**

- Tool bar
- Explorer
  - Auto-discovered pages
  - Source-local metadata
- Status bar

1. Read the guide
2. Configure the theme
   1. Set the main color
   2. Add your author identity
3. Ship it

### Horizontal rules

Three or more `-`, `*`, or `_` on their own line draw a rule.

**Input**

```md
Above the rule.

---

Below the rule.
```

**Output**

Above the rule.

---

Below the rule.

### Links

Inline links, links with a title, reference-style links, bare autolinks, and
internal links to other pages on the site are all supported.

**Input**

```md
An [inline link](https://vitepress.dev/) and one
[with a title](https://vitepress.dev/ "VitePress home").

A [reference link][vp] defined elsewhere. A bare URL is linkified
automatically: https://vitepress.dev/

An internal link to [the guide](/guide/).

[vp]: https://vitepress.dev/
```

**Output**

An [inline link](https://vitepress.dev/) and one
[with a title](https://vitepress.dev/ "VitePress home").

A [reference link][vp] defined elsewhere. A bare URL is linkified
automatically: https://vitepress.dev/

An internal link to [the guide](/guide/).

[vp]: https://vitepress.dev/

### Inline code

Wrap code in backticks; use more backticks when the span itself contains one.

**Input**

```md
Run `pnpm dev`, read `themeConfig.mainColor`, and note that
`` `code` `` shows a literal backtick.
```

**Output**

Run `pnpm dev`, read `themeConfig.mainColor`, and note that
`` `code` `` shows a literal backtick.

### Tables

Pipes separate columns; the dashes row sets alignment with `:`.

**Input**

```md
| Region     | Position      | Aligned right |
| :--------- | :-----------: | ------------: |
| Tool bar   | top           |             1 |
| Viewport   | center        |            22 |
| Status bar | bottom        |           333 |
```

**Output**

| Region     | Position      | Aligned right |
| :--------- | :-----------: | ------------: |
| Tool bar   | top           |             1 |
| Viewport   | center        |            22 |
| Status bar | bottom        |           333 |

### Inline HTML and Font Awesome icons

Raw HTML is allowed inline, and Font Awesome Free loads with the theme
(FONT-002), so its icons work as inline HTML on any page.

**Input**

```md
Press <kbd>/</kbd> to open search. Text can be <mark>highlighted</mark> or
noted as <sub>small</sub> / <sup>raised</sup> with HTML too.

<i class="fa-solid fa-terminal"></i> terminal ·
<i class="fa-brands fa-github"></i> github ·
<i class="fa-solid fa-rss"></i> rss
```

**Output**

Press <kbd>/</kbd> to open search. Text can be <mark>highlighted</mark> or
noted as <sub>small</sub> / <sup>raised</sup> with HTML too.

<i class="fa-solid fa-terminal"></i> terminal ·
<i class="fa-brands fa-github"></i> github ·
<i class="fa-solid fa-rss"></i> rss

## Code Blocks

Fenced code blocks are highlighted by Shiki with the Oxocarbon palettes,
following the active color mode (dark / light / paper). Each block renders as a
card-style window (STYLE-004) headed by a title bar carrying the language name
and a COPY button — never a shell prompt.

**Input**

````md
```js
export default {
  name: 'VitePressThemeTerminal',
  data() {
    return { msg: 'Highlighted!' }
  },
}
```
````

**Output**

```js
export default {
  name: 'VitePressThemeTerminal',
  data() {
    return { msg: 'Highlighted!' }
  },
}
```

Add a file name in square brackets after the language — `[main.scss]` — and it
appears in the title bar before the language:

**Input**

````md
```scss [main.scss]
@use "tokens" as *;
body { color: var(--ct-main); }
```
````

**Output**

```scss [main.scss]
@use "tokens" as *;
body { color: var(--ct-main); }
```

## Markdown Extensions

These come from the markdown-it plugin suite (MD-001).

### Emoji

**Input**

```md
Ship it! :tada: :rocket: — reviewed with :heart: and a bit of :coffee:
```

**Output**

Ship it! :tada: :rocket: — reviewed with :heart: and a bit of :coffee:

### Subscript & superscript

**Input**

```md
H~2~O is water, E = mc^2^, and the 19^th^ element is K.
```

**Output**

H~2~O is water, E = mc^2^, and the 19^th^ element is K.

### Inserted & marked text

**Input**

```md
VitePress is ++simple++ and this theme makes it ==terminal-flavored==.
```

**Output**

VitePress is ++simple++ and this theme makes it ==terminal-flavored==.

### Footnotes

**Input**

```md
The theme follows the Oxocarbon palette[^1] and IBM Plex type[^2].

[^1]: A Carbon-derived color scheme by Nyoom Engineering.

[^2]: IBM's open-source typeface family: Sans, Serif, and Mono.
```

**Output**

The theme follows the Oxocarbon palette[^1] and IBM Plex type[^2].

[^1]: A Carbon-derived color scheme by Nyoom Engineering.

[^2]: IBM's open-source typeface family: Sans, Serif, and Mono.

### Definition lists

**Input**

```md
Tool bar
: Editor-style navigation tabs at the top of the shell.

Status bar
: Mode indicator, location, reading progress, and switchers.
```

**Output**

Tool bar
: Editor-style navigation tabs at the top of the shell.

Status bar
: Mode indicator, location, reading progress, and switchers.

### Abbreviations

Hover the acronyms in the output to see their expansions.

**Input**

```md
*[TUI]: Text-based User Interface
*[SSR]: Server-Side Rendering

The theme renders a TUI look while keeping full SSR support.
```

**Output**

*[TUI]: Text-based User Interface
*[SSR]: Server-Side Rendering

The theme renders a TUI look while keeping full SSR support.

### Math formulas — LaTeX

LaTeX math (MD-001) is written inline with `$…$` and as a display block with
`$$…$$`. MathJax converts it to **MathML**, which the browser renders natively in
the **IBM Plex Math** typeface (FONT-005).

**Input**

```md
Inline math: $E = mc^2$ and $\sqrt{x^2 + y^2}$. Euler also happen to discover the identity $e^{i\pi} + 1 = 0$.

Block math — Tupper's self-referential formula:

$$
\frac{1}{2} < \left\lfloor \mathrm{mod}\left( \left\lfloor \frac{y}{17} \right\rfloor 2^{-17 \lfloor x \rfloor - \mathrm{mod}(\lfloor y \rfloor, 17)}, 2 \right) \right\rfloor
$$
```

**Output**

Inline math: $E = mc^2$ and $\sqrt{x^2 + y^2}$. Euler also happen to discover the identity $e^{i\pi} + 1 = 0$.

Block math — Tupper's self-referential formula:

$$
\frac{1}{2} < \left\lfloor \mathrm{mod}\left( \left\lfloor \frac{y}{17} \right\rfloor 2^{-17 \lfloor x \rfloor - \mathrm{mod}(\lfloor y \rfloor, 17)}, 2 \right) \right\rfloor
$$

### Math formulas — Typst

Typst math (MD-004) is an alternative to LaTeX and renders in the same IBM Plex
Math typeface. A `::: typst` container holds a **block** of Typst math, and the
`:typst[…]` form drops **inline** Typst math into a paragraph. The `$`/`$$`
delimiters above always stay LaTeX — the two never collide. Typst math is
compiled in the browser; malformed input shows a visible error rather than a
blank, and the raw source stays readable with JavaScript off.

**Input**

```md
Inline Typst: :typst[e^(i pi) + 1 = 0] closes the loop. Also, :typst[E = m c^2].

Block Typst — Tupper's self-referential formula:

::: typst
1/2 < floor("mod"(floor(y/17) dot 2^(-17 floor(x) - "mod"(floor(y), 17)), 2))
:::
```

**Output**

Inline Typst: :typst[e^(i pi) + 1 = 0] closes the loop. Also, :typst[E = m c^2].

Block Typst — Tupper's self-referential formula:

::: typst
1/2 < floor("mod"(floor(y/17) dot 2^(-17 floor(x) - "mod"(floor(y), 17)), 2))
:::

## Callouts

Callout containers (MD-002) render as minimal left-bar admonitions. Default
titles are localized and follow the language switcher; a custom title can be
given on the opening line. `note` shares `info`'s color and `caution` shares
`danger`'s. `details` is collapsible.

**Input**

```md
::: info
Plain information.
:::

::: note
A note in the margin of the session.
:::

::: tip
Use the keyboard: `/` opens the find palette.
:::

::: warning
The explorer is hidden in paper mode.
:::

::: danger
`rm -rf` has no undo.
:::

::: caution
Alias of danger — same color, its own title.
:::

::: important
Derived colors are computed, never configured.
:::

::: details
Collapsed by default — click the title to expand. Callouts can hold any
Markdown, including lists and `code`.
:::

::: tip Custom title with `code`
Custom titles render inline Markdown and are not re-localized.
:::
```

**Output**

::: info
Plain information.
:::

::: note
A note in the margin of the session.
:::

::: tip
Use the keyboard: `/` opens the find palette.
:::

::: warning
The explorer is hidden in paper mode.
:::

::: danger
`rm -rf` has no undo.
:::

::: caution
Alias of danger — same color, its own title.
:::

::: important
Derived colors are computed, never configured.
:::

::: details
Collapsed by default — click the title to expand. Callouts can hold any
Markdown, including lists and `code`.
:::

::: tip Custom title with `code`
Custom titles render inline Markdown and are not re-localized.
:::

## Images and galleries

Content images are interactive by default (COMP-002): **click any image** to
enlarge it in a lightbox, and browse every image on the page as slides with the
arrow keys or controls. Images wrapped in a link keep their link, and
`data-no-lightbox` opts a single image out.

**Input**

```md
![A terminal session mock in the theme palette](/images/demo-terminal-1.svg)
```

**Output**

![A terminal session mock in the theme palette](/images/demo-terminal-1.svg)

### Swiper cards

A `:::: swiper` container with nested `::: swiper-slide-no-shadow` blocks renders
its images as SwiperJS slides with the **cards effect** — the slides sit stacked
on top of each other like a deck. Drag a card away (or swipe on touch) to reveal
the next one.

**Input**

```md
:::: swiper
::: swiper-slide-no-shadow
![A terminal session mock](/images/demo-terminal-1.svg)
:::
::: swiper-slide-no-shadow
![A split-pane terminal mock](/images/demo-terminal-2.svg)
:::
::: swiper-slide-no-shadow
![A paper-mode terminal mock](/images/demo-terminal-3.svg)
:::
::::
```

**Output**

:::: swiper
::: swiper-slide-no-shadow
![A terminal session mock](/images/demo-terminal-1.svg)
:::
::: swiper-slide-no-shadow
![A split-pane terminal mock](/images/demo-terminal-2.svg)
:::
::: swiper-slide-no-shadow
![A paper-mode terminal mock](/images/demo-terminal-3.svg)
:::
::::

## Card component

The reusable card (DEMO-002) is a floating TUI window with an optional
shell-prompt decoration. Set `showPrompt` to `true` to render the prompt line.
The `prompt` object accepts optional `host` and `path`, a required `command`,
and optional `args`; omitted values default to the configured
`themeConfig.siteName` (or, when unset, the automatically normalized site title)
plus the current page path. All values remain overridable, and the prompt is off
by default.

**Input**

````md
<script setup lang="ts">
import Card from '../.vitepress/theme/components/Card.vue'
</script>

<Card
  :show-prompt="true"
  :prompt="{
    command: 'card',
    args: '~/markdown-examples',
  }"
>
  <p>A card can hold any consuming component's content.</p>
</Card>

<Card
  :show-prompt="true"
  :prompt="{
    host: 'docs-terminal',
    path: '~/docs/override',
    command: 'open',
    args: '--readonly',
  }"
>
  <p>Host, path, command, and args can all be overridden.</p>
</Card>

<Card :show-prompt="false">
  <p>The shell-prompt decoration is optional.</p>
</Card>

<Card>
  <p>And is off by default.</p>
</Card>
````

**Output**

<Card
  :show-prompt="true"
  :prompt="{
    command: 'card',
    args: '~/markdown-examples',
  }"
>
  <p>A card can hold any consuming component's content.</p>
</Card>

<Card
  :show-prompt="true"
  :prompt="{
    host: 'docs-terminal',
    path: '~/docs/override',
    command: 'open',
    args: '--readonly',
  }"
>
  <p>Host, path, command, and args can all be overridden.</p>
</Card>

<Card :show-prompt="false">
  <p>The shell-prompt decoration is optional.</p>
</Card>

<Card>
  <p>And is off by default.</p>
</Card>

## More

Full option documentation for the Markdown pipeline and the rest of the theme
lands with the user documentation (plan DOC-002 / DOC-004).
