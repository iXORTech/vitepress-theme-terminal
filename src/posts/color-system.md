---
title: One Color, Many Derivatives
date: 2024-11-05
categories: Design
tags:
  - color
  - theme
description: The single configurable main color and how every hover, border, and selection tone is derived from it.
---

# One Color, Many Derivatives

The theme exposes exactly one configurable color — the main accent. Every other
tone (hover, dim, subtle background, border, selection) is computed from it, so
a site restyles itself by changing a single value.

## Neutral body, accent emphasis

Body text stays neutral in every mode; the main color appears only on emphasis:
links, bold, headings, inline code, and active states.
