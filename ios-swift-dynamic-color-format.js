const { camelCase, isDynamicToken } = require("./helpers");

module.exports = function registerIosSwiftDynamicColorFormat(StyleDictionary) {
  StyleDictionary.registerFormat({
    name: "ios-swift/dynamic-color",
    format: function ({ dictionary }) {
      const tokens = dictionary.allProperties || dictionary.allTokens;

      const header = `import SwiftUI

extension UIColor {
    convenience init(hex: String) {
        var hexString = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if hexString.hasPrefix("#") {
            hexString.removeFirst()
        }
        var rgbValue: UInt64 = 0
        Scanner(string: hexString).scanHexInt64(&rgbValue)
        let red = CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0
        let green = CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0
        let blue = CGFloat(rgbValue & 0x0000FF) / 255.0
        self.init(red: red, green: green, blue: blue, alpha: 1.0)
    }
}
`;

      const properties = tokens
        .map((token) => {
          if (isDynamicToken(token)) {
            return `    static var ${camelCase(token.path)}: Color {
        return Color(UIColor { traitCollection in
            switch traitCollection.userInterfaceStyle {
            case .dark:
                return UIColor(hex: "${token.value.dark}")
            default:
                return UIColor(hex: "${token.value.light}")
            }
        })
    }`;
          }
          return `    static var ${camelCase(token.path)}: Color {
        return Color(UIColor(hex: "${token.value}"))
    }`;
        })
        .join("\n");

      const extensionBlock = `
extension Color {
${properties}
}
`;
      return header + extensionBlock;
    },
  });
};
