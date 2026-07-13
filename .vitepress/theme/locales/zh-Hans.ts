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

  // Find palette (SEARCH-002)
  'search.open': '搜索',
  'search.title': '搜索',
  'search.inputTitle': '查找',
  'search.resultsTitle': '结果',
  'search.placeholder': '搜索站点……',
  'search.hint': '[enter] 打开 · [esc] 关闭 · [↑↓] 移动',
  'search.idle': '输入以搜索',
  'search.loading': '搜索中……',
  'search.empty': '未找到结果',
  'search.error': '搜索失败——请重试',
  'search.unconfigured': '搜索尚未配置',
  'search.poweredBy': '由 Algolia 提供搜索',

  // Settings panel (THEME-007)
  'settings.title': '设置',
  'settings.open': '打开设置',
  'settings.fonts': '字体',
  'settings.fontFamily': '字体',
  'settings.fontSize': '字号',
  'settings.fontDefault': '默认',
  'settings.fontSans': '无衬线',
  'settings.fontSerif': '衬线',
  'settings.fontMono': '等宽',
  'settings.sizeSmall': '小',
  'settings.sizeMedium': '中',
  'settings.sizeLarge': '大',
  'settings.language': '语言',

  // Code block cards (STYLE-004)
  'code.copy': '复制',
  'code.copied': '已复制',

  // Image containers (COMP-002) — card deck arrows
  'swiper.prev': '上一张',
  'swiper.next': '下一张',

  // Status bar segments
  'status.read': '阅读',
  'status.home': '主页',
  'status.notFound': '404',
  'status.clock': '当前时间',
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
