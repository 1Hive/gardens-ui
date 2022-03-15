module.exports = function setupFallbacks(webpackConfig) {
  webpackConfig.resolve.fallback = {
    ...webpackConfig.resolve.fallback,
    // url: require.resolve('url/'),
    // assert: require.resolve('assert/'),
    // buffer: require.resolve('buffer/'),
    // http: require.resolve('stream-http'),
    // path: require.resolve('path-browserify'),
    // https: require.resolve('https-browserify'),
    // crypto: require.resolve('crypto-browserify'),
    // stream: require.resolve('stream-browserify'),
    // timers: require.resolve('timers-browserify'),
    // os: require.resolve('os-browserify/browser'),
  }
}
