---
title: Designing a TUI on the Web
date: 2025-01-28
categories: Design
tags:
  - tui
  - terminal
description: How the theme borrows the language of terminal user interfaces — panels, status bars, and a fixed shell frame.
---

# Designing a TUI on the Web

The theme is modeled on modern terminal user interfaces: a tool bar at the top,
a status bar at the bottom, a file explorer on the side, and floating utility
windows over a fixed shell frame.

## Why a fixed frame

Keeping the chrome fixed and scrolling only the viewport panel makes the site
feel like an editor rather than a document — the defining move of the design
language.
