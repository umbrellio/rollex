import { resolve } from 'path'

export default {
  context: resolve('src'),
  entry: ['babel-polyfill', './'],
  output: {
    path: resolve('dist/'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader']
      }
    ]
  }
}
