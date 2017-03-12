// babel-polyfill is required for older browsers (e.x. Firefox < 38)
require('babel-polyfill')

// Load all tests via Webpack
const context = require.context('./', true, /\.test\.js$/)
context.keys().forEach(context)
