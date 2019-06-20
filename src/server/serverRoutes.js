// Copyright 2018, 2019 Stanford University see LICENSE for license

import express from 'express'
import versoSpoof from '../versoSpoof'

const router = express.Router()

router.all('/verso/api/configs', (req, res, next) => {
  if (req.query.filter.where.configType === 'profile') {
    res.json(versoSpoof.profiles)
  } else if (req.query.filter.where.configType === 'ontology') {
    res.json(versoSpoof.ontologies)
  } else {
    res.status(400).send(`Verso not enabled -- app made request ${req.originalUrl}`)
  }
  next()
})

router.all('/profile-edit/server/whichrt', (req, res) => {
  const reqUri = req.query.uri

  if (reqUri !== null) {
    if (versoSpoof.ontologyUrls.includes(reqUri)) {
      const json = versoSpoof.owlOntUrl2JsonMappings.find(el => reqUri === el.url)

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

export default router
