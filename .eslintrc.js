module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'airbnb-base', // Добавили конфигурацию Airbnb
  ],
  overrides: [
    {
      env: { node: true },
      files: ['eslint.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    'prettier/prettier': ['warn', { endOfLine: 'auto' }],
  },
};
