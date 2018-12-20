const N3 = require('n3')

const { DataFactory } = N3
const { namedNode, literal, blankNode, quad } = DataFactory

const DEFAULT_STATE = {
  graph: null
}

const generateMyRDF = (state, action) => {
  const writer = N3.Writer({
    prefixes: { bf: 'http://id.loc.gov/ontologies/bibframe/'}
  })
  const subject = blankNode()
  action.payload.literals.formData.forEach(field => {
    field.items.forEach(item => {
      if(item.hasOwnProperty('content')) {
        writer.addQuad(
          quad(subject, namedNode(field.id), literal(item.content))
        )
      }
    })
  })
  action.payload.lookups.formData.forEach(field => {
    field.items.forEach(item => {
      if(item.hasOwnProperty('uri')) {
        writer.addQuad(subject, namedNode(field.id), namedNode(item.uri))
      }
    })
  })
  // Temp solution displays RDF in Turtle, likely use a Modal Component
  // to display graph in multiple formats.
  writer.end((error, result) => {
    alert(result)
    return { ...state, graph: result }
  })
}

const generateRDF = (state=DEFAULT_STATE, action) => {
  switch(action.type) {
    case 'GENERATE_RDF':
      return generateMyRDF(state, action)
    default:
      return state
  }
}

export default generateRDF
