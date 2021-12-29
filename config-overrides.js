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

const SentryWebpackPlugin = require('@sentry/webpack-plugin')

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
    new SentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      include: './build',
      debug: false,
      // ignore: ['node_modules', 'webpack.config.js'],
      configFile: path.resolve(__dirname, '.sentryclirc'),
      validate: true,
      release: process.env.VERCEL_GIT_COMMIT_SHA,
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
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      timers: require.resolve('timers-browserify'),
      os: require.resolve('os-browserify/browser'),
    },
  })
)
