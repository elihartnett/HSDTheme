const { camelCase, isDynamicToken } = require("./helpers");

module.exports = function registerAndroidJetpackComposeDynamicColorFormat(
  StyleDictionary
) {
  StyleDictionary.registerFormat({
    name: "android-jetpack/dynamic-color",
    format: function ({ dictionary }) {
      const tokens = dictionary.allProperties || dictionary.allTokens;

      const header = `package com.example.myapp.theme

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.isSystemInDarkTheme

fun parseColor(hex: String): Color {
    val hexClean = hex.trim().removePrefix("#")
    val colorString = if (hexClean.length == 6) "FF" + hexClean else hexClean
    return Color(colorString.toLong(16))
}

object DynamicColors {`;

      const properties = tokens
        .map((token) => {
          if (isDynamicToken(token)) {
            return `
    val ${camelCase(token.path)}: Color
        @Composable
        get() = if (isSystemInDarkTheme()) {
            parseColor("${token.value.dark}")
        } else {
            parseColor("${token.value.light}")
        }`;
          }
          return `
    val ${camelCase(token.path)}: Color = parseColor("${token.value}")`;
        })
        .join("\n");

      const footer = `
}`;

      return header + properties + footer;
    },
  });
};
