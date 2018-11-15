// Copyright 2018 Stanford University see Apache2.txt for license
// Minimal BIBFRAME Editor Node.js server. To run from the command-line:
//  npm start  or node server.js

var port = 8000;
var express = require('express');

var app = express();

app.use(express.static(__dirname + '/'));
app.listen(port);

const versoSpoof = require('./src/versoSpoof.js')

app.all("/verso/api/configs", function (req, res, next) {
  if (req.query.filter.where.configType === 'profile') {
    res.json(versoSpoof.profiles)
  } else if (req.query.filter.where.configType === 'ontology') {
    res.json(versoSpoof.ontologies)
  } else {
    res.status(400).send(`Verso not enabled -- app made request ${req.originalUrl}`)
  }
  next()
})

app.all("/profile-edit/server/whichrt", function (req, res) {
  const reqUri = req.query.uri
  if (reqUri != null) {
    // console.debug(`DEBUG: got server/whichrt for ${reqUri}.`)
    if (versoSpoof.ontologyUrls.includes(reqUri)) {
      // FIXME:  there's probably a better way to find the value in array than forEach, but there are only 5 urls
      var json
      versoSpoof.owlOntUrl2JsonMappings.forEach( function(el) {
        if (reqUri == el.url) {
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

console.log('BIBFRAME Editor running on ' + port);
console.log('Press Ctrl + C to stop.');
