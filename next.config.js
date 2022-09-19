
const path = require('path')
const setupAliases = require('./webpack/setup-aliases')
const setupFallbacks = require('./webpack/setup-fallbacks')
const setupAdditionalPlugins = require('./webpack/setup-additional-plugins')


// const withSass = require('@zeit/next-sass')
const withImages = require('next-images')


const internalNodeModulesRegExp = /use-wallet(?!.*node_modules)/;
const externalNodeModulesRegExp = /node_modules(?!\/use-wallet(?!.*node_modules))/;


/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  distDir: 'build',

  webpack: function includeExtraPlugins(config, { webpack, buildId, dev, isServer, defaultLoaders  }) {
      setupAliases(config)
      
      setupFallbacks(config)
      
      setupAdditionalPlugins(config, webpack)

      config.module.rules.push({
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          include: [path.resolve(__dirname,'node_modules/use-wallet/esm'),path.resolve(__dirname,'node_modules/use-wallet/dist/cjs'),path.resolve(__dirname,'public')]
      })

    //   config.externals = config.externals.map(external => {
    
    //     if (typeof external !== "function") return external
    //     return ({ctx, req}, cb) => (internalNodeModulesRegExp.test(req) ? cb() : external(ctx, req, cb))
    // });

    // config.module.rules.push({
    //     test: /\.(png|jpe?g|gif|webp)$/i,
    //     use: [
    //         {
    //             loader: 'url-loader',
    //             options: {
    //                 outputPath: 'images/',
    //                 publicPath: '/_next/',
    //                 name: dev ? '[name]-[hash].[ext]' : '[hash].[ext]',
    //                 limit: 4000,
    //             },
    //         },
    //     ],
    // });

    return config
  },

//   webpackDevMiddleware: config => {
//     const ignored = [ config.watchOptions.ignored[ 0 ], externalNodeModulesRegExp ]
//     config.watchOptions.ignored = ignored
//     return config
// },

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
// module.exports = withImages(nextConfig)
