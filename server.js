/*
 * Copyright 2019 Stanford University see LICENSE for license
 *
 * Minimal BIBFRAME Editor Node.js server. To run from the command-line:
 *  npm start  or node server.js
 */

import express from 'express'
import request from 'request'
import bodyParser from 'body-parser'
import Config from './src/Config'
import versoSpoof from './src/versoSpoof'
import _ from 'lodash'

const port = 8000
const app = express()

// Required for ElasticSearch proxy middleware to parse response body as JSON
app.use(bodyParser.json()) // handle json data
app.use(bodyParser.urlencoded({ extended: true })) // handle URL-encoded data

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// ElasticSearch proxy middleware
app.use('/api/search', (req, res) => {
  if (!['GET', 'POST'].includes(req.method)) {
    res.status(400).json({ error: `unsupported method: ${req.method}` })
    return
  }

  // Hard-coded for now since we only have the one use case for proxying ES,
  // i.e., full-text search of resources
  if (req.path !== '/sinopia_resources/sinopia/_search') {
    res.status(400).json({ error: `unsupported path: ${req.path}` })
    return
  }

  // Only use the method, path, and body from the original request: method and
  // path have already been validated above and the body must be a
  // JSON-serializeable entity

  let searchUri = `${Config.indexUrl}${req.path}`
  if (!_.isEmpty(req.query)) {
    searchUri += new URL(req.originalUrl).search
  }

  request({
    method: req.method,
    uri: searchUri,
    body: req.body,
    json: true,
  })
    .on('error', (err) => {
      console.error(`error making request to ElasticSearch: ${err}`)
      res.status(500).json({ error: 'server error: could not make request to ElasticSearch' })
    })
    .pipe(res)
    .on('error', (err) => {
      console.error(`error returning ElasticSearch response: ${err}`)
      res.status(500).json({ error: 'server error: could not send ElasticSearch response' })
    })
})

// Serve static assets to the browser, e.g., from src/styles/ and static/
app.use(express.static(`${__dirname}/`))

app.all('/verso/api/configs', (req, res, next) => {
  if (req.query.filter.where.configType === 'profile') {
    res.json(versoSpoof.profiles)
  } else if (req.query.filter.where.configType === 'ontology') {
    res.json(versoSpoof.ontologies)
  } else {
    res.status(400).send(`Verso not enabled -- app made request ${req.originalUrl}`)
  }
  next()
})

app.all('/profile-edit/server/whichrt', (req, res) => {
  const reqUri = req.query.uri

  if (reqUri !== null) {
    if (versoSpoof.ontologyUrls.includes(reqUri)) {
      const json = versoSpoof.owlOntUrl2JsonMappings.find(el => reqUri === el.url).json

      res.json(json)
    } else {
      console.error(`/profile-edit/server/whichrt called for uri other than ontology ${reqUri}`)
      res.status(400).send(`/profile-edit/server/whichrt called for uri other than ontology ${reqUri}`)
    }
  } else {
    console.error(`/profile-edit/server/whichrt called without uri ${req.originalUrl}`)
    res.status(400).send(`/profile-edit/server/whichrt called without uri ${req.originalUrl}`)
  }
})

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.listen(port, () => {
  console.info(`Sinopia Linked Data Editor running on ${port}`)
  console.info('Press Ctrl + C to stop.')
})
