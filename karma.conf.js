const webpack = require('webpack')
// Travis only comes with Firefox
const browsers = process.env.TRAVIS ? ['Firefox'] : ['Chrome', 'Firefox']

module.exports = function (config) {
  config.set({
    browsers: browsers,
    singleRun: true,
    basePath: 'test/acceptance',
    frameworks: ['jasmine'],
    files: ['tests.js'],
    preprocessors: {
      'tests.js': ['webpack', 'sourcemap']
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
