/*
 * Copyright 2018 Stanford University see LICENSE for license
 * Minimal BIBFRAME Editor Node.js server. To run from the command-line:
 *  npm start  or node server.js
 */

import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import historyApiFallback from 'connect-history-api-fallback'
import config from '../../webpack.dev.config'
import router from './serverRoutes'

const port = 8888
const app = express()
const compiler = webpack(config)

app.use('/', router)

app.use(historyApiFallback({
  verbose: false,
}))

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}))

app.use(webpackHotMiddleware(compiler))

app.get('*', (req, res, next) => {
  compiler.outputFileSystem.readFile(`${__dirname}/index.html`, (err, result) => {
    if (err) {
      return next(err)
    }
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})

app.listen(port, () => {
  console.info(`BIBFRAME Editor running on ${port}`)
  console.info('Press Ctrl + C to stop.')
})
