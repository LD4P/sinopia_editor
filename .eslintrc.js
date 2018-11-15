// Copyright 2018 Stanford University see Apache2.txt for license
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:jsx-a11y/recommended"
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
    }
  },
  env: {
    "es6": true,
    "browser": true,
    "node": true
  },
  plugins: ["react", "import", "jsx-a11y"],

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
        "no-useless-escape": "warn",
        "node/no-unsupported-features/es-syntax": "warn" // FIXME: want this to be error
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
