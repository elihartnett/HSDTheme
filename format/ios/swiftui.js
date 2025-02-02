const { isDynamicToken } = require("../helpers");

module.exports = function registerIosSwiftThemeFormat(StyleDictionary) {
  StyleDictionary.registerFormat({
    name: "ios/swiftui",
    format: function ({ dictionary }) {
      // Get all tokens
      const allTokens = dictionary.allProperties || dictionary.allTokens;

      // Filter tokens by type based on the first segment in the token path
      const colorTokens = allTokens.filter(
        (token) => token.path[0] === "color"
      );
      const fontTokens = allTokens.filter((token) => token.path[0] === "font");

      // Header for color support (includes the UIColor extension)
      const colorHeader = `import SwiftUI

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

      // Build the Color extension block
      let colorExtension = "\nextension Color {\n";
      colorTokens.forEach((token) => {
        // Assuming token.path[1] is the property name (e.g., "primary")
        if (isDynamicToken(token)) {
          colorExtension += `    static var ${token.path[1]}: Color {\n`;
          colorExtension += `        return Color(UIColor { traitCollection in\n`;
          colorExtension += `            switch traitCollection.userInterfaceStyle {\n`;
          colorExtension += `            case .dark:\n`;
          colorExtension += `                return UIColor(hex: "${token.value.dark}")\n`;
          colorExtension += `            default:\n`;
          colorExtension += `                return UIColor(hex: "${token.value.light}")\n`;
          colorExtension += `            }\n`;
          colorExtension += `        })\n`;
          colorExtension += `    }\n`;
        } else {
          colorExtension += `    static var ${token.path[1]}: Color {\n`;
          colorExtension += `        return Color(UIColor(hex: "${token.value}"))\n`;
          colorExtension += `    }\n`;
        }
      });
      colorExtension += "}\n";

      // Build the Font extension block
      let fontExtension = "\npublic extension Font {\n";
      fontTokens.forEach((token) => {
        // Assuming token.value is an object with fontName and fontSize
        fontExtension += `    static var ${token.path[1]}: Font { .custom("${token.value.fontName}", size: ${token.value.fontSize}) }\n`;
      });
      fontExtension += "}\n";

      // Combine everything into the final output
      return colorHeader + colorExtension + fontExtension;
    },
  });
};
