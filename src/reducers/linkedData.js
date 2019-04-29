import { getResourceTemplate } from '../sinopiaServer'

const DEFAULT_STATE = {
  generateLD: {}
}

let jsonLD = {
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

const clearLinkedData = () => {
  jsonLD = {
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

  return { jsonld: jsonLD }
}

const generateLinkedData = (state, action) => {
  let subject, predicate, object, resourceUri, label
  subject = action.payload.linkedNode.value
  resourceUri = action.payload.resourceURI

  if(jsonLD['@graph'][0] === undefined){
    jsonLD['@graph'].push({
      "@id": `_:${subject}`,
      "@type": resourceUri
    })
  }

  action.payload.lookups.formData.forEach(field => {
    predicate = field.id
    field.items.forEach(item => {
      object = item.uri
      label = item.label
      createRDFLinks(predicate, object, resourceUri, label)
    })
  })

  action.payload.literals.formData.forEach(field => {
    field.items.forEach(item => {
      object = item.content
      item.propPredicate ? predicate = item.propPredicate : predicate = field.id
      createRDFLiterals(predicate, field.items, field.rtId, item.bnode, item.propPredicate)
    })
  })

  return { jsonld: jsonLD }
}

const createRDFLinks = (p, o, resourceUri, label) => {
  const entity = jsonLD['@graph'].some(thing => thing["@type"] === resourceUri)
  if(entity){
    jsonLD['@graph'][0][p] =  { "@id": o }
  }

  const duplicate = jsonLD['@graph'].some(thing => thing["@id"] === o)
  if(!duplicate){
    const obj = {
      "@id": o,
      "@type": p,
      "rdfs:label": label
    }
    jsonLD['@graph'].push(obj)
  }
}

const createRDFLiterals = (p, o, rtId, bnode, propPredicate) => {
  // TODO: This only works for spoofed resource templates! Needs to be reworked
  // to deal with promises.
  //
  // See https://github.com/LD4P/sinopia_editor/issues/473
  let resourceTemplateForEntity = getResourceTemplate(rtId)
  let entityResourceUri = resourceTemplateForEntity.resourceURI
  let literalItems = createLiteralArray(o)
  let literalValue = ''
  const entity = jsonLD['@graph'].some(thing => thing["@type"] === entityResourceUri)

  if (literalItems.length === 1) {
    literalValue = literalItems[0]
  } else {
    literalValue = literalItems
  }

  if(entity){
    jsonLD['@graph'][0][p] = literalValue
  } else {
    jsonLD['@graph'][0][propPredicate] = { "@id": `_:${bnode.value}` }

    let predicate = resourceTemplateForEntity.propertyTemplates[0].propertyURI

    const obj = {
      "@id": `_:${bnode.value}`,
      "@type": entityResourceUri,
      [predicate]: literalValue
    }
    jsonLD['@graph'].push(obj)
  }
}

function createLiteralArray(items){
  const result = []
  items.forEach(item => {
    result.push(item.content)
  })
  return result
}

const generateLD = (state=DEFAULT_STATE, action) => {
  switch(action.type) {
    case 'GENERATE_LD':
      return generateLinkedData(state, action)
    case 'REMOVE_ALL':
      return clearLinkedData()
    default:
      return state
  }
}

export { generateLD }
