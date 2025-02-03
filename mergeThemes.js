const fs = require("fs");
const path = require("path");
const merge = require("lodash.merge");

function mergeThemes(themesDirectory, mergedThemesDirectory) {
  // Load the default theme
  const defaultThemePath = path.join(themesDirectory, "default.json");
  if (!fs.existsSync(defaultThemePath)) {
    throw new Error(
      `Default theme file is required but was not found at: ${defaultThemePath}`
    );
  }
  const defaultTheme = JSON.parse(fs.readFileSync(defaultThemePath, "utf8"));

  // Merge each theme with the default theme
  const themeFiles = fs
    .readdirSync(themesDirectory)
    .filter((file) => file.endsWith(".json"));
  themeFiles.forEach((file) => {
    const themePath = path.join(themesDirectory, file);
    const themeData = JSON.parse(fs.readFileSync(themePath, "utf8"));

    const mergedTheme =
      file === "default.json" ? themeData : merge({}, defaultTheme, themeData);

    const mergedPath = path.join(mergedThemesDirectory, file);
    fs.writeFileSync(mergedPath, JSON.stringify(mergedTheme, null, 2));
  });
}

module.exports = {
  mergeThemes,
};
