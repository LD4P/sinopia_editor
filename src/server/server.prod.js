/*
 * Copyright 2018, 2019 Stanford University see LICENSE for license
 * Minimal BIBFRAME Editor Node.js server. To run from the command-line:
 *  npm run start
 */

import express from 'express'
import router from './serverRoutes'

const port = 8000
const app = express()

app.use('/', router)

app.use(express.static(__dirname))

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.listen(port, () => {
  console.info(`BIBFRAME Editor running on ${port}`)
  console.info('Press Ctrl + C to stop.')
})
