// Copyright 2018 Stanford University see Apache2.txt for license
module.exports = {
  plugins: [
    "import",
    "jest",
    "jsx-a11y",
    "react",
    "security"
  ],
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:jsx-a11y/recommended",
    "plugin:security/recommended"
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2019,
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
    "browser": true,
    "jest": true,
    "node": true
  },
  rules: {
    "jsx-a11y/anchor-is-valid": "warn",
    "jsx-a11y/label-has-for": "warn",
    "no-console": "warn",
    "no-extra-semi": "warn",
    "no-unused-vars": "warn",
    "react/jsx-no-target-blank": "warn",
    "react/no-unescaped-entities": "warn",
    "react/prop-types": "warn"
  },
  overrides: [
    {
      "files": ["**/*.jsx", "src/index.js"],
      "rules": {
        "node/no-unsupported-features/es-syntax": "off" // FIXME: getting these "Import and export declarations are not supported yet"
      }
    }
  ]
}
