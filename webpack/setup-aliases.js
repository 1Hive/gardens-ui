const path = require('path')

module.exports = function setupAlias(webpackConfig) {
  webpackConfig.resolve.alias = {
    ...webpackConfig.resolve.alias,
    '@': path.resolve(__dirname, './src'),
    '@abis': path.resolve(__dirname, './src/abi'),
    '@images': path.resolve(__dirname, './public'),
    '@assets': path.resolve(__dirname, './src/assets'),
    '@components': path.resolve(__dirname, './src/components'),
    '@hooks': path.resolve(__dirname, './src/hooks'),
    '@lib': path.resolve(__dirname, './src/lib'),
    '@providers': path.resolve(__dirname, './src/providers'),
    '@utils': path.resolve(__dirname, './src/utils'),
  }
}
