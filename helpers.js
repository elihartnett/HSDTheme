function camelCase(path) {
  return path
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
}

function isDynamicToken(token) {
  return (
    token.value &&
    typeof token.value === "object" &&
    token.value.light &&
    token.value.dark
  );
}

module.exports = {
  camelCase,
  isDynamicToken,
};
