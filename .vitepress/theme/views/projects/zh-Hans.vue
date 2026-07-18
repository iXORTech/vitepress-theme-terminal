<script setup lang="ts">
// ============================================================================
// projects/zh-Hans.vue — Simplified Chinese projects content (PAGE-002)
// ============================================================================
// The Simplified-Chinese counterpart of `projects/en.vue`, rendered by
// `views/Projects.vue` when the UI language is Chinese. Same structure and
// shared card-grid span modifiers (full lead · 1/3 + 2/3); only the authored
// prose differs.
import Card from '../../components/Card.vue'
</script>

<template>
  <section class="ct-page ct-projects">
    <h1 class="ct-page__title">项目</h1>

    <ul class="ct-cardgrid">
      <!-- 整行特色项目，带有 shell 提示符 -->
      <li class="ct-cardgrid__item ct-cardgrid__item--full">
        <Card class="ct-project" show-prompt :prompt="{ command: 'open' }">
          <h2 class="ct-project__name">
            <i class="fa-solid fa-terminal ct-project__icon" aria-hidden="true"></i>
            <a
              href="https://github.com/iXORTech/vitepress-theme-terminal"
              target="_blank"
              rel="noopener"
            >VitePress 终端主题</a>
          </h2>
          <p class="ct-project__desc">
            本主题——一个为 VitePress 打造的现代 TUI/终端环境，依据一套绑定的设计系统逐步构建：
            编辑器风格的工具栏、状态栏、文件资源管理器、浮动窗口，以及带提示符装饰的卡片。
          </p>
          <ul class="ct-project__tags">
            <li class="ct-project__tag">vitepress</li>
            <li class="ct-project__tag">vue</li>
            <li class="ct-project__tag">scss</li>
          </ul>
        </Card>
      </li>

      <!-- 一行：1/3 + 2/3 -->
      <li class="ct-cardgrid__item ct-cardgrid__item--third">
        <Card class="ct-project">
          <h2 class="ct-project__name">
            <i class="fa-solid fa-font ct-project__icon" aria-hidden="true"></i>
            <a href="https://www.ibm.com/plex/" target="_blank" rel="noopener">IBM Plex</a>
          </h2>
          <p class="ct-project__desc">
            贯穿界面、阅读与代码各处的字体家族。
          </p>
          <ul class="ct-project__tags">
            <li class="ct-project__tag">fonts</li>
          </ul>
        </Card>
      </li>

      <li class="ct-cardgrid__item ct-cardgrid__item--two-thirds">
        <Card class="ct-project">
          <h2 class="ct-project__name">
            <i class="fa-solid fa-palette ct-project__icon" aria-hidden="true"></i>
            <a
              href="https://github.com/nyoom-engineering/oxocarbon.nvim"
              target="_blank"
              rel="noopener"
            >Oxocarbon</a>
          </h2>
          <p class="ct-project__desc">
            源自 IBM Carbon 的配色方案，为主题在三种模式下的代码高亮提供支持——
            为屏幕模式提供深色与浅色两套配色，并为纸张模式提供偏向打印的配色。
          </p>
          <ul class="ct-project__tags">
            <li class="ct-project__tag">colors</li>
            <li class="ct-project__tag">nvim</li>
          </ul>
        </Card>
      </li>
    </ul>
  </section>
</template>
