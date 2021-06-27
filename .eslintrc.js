module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'max-len': ['error', { code: 80 }],
    'newline-after-var': ['error', 'always'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
  ignorePatterns: ['generator/templates'],
};
