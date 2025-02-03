const path = require("path");
const fs = require("fs");

// Generate unified theme file for both platforms
const protocolName = "SDTheme";
generateiOSSDTheme(protocolName);
generateAndroidSDTheme(protocolName);

function generateiOSSDTheme(protocolName) {
  const buildDirectory = path.join(__dirname, "build/ios");

  // Get generated theme files
  const themeFiles = fs
    .readdirSync(buildDirectory)
    .filter(
      (file) => file.endsWith("Theme.swift") && file !== `${protocolName}.swift`
    );

  // Collect the theme names
  const themeNames = themeFiles.map((file) => {
    let baseName = path.basename(file, ".swift");
    baseName = baseName.slice(0, -"Theme".length);
    return baseName;
  });

  // Build content
  let content = `import SwiftUI

  protocol ${protocolName} {
      var colors: any SDColors { get }
      var dimensions: any SDDimensions { get }
      var fonts: any SDFonts { get }
  }
  `;

  content += "protocol SDColors {\n";
  content += "    var primary: Color { get }\n";
  content += "    var dynamicPrimary: Color { get }\n";
  content += "}\n\n";

  content += "protocol SDDimensions {\n";
  content += "    var padding: CGFloat { get }\n";
  content += "}\n\n";

  content += "protocol SDFonts {\n";
  content += "    var body: Font { get }\n";
  content += "}\n\n";

  // Add the EnvironmentValues extension.
  content += "extension EnvironmentValues {\n";
  content += `    @Entry var theme: ${protocolName} = ${protocolName}s.default.sdTheme\n`;
  content += "}\n\n";

  content += `enum ${protocolName}s: CaseIterable {\n`;
  themeNames.forEach((name) => {
    const lower = name.toLowerCase();
    const safeName = lower === "default" ? `\`${lower}\`` : lower;
    content += `    case ${safeName}\n`;
  });

  // Add the computed property on the enum to return the unified theme.
  content += `\n    var sdTheme: ${protocolName} {\n`;
  content += "        switch self {\n";
  themeNames.forEach((name) => {
    const lower = name.toLowerCase();
    const safeName = lower === "default" ? `\`${lower}\`` : lower;
    content += `        case .${safeName}:\n`;
    content += `            return ${name}${protocolName}()\n`;
  });
  content += "        }\n";
  content += "    }\n";
  content += "}\n\n";

  // Add the View extension.
  content += "extension View {\n";
  content += `    func applyTheme(_ sdTheme: ${protocolName}) -> some View {\n`;
  content += "        self.environment(\\\.theme, sdTheme)\n";
  content += "    }\n";
  content += "}\n\n";

  themeFiles.forEach((file) => {
    let content = fs.readFileSync(path.join(buildDirectory, file), "utf8");

    // Remove the 'import SwiftUI' line (assumes it's at the top)
    content = content.replace(/^import SwiftUI\s*\n/, "");

    // Derive the nested struct name by removing the "Theme" suffix.
    const baseName = path.basename(file, ".swift");
    let nestedName = baseName;
    if (nestedName.endsWith("Theme")) {
      nestedName = nestedName.slice(0, -"Theme".length);
    }

    // Replace the original struct declaration with one for the nested struct.
    const regex = new RegExp(`struct\\s+${baseName}\\b`);
    content = content.replace(regex, `struct ${nestedName}`);

    content += content + "\n";
  });

  // Append the private UIColor extension at the bottom.
  content += "private extension UIColor {\n";
  content += "    convenience init(hex: String) {\n";
  content +=
    "        var hexString = hex.trimmingCharacters(in: .whitespacesAndNewlines)\n";
  content +=
    '        if hexString.hasPrefix("#") { hexString.removeFirst() }\n';
  content += "        var rgbValue: UInt64 = 0\n";
  content += "        Scanner(string: hexString).scanHexInt64(&rgbValue)\n";
  content += "        let red = CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0\n";
  content +=
    "        let green = CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0\n";
  content += "        let blue = CGFloat(rgbValue & 0x0000FF) / 255.0\n";
  content +=
    "        self.init(red: red, green: green, blue: blue, alpha: 1.0)\n";
  content += "    }\n";
  content += "}";

  const unifiedIosPath = path.join(buildDirectory, `${protocolName}.swift`);
  fs.writeFileSync(unifiedIosPath, content);
}

function generateAndroidSDTheme(protocolName) {
  const androidBuildDir = path.join(__dirname, "build/android");

  // Wait until the Android build directory exists.
  // await waitForDir(androidBuildDir);

  // Get generated theme files, excluding the unified file.
  const generatedAndroidThemeFiles = fs
    .readdirSync(androidBuildDir)
    .filter((file) => file.endsWith("Theme.kt") && file !== "Theme.kt");

  let unifiedAndroidContent = `package com.example.myapp.theme\n\nobject Theme {\n`;

  generatedAndroidThemeFiles.forEach((file) => {
    let content = fs.readFileSync(path.join(androidBuildDir, file), "utf8");

    // Remove any package declaration lines (assumes it’s at the top)
    content = content.replace(/^package\s+[^\n]+\n/, "");

    // Derive the nested object name by removing the "Theme" suffix.
    const baseName = path.basename(file, ".kt"); // e.g., "DefaultTheme"
    let nestedName = baseName;
    if (nestedName.endsWith("Theme")) {
      nestedName = nestedName.slice(0, -"Theme".length);
    }
    // Replace the original object declaration with one for the nested object.
    const regex = new RegExp(`object\\s+${baseName}\\b`);
    content = content.replace(regex, `object ${nestedName}`);

    // Indent the file content by 4 spaces so it nests inside Theme.
    const indentedContent = content
      .split("\n")
      .map((line) => "    " + line)
      .join("\n");

    unifiedAndroidContent += indentedContent + "\n";
  });

  unifiedAndroidContent += "}\n";

  const unifiedAndroidPath = path.join(androidBuildDir, "Theme.kt");
  fs.writeFileSync(unifiedAndroidPath, unifiedAndroidContent);
}
