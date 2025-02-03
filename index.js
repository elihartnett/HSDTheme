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

mergeThemes(themesDirectory, mergedThemesDirectory);

// Register formats
const registerSwiftUIFormat = require("./format/ios/swiftui");
registerSwiftUIFormat(StyleDictionary, "ios/swiftui");

// Create Style Dictionary configurations
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
    },
  };

  const sd = new StyleDictionary(config);
  sd.buildAllPlatforms();
});
