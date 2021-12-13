module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['react-hooks'],
  overrides: [
    // typescript
    {
      files: ['*.ts', '*.tsx'],
      excludedFiles: ['*.test.js'],
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/member-delimiter-style': 0,
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/no-use-before-define': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        'react/prop-types': 0,
        'react/display-name': 'off',
      },
    },

    // javascript
    {
      files: ['*.js'],
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'valid-jsdoc': 'error',
        'react/prop-types': 0,
        'react/jsx-fragments': 0,
        'react/jsx-key': 0,
        'react/jsx-handler-names': 0,
        'linebreak-style': ['error', 'unix'],
      },
    },

    // eslint config files
    {
      files: ['.eslintrc.js', './scripts/**'],
      env: {
        node: true,
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
