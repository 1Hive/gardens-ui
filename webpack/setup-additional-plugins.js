module.exports = function setupAdditionalPlugins(webpackConfig, webpack) {
  webpackConfig.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  )

  webpackConfig.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
  )

  return webpackConfig
}
