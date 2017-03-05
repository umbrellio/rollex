import { resolve } from 'path'

export default {
  context: resolve('src'),
  entry: './',
  output: {
    filename: 'bundle.js',
    path: resolve('dist/')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: /src/
      }
    ]
  }
}
