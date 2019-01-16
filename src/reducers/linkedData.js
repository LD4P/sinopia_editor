//TODO: Replace this resource template call to Trellis
const { getResourceTemplate } = require('../sinopiaServerSpoof.js')

const DEFAULT_STATE = {
  generateLD: {}
}

const jsonLD = {
  "@context": {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "bf": "http://id.loc.gov/ontologies/bibframe/",
    "bflc": "http://id.loc.gov/ontologies/bflc/",
    "madsrdf": "http://www.loc.gov/mads/rdf/v1#",
    "pmo": "http://performedmusicontology.org/ontology/"
  },
  "@graph": []
}
const generateLinkedData = (state, action) => {
  let subject, predicate, object, resourceUri, label
  subject = action.payload.linkedNode.value
  resourceUri = action.payload.resourceURI

  jsonLD['@graph'].push({
    "@id": subject,
    "@type": resourceUri
  })

  action.payload.lookups.formData.forEach(field => {
    predicate = field.id
    field.items.forEach(item => {
      object = item.uri
      label = item.label
      createRDFLinks(subject, predicate, object, resourceUri, label)
    })
  })

  action.payload.literals.formData.forEach(field => {
    field.items.forEach(item => {
      object = item.content
      item.type ? predicate = item.type : predicate = field.id
      createRDFLiterals(predicate, object, field.rtId, item.bnode)
    })
  })

  return { jsonld: jsonLD }
}

function createRDFLinks(s, p, o, resourceUri, label) {
  const entity = jsonLD['@graph'].some(thing => thing["@type"] === resourceUri)
  if(entity){
    jsonLD['@graph'][0][p] =  { "@id": o }
  } else {
    jsonLD['@graph'].push({
      "@id": s,
      "@type": resourceUri,
      [p]: { "@id": o }
    })
  }

  const duplicate = jsonLD['@graph'].some(thing => thing["@id"] === o)
  if(!duplicate){
    jsonLD['@graph'].push({
      "@id": o,
      "@type": p,
      "rdfs:label": label
    })
  }
}

function createRDFLiterals(p, o, rtId, bnode) {
  let resourceTemplateForEntity = getResourceTemplate(rtId)
  const entity = jsonLD['@graph'].some(thing => thing["@type"] === resourceTemplateForEntity.resourceURI)
  if(entity){
    jsonLD['@graph'][0][p] = o

  } else {
    jsonLD['@graph'][0][p] = { "@id": bnode.value }

    let predicate = resourceTemplateForEntity.propertyTemplates[0].propertyURI

    jsonLD['@graph'].push({
      "@id": bnode.value,
      "@type": resourceTemplateForEntity.resourceURI,
      [predicate]: o
    })
  }
}

const generateLD = (state=DEFAULT_STATE, action) => {
  switch(action.type) {
    case 'GENERATE_LD':
      return generateLinkedData(state, action)
    default:
      return state
  }
}

export { generateLD }
