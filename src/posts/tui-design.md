---
title:
  en: "Designing a TUI on the Web"
  zh-Hans: "在网页上设计 TUI"
date: 2025-01-28
cover: /images/demo-terminal-2.svg
categories: Design
tags:
  - tui
  - terminal
description:
  en: "How the theme borrows the language of terminal user interfaces — panels, status bars, and a fixed shell frame."
  zh-Hans: "主题如何借鉴终端用户界面的语言——面板、状态栏，以及固定的外壳框架。"
---

# Designing a TUI on the Web

The theme is modeled on modern terminal user interfaces: a tool bar at the top,
a status bar at the bottom, a file explorer on the side, and floating utility
windows over a fixed shell frame.

## Why a fixed frame

Keeping the chrome fixed and scrolling only the viewport panel makes the site
feel like an editor rather than a document — the defining move of the design
language.
