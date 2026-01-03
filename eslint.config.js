// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*', 'jest.setup.ts'],
    languageOptions: {
      globals: {
        jest: 'readonly',
      },
    },
  },
]);
