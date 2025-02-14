# SDThemer

## Overview
SDThemer generates a theme from tokens, including **strings**, **floats**, **bools**, **colors**, and **fonts**.

## Usage
Run the following command to generate the theme:

```bash
./driver.sh themes SDThemer.swift
```

## Inputs
- `themes/default.json` *(required)* – Base theme configuration.
- `themes/custom.json` *(optional)* – Overrides or extends the default theme.

## Outputs
- **iOS:** `SDThemer.swift` *(Generated theme file for iOS projects.)*
