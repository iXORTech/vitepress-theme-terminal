---
title:
  en: "Markdown Examples"
  zh-Hans: "Markdown 示例"
---

<script setup lang="ts">
import Card from '../.vitepress/theme/components/Card.vue'
</script>

# Markdown Extension Examples

This page demonstrates the markdown extensions provided by the theme: the
markdown-it plugin suite (MD-001), math formulas, and the callout containers
(MD-002), alongside VitePress's built-in Shiki syntax highlighting.

The basic Markdown syntax, *emphasis*, **strong**, `inline code`, [links](https://vitepress.dev/), and lists are supported as usual. The following sections show the theme's extensions or enhancements on a certain feature.

## Syntax Highlighting

Code blocks are highlighted by Shiki with the Oxocarbon palettes, following
the active color mode (dark / light / paper). Each block renders as a
card-style window (STYLE-004) headed by a title bar — the language name and a
COPY button — never a shell prompt.

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

## Emoji

**Input**

```md
Ship it! :tada: :rocket: — reviewed with :heart: and a bit of :coffee:
```

**Output**

Ship it! :tada: :rocket: — reviewed with :heart: and a bit of :coffee:

## Subscript & Superscript

**Input**

```md
H~2~O is water, E = mc^2^, and the 19^th^ element is K.
```

**Output**

H~2~O is water, E = mc^2^, and the 19^th^ element is K.

## Inserted & Marked Text

**Input**

```md
VitePress is ++simple++ and this theme makes it ==terminal-flavored==.
```

**Output**

VitePress is ++simple++ and this theme makes it ==terminal-flavored==.

## Footnotes

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

## Definition Lists

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

## Abbreviations

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

## Math Formulas

**Input**

```md
Inline math: $E = mc^2$ and $\sqrt{x^2 + y^2}$.

Block math:

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$
```

**Output**

Inline math: $E = mc^2$ and $\sqrt{x^2 + y^2}$.

Block math:

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

## Icons (Font Awesome)

Font Awesome Free loads with the theme (FONT-002), so its icons can be used
directly as inline HTML in any page.

**Input**

```md
<i class="fa-solid fa-terminal"></i> terminal ·
<i class="fa-brands fa-github"></i> github ·
<i class="fa-solid fa-rss"></i> rss
```

**Output**

<i class="fa-solid fa-terminal"></i> terminal ·
<i class="fa-brands fa-github"></i> github ·
<i class="fa-solid fa-rss"></i> rss

## Images

Content images are interactive by default (COMP-002): **click any image** to
enlarge it in a lightbox, and browse every image on the page as slides with the
arrow keys or controls — the plain image below and the three cards in the deck
further down all belong to the same gallery. Images wrapped in a link keep
their link, and `data-no-lightbox` opts a single image out.

**Input**

```md
![A terminal session mock in the theme palette](/images/demo-terminal-1.svg)
```

**Output**

![A terminal session mock in the theme palette](/images/demo-terminal-1.svg)

### Swiper cards

A `:::: swiper` container with nested `::: swiper-slide-no-shadow` blocks
renders its images as SwiperJS slides with the **cards effect** — the slides
sit stacked on top of each other like a deck. Drag a card away (or swipe on
touch) to reveal the next one.

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

The reusable card is a floating window with an optional shell-prompt
decoration. Set `showPrompt` to `true` to render it. The `prompt` object accepts
optional `host` and `path`, required `command`, and optional `args`; omitted
values default to the normalized site title and current page path. All values
remain overridable.

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

## Callouts

Callout containers render as TUI cards. Default titles are localized and
follow the language switcher; custom titles are supported. `note` shares
`info`'s color, `caution` shares `danger`'s.

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
Collapsed by default — click the title to expand.
:::

::: tip Custom title with `code`
Custom titles render inline markdown and are not re-localized.
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
Collapsed by default — click the title to expand.
:::

::: tip Custom title with `code`
Custom titles render inline markdown and are not re-localized.
:::

## More

Full option documentation for the markdown pipeline lands with the user docs
(plan DOC-002/DOC-004).
