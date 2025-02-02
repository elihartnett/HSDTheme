const fs = require("fs");
const path = require("path");
const StyleDictionary = require("style-dictionary").default;

// 1. Read all theme files from the themes folder
const themesDir = path.join(__dirname, "themes");
const themeFiles = fs
  .readdirSync(themesDir)
  .filter((file) => file.endsWith(".json"));

// 2. Dynamically generate file entries for iOS and Android

// Helper function to convert file name to Capitalized theme name
function getCapitalizedThemeName(file) {
  const themeName = path.basename(file, ".json");
  return themeName.charAt(0).toUpperCase() + themeName.slice(1);
}

const iosFiles = themeFiles.map((file) => {
  const capitalizedThemeName = getCapitalizedThemeName(file);
  return {
    destination: `${capitalizedThemeName}Theme.swift`,
    format: "ios/swiftui",
  };
});

const androidFiles = themeFiles.map((file) => {
  const capitalizedThemeName = getCapitalizedThemeName(file);
  return {
    destination: `${capitalizedThemeName}Theme.kt`,
    format: "android/jetpack",
  };
});

// 3. Register your custom formats for both platforms
const registerSwiftUIFormat = require("./format/ios/swiftui");
registerSwiftUIFormat(StyleDictionary);

const registerJetpackThemeFormat = require("./format/android/jetpack");
registerJetpackThemeFormat(StyleDictionary);

// 4. Create your Style Dictionary configuration with the dynamic files arrays
const config = {
  source: ["themes/**/*.json"],
  platforms: {
    ios: {
      buildPath: "build/ios/",
      files: iosFiles,
    },
    android: {
      buildPath: "build/android/",
      files: androidFiles,
    },
  },
};

const sd = new StyleDictionary(config);
sd.buildAllPlatforms();
