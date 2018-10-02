module.exports = {
    extends: [ "eslint:recommended", "plugin:node/recommended", "plugin:security/recommended", "plugin:jest/recommended"],
    overrides: [
      {
        files: "**/*.js",
        env: {
          jest: true
        },
        plugins: ["jest", "security"],
        rules: {
          "no-console": "warn",
          "no-redeclare": "warn", // FIXME: want this to be error, but don't want to address in 5000 line bfe.js
          "no-undef": "warn",
          "no-unused-vars": "warn",
          "no-useless-escape": "warn"
        }
      }
  ]
};
