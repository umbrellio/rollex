const webpack = require('webpack')
const sauceLaunchers = require('./sauceLaunchers.config')

var browsers
if (process.env.TRAVIS) {
  // Travis only comes with Firefox
  browsers = ['Firefox']
} else if (process.env.SAUCE) {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.error('SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables must be set!')
    process.exit(1)
  }
  browsers = Object.keys(sauceLaunchers)
} else if (process.platform === 'darwin') {
  browsers = ['Chrome', 'Firefox', 'Safari']
} else {
  browsers = ['Chrome', 'Firefox']
}

module.exports = function (config) {
  const ci = process.env.CI
  const sauce = process.env.SAUCE

  config.set({
    singleRun: true,
    frameworks: ['jasmine'],
    files: [
      'stylesheets/minimal.css',
      'test/acceptance/tests.js'
    ],
    preprocessors: {
      'test/acceptance/tests.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots', 'saucelabs'],
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
    },
    sauceLabs: {
      testName: ci ? 'Rollex acceptance tests (CI)' : 'Rollex acceptance tests'
    },
    browsers: browsers,
    concurrency: (ci || sauce) ? 2 : Infinity,
    captureTimeout: ci ? 120000 : 300000,
    browserNoActivityTimeout: ci ? 120000 : 300000,
    customLaunchers: sauceLaunchers
  })
}
