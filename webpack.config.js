// Copyright 2018 Stanford University see Apache2.txt for license
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
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
      }
    ]
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
        'REACT_APP_SPOOF_SINOPIA_SERVER',
        'REACT_APP_SINOPIA_SERVER_URL'
      ]
    )
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 8888
  }
}
