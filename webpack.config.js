// Copyright 2019 Stanford University see LICENSE for license

/* eslint n/no-unpublished-require: ["off"] */
const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.js",
  module: {
    noParse: /bad_json/,
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, "./src"),
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            // inject CSS to page
            loader: "style-loader",
          },
          {
            // translates CSS into CommonJS modules
            loader: "css-loader",
          },
          {
            // Run postcss actions
            loader: "postcss-loader",
            options: {
              // `postcssOptions` is needed for postcss 8.x;
              // if you use postcss 7.x skip the key
              postcssOptions: {
                // postcss plugins, can be exported to postcss.config.js
                plugins() {
                  return [require("autoprefixer")]
                },
              },
            },
          },
          {
            // compiles Sass to CSS
            loader: "sass-loader",
            options: {
              // Prevent Dart Sass from prepending a UTF-8 BOM/@charset when
              // compiled output contains non-ASCII characters (e.g. "❯" in
              // main.scss) — a leading BOM corrupts the next selector, which
              // dropped Bootstrap's :root custom properties in some builds.
              sassOptions: {
                charset: false,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        // More information here https://webpack.js.org/guides/asset-modules/
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    fallback: {
      fs: false,
      vm: false,
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer"),
    },
  },
  output: {
    path: path.join(__dirname, "/dist"),
    publicPath: "/dist/",
    filename: "bundle.js",
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
      hash: true,
    }),
    new webpack.EnvironmentPlugin({
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
    }),
  ],
  devtool: "source-map",
  devServer: {
    static: "./dist",
    historyApiFallback: true,
    hot: true,
    port: 8888,
    proxy: [
      {
        context: ["/api/search"],
        target: "http://localhost:8000",
      },
    ],
  },
}
