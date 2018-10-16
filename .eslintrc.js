module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:security/recommended",
    "plugin:jest/recommended"
  ],
  overrides: [
    {
      files: "**/*.js",
      env: {
        jest: true
      },
      plugins: ["jest", "security"],
      rules: {
        "no-console": "off",
        "no-redeclare": "warn", // FIXME: want this to be error, but don't want to address in 5000 line bfe.js
        "no-undef": "warn",
        "no-unused-vars": "warn",
        "no-useless-escape": "warn"
      },
      globals: {
        // FIXME: this is a cheap way to reduce warnings, but perhaps code practices should improve for our own stuff?
        "$": true,
        "bfe": true,
        "bfeditor": true,
        "bfelog": true,
        "config": true,
        "document": true,
        "jQuery": true,
        "page": true,
        "window": true
      }
    }
  ]
};
