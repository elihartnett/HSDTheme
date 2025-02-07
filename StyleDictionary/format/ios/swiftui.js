const { isDynamicToken } = require("../helpers");

module.exports = function registerSwiftUIFormat(styleDictionary, name) {
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
      const colorTokens = allTokens.filter(
        (token) => token.path[0] === "color"
      );
      const fontTokens = allTokens.filter((token) => token.path[0] === "font");

      let output = `
struct ${themeName}: SDTheme {

    var strings: any SDStrings = Strings()
    var dimensions: any SDDimensions = Dimensions()
    var colors: any SDColors = Colors()
    var fonts: any SDFonts = Fonts()
`;
      if (stringTokens.length > 0) {
        output += `
    struct Strings: SDStrings {
`;
        stringTokens.forEach((token) => {
          output += `        var ${token.path[1]}: String { return "${token.value}" }
`;
        });
        output += `    }
`;
      }

      output += `
    struct Dimensions: SDDimensions {
`;
      dimensionTokens.forEach((token) => {
        output += `        var ${token.path[1]}: CGFloat { ${token.value} }
`;
      });
      output += `    }

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
        }
`;
        } else {
          output += `        var ${prop}: Color { return Color(UIColor(hex: "${token.value}")) }
`;
        }
      });
      output += `    }

    struct Fonts: SDFonts {
`;
      fontTokens.forEach((token) => {
        output += `        var ${token.path[1]}: Font { .custom("${token.value.fontName}", size: ${token.value.fontSize}) }
`;
      });
      output += `    }
}`;
      return output;
    },
  });
};
