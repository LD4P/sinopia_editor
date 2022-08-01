// Copyright 2018 Stanford University see Apache2.txt for license

module.exports = {
  plugins: [
    'import',
    'jest',
    'jsx-a11y',
    'react',
    'react-hooks',
    'security',
    'cypress'
  ],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended',
    'plugin:security/recommended',
    'airbnb-base',
    'plugin:cypress/recommended',
    'prettier'
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    node: {
      resolvePaths: ['src', '__tests__/testUtilities'],
      tryExtensions: ['.js', '.jsx', '.json', '.node'],
    },
    'import/resolver': {
      node: {
        paths: ['src', '__tests__/testUtilities'],
        extensions: ['.js', '.jsx'],
      },
    },
    react: {
      version: '16.6',
    },
  },
  env: {
    browser: true,
    jest: true,
    node: true,
    es6: true,
  },
  rules: {
    'array-callback-return': 'off',
    'brace-style': 'off',
    'capitalized-comments': 'off',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    eqeqeq: ['error', 'smart'],
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'global-require': 'off',
    'guard-for-in': 'off',
    'id-length': 'off',
    'import/exports-last': 'off',
    'import/group-exports': 'off',
    'import/max-dependencies': 'off',
    'import/no-commonjs': 'off',
    'import/no-cycle': 'off',
    'import/no-default-export': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-internal-modules': 'off',
    'import/no-mutable-exports': 'off',
    'import/no-named-as-default': 'off',
    'import/no-namespace': 'off',
    'import/no-nodejs-modules': 'off',
    'import/no-relative-parent-imports': 'off',
    'import/no-unassigned-import': 'off',
    'import/order': 'off',
    'import/unambiguous': 'off',
    'indent': 'off', // Off for prettier
    'init-declarations': 'off',
    'jsx-a11y/anchor-is-valid': 'warn', // see #172
    'jsx-a11y/label-has-for': 'off', // see #173
    'jsx-a11y/no-onchange': 'warn', // The DropZone select form needs an onChange prop to set the state with the new group
    'jsx-a11y/no-noninteractive-tabindex': ['off', { roles: ['tooltip'] }],
    'lines-around-comment': 'off', // Off for prettier
    'max-classes-per-file': 'off',
    'max-len': 'off',
    'max-lines-per-function': 'off',
    'max-statements': 'off',
    'max-statements-per-line': 'off',
    'multiline-comment-style': 'off',
    'new-cap': 'off',
    'newline-after-var': 'off', // deprecated rule, enabled by airbnb-base/whitespace
    'newline-before-return': 'off',
    'node/no-extraneous-import': 'off', // turning off because objects to our imports
    'no-alert': 'off',
    'no-await-in-loop': 'off',
    'no-console': ['warn', { allow: ['error', 'info'] }], // we want to see errors in the console
    'no-extra-semi': 'off', // Off for prettier
    'no-inline-comments': 'off',
    'no-invalid-this': 'off',
    'no-magic-numbers': 'off',
    'no-negated-condition': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-process-env': 'off',
    'no-restricted-syntax': 'off',
    'no-return-assign': 'off',
    'no-return-await': 'off',
    'no-sequences': 'off',
    'no-shadow': 'off',
    'no-sync': 'off',
    'no-ternary': 'off',
    'no-throw-literal': 'off',
    'no-undefined': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_.*' }],
    'no-use-before-define': 'off',
    'no-useless-constructor': 'warn',
    'no-var': 'error',
    'no-warning-comments': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'prefer-const': 'error',
    'prefer-destructuring': 'off',
    'prefer-reflect': 'off',
    'quotes': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-indent': 'off', // Off for prettier
    'react/jsx-indent-props': 'off', // Off for prettier
    'require-await': 'off',
    'require-jsdoc': 'off',
    'require-unicode-regexp': 'off',
    'security/detect-object-injection': 'off',
    'semi': 'off', // Off for prettier,
    'sort-imports': 'off',
    'sort-keys': 'off',
    'valid-jsdoc': 'off',
  },
  overrides: [
    {
      // Allow tests to include block statements (idiomatic Jest style)
      files: ['__tests__/**'],
      rules: {
        'arrow-body-style': 'off',
        'max-lines': 'off',
        'max-len': 'off',
      },
      extends: ['plugin:testing-library/react']
    },
    {
      // Bootstrap styles require that navbar's use <a> instead of <btn>, so ignoring.
      // Might be able to fix this with BS4.
      files: [
        'src/components/Header.jsx',
        'src/components/home/Header.jsx'
      ],
      rules: {
        'jsx-a11y/anchor-is-valid': 'off',
      },
    },
    {
      files: [
        'react-testing-library.setup.js'
      ],
      rules: {
        'node/no-unpublished-import': 'off',
      },
    },
    {
      files: ['cypress/plugins/index.js'],
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
}
