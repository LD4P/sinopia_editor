const N3 = require('n3')
const store = N3.Store({})
const { DataFactory } = N3
const { namedNode, literal, blankNode, quad } = DataFactory

const DEFAULT_STATE = {
  generateRDF: {}
}

const generateMyRDF = (state, action) => {

  const writer = N3.Writer({
    prefixes: { bf: 'http://id.loc.gov/ontologies/bibframe/'},
    format: 'Turtle'
  })

  const quads = store.getQuads(
    null,
    namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
    namedNode(action.payload.type)
  )

  let subject
  if (quads.length === 0) {
    subject = blankNode()
    store.addQuad(
      quad(subject,
        namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        namedNode(action.payload.type))
    )
  } else {
    subject = quads[0].subject
  }

  // Adds all of the lookup fields
  action.payload.lookups.formData.forEach(field => {
    if (action.payload.rtId === field.rtId) {
      field.items.forEach(item => {
        if (item['uri'] !== undefined) {
          store.addQuad(
            quad(subject, namedNode(field.id), namedNode(item['uri']))
          )
        }
      })
    }
  })

  // Adds all of the literal fields
  action.payload.literals.formData.forEach(field => {
    if (action.payload.rtId === field.rtId) {
      field.items.forEach(item => {
        store.addQuad(
          quad(subject, namedNode(field.id), literal(item['content']))
        )
      })
    }
  })

  // Temp solution displays RDF in Turtle, likely use a Modal Component
  // to display graph in multiple formats.
  let newGraphData = {}
  const quadstore = store.getQuads(namedNode(subject), null, null)
  quadstore.forEach(quad => {
    writer.addQuad(quad)
  })

  writer.end((error, result) => {
    newGraphData = result
  })
  return { rdf: newGraphData }
}

const generateRDF = (state=DEFAULT_STATE, action) => {
  switch(action.type) {
    case 'GENERATE_RDF':
      return generateMyRDF(state, action)
    default:
      return state
  }
}

export { generateRDF }
