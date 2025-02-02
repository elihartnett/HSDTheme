const { isDynamicToken } = require("../helpers");

module.exports = function registerAndroidJetpackThemeFormat(StyleDictionary) {
  StyleDictionary.registerFormat({
    name: "android/jetpack",
    format: function ({ dictionary }) {
      const tokens = dictionary.allTokens;

      // Separate tokens by type
      const colorTokens = tokens.filter((token) => token.path[0] === "color");
      const fontTokens = tokens.filter((token) => token.path[0] === "font");

      // Start building the output with package and import statements.
      let output = "";
      output += "package com.example.myapp.theme\n\n";
      output += "import androidx.compose.runtime.Composable\n";
      output += "import androidx.compose.ui.graphics.Color\n";
      output += "import androidx.compose.foundation.isSystemInDarkTheme\n";
      output += "import androidx.compose.ui.text.font.Font\n";
      output += "import androidx.compose.ui.text.font.FontFamily\n\n";

      // Define a helper function to parse a hex color.
      output += "fun parseColor(hex: String): Color {\n";
      output += '    val hexClean = hex.trim().removePrefix("#")\n';
      output +=
        '    val colorString = if (hexClean.length == 6) "FF" + hexClean else hexClean\n';
      output += "    return Color(colorString.toLong(16))\n";
      output += "}\n\n";

      // Build the DynamicColors object for color tokens.
      output += "object DynamicColors {\n";
      colorTokens.forEach((token) => {
        // Use token.path[1] as the property name (for example, "primary").
        const propertyName = token.path[1];
        if (isDynamicToken(token)) {
          output += `    val ${propertyName}: Color\n`;
          output += "        @Composable\n";
          output += "        get() = if (isSystemInDarkTheme()) {\n";
          output += `            parseColor("${token.value.dark}")\n`;
          output += "        } else {\n";
          output += `            parseColor("${token.value.light}")\n`;
          output += "        }\n";
        } else {
          output += `    val ${propertyName}: Color = parseColor("${token.value}")\n`;
        }
      });
      output += "}\n\n";

      // Build the Fonts object for font tokens.
      output += "object Fonts {\n";
      fontTokens.forEach((token) => {
        // Use token.path[1] as the property name (for example, "heading").
        const propertyName = token.path[1];
        // Convert the fontName to a valid resource name (e.g. "Helvetica-Bold" → "helvetica_bold")
        const fontResource = token.value.fontName
          .toLowerCase()
          .replace(/-/g, "_");
        output += `    val ${propertyName} = FontFamily(Font(R.font.${fontResource}))\n`;
      });
      output += "}\n";

      return output;
    },
  });
};
