// =============================================================================
// zh-Hans.ts — built-in Chinese (Simplified) locale (I18N-001)
// =============================================================================
// Ships with the theme (plan I18N-001). Typed against the English table, so a
// missing or extra key is a type error — translations can never drift from
// the canonical string set silently.

import type { ThemeLocaleStrings } from './en'

export const zhHans: ThemeLocaleStrings = {
  // Self-description
  'lang.label': '简体中文',

  // Color modes
  'mode.dark': '深色',
  'mode.light': '浅色',
  'mode.paper': '纸张',
  'mode.switch': '切换颜色模式',

  // Language switching
  'lang.switch': '切换语言',

  // Tool bar navigation
  'nav.label': '站点导航',
  'nav.home': '主页',

  // File explorer
  'explorer.label': '资源管理器',
  'explorer.toggle': '切换资源管理器',
  'explorer.close': '关闭资源管理器',

  // Floating utility window
  'window.close': '关闭窗口',
  'window.demoTitle': '浮动窗口',
  'window.demoOpen': '打开浮动窗口演示',
  'window.demoBody':
    '这是共享的浮动工具窗口——查找面板、设置面板等工具都以一个或多个带边框窗格的形式渲染在这一个窗口中。',
  'window.demoHintsTitle': '提示',
  'window.demoHint': '[~] 打开 · [esc] 关闭',
  // Search demo
  'window.searchTitle': '搜索',
  'window.searchInputTitle': '查找',
  'window.searchResultsTitle': '结果',
  'window.searchPlaceholder': '搜索站点……',
  'window.searchHint': '[enter] 打开 · [esc] 关闭 · [↑↓] 移动',
  'window.searchSample1': '色彩系统',
  'window.searchSample2': '语法高亮',
  'window.searchSample3': '关于本站',

  // Status bar segments
  'status.read': '阅读',
  'status.progress': '阅读进度',
  'status.top': '顶端',
  'status.bottom': '底端',
  'status.backToTop': '返回顶部',

  // In-viewport footer
  'footer.copyright': '版权所有 © {year} {author}',
  'footer.poweredBy': '由 {vitepress} 与 {theme} 驱动',
  'footer.rss': 'RSS 订阅',
  'footer.license': '许可协议',
  'footer.licensedUnder': '内容按 {license} 许可协议授权',
  // Custom pre-footer demo label (THEME-006, temporary)
  'footer.demoCustom': '可自定义的页脚内容',

  // Callout default titles
  'callout.info': '信息',
  'callout.note': '备注',
  'callout.tip': '提示',
  'callout.warning': '警告',
  'callout.danger': '危险',
  'callout.caution': '注意',
  'callout.important': '重要',
  'callout.details': '详情',
}
