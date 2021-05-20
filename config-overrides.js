/* config-overrides.js */

const path = require('path')
const {
  addWebpackAlias,
  useBabelRc,
  override,
  useEslintRc,
} = require('customize-cra')

module.exports = override(
  useBabelRc(),
  useEslintRc(path.resolve(__dirname, '.eslintrc')),
  addWebpackAlias({
    '@': path.resolve(__dirname, './src'),
    '@assets': path.resolve(__dirname, './src/assets'),
    '@components': path.resolve(__dirname, './src/components'),
    '@hooks': path.resolve(__dirname, './src/hooks'),
    '@lib': path.resolve(__dirname, './src/lib'),
    '@providers': path.resolve(__dirname, './src/providers'),
    '@utils': path.resolve(__dirname, './src/utils'),
  })
)
