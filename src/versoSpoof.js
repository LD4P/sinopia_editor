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
  {'url': 'http://id.loc.gov/ontologies/bibframe.rdf', 'type': 'rdfxml', 'fname': 'bibframe.rdf.xml'},
  {'url': 'http://id.loc.gov/ontologies/bflc.rdf', 'type': 'rdfxml', 'fname': 'bflc.rdf.xml'},
  {'url': 'http://www.loc.gov/standards/mads/rdf/v1.rdf', 'type': 'rdfxml', 'fname': 'mads-v1.rdf.xml'},
  {'url': 'http://www.w3.org/1999/02/22-rdf-syntax-ns.rdf', 'type': 'rdfxml', 'fname': 'rdf-syntax-ns.rdf.xml'},
  {'url': 'http://www.w3.org/2000/01/rdf-schema.rdf', 'type': 'rdfxml', 'fname': 'rdf-schema.rdf.xml'},
  {'url': 'http://id.loc.gov/ontologies/bibframe/Instance.json', 'type': 'json', 'fname': 'Instance.json'},
  {'url': 'http://id.loc.gov/ontologies/bibframe/Work.json', 'type': 'json', 'fname': 'Work.json'}
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
      const fileName = mappingEl['fname']
      if (mappingEl['type'] == 'rdfxml') {
        const filePath = path.join(__dirname, '..', 'static', 'rdfxml', fileName)
        const oxml = fs.readFileSync(filePath, {encoding: 'utf8'})
        owlOntUrl2JsonMappings.push(
          {
            url: mappingEl['url'],
            json: x2json_parser.xml2js(oxml)
          }
        )
      } else if (mappingEl['type'] == 'json') {
        const filePath = path.join(__dirname, '..', 'static', 'id.loc.gov', 'ontologies', 'bibframe', fileName)
        owlOntUrl2JsonMappings.push(
          {
            url: mappingEl['url'],
            json: fs.readFileSync(filePath, {encoding: 'utf8'})
          }
        )
      }
    })
  }
}
