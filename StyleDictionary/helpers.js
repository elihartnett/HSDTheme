const fs = require("fs");
const path = require("path");

function getCapitalizedFileName(file) {
  const themeName = path.basename(file, ".json");
  return themeName.charAt(0).toUpperCase() + themeName.slice(1) + "SDTheme";
}

function resetDirectory(directory) {
  if (fs.existsSync(directory)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
  fs.mkdirSync(directory, { recursive: true });
}

module.exports = {
  resetDirectory,
  getCapitalizedFileName,
};
