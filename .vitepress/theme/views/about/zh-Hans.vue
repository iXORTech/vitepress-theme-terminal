<script setup lang="ts">
// ============================================================================
// about/zh-Hans.vue — Simplified Chinese About content (PAGE-003)
// ============================================================================
// The Simplified-Chinese counterpart of `about/en.vue`, rendered by
// `views/About.vue` when the UI language is Chinese. Same structure and shared
// card-grid span modifiers (full lead · 2/3 + 1/3 · 1/2 + 1/2); only the
// authored prose differs.
import Card from '../../components/Card.vue'
</script>

<template>
  <section class="ct-page ct-about">
    <h1 class="ct-page__title">关于</h1>

    <ul class="ct-cardgrid">
      <!-- 整行引导卡片，带有 shell 提示符 -->
      <li class="ct-cardgrid__item ct-cardgrid__item--full">
        <Card class="ct-about-block" show-prompt :prompt="{ command: 'whoami' }">
          <h2 class="ct-about-block__title">
            <i class="fa-solid fa-user-astronaut ct-about-block__icon" aria-hidden="true"></i>
            你好，我是终端主题
          </h2>
          <p class="ct-about-block__body">
            这是 VitePress 终端主题的演示「关于」页面——一个为博客与个人网站打造的现代
            TUI/终端环境。它同时也是一份活的参考：每一项功能都在这些页面中有所体现。
            本页以普通的 Vue 视图编写；编辑
            <code>.vitepress/theme/views/about/zh-Hans.vue</code> 即可换成你自己的内容。
          </p>
        </Card>
      </li>

      <!-- 一行：2/3 + 1/3 -->
      <li class="ct-cardgrid__item ct-cardgrid__item--two-thirds">
        <Card class="ct-about-block">
          <h2 class="ct-about-block__title">
            <i class="fa-solid fa-seedling ct-about-block__icon" aria-hidden="true"></i>
            近况
          </h2>
          <p class="ct-about-block__body">
            正在完善主题的各类页面类型，并在深色、浅色与纸张三种配色模式下打磨阅读体验。
            你正在看的卡片网格是完全流式的：每张卡片可占据一行的三分之一、二分之一、
            三分之二或整行，可按页面需要自由搭配。
          </p>
        </Card>
      </li>

      <li class="ct-cardgrid__item ct-cardgrid__item--third">
        <Card class="ct-about-block">
          <h2 class="ct-about-block__title">
            <i class="fa-solid fa-screwdriver-wrench ct-about-block__icon" aria-hidden="true"></i>
            技术栈
          </h2>
          <dl class="ct-about-block__items">
            <div class="ct-about-block__row">
              <dt class="ct-about-block__label">框架</dt>
              <dd class="ct-about-block__value">VitePress 2 + Vue 3</dd>
            </div>
            <div class="ct-about-block__row">
              <dt class="ct-about-block__label">样式</dt>
              <dd class="ct-about-block__value">SCSS</dd>
            </div>
            <div class="ct-about-block__row">
              <dt class="ct-about-block__label">字体</dt>
              <dd class="ct-about-block__value">IBM Plex</dd>
            </div>
          </dl>
        </Card>
      </li>

      <!-- 一行：1/2 + 1/2 -->
      <li class="ct-cardgrid__item ct-cardgrid__item--half">
        <Card class="ct-about-block">
          <h2 class="ct-about-block__title">
            <i class="fa-solid fa-link ct-about-block__icon" aria-hidden="true"></i>
            其他链接
          </h2>
          <dl class="ct-about-block__items">
            <!-- 堆叠：较长的仓库地址在标签下方单独成行 -->
            <div class="ct-about-block__row ct-about-block__row--stacked">
              <dt class="ct-about-block__label">
                <i class="fa-brands fa-github" aria-hidden="true"></i> GitHub
              </dt>
              <dd class="ct-about-block__value">
                <a
                  href="https://github.com/iXORTech/vitepress-theme-terminal"
                  target="_blank"
                  rel="noopener"
                >iXORTech/vitepress-theme-terminal</a>
              </dd>
            </div>
          </dl>
        </Card>
      </li>

      <li class="ct-cardgrid__item ct-cardgrid__item--half">
        <Card class="ct-about-block">
          <h2 class="ct-about-block__title">
            <i class="fa-solid fa-envelope ct-about-block__icon" aria-hidden="true"></i>
            打个招呼
          </h2>
          <dl class="ct-about-block__items">
            <div class="ct-about-block__row ct-about-block__row--stacked">
              <dt class="ct-about-block__label">
                <i class="fa-solid fa-at" aria-hidden="true"></i> 邮箱
              </dt>
              <dd class="ct-about-block__value">
                <a href="mailto:hello@example.com">hello@example.com</a>
              </dd>
            </div>
          </dl>
        </Card>
      </li>
    </ul>
  </section>
</template>
