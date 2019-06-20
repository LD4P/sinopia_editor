// Copyright 2018, 2019 Stanford University see LICENSE for license

const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = (_, argv) => {
  const serverPath = argv.mode === 'production'
    ? './src/server/server.prod.js'
    : './src/server/server.dev.js'

  return {
    entry: {
      server: serverPath,
    },
    output: {
      path: path.join(__dirname, '/dist'),
      publicPath: '/',
      filename: '[name].js',
    },
    target: 'node',
    node: {
      fs: 'empty',
      __dirname: false,
      __filename: false,
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
      ],
    },
  }
}
