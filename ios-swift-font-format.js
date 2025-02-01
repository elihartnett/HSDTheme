module.exports = function (StyleDictionary) {
  StyleDictionary.registerFormat({
    name: "ios-swift/font",
    format: function ({ dictionary }) {
      let output = "";
      output += "import SwiftUI\n\n";
      output += "public extension Font {\n";
      dictionary.allTokens.forEach((token) => {
        const propertyName = token.path[1];
        output += `  static var ${propertyName}: Font { .custom("${token.value.fontName}", size: ${token.value.fontSize}) }\n`;
      });
      output += "}\n";
      return output;
    },
  });
};
