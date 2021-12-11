module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    "react/display-name": "off"
  },
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
        'react/prop-types': 0,
        "react/display-name": "off",
        "@typescript-eslint/explicit-function-return-type": 0
      },
    },

    // gatsby and eslint config files
    {
      files: [
        '.eslintrc.js',
        'gatsby-node.js',
        'gatsby-config.js',
        './scripts/**',
      ],
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