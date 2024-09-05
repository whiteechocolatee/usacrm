module.exports = {
  root: true,
  extends: [
    'next',
    'airbnb',
    'airbnb-typescript',
    'prettier',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', 'jsx-a11y', 'import', '@typescript-eslint', 'react-hooks'],
  rules: {
    'react/jsx-props-no-spreading': 'warn',
    'no-param-reassign': 'off',
    'react/require-default-props': 'warn',
    'no-console': 'error',
    'react/react-in-jsx-scope': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'react-hooks/rules-of-hooks': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  ignorePatterns: [
    '.eslintrc.js',
    '.next/',
    'src/components/ui/',
    'prettier.config.js',
    './test.tsx',
    './tailwind.config.ts',
  ],
};
