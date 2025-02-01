const StyleDictionary = require("style-dictionary").default;
const registerIosSwiftDynamicColorFormat = require("./ios-swift-dynamic-color-format");

registerIosSwiftDynamicColorFormat(StyleDictionary);

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
  },
};

const sd = new StyleDictionary(config);
sd.buildAllPlatforms();
