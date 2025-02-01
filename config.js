const StyleDictionary = require("style-dictionary").default;

// Register color formats (already provided)
const registerIosSwiftColorFormat = require("./ios-swift-color-format");
const registerAndroidJetpackComposeColorFormat = require("./android-jetpack-color-format");

registerIosSwiftColorFormat(StyleDictionary);
registerAndroidJetpackComposeColorFormat(StyleDictionary);

const registerIosSwiftFontFormat = require("./ios-swift-font-format");
registerIosSwiftFontFormat(StyleDictionary);

const config = {
  source: ["tokens/**/*.json"],
  platforms: {
    ios: {
      buildPath: "build/ios/",
      files: [
        {
          destination: "Color.swift",
          format: "ios-swift/color",
          filter: (token) => token.path[0] === "color",
        },
        {
          destination: "Font.swift",
          format: "ios-swift/font",
          filter: (token) => token.path[0] === "font",
        },
      ],
    },
    android: {
      buildPath: "build/android/",
      files: [
        {
          destination: "Color.kt",
          format: "android-jetpack/color",
          filter: (token) => token.path[0] === "color",
        },
      ],
    },
  },
};

const sd = new StyleDictionary(config);
sd.buildAllPlatforms();
