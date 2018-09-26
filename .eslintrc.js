const ERROR = 2;
const WARN = 1;

module.exports = {
    extends: [ "eslint:recommended", "plugin:node/recommended", "plugin:security/recommended"],
    overrides: [
      {
        files: "**/*.js",
        env: {
          jest: true
        },
        plugins: [
          "jest", "security"
        ],
        rules: {
          "jest/no-disabled-tests": "warn",
          "jest/no-focused-tests": "error",
          "jest/no-identical-title": "error",
          "jest/prefer-to-have-length": "warn",
          "jest/valid-expect": "error",
          "node/exports-style": ["error", "module.exports"],
          "node/prefer-global/buffer": ["error", "always"],
          "node/prefer-global/console": ["error", "always"],
          "node/prefer-global/process": ["error", "always"],
          "node/prefer-global/url-search-params": ["error", "always"],
          "node/prefer-global/url": ["error", "always"],
        }
      }
  ]
};
