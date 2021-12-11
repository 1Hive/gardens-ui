/* config-overrides.js */

const path = require('path')
const {
  addWebpackAlias,
  useBabelRc,
  override,
  useEslintRc,
  enableEslintTypescript,
} = require('customize-cra')

module.exports = override(
  useBabelRc(),
  useEslintRc(path.resolve(__dirname, '.eslintrc.js')),
  enableEslintTypescript(),
  addWebpackAlias({
    '@': path.resolve(__dirname, './src'),
    '@abis': path.resolve(__dirname, './src/abi'),
    '@assets': path.resolve(__dirname, './src/assets'),
    '@components': path.resolve(__dirname, './src/components'),
    '@hooks': path.resolve(__dirname, './src/hooks'),
    '@lib': path.resolve(__dirname, './src/lib'),
    '@providers': path.resolve(__dirname, './src/providers'),
    '@utils': path.resolve(__dirname, './src/utils'),
  })
)
