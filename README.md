# SDTheme

## Overview

This repository provides a **Style Dictionary based theme** that defines tokens for colors, dimensions, and fonts.

## How It Works

The **default theme** (`themes/default.json`) serves as the base configuration. You can create **custom themes** (e.g., `themes/custom.json`) to override specific tokens. Any token not explicitly defined in a custom theme will fall back to the default theme.

`SDTheme`s will be generated, allowing seamless switching between themes.

## Inputs

- `themes/default.json`
- `themes/custom.json`

## Outputs

- **iOS:** `build/ios/SDTheme.swift`
