const { existsSync } = require('fs')
const { join } = require('path')

const e = (k, v, f = join(k, v)) => existsSync(f) && f

const init = (
  tsconfigRootDir = __dirname,
  project = e(tsconfigRootDir, 'tsconfig.eslint.json') ||
    e(tsconfigRootDir, 'tsconfig.json') ||
    {}
) => ({
  extends: ['airbnb-typescript-prettier'],
  ignorePatterns: ['.eslintrc.js', 'dist'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    project,
    sourceType: 'module'
  },
  plugins: [
    'import',
    'sort-keys-fix',
    'typescript-sort-keys',
    'sort-destructure-keys'
  ],
  root: true,
  rules: {
    'import/prefer-default-export': 0,
    'no-console': 0,
    'no-empty': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-return-assign': 0,
    'no-shadow': 1,
    'no-sparse-arrays': 0,
    'padding-line-between-statements': [
      1,
      {
        blankLine: 'always',
        next: [
          'block-like',
          'block',
          'break',
          'class',
          'continue',
          'debugger',
          'if',
          'multiline-const',
          'multiline-let',
          'return'
        ],
        prev: '*'
      },
      {
        blankLine: 'always',
        next: '*',
        prev: [
          'case',
          'default',
          'multiline-block-like',
          'multiline-const',
          'multiline-let'
        ]
      },
      {
        blankLine: 'never',
        next: ['block', 'block-like'],
        prev: ['case', 'default']
      },
      {
        blankLine: 'always',
        next: ['empty'],
        prev: 'export'
      },
      {
        blankLine: 'never',
        next: 'iife',
        prev: ['block', 'block-like', 'empty']
      }
    ],
    'prettier/prettier': [1, require('./.prettierrc')],
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-keys-fix/sort-keys-fix': 2
  }
})

module.exports = new Proxy(init(__dirname), {
  get(o, k) {
    if (k === 'init') {
      return init
    }

    return o[k]
  }
})
