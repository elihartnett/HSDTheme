const path = require("path");
const fs = require("fs");
const { isDynamicToken } = require("../StyleDictionary/format/helpers");

const protocolName = "SDTheme";
const themesDirectory = path.join(__dirname, "themes");
const themeNames = fs
  .readdirSync(themesDirectory)
  .filter((file) => file.endsWith(".json"))
  .map((file) => path.basename(file, ".json"));
const defaultThemePath = path.join(themesDirectory, "default.json");
const themeData = JSON.parse(fs.readFileSync(defaultThemePath, "utf8"));
const stringTokenKeys = Object.keys(themeData.string || {});
const dimensionTokenKeys = Object.keys(themeData.dimension || {});
const boolTokenKeys = Object.keys(themeData.bool || {});
const colorTokens = themeData.color || {};
const colorTokenKeys = Object.keys(colorTokens || {});
const fontTokenKeys = Object.keys(themeData.font || {});

generateiOSSDThemer(protocolName);
generateAndroidSDThemer(protocolName);

function generateiOSSDThemer(protocolName) {
  let content = `import SwiftUI

struct ${protocolName}r {
    static var theme: ${protocolName} = ${protocolName}s.default.sdTheme
}

protocol ${protocolName} {
    var strings: any SDStrings { get }
    var dimensions: any SDDimensions { get }
    var bools: any SDBools { get }
    var colors: any SDColors { get }
    var fonts: any SDFonts { get }
}

protocol SDStrings {
${stringTokenKeys.map((prop) => `    var ${prop}: String { get }`).join("\n")}
}

protocol SDDimensions {
${dimensionTokenKeys.map((prop) => `    var ${prop}: CGFloat { get }`).join("\n")}
}

protocol SDBools {
${boolTokenKeys.map((prop) => `    var ${prop}: Bool { get }`).join("\n")}
}

protocol SDColors {
${colorTokenKeys.map((prop) => `    var ${prop}: Color { get }`).join("\n")}
}

protocol SDFonts {
${fontTokenKeys.map((prop) => `    var ${prop}: Font { get }`).join("\n")}
}

enum ${protocolName}s: CaseIterable {
${themeNames.map((name) => `    case ${name === "default" ? "`default`" : name.toLowerCase()}`).join("\n")}

    var sdTheme: ${protocolName} {
        switch self {
${themeNames.map((name) => `        case .${name === "default" ? "`default`" : name.toLowerCase()}: return ${name.charAt(0).toUpperCase() + name.slice(1)}${protocolName}()`).join("\n")}
        }
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
}
`;

  const buildDirectory = path.join(__dirname, "build/ios");
  const themeFiles = fs
    .readdirSync(buildDirectory)
    .filter(
      (file) => file.endsWith("Theme.swift") && file !== `${protocolName}.swift`
    )
    .map((file) => fs.readFileSync(path.join(buildDirectory, file), "utf8"))
    .join("\n");

  content += themeFiles;

  fs.writeFileSync(
    path.join(buildDirectory, `${protocolName}r.swift`),
    content
  );
}

function generateAndroidSDThemer(protocolName) {
  const buildDirectory = path.join(__dirname, "build/android");
  const themeFiles = fs
    .readdirSync(buildDirectory)
    .filter(
      (file) => file.endsWith("Theme.kt") && file !== `${protocolName}.kt`
    )
    .map((file) => fs.readFileSync(path.join(buildDirectory, file), "utf8"))
    .join("\n");

  let content = `package com.example.theme
import com.example.theme.R

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import android.graphics.Color as AndroidColor

object SDThemer {
    var theme: SDTheme = ${protocolName}s.DEFAULT.sdTheme()
}

interface SDTheme {
    val strings: SDStrings
    val dimensions: SDDimensions
    val bools: SDBools
    val colors: SDColors
    val fonts: SDFonts
}
  
interface SDStrings {
${stringTokenKeys.map((token) => `    val ${token}: String`).join("\n")}
}
  
interface SDDimensions {
${dimensionTokenKeys.map((token) => `    val ${token}: Float`).join("\n")}
}
  
interface SDBools {
${boolTokenKeys.map((token) => `    val ${token}: Boolean`).join("\n")}
}
  
interface SDColors {
${Object.keys(colorTokens)
  .map((token) => {
    return isDynamicToken(colorTokens[token])
      ? `    @Composable\n    fun ${token}(): Color`
      : `    val ${token}: Color`;
  })
  .join("\n")}
}
  
interface SDFonts {
${fontTokenKeys.map((token) => `      val ${token}: TextStyle`).join("\n")}
}

enum class ${protocolName}s {
${themeNames.map((name) => `    ${name === "default" ? "DEFAULT" : name.toUpperCase()}`).join(",\n")};

    fun sdTheme(): ${protocolName} {
        return when (this) {
${themeNames.map((name) => `            ${name === "default" ? "DEFAULT" : name.toUpperCase()} -> ${name.charAt(0).toUpperCase() + name.slice(1)}${protocolName}`).join("\n")}
        }
    }
}
`;

  content += themeFiles;
  fs.writeFileSync(path.join(buildDirectory, `${protocolName}r.kt`), content);
}
