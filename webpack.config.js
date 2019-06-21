// Copyright 2018 Stanford University see LICENSE for license
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  module: {
    noParse: /bad_json/,
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, './src'),
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        parser: {
          amd: false
        }
      }
    ]
  },
  node: {
    fs: "empty"
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('./', 'index.html'),
      filename: 'index.html',
      hash: true
    }),
    new webpack.EnvironmentPlugin(
      [
        'USE_FIXTURES',
        'TRELLIS_BASE_URL',
        'DEFAULT_PROFILE_SCHEMA_VERSION',
        'SINOPIA_GROUP',
        'SINOPIA_URI',
        'AWS_COGNITO_DOMAIN',
        'COGNITO_CLIENT_ID',
        'COGNITO_USER_POOL_ID'
      ]
    )
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 8888,
    proxy: {
      '/api/search': 'http://localhost:8000'
    }
  }
}
