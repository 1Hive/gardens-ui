/**
 * @type {import('next').NextConfig}
 */

const setupAliases = require('./webpack/setup-aliases')
const setupAdditionalPlugins = require('./webpack/setup-additional-plugins')

const nextConfig = {
  // enable sourcemaps for browsers (this will increase the build time a bit)
  productionBrowserSourceMaps: true,

  // removes the powered by icon (which appears in the bottom left) from the app
  poweredByHeader: false,

  // overrides the default webpack config
  webpack: function includeExtraPlugins(webpackConfig, { webpack }) {
    setupAliases(webpackConfig)

    setupAdditionalPlugins(webpackConfig, webpack)

    return webpackConfig
  },

  // specify redirects to be handled by next.js internally.
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
