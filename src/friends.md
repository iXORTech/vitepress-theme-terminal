---
title:
  en: Friends
  zh-Hans: 友链
---

::: lang en
# Friends

Sites and people worth your time. Entries are loaded from `linksData.mjs` data
modules — hand-maintained ones and the ones synced automatically from GitHub
Issues through the friend-links generator (see “How to apply” below).
:::

::: lang zh-Hans
# 友链

值得一看的网站与朋友们。条目来自 `linksData.mjs` 数据文件——既有手工维护的，
也有通过友链生成器从 GitHub Issue 自动同步的（申请方式见下文）。
:::

<FriendLinks />

::: lang en
## How to apply

Open an issue on the link-data repository containing a `json` code block
between `<!-- DATA_START -->` and `<!-- DATA_END -->` comments:

```json
{
    "title": "My Blog",
    "url": "https://myblog.com",
    "description": "A blog about my life and stuff.",
    "avatar": "https://myblog.com/avatar.png"
}
```

Once the issue is labeled active, the generator adds the entry to the data
branch and this page picks it up on the next sync.
:::

::: lang zh-Hans
## 如何申请

在友链数据仓库开一个 issue，正文中在 `<!-- DATA_START -->` 与
`<!-- DATA_END -->` 注释之间放置一个 `json` 代码块：

```json
{
    "title": "我的博客",
    "url": "https://myblog.com",
    "description": "记录生活与技术的博客。",
    "avatar": "https://myblog.com/avatar.png"
}
```

Issue 被标记为激活后，生成器会把条目写入数据分支，本页面在下次同步时自动更新。
:::
