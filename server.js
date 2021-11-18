/*
 * Copyright 2019 Stanford University see LICENSE for license
 *
 * Minimal BIBFRAME Editor Node.js server. To run from the command-line:
 *  npm start  or node server.js
 */

import express from "express"
import Config from "./src/Config"

import cors from "cors"
import proxy from "express-http-proxy"

const port = 8000
const app = express()

app.use(express.urlencoded({ extended: true })) // handle URL-encoded data

app.use(cors())
app.options("*", cors())

app.use(
  "/api/search",
  proxy(Config.indexUrl, {
    parseReqBody: false,
    proxyReqOptDecorator(proxyReqOpts) {
      delete proxyReqOpts.headers.origin
      return proxyReqOpts
    },
    filter: (req) => req.method === "POST",
  })
)

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`)
})

// Serve static assets to the browser, e.g., from src/styles/ and static/
app.use(express.static(`${__dirname}/`))

app.get("*", (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`)
})

app.listen(port, () => {
  console.info(`Sinopia Linked Data Editor running on ${port}`)
  console.info("Press Ctrl + C to stop.")
})
