'use strict';
const path = require('path');

const OFF = 0;
const ERROR = 2;

module.exports = {
  'parser': 'babel-eslint',
  plugins: [
    'react', 'node'
  ],
  "env": {
    "es6": true,
    "node": true,
    "browser": true,
    "mocha": true
  },
  parserOptions: {
    'ecmaVersion': 8,
    'sourceType': 'module',
    "allowImportExportEverywhere": false,
    "codeFrame": false,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "experimentalDecorators": true,
      "jsx": true
    }
  },
  extends: [
    'eslint:recommended', 'plugin:react/recommended', 'plugin:node/recommended'
  ],
  rules: {
    "strict": 0,
    'semi': [
      ERROR, 'never'
    ],
    'accessor-pairs': OFF,
    'comma-dangle': [
      ERROR, 'always-multiline'
    ],
    'consistent-return': OFF,
    'dot-location': [
      ERROR, 'property'
    ],
    'dot-notation': ERROR,
    'eol-last': ERROR,
    'eqeqeq': [
      ERROR, 'allow-null'
    ],
    'indent': OFF,
    'jsx-quotes': [
      ERROR, 'prefer-single'
    ],
    'keyword-spacing': [
      ERROR, {
        after: true,
        before: true
      }
    ],
    'no-bitwise': OFF,
    'no-inner-declarations': [
      ERROR, 'functions'
    ],
    'no-multi-spaces': ERROR,
    'no-restricted-syntax': [
      ERROR, 'WithStatement'
    ],
    'no-shadow': ERROR,
    'no-console': 0,
    'no-unused-vars': [
      OFF, {
        args: 'none',
        varsIgnorePattern: 'log'
      }
    ],
    'no-useless-concat': OFF,
    'quotes': [
      ERROR,
      'single', {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    'space-before-blocks': ERROR,
    'space-before-function-paren': OFF,
    'react/jsx-boolean-value': [
      ERROR, 'always'
    ],
    'react/jsx-no-undef': ERROR,
    'react/jsx-sort-prop-types': OFF,
    'react/jsx-tag-spacing': ERROR,
    'react/jsx-uses-react': ERROR,
    'react/no-is-mounted': OFF,
    'react/react-in-jsx-scope': ERROR,
    'react/self-closing-comp': ERROR,
    'react/jsx-wrap-multilines': [
      ERROR, {
        declaration: false,
        assignment: false
      }
    ],
    'node/no-unpublished-require': OFF,
    'node/no-extraneous-require': OFF,
    'node/no-unsupported-features': OFF,
    'no-unused-expressions': OFF,
    'object-curly-spacing': [ERROR, 'always']
  },
  settings: {
    'import/resolver': 'babel-plugin-root-import'
  },
  globals: {
    expectDev: true,
    window: true,
    document: true,
    import: true,
    __DEV__: true,
    createLogger: true,
  }
};
