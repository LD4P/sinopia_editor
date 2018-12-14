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
    "jsx-a11y/anchor-is-valid": "warn", // see #172
    "jsx-a11y/label-has-for": "warn", // see #173
    "no-console": ["warn", { allow: ["info", "log"] }], //for development purposes
    "no-extra-semi": "off", // because it isn't that important
    "react/prop-types": "warn" // see #175
  },
  overrides: [
    {
      "files": ["**/*.jsx", "src/index.js", "src/*/*.js", "src/store.js"],
      "rules": {
        // See https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-unsupported-features/es-syntax.md
        //   rule supposedly matches ECMA version with node
        //   we get: "Import and export declarations are not supported yet"
        "node/no-unsupported-features/es-syntax": "off"
      }
    }
  ]
}
