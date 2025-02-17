const fs = require("fs");
const { mergeThemes } = require("./mergeThemes.js");
const path = require("path");
const { resetDirectory, getCapitalizedFileName } = require("./helpers");
const StyleDictionary = require("style-dictionary").default;

// Set up directories
const buildDirectory = path.join(__dirname, "build");
const themesDirectory = path.join(__dirname, "themes");
const mergedThemesDirectory = path.join(themesDirectory, "merged");
resetDirectory(buildDirectory);
resetDirectory(mergedThemesDirectory);

// Merge themes
mergeThemes(themesDirectory, mergedThemesDirectory);

// Register formats
const registerSwiftUIFormat = require("./format/ios/swiftui");
registerSwiftUIFormat(StyleDictionary, "ios/swiftui");

const registerComposeFormat = require("./format/android/compose");
registerComposeFormat(StyleDictionary, "android/compose");

// Create Style Dictionary configurations and build
const mergedThemeFiles = fs
  .readdirSync(mergedThemesDirectory)
  .filter((file) => file.endsWith(".json"));
mergedThemeFiles.forEach((file) => {
  const capitalizedThemeName = getCapitalizedFileName(file);

  const config = {
    source: [path.join(mergedThemesDirectory, file)],
    platforms: {
      ios: {
        buildPath: "build/ios/",
        files: [
          {
            destination: `${capitalizedThemeName}.swift`,
            format: "ios/swiftui",
            options: { themeName: `${capitalizedThemeName}` },
          },
        ],
      },
      android: {
        buildPath: "build/android/",
        files: [
          {
            destination: `${capitalizedThemeName}.kt`,
            format: "android/compose",
            options: { themeName: `${capitalizedThemeName}` },
          },
        ],
      },
    },
  };

  const sd = new StyleDictionary(config);
  sd.buildAllPlatforms();
});
