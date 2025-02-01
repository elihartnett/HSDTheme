const StyleDictionary = require("style-dictionary").default;

// Register color formats (already provided)
const registerIosSwiftColorFormat = require("./ios-swiftui-color-format");
registerIosSwiftColorFormat(StyleDictionary);

const registerIosSwiftFontFormat = require("./ios-swiftui-font-format");
registerIosSwiftFontFormat(StyleDictionary);

const registerAndroidJetpackComposeColorFormat = require("./android-jetpack-color-format");
registerAndroidJetpackComposeColorFormat(StyleDictionary);

const registerAndroidJetpackComposeFontFormat = require("./android-jetpack-font-format");
registerAndroidJetpackComposeFontFormat(StyleDictionary);

const config = {
  source: ["tokens/**/*.json"],
  platforms: {
    ios: {
      buildPath: "build/ios/",
      files: [
        {
          destination: "Color.swift",
          format: "ios-swiftui/color",
          filter: (token) => token.path[0] === "color",
        },
        {
          destination: "Font.swift",
          format: "ios-swiftui/font",
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
        {
          destination: "Font.kt",
          format: "android-jetpack/font",
          filter: (token) => token.path[0] === "font",
        },
      ],
    },
  },
};

const sd = new StyleDictionary(config);
sd.buildAllPlatforms();
