const path = require("path");
const fs = require("fs");

const protocolName = "SDTheme";
generateiOSSDTheme(protocolName);

function generateiOSSDTheme(protocolName) {
  const themesDirectory = path.join(__dirname, "themes");
  // Get all theme names
  const themeNames = fs
    .readdirSync(themesDirectory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.basename(file, ".json"));

  // Get all theme properites
  const defaultThemePath = path.join(themesDirectory, "default.json");
  const themeData = JSON.parse(fs.readFileSync(defaultThemePath, "utf8"));
  const colorProperties = Object.keys(themeData.color || {});
  const dimensionProperties = Object.keys(themeData.dimension || {});
  const fontProperties = Object.keys(themeData.font || {});

  // Generate content
  let content = `import SwiftUI

protocol ${protocolName} {
    var colors: any SDColors { get }
    var dimensions: any SDDimensions { get }
    var fonts: any SDFonts { get }
}

protocol SDColors {
${colorProperties.map((prop) => `    var ${prop}: Color { get }`).join("\n")}
}

protocol SDDimensions {
${dimensionProperties.map((prop) => `    var ${prop}: CGFloat { get }`).join("\n")}
}

protocol SDFonts {
${fontProperties.map((prop) => `    var ${prop}: Font { get }`).join("\n")}
}

extension EnvironmentValues {
    @Entry var theme: ${protocolName} = ${protocolName}s.default.sdTheme
}

enum ${protocolName}s: CaseIterable {
${themeNames.map((name) => `    case ${name === "default" ? "`default`" : name.toLowerCase()}`).join("\n")}

    var sdTheme: ${protocolName} {
        switch self {
${themeNames.map((name) => `        case .${name === "default" ? "`default`" : name.toLowerCase()}: return ${name.charAt(0).toUpperCase() + name.slice(1)}${protocolName}()`).join("\n")}
        }
    }
}

extension View {
    func applyTheme(_ sdTheme: ${protocolName}) -> some View {
        self.environment(\\\.theme, sdTheme)
    }
}

private extension UIColor {
    convenience init(hex: String) {
        var hexString = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if hexString.hasPrefix("#") { hexString.removeFirst() }
        var rgbValue: UInt64 = 0
        Scanner(string: hexString).scanHexInt64(&rgbValue)
        self.init(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: 1.0
        )
    }
}`;

  // Copy themes into SDTheme
  const buildDirectory = path.join(__dirname, "build/ios");
  const themeFiles = fs
    .readdirSync(buildDirectory)
    .filter(
      (file) => file.endsWith("Theme.swift") && file !== `${protocolName}.swift`
    )
    .map((file) => fs.readFileSync(path.join(buildDirectory, file), "utf8"))
    .join("\n\n");
  content += themeFiles;

  // Write output to file
  fs.writeFileSync(path.join(buildDirectory, `${protocolName}.swift`), content);
}
