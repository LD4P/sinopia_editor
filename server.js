/*
 * Copyright 2019 Stanford University see LICENSE for license
 * Minimal BIBFRAME Editor Node.js server. To run from the command-line:
 *  npm start  or node server.js
 */

const express = require('express')
const versoSpoof = require('./src/versoSpoof')

const port = 8000
const app = express()

app.use(express.static(`${__dirname}/`))

app.get('/api/search', (req, res) => {
  res.json({ foo: 'bar' })
})

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
      // FIXME:  there's probably a better way to find the value in array than forEach, but there are only 5 urls
      let json

      versoSpoof.owlOntUrl2JsonMappings.forEach((el) => {
        if (reqUri === el.url) {
          json = el.json
        }
      })
      res.status(200).type('application/json').send(json)
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
