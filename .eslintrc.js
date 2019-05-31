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
    "plugin:security/recommended",
    "airbnb-base/whitespace"
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
    "node/no-unsupported-features/es-syntax": "off",
    "jsx-a11y/anchor-is-valid": "warn", // see #172
    "jsx-a11y/label-has-for": "warn", // see #173
    "jsx-a11y/no-onchange": "warn", // The DropZone select form needs an onChange prop to set the state with the new group
    "no-console": ["warn", { allow: ["error", "info"] }], // we want to see errors in the console
    "no-extra-semi": "error",
    "semi": ["error", "never"],
    "quotes": ["error", "single"],
    "security/detect-object-injection": "off",
    "prefer-const": "error",
    "no-var": "error",
    "indent": ["error", 2, {
      "SwitchCase": 1,
      "ignoredNodes": [
        // Let react/jsx-indent-props govern JSX prop indentation
        "JSXAttribute"
      ]
    }],
    "react/jsx-indent": ["error", 2],
    "react/jsx-indent-props": ["error", "first"],
    // Added the following, which started failing when airbnb-base/whitespace was added
    // We may wish to gradually enable these. At the moment, there are >2K warnings.
    "sort-keys": "off",
    "eqeqeq": "off",
    "id-length": "off",
    "no-magic-numbers": "off",
    "new-cap": "off",
    "camelcase": "off",
    "no-sync": "off",
    "global-require": "off",
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "func-style": "off",
    "import/no-commonjs": "off",
    "import/group-exports": "off",
    "no-use-before-define": "off",
    "import/no-dynamic-require": "off",
    "import/no-nodejs-modules": "off",
    "import/unambiguous": "off",
    "init-declarations": "off",
    "no-underscore-dangle": "off",
    "import/no-default-export": "off",
    "no-process-env": "off",
    "import/no-mutable-exports": "off",
    "import/no-internal-modules": "off",
    "array-callback-return": "off",
    "consistent-return": "off",
    "import/exports-last": "off",
    "import/max-dependencies": "off",
    "no-return-await": "off",
    "max-len": "off",
    "no-return-assign": "off",
    "no-param-reassign": "off",
    "sort-imports": "off",
    "no-restricted-syntax": "off",
    "no-plusplus": "off",
    "prefer-destructuring": "off",
    "no-sequences": "off",
    "no-unused-expressions": "off",
    "no-shadow": "off",
    "no-ternary": "off",
    "no-invalid-this": "off",
    "no-warning-comments": "off",
    "max-statements": "off",
    "no-undefined": "off",
    "import/no-relative-parent-imports": "off",
    "no-useless-constructor": "off",
    "max-lines-per-function": "off",
    "import/no-extraneous-dependencies": "off",
    "class-methods-use-this": "off",
    "no-negated-condition": "off",
    "import/no-unassigned-import": "off",
    "require-await": "off",
    "import/no-named-as-default": "off",
    "max-statements-per-line": "off",
    "import/no-cycle": "off",
    "no-inline-comments": "off",
    "max-classes-per-file": "off",
    "newline-before-return": "off",
    "brace-style": "off",
    "prefer-reflect": "off",
    "guard-for-in": "off",
    "no-await-in-loop": "off",
    "no-alert": "off",
    "require-unicode-regexp": "off",
    "import/order": "off",
    "no-throw-literal": "off",
    "import/no-namespace": "off",
    "no-nested-ternary": "off"
  },
  overrides: [
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
