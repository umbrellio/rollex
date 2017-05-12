import { resolve } from 'path'

const minify = process.argv.indexOf('-p') !== -1

export default {
  context: resolve('src'),
  entry: './',
  output: {
    path: resolve('dist/'),
    filename: minify ? 'rollex.min.js' : 'rollex.js',
    library: 'Rollex',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
      },
    ],
  },
}
