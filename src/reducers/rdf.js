const N3 = require('n3')

const { DataFactory } = N3
// TODO: Use N3.Store() for graph state
const { namedNode, literal, blankNode, quad } = DataFactory

const DEFAULT_STATE = {
  graph: {}
}

const addTriples = (subject, formData, rtId, testProperty, graph) => {
  formData.forEach(field => {
    if (field.rtId === rtId ) {
      field.items.forEach(item => {
        if(item.hasOwnProperty(testProperty)) {
          let obj = null
          if (testProperty === 'uri') {
            obj = namedNode(item[`uri`])
          } else {
            obj = literal(item[`${testProperty}`])
          }
          graph.addQuad(
            quad(subject, namedNode(field.id), obj)
          )
        }
      })
    }
  })
}

const generateMyRDF = (state, action) => {
  const writer = N3.Writer({
    prefixes: { bf: 'http://id.loc.gov/ontologies/bibframe/'}
  })
  const subject = blankNode()
  writer.addQuad(
    quad(subject,
         namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
         namedNode(action.payload.type))
  )
  addTriples(
    subject,
    action.payload.literals.formData,
    action.payload.rtId,
    'content',
     writer
   )
  addTriples(
    subject,
    action.payload.lookups.formData,
    action.payload.rtId,
    'uri',
    writer
  )
  // Temp solution displays RDF in Turtle, likely use a Modal Component
  // to display graph in multiple formats.
  writer.end((error, result) => {
    alert(result)
  })
  return { ...state, graph: writer }
}

const generateRDF = (state=DEFAULT_STATE, action) => {
  switch(action.type) {
    case 'GENERATE_RDF':
      return generateMyRDF(state, action)
    default:
      return state
  }
}

export { generateRDF, addTriples }
