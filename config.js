const StyleDictionary = require("style-dictionary").default;
const registerIosSwiftDynamicColorFormat = require("./ios-swift-dynamic-color-format");
const registerAndroidJetpackComposeDynamicColorFormat = require("./android-jetpack-dynamic-color-format");

registerIosSwiftDynamicColorFormat(StyleDictionary);
registerAndroidJetpackComposeDynamicColorFormat(StyleDictionary);

const config = {
  source: ["tokens/**/*.json"],
  platforms: {
    ios: {
      buildPath: "build/ios/",
      files: [
        {
          destination: "DynamicColors.swift",
          format: "ios-swift/dynamic-color",
        },
      ],
    },
    android: {
      buildPath: "build/android/",
      files: [
        {
          destination: "DynamicColors.kt",
          format: "android-jetpack/dynamic-color",
        },
      ],
    },
  },
};

const sd = new StyleDictionary(config);
sd.buildAllPlatforms();
