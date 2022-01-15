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
// const BundleAnalyzerPlugin =
//   require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const updateWebpackModuleRules = (config) => {
  const sourceMapLoader = {
    enforce: 'pre',
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    test: /\.(js|mjs|jsx|ts|tsx|css)$/,
    use: [
      {
        loader: 'source-map-loader',
        options: {
          filterSourceMappingUrl: (url, resourcePath) => {
            if (/.*\/node_modules\/.*/.test(resourcePath)) {
              return false
            }
            return true
          },
        },
      },
    ],
  }

  // console.log(config)

  config.module.rules.splice(0, 1, sourceMapLoader)

  return config
}

module.exports = override(
  updateWebpackModuleRules,
  useBabelRc(),
  addWebpackAlias({
    'bn.js': 'fork-bn.js',
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
  // addWebpackPlugin(new BundleAnalyzerPlugin()),
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
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      timers: require.resolve('timers-browserify'),
      os: require.resolve('os-browserify/browser'),
    },
  })
)
