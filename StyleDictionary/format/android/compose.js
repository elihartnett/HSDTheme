const { isDynamicToken } = require("../helpers");

module.exports = function registerJetpackComposeFormat(styleDictionary, name) {
  styleDictionary.registerFormat({
    name: name,
    format: function ({ dictionary, options }) {
      const themeName = options.themeName;
      const allTokens = dictionary.allProperties || dictionary.allTokens;

      const stringTokens = allTokens.filter(
        (token) => token.path[0] === "string"
      );
      const dimensionTokens = allTokens.filter(
        (token) => token.path[0] === "dimension"
      );
      const boolTokens = allTokens.filter((token) => token.path[0] === "bool");
      const colorTokens = allTokens.filter(
        (token) => token.path[0] === "color"
      );
      const fontTokens = allTokens.filter((token) => token.path[0] === "font");

      let output = `
object ${themeName} : SDTheme {

    override val strings: SDStrings = Strings
    override val dimensions: SDDimensions = Dimensions
    override val bools: SDBools = Bools
    override val colors: SDColors = Colors
    override val fonts: SDFonts = Fonts

    object Strings : SDStrings {
`;
      stringTokens.forEach((token) => {
        output += `        override val ${token.path[1]}: String get() = "${token.value}"\n`;
      });
      output += `    }\n\n`;

      output += `    object Dimensions : SDDimensions {\n`;
      dimensionTokens.forEach((token) => {
        output += `        override val ${token.path[1]}: Float get() = ${token.value}f\n`;
      });
      output += `    }\n\n`;

      output += `    object Bools : SDBools {\n`;
      boolTokens.forEach((token) => {
        output += `        override val ${token.path[1]}: Boolean get() = ${token.value}\n`;
      });
      output += `    }\n\n`;

      output += `    object Colors : SDColors {\n`;
      colorTokens.forEach((token) => {
        const prop = token.path[1];
        if (isDynamicToken(token)) {
          output +=
            `        @Composable\n` +
            `        override fun ${prop}(): Color {\n` +
            `            return if (isSystemInDarkTheme()) {\n` +
            `                Color(AndroidColor.parseColor("${token.value.dark}"))\n` +
            `            } else {\n` +
            `                Color(AndroidColor.parseColor("${token.value.light}"))\n` +
            `            }\n` +
            `        }\n`;
        } else {
          output += `        override val ${prop}: Color = Color(AndroidColor.parseColor("${token.value}"))\n`;
        }
      });
      output += `    }\n\n`;

      output += `    object Fonts : SDFonts {\n`;
      fontTokens.forEach((token) => {
        output +=
          `        override val ${token.path[1]}: TextStyle get() = TextStyle(\n` +
          `            fontFamily = FontFamily(Font(R.font.${token.value.fontName})),\n` +
          `            fontSize = ${token.value.fontSize}.sp\n` +
          `        )\n`;
      });
      output += `    }\n`;
      output += `}\n`;

      return output;
    },
  });
};
