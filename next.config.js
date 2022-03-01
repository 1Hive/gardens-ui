/**
 * @type {import('next').NextConfig}
 */

const setupAliases = require('./webpack/setup-aliases')
const setupFallbacks = require('./webpack/setup-fallbacks')
const setupAdditionalPlugins = require('./webpack/setup-additional-plugins')

const nextConfig = {
  distDir: 'build',

  webpack: function includeExtraPlugins(webpackConfig, { webpack }) {
    setupAliases(webpackConfig)

    setupFallbacks(webpackConfig)

    setupAdditionalPlugins(webpackConfig, webpack)

    return webpackConfig
  },

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
