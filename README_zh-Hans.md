# VitePress Theme Terminal

[English](README.md) · **简体中文**

![深色模式下的主题演示站点：工具栏、文件浏览器、视口中的 shell 提示符卡片、页脚与状态栏](.github/assets/cover.png)

一个面向博客与个人站点的自定义 [VitePress](https://vitepress.dev) 主题，把站点
呈现为一次现代的终端／TUI 会话：工具栏、文件浏览器、可滚动的视口、状态栏，以及
浮动工具窗口。设计语言取材于模式化文本编辑器——面板秩序、以键盘为中心的工具窗口
与编辑器外壳——并且渲染出的界面中不出现任何第三方品牌标识。

## 功能

- **TUI 外壳** —— 带下拉子菜单与溢出抽屉的工具栏、NeoVim 风格的文件浏览器、
  实时状态栏（状态标签、面包屑、阅读进度、时钟、设置），以及浮动窗口。
- **一个颜色配置整个主题** —— 只需设置 `mainColor`；所有悬停、边框、暗淡与选中
  色调都由它**派生**。中性色板来自 IBM Carbon，代码配色来自 Oxocarbon。
- **三种配色模式** —— 深色（默认）、浅色，以及为阅读优化、同时用于打印的纸张
  模式。用户的选择会被记住。
- **博客能力** —— 带日期、标签、分类、归档、系列、封面图、作者署名、许可卡片，
  以及 Waline 评论与访问计数的文章体系。
- **丰富的 Markdown** —— 可复制的代码块卡片、八种提示框、LaTeX（MathML）与
  Typst 公式、引用块、图片灯箱与 Swiper 相册，以及 markdown-it 扩展套件
  （脚注、定义列表、缩写、上下标、插入、标记、emoji）。
- **导航** —— 自动发现的文件浏览器（可用同目录的 `explorer.json` 补充元数据）、
  可拖动且会被记住宽度的浏览器与目录、带复制链接的标题锚点、查找面板（`/`），
  以及不带后缀的简洁 URL。
- **国际化** —— 客户端语言切换，且 **URL 中没有 `/<lang>/` 段**：frontmatter
  标题、分类法标签、界面字符串，乃至分语言的页面正文（`::: lang` 块）都可本地化。
  内置英文与简体中文。
- **移动端重点适配** —— 每个组件都会适配，包括文件浏览器抽屉。
- **字体排印** —— IBM Plex Sans/Serif/Mono/Math、Font Awesome 以及仅含符号的
  Nerd Font，全部通过样式表加载（不使用任何 npm 字体包）。

## 环境要求

| 工具 | 版本 | 说明 |
| --- | --- | --- |
| Node.js | 20 LTS 或更新 | VitePress 2 所要求的版本 |
| pnpm | 任意较新版本 | 本仓库使用的包管理器 |
| git | 任意 | 可选——文章的「更新时间」来自 git |

## 快速开始

主题**以本仓库的形式**发布：这是一个 VitePress 站点，主题位于
`.vitepress/theme/`，`src/` 中的演示站点覆盖了每一项功能。

```sh
git clone --recurse-submodules https://github.com/iXORTech/vitepress-theme-terminal.git my-site
cd my-site
pnpm install

pnpm dev       # 带热更新的开发服务器，http://localhost:5173
pnpm build     # 生产构建，输出到 .vitepress/dist
pnpm preview   # 在本地预览构建产物
```

`--recurse-submodules` 会拉取演示用的友链数据；不加也没关系，友链页面会只显示
手写的条目。

接着在 `.vitepress/config.mts` 中把它变成你的站点——站点身份、`mainColor`、
作者与许可协议、工具栏导航与页脚。逐步说明（以及如何清理演示内容）见
[`docs/guide/getting-started.md`](docs/guide/getting-started.md)。

## 仓库结构

```
.vitepress/config.mts     站点与主题配置——你改得最多的文件
.vitepress/theme/         主题实现（组件、样式、组合式函数）
src/                      站点内容（VitePress 的 `srcDir`）——演示站点
docs/                     文档之家（唯一会被编辑的文档所在地）
src/docs/                 已发布文档的生成副本（已加入 gitignore）
AGENTS.md                 给 AI 编码代理的指令
.agent/                   任务板与逐文件的上下文缓存
```

## 文档

全部文档都在 [`docs/`](docs/index.md)。其中面向用户的部分也会发布到构建后站点的
`/docs/`。

| 文档 | 内容 |
| --- | --- |
| [快速开始](docs/guide/getting-started.md) | 环境要求、安装、运行站点，以及让站点变成你自己的五处改动 |
| [撰写内容](docs/guide/writing-content.md) | 页面类型、frontmatter、代码块、提示框、公式、图片、在 Markdown 中使用 Vue |
| [文章、分类与系列](docs/guide/blogging.md) | 文章、标签与分类、列表页、系列、封面图、文末卡片 |
| [导航与外壳界面](docs/guide/navigation.md) | 工具栏、文件浏览器、目录、查找面板、状态栏、键盘快捷键 |
| [国际化](docs/guide/internationalization.md) | 语言切换、可本地化文本、`::: lang` 正文、新增语言 |
| [自定义](docs/guide/customization.md) | 配色与模式、字体与图标、样式规则、手写视图与插槽 |
| [构建与部署](docs/guide/deployment.md) | 构建与预览、托管、子路径部署、CI 检出、上线前清单 |
| [`themeConfig` 参考](docs/configuration/theme-config.md) · [Frontmatter 参考](docs/configuration/frontmatter.md) | 每一个选项的类型、默认值与示例 |

[`docs/design/`](docs/design/) 下具有约束力的设计记录**只存在于仓库中**——它们是
写给贡献者与编码代理的决策记录，有意不发布到站点上。

## 参与开发

请先阅读 [`AGENTS.md`](AGENTS.md)：它是本仓库工作流规则、工程约定与会话流程的
唯一来源，对人类与 AI 代理同样适用。简而言之：每项需求都要先在
[`.agent/plan.md`](.agent/plan.md) 中立任务再实现；设计决策先改 `docs/design/`
再改代码；样式一律用 SCSS；界面文本一律走本地化系统；移动端不是可选项。

## 许可协议

[MIT](LICENSE) © 2026 iXOR Technology。

这是主题本身的授权条款。文章的**内容**许可协议由站点所有者通过 `themeConfig` 选项设置，默认为 CC BY-NC-SA 4.0。
