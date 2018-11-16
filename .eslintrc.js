// Copyright 2018 Stanford University see Apache2.txt for license
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:jsx-a11y/recommended",
    "plugin:security/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {
        "jsx": true
    }
  },
  settings: {
    "import/resolver": {
      "node": {
        "extensions": ['.js','.jsx']
      }
    },
    "react": {
      "version": "16.6"
    }
  },
  env: {
    "es6": true,
    "browser": true,
    "node": true
  },
  plugins: ["import", "jsx-a11y", "security"],

  overrides: [
    {
      files: "**/*.js",
      env: {
        jest: true
      },
      plugins: ["jest", "security"],
      rules: {
        "no-console": "off",
        "node/no-unsupported-features/es-syntax": "warn" // FIXME: want this to be error
      }
    }
  ]
};
