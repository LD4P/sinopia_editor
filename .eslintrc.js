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
        "paths": ['src'],
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
    "array-callback-return": "off",
    "brace-style": "off",
    'capitalized-comments': "off",
    "class-methods-use-this": "off",
    "consistent-return": "off",
    "eqeqeq": ["error", "smart"],
    "func-style": ["error", "declaration", { "allowArrowFunctions": true }],
    "global-require": "off",
    "guard-for-in": "off",
    "id-length": "off",
    "import/exports-last": "off",
    "import/group-exports": "off",
    "import/max-dependencies": "off",
    "import/no-commonjs": "off",
    "import/no-cycle": "off",
    "import/no-default-export": "off",
    "import/no-dynamic-require": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-internal-modules": "off",
    "import/no-mutable-exports": "off",
    "import/no-named-as-default": "off",
    "import/no-namespace": "off",
    "import/no-nodejs-modules": "off",
    "import/no-relative-parent-imports": "off",
    "import/no-unassigned-import": "off",
    "import/order": "off",
    "import/unambiguous": "off",
    "indent": ["error", 2, {
      "SwitchCase": 1,
      "ignoredNodes": [
        // Let react/jsx-indent-props govern JSX prop indentation
        "JSXAttribute"
      ]
    }],
    "init-declarations": "off",
    "jsx-a11y/anchor-is-valid": "warn", // see #172
    "jsx-a11y/label-has-for": "off", // see #173
    "jsx-a11y/no-onchange": "warn", // The DropZone select form needs an onChange prop to set the state with the new group
    'jsx-a11y/no-noninteractive-tabindex': ['off', { roles: ['tooltip'] }],
    'lines-around-comment': ['error', { 'allowBlockStart': true }],
    "max-classes-per-file": "off",
    "max-len": ["error", { "code": 164, "ignoreComments": true }],
    "max-lines-per-function": "off",
    "max-statements": "off",
    "max-statements-per-line": "off",
    'multiline-comment-style': "off",
    "new-cap": "off",
    'newline-after-var': 'off', // deprecated rule, enabled by airbnb-base/whitespace
    "newline-before-return": "off",
    "no-alert": "off",
    "no-await-in-loop": "off",
    "no-console": ["warn", { allow: ["error", "info"] }], // we want to see errors in the console
    "no-extra-semi": "error",
    "no-inline-comments": "off",
    "no-invalid-this": "off",
    "no-magic-numbers": "off",
    "no-negated-condition": "off",
    "no-nested-ternary": "off",
    "no-param-reassign": "off",
    "no-plusplus": "off",
    "no-process-env": "off",
    "no-restricted-syntax": "off",
    "no-return-assign": "off",
    "no-return-await": "off",
    "no-sequences": "off",
    "no-shadow": "off",
    "no-sync": "off",
    "no-ternary": "off",
    "no-throw-literal": "off",
    "no-undefined": "off",
    "no-underscore-dangle": "off",
    "no-unused-expressions": "off",
    "no-use-before-define": "off",
    "no-useless-constructor": "warn",
    "no-var": "error",
    "no-warning-comments": "off",
    "node/no-unsupported-features/es-syntax": "off",
    "prefer-const": "error",
    "prefer-destructuring": "off",
    "prefer-reflect": "off",
    "quotes": ["error", "single"],
    "react/jsx-indent": ["error", 2],
    "react/jsx-indent-props": ["error", "first"],
    "require-await": "off",
    "require-jsdoc": "off",
    "require-unicode-regexp": "off",
    "security/detect-object-injection": "off",
    "semi": ["error", "never"],
    "sort-imports": "off",
    "sort-keys": "off",
    "valid-jsdoc": "off"
  },
  overrides: [
    {
      // Allow tests to include block statements (idiomatic Jest style)
      "files": ["__tests__/**"],
      "rules": {
        "arrow-body-style": "off",
        "max-lines": "off",
        "max-len": "off"
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
      // There is a known issue with exporting async default functions
      // Link: https://github.com/babel/babel/issues/6262
      "files": ["__tests__/integration/previewRDFHelper.js"],
      "rules": {
        "import/prefer-default-export": "off"
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
    },
    {
      // Allow a continue guard clause here as an if will increase the depth
      "files": ["src/GraphBuilder.js"],
      "rules": {
        "no-continue": "off"
      }
    },
    {
      "files": ["src/components/editor/property/ResourceProperty.jsx"],
      "rules": {
        "max-len": "off"
      }
    },
  ]
}
