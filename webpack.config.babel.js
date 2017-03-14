import { resolve } from 'path'

export default {
  context: resolve('src'),
  entry: ['babel-polyfill', './'],
  output: {
    path: resolve('dist/'),
    filename: 'rollex.js',
    library: 'Rollex',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
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
