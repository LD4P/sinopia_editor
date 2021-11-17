/*
 * Copyright 2019 Stanford University see LICENSE for license
 *
 * Minimal BIBFRAME Editor Node.js server. To run from the command-line:
 *  npm start  or node server.js
 */

import express from "express"
import got from "got"
import Config from "./src/Config"
import _ from "lodash"
import cors from "cors"

const port = 8000
const app = express()

// Required for ElasticSearch proxy middleware to parse response body as JSON
app.use(express.json()) // handle json data
app.use(express.urlencoded({ extended: true })) // handle URL-encoded data

app.use(cors())
app.options("*", cors())

// ElasticSearch proxy middleware
app.post("/api/search/:index/sinopia/_search", (req, res) => {
  // Only use the method, path, and body from the original request: method and
  // path have already been validated above and the body must be a
  // JSON-serializeable entity

  let searchUri = `${Config.indexUrl}/${req.params.index}/sinopia/_search`
  if (!_.isEmpty(req.query)) {
    const originalUrl = `${req.protocol}://${req.hostname}${req.originalUrl}`
    searchUri += new URL(originalUrl).search
  }

  got(searchUri, {
    method: req.method,
    json: req.body,
    responseType: "json",
  })
    .on("error", (err) => {
      console.error(`error making request to ElasticSearch: ${err}`)
      res.status(500).json({
        error: "server error: could not make request to ElasticSearch",
      })
    })
    .pipe(res)
    .on("error", (err) => {
      console.error(`error returning ElasticSearch response: ${err}`)
      res.status(500).json({
        error: "server error: could not send ElasticSearch response",
      })
    })
})

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
