/* config-overrides.js */

const path = require('path')
const {
  addWebpackAlias,
  addWebpackPlugin,
  addWebpackResolve,
  useBabelRc,
  override,
} = require('customize-cra')
const webpack = require('webpack')

module.exports = override(
  useBabelRc(),
  addWebpackAlias({
    '@': path.resolve(__dirname, './src'),
    '@abis': path.resolve(__dirname, './src/abi'),
    '@assets': path.resolve(__dirname, './src/assets'),
    '@components': path.resolve(__dirname, './src/components'),
    '@hooks': path.resolve(__dirname, './src/hooks'),
    '@lib': path.resolve(__dirname, './src/lib'),
    '@providers': path.resolve(__dirname, './src/providers'),
    '@utils': path.resolve(__dirname, './src/utils'),
  }),
  addWebpackPlugin(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  ),
  addWebpackPlugin(
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
  ),
  addWebpackResolve({
    fallback: {
      url: require.resolve('url/'),
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
      http: require.resolve('stream-http'),
      path: require.resolve('path-browserify'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      stream: require.resolve('stream-browserify'),
      timers: require.resolve('timers-browserify'),
    },
  })
)
