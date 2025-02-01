module.exports = function (styleDictionary) {
  styleDictionary.registerFormat({
    name: "android-jetpack/font",
    format: function ({ dictionary }) {
      const tokens = dictionary.allTokens;
      let output = "";
      output += "package com.yourcompany.theme\n\n";
      output += "import androidx.compose.ui.text.font.Font\n";
      output += "import androidx.compose.ui.text.font.FontFamily\n\n";
      output += "object Fonts {\n";
      tokens.forEach((token) => {
        // Convert the fontName (e.g. "Helvetica-Bold") to a resource name (e.g. "helvetica_bold")
        const fontResource = token.value.fontName
          .toLowerCase()
          .replace(/-/g, "_");
        // Use the second element of the token path as the property name (e.g. "heading")
        const propertyName = token.path[1];
        output += `    val ${propertyName} = FontFamily(Font(R.font.${fontResource}))\n`;
      });
      output += "}\n";
      return output;
    },
  });
};
