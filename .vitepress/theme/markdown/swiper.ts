// =============================================================================
// swiper.ts — image slider containers (COMP-002)
// =============================================================================
// Node-side markdown setup. Registers the two nested containers of the image
// slider syntax (design-language.md §4, image containers):
//
//   :::: swiper
//   ::: swiper-slide-no-shadow
//   ![First](/images/first.png)
//   :::
//   ::: swiper-slide-no-shadow
//   ![Second](/images/second.png)
//   :::
//   ::::
//
// The outer container becomes the SwiperJS root (`.swiper > .swiper-wrapper`),
// each inner container a `.swiper-slide`. The markup is inert static HTML; the
// client composable `useSwipers()` instantiates the cards-effect Swiper on it
// after mount (the library is never loaded during SSR). The `-no-shadow` slide
// flavor renders without Swiper's own slide-shadow overlay — the theme's card
// finish (border/rounding in styles/_swiper.scss) supplies the depth instead.

import container from 'markdown-it-container'

// Minimal structural typing for the markdown-it instance (markdown-it is a
// transitive dependency; its types are not resolvable from the project root).
interface MarkdownItLike {
  use: (plugin: unknown, ...params: unknown[]) => MarkdownItLike
}

/** Wire the `:::: swiper` / `::: swiper-slide-no-shadow` containers. */
export function swiperPlugin(md: MarkdownItLike): void {
  // Outer deck: a flex wrapper holding the prev arrow, the Swiper root (with
  // the wrapper element Swiper expects), and the next arrow — the arrows sit
  // BESIDE the card stack, never on top of the images. Real <button>s (no
  // ARIA retrofitting), wired to the Navigation module and localized by
  // useSwipers.
  md.use(container, 'swiper', {
    render: (tokens: { nesting: number }[], idx: number) =>
      tokens[idx].nesting === 1
        ? '<div class="ct-swiper">' +
          '<button type="button" class="ct-swiper__nav ct-swiper__nav--prev"></button>' +
          '<div class="ct-swiper__deck swiper"><div class="swiper-wrapper">\n'
        : '</div></div>' +
          '<button type="button" class="ct-swiper__nav ct-swiper__nav--next"></button>' +
          '</div>\n',
  })

  // One card of the deck, in the shadowless flavor.
  md.use(container, 'swiper-slide-no-shadow', {
    render: (tokens: { nesting: number }[], idx: number) =>
      tokens[idx].nesting === 1
        ? '<div class="ct-swiper__slide swiper-slide">\n'
        : '</div>\n',
  })
}
