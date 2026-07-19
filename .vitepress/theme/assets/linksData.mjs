// =============================================================================
// linksData.mjs — hand-authored demo friend-links data (PAGE-004)
// =============================================================================
// Same format as the `blog-friend-links-data-generator` output
// (docs/design/friend-links.md §2); a hand-authored file may additionally use
// LocalizableText maps where generated data has plain strings (§4). This demo
// exercises localized group labels, an entry without an avatar (placeholder
// glyph), and a `group`-id merge with the generated submodule data (`group1`).

const linksData = [
  {
    group: "friends",
    groupName: { en: "Friends", "zh-Hans": "朋友们" },
    groupDesc: { en: "The people behind the links.", "zh-Hans": "链接背后的人。" },
    entries: [
      {
        title: "Qubik's Website",
        url: "https://qubik.top",
        description: {
          en: "The theme author's corner of the web.",
          "zh-Hans": "主题作者的个人网站。",
        },
        avatar: "https://github.com/Qubik65536.png",
      },
      {
        title: { en: "No-Avatar Example", "zh-Hans": "无头像示例" },
        url: "https://example.com",
        description: {
          en: "An entry without an avatar — the placeholder glyph renders instead.",
          "zh-Hans": "没有头像的条目——渲染占位图标。",
        },
      },
    ],
  },
  {
    // No labels here: this merges into the generated submodule's `group1` —
    // the generated groupName/groupDesc apply (the first source that provides
    // them), while this file's position (first seen) and entries are kept.
    group: "group1",
    entries: [
      {
        title: "Merged Entry",
        url: "https://vitepress.dev",
        description:
          "Appended from the hand-authored file into the generated group.",
      },
    ],
  },
];

export default linksData;
