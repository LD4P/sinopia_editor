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
    "node": true,
    "es6": true
  },
  rules: {
    "jsx-a11y/anchor-is-valid": "warn", // see #172
    "jsx-a11y/label-has-for": "warn", // see #173
    "jsx-a11y/no-onchange": "warn", // The DropZone select form needs an onChange prop to set the state with the new group
    "no-console": ["warn", { allow: ["error", "info"] }], // we want to see errors in the console
    "no-extra-semi": 2, // 0 = off, 1 = warn, 2 = error
    "security/detect-object-injection": "off"
  },
  overrides: [
    {
      // Allow all JS and JSX files to use new-style imports and exports
      "files": ["**/*.jsx", "**/*.js"],
      "rules": {
        // See https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-unsupported-features/es-syntax.md
        //   rule supposedly matches ECMA version with node
        //   we get: "Import and export declarations are not supported yet"
        "node/no-unsupported-features/es-syntax": "off"
      }
    },
    {
      // Allow integration tests to use `page` global variable defined by puppeteer
      "files": ["__tests__/integration/**"],
      "rules": {
        "no-undef": "off"
      }
    },
    {
      // Allow ImportFileZone test to require `isomorphic-fetch`
      "files": ["__tests__/components/editor/ImportFileZone.test.js"],
      "rules": {
        "node/no-extraneous-require": "warn"
      }
    },
    {
      // Allow unicode whitespace in OutlineHeader test (bc apparently actually used in OutlineHeader component)
      "files": ["__tests__/components/editor/OutlineHeader.test.js"],
      "rules": {
        "no-irregular-whitespace": "off"
      }
    },
    {
      // Allow react-router-dom mock to do things counter to React's linter preferences
      "files": ["__mocks__/react-router-dom.js"],
      "rules": {
        "react/display-name": "warn",
        "react/prop-types": "warn"
      }
    }
  ]
}
