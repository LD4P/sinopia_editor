// Copyright 2018, 2019 Stanford University see LICENSE for license

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js'],
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  mode: 'development',
  target: 'web',
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        parser: {
          amd: false,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
      filename: './index.html',
      excludeChunks: ['server'],
    }),
    new CopyWebpackPlugin([
      { from: 'static', to: 'static' },
    ]),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin(
      [
        'SPOOF_SINOPIA_SERVER',
        'TRELLIS_BASE_URL',
        'DEFAULT_PROFILE_SCHEMA_VERSION',
        'SINOPIA_GROUP',
        'SINOPIA_URI',
        'AWS_COGNITO_DOMAIN',
        'COGNITO_CLIENT_ID',
        'COGNITO_USER_POOL_ID',
      ],
    ),
  ],
}
