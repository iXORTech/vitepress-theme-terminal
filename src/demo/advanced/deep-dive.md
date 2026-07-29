---
title:
  en: "Deep Dive"
  zh-Hans: "深入"
---

::: lang en

# Deep Dive

A leaf page two folders deep (`demo/advanced/deep-dive`) — the deepest node
of the explorer demo tree.

This page's **body switches with the site language** (I18N-007): the text you
are reading is inside a `::: lang en` block, and a `::: lang zh-Hans` block
holds the Simplified Chinese version. Switch the language in the status bar and
the content changes in place — no navigation, just like the localized `title`
that drives this page's explorer label.

Worth noticing here:

- the explorer indents each level along a guide line, editor-tree style;
- this row carries the accent highlight while the page is open;
- the `advanced` folder above shows its **open** folder glyph now, and
  remembers being open if you reload.

:::

::: lang zh-Hans

# 深入

一个位于两层文件夹深处的叶子页面（`demo/advanced/deep-dive`）——浏览器演示树中最深的节点。

这个页面的**正文会随站点语言切换**（I18N-007）：你正在阅读的文字位于一个
`::: lang zh-Hans` 块中，而另一个 `::: lang en` 块保存着英文版本。在状态栏切换语言，
内容便会就地更换——无需跳转，正如驱动本页浏览器标签的本地化 `title` 一样。

值得留意的地方：

- 浏览器沿着一条引导线为每一层缩进，如同编辑器的文件树；
- 打开此页面时，这一行带有强调高亮；
- 上方的 `advanced` 文件夹此时显示为**展开**的文件夹图标，并会在你重新加载后记住其展开状态。

:::

Note that this line exists outside the language blocks, so it is always shown regardless of the selected language. It is a good place for content that is not language-specific, such as code snippets, images, or shared instructions.

注意，这一行位于语言块之外，因此无论选择哪种语言，它都会始终显示。它是放置非语言特定内容的好地方，例如代码片段、图片或共享说明。
