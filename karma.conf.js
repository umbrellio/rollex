const webpack = require('webpack')
// Travis only comes with Firefox
const browsers = process.env.TRAVIS ? ['Firefox'] : ['Chrome', 'Firefox']

module.exports = function (config) {
  config.set({
    browsers: browsers,
    singleRun: true,
    frameworks: ['jasmine'],
    files: [
      'stylesheets/minimal.css',
      'test/acceptance/tests.js'
    ],
    preprocessors: {
      'test/acceptance/tests.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots'],
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            WATCH: process.env.WATCH
          }
        })
      ],
      devtool: 'inline-source-map'
    },
    webpackMiddleware: {
      stats: 'errors-only'
    }
  })
}
