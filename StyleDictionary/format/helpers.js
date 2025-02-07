function isDynamicToken(token) {
  return (
    token.value &&
    typeof token.value === "object" &&
    token.value.light &&
    token.value.dark
  );
}

module.exports = {
  isDynamicToken,
};
