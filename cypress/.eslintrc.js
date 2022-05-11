module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  rules: {
    'jest/expect-expect': 'off',
    'testing-library/await-async-query': 'off',
    'testing-library/prefer-screen-queries': 'off',
  },
};
