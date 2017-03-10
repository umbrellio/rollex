import { resolve } from 'path'

export default function (env = {}) {
  var config = {
    context: resolve('src'),
    output: {
      filename: 'bundle.js'
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

  if (env.pages) {
    config.entry = './docs'
    config.output.path = resolve('docs/')
  } else {
    config.entry = './'
    config.output.path = resolve('dist/')
  }

  return config
}
