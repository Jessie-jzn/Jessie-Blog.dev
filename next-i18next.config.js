const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "zh",
    locales: ["en", "zh"],
  },
  defaultNS: "common",
  localePath: path.resolve("./public/locales"),
  react: { useSuspense: false },
};
