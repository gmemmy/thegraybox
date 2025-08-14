// https://docs.expo.dev/guides/using-eslint/
const {defineConfig} = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const unusedImports = require('eslint-plugin-unused-imports');

const base = [
  expoConfig,
  {
    ignores: ['dist/*'],
  },
];

const prettierAsArray = Array.isArray(prettierConfig) ? prettierConfig : [prettierConfig];

const bestPractices = {
  plugins: {
    import: importPlugin,
    'unused-imports': unusedImports,
  },
  rules: {
    'no-console': ['warn', {allow: ['warn', 'error']}],
    eqeqeq: ['error', 'always'],
    'no-param-reassign': ['error', {props: true}],
    'prefer-const': 'error',
    'no-var': 'error',
    curly: ['error', 'all'],

    'import/no-duplicates': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: {order: 'asc', caseInsensitive: true},
      },
    ],
    'sort-imports': [
      'warn',
      {
        ignoreDeclarationSort: true,
        ignoreCase: true,
      },
    ],

    // Unused imports/vars
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};

module.exports = defineConfig([...base, bestPractices, ...prettierAsArray]);
