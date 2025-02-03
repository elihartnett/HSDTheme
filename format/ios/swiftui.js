const { isDynamicToken } = require("../helpers");

module.exports = function registerSwiftUIFormat(styleDictionary, name) {
  styleDictionary.registerFormat({
    name: name,
    format: function ({ dictionary, options }) {
      const themeName = options.themeName;
      const allTokens = dictionary.allProperties || dictionary.allTokens;

      const colorTokens = allTokens.filter(
        (token) => token.path[0] === "color"
      );
      const dimensionTokens = allTokens.filter(
        (token) => token.path[0] === "dimension"
      );
      const fontTokens = allTokens.filter((token) => token.path[0] === "font");

      let output = `
struct ${themeName}: SDTheme {

    var colors: any SDColors = Colors()
    var dimensions: any SDDimensions = Dimensions()
    var fonts: any SDFonts = Fonts()

    struct Colors: SDColors {
`;

      colorTokens.forEach((token) => {
        const prop = token.path[1];
        if (isDynamicToken(token)) {
          output += `        var ${prop}: Color {
            return Color(UIColor { traitCollection in
                switch traitCollection.userInterfaceStyle {
                case .dark:
                    return UIColor(hex: "${token.value.dark}")
                default:
                    return UIColor(hex: "${token.value.light}")
                }
            })
        }\n`;
        } else {
          output += `        var ${prop}: Color { return Color(UIColor(hex: "${token.value}")) }\n`;
        }
      });

      output += `    }

    struct Dimensions: SDDimensions {
`;

      dimensionTokens.forEach((token) => {
        output += `        var ${token.path[1]}: CGFloat { ${token.value} }\n`;
      });

      output += `    }

    struct Fonts: SDFonts {
`;

      fontTokens.forEach((token) => {
        output += `        var ${token.path[1]}: Font { .custom("${token.value.fontName}", size: ${token.value.fontSize}) }\n`;
      });

      output += `    }
}`;

      return output;
    },
  });
};
