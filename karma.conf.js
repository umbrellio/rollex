const webpack = require('webpack')

const sauceLaunchers = {
  sl_chrome_old: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: '30'
  },
  sl_chrome_new: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: '56'
  },
  sl_firefox_old: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '30'
  },
  sl_firefox_new: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '51'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '14.14393'
  },
  sl_safari_10: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macOS 10.12',
    version: '10.0'
  }
}

if (process.env.TRAVIS) {
  // Travis only comes with Firefox
  var browsers = ['Firefox']
} else if (process.env.SAUCE) {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.error('SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables must be set!')
    process.exit(1)
  }
  var browsers = Object.keys(sauceLaunchers)
} else if (process.platform === 'darwin') {
  var browsers = ['Chrome', 'Firefox', 'Safari']
} else {
  var browsers = ['Chrome', 'Firefox']
}

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
      testName: process.env.CI ? 'Rollex acceptance tests (CI)' : 'Rollex acceptance tests'
    },
    concurrency: 2,
    captureTimeout: 300000,
    browserNoActivityTimeout: 300000,
    customLaunchers: sauceLaunchers
  })
}
