/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
// spoof verso calls to get profiles and ontologies
const path = require('path')
const fs = require('fs')

var profiles = []
loadProfiles()
module.exports.profiles = profiles

function loadProfiles () {
  if (profiles.length == 0) {
    const profilesDirPath = path.join(__dirname, '..', 'static', 'spoofedFilesFromServer', 'from_verso', 'data', 'profiles')
    fs.readdirSync(profilesDirPath).forEach(file => {
      const fileJson = require(path.join(profilesDirPath, file))
      profiles.push(
        {
          id: fileJson['Profile']['id'],
          name: fileJson['Profile']['description'],
          configType: 'profile',
          json: fileJson
        }
      )
    })
  }
}

// Manual construction of ontologies list, based on lcnetdev verso/server/boot/05-load-ontologies.js
const ontologies = [
  {
    'id': 'Bibframe-ontology',
    'configType': 'ontology',
    'name': 'Bibframe-ontology',
    'json': {'label': 'Bibframe 2.0', 'url': 'http://id.loc.gov/ontologies/bibframe.rdf'},
  },
  {
    'id': 'BFLC-ontology',
    'configType': 'ontology',
    'name': 'BFLC-ontology',
    'json': {'label': 'BFLC', 'url': 'http://id.loc.gov/ontologies/bflc.rdf'},
  },
  {
    'id': 'MADSRDF-ontology',
    'configType': 'ontology',
    'name': 'MADSRDF-ontology',
    'json': {'label': 'MADSRDF', 'url': 'http://www.loc.gov/standards/mads/rdf/v1.rdf'},
  },
  {
    'id': 'RDF-ontology',
    'configType': 'ontology',
    'name': 'RDF-ontology',
    'json': {'label': 'RDF', 'url': 'http://www.w3.org/1999/02/22-rdf-syntax-ns.rdf'},
  },
  {
    'id': 'RDF-Schema-ontology',
    'configType': 'ontology',
    'name': 'RDF-Schema-ontology',
    'json': {'label': 'RDFS', 'url': 'http://www.w3.org/2000/01/rdf-schema.rdf'},
  }
]
module.exports.ontologies = ontologies

const owlOntUrl2FileMappings = [
  {'url': 'http://id.loc.gov/ontologies/bibframe.rdf', 'type': 'rdfxml', 'fname': ['id.loc.gov', 'ontologies', 'bibframe.rdf']},
  {'url': 'http://id.loc.gov/ontologies/bflc.rdf', 'type': 'rdfxml', 'fname': ['id.loc.gov', 'ontologies', 'bflc.rdf']},
  {'url': 'http://www.loc.gov/standards/mads/rdf/v1.rdf', 'type': 'rdfxml', 'fname': ['www.loc.gov', 'standards', 'mads', 'rdf', 'v1.rdf']},
  {'url': 'http://www.w3.org/1999/02/22-rdf-syntax-ns.rdf', 'type': 'rdfxml', 'fname': ['www.w3.org', '1999', '02', '22-rdf-syntax-ns.rdf']},
  {'url': 'http://www.w3.org/2000/01/rdf-schema.rdf', 'type': 'rdfxml', 'fname': ['www.w3.org', '2000', '01','rdf-schema.rdf']},
  {'url': 'http://id.loc.gov/ontologies/bibframe/Instance.json', 'type': 'json', 'fname': ['id.loc.gov', 'ontologies', 'bibframe', 'Instance.json']},
  {'url': 'http://id.loc.gov/ontologies/bibframe/Work.json', 'type': 'json', 'fname': ['id.loc.gov', 'ontologies', 'bibframe', 'Work.json']}
]

const ontologyUrls = []
loadOntologyUrls()
module.exports.ontologyUrls = ontologyUrls

function loadOntologyUrls() {
  owlOntUrl2FileMappings.forEach(function (el) {
    ontologyUrls.push(el.url)
  })
}

var owlOntUrl2JsonMappings = []
loadOwlOntologies()
module.exports.owlOntUrl2JsonMappings = owlOntUrl2JsonMappings

function loadOwlOntologies() {
  const x2js = require('x2js')
  const x2json_parser = new x2js()
  if (owlOntUrl2JsonMappings.length == 0) {
    owlOntUrl2FileMappings.forEach(function (mappingEl) {
      var fullFilePath = path.join(__dirname, '..', 'static', 'cachedHttp')
      mappingEl['fname'].forEach(function (p) {
        fullFilePath = path.join(fullFilePath, p)
      })
      const fileContents = fs.readFileSync(fullFilePath, {encoding: 'utf8'})
      if (mappingEl['type'] == 'rdfxml') {
        owlOntUrl2JsonMappings.push(
          {
            url: mappingEl['url'],
            json: x2json_parser.xml2js(fileContents)
          }
        )
      } else if (mappingEl['type'] == 'json') {
        owlOntUrl2JsonMappings.push(
          {
            url: mappingEl['url'],
            json: fileContents
          }
        )
      }
    })
  }
}
