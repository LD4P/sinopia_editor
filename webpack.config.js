// Copyright 2019 Stanford University see LICENSE for license

/* eslint node/no-unpublished-require: ["off"] */
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
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    fallback: {
      fs: false,
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
    },
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jQuery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      hash: true,
    }),
    new webpack.EnvironmentPlugin(
      {
        USE_FIXTURES: null,
        SINOPIA_API_BASE_URL: null,
        SINOPIA_GROUP: null,
        SINOPIA_ENV: null,
        SINOPIA_URI: null,
        AWS_COGNITO_DOMAIN: null,
        COGNITO_CLIENT_ID: null,
        COGNITO_USER_POOL_ID: null,
        INDEX_URL: null,
        SEARCH_HOST: null,
        EXPORT_BUCKET_URL: null,
        HONEYBADGER_API_KEY: null,
        HONEYBADGER_REVISION: null,
      },
    ),
  ],
  devtool: 'source-map',
  devServer: {
    static: './dist',
    historyApiFallback: true,
    hot: true,
    port: 8888,
    proxy: {
      '/api/search': 'http://localhost:8000',
    },
  },
}
