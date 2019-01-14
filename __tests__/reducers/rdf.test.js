import { generateRDF, addTriples } from '../../src/reducers/rdf'

const N3 = require('n3')

const { DataFactory } = N3
const { blankNode, defaultGraph } = DataFactory

describe('generateRDF reducer', () => {
  it('should handle initial state', () => {
    expect(
      generateRDF(null, {})
    ).toEqual( null )
  })

  it('should generate a triple that has a blank-node subject with a BIBFRAME Instance Type', () => {
    let action = { type: 'GENERATE_RDF',
      payload: {
        literals: { formData: []},
        lookups: { formData: []},
        type: 'http://id.loc.gov/ontologies/bibframe/Instance'
      }
    }
    let graph = generateRDF(null, action)['graph']
    graph.end((error, result) => {
      expect( result ).toBe(`@prefix bf: <http://id.loc.gov/ontologies/bibframe/>.

    _:n3-0 a bf:Instance.`)
    })
  })
})

describe('addTriples function', () => {

  it('throws an error if missing parameters',
    () => {
    expect(
      addTriples
    ).toThrowError(TypeError)
  })

  it('does not add triple if resourceTemplate ID is null', () => {
    const subject = blankNode()
    const graph = N3.Store()
    addTriples(subject, [], null, null, graph)
    expect(graph.size).toBe(0)
  })

  it('adds triple with a literal for the object', () => {
    const formData = [
      { id: "http://id.loc.gov/ontologies/bibframe/responsibilityStatement",
        rtId: "resourceTemplate:bf2:Monograph:Instance",
        items: [{
          id: 0,
          content: "A test string"
        }]}
    ]
    const subject = blankNode()
    const graph = N3.Store()
    addTriples(subject,
      formData,
      "resourceTemplate:bf2:Monograph:Instance",
      'content',
      graph)
    const object = graph.getObjects(subject, null, null)[0]
    expect(graph.size).toBe(1)
    expect(object.id).toMatch("A test string")
  })

  it('adds a triple with a URI for the object', () => {
    const monograph = "http://id.loc.gov/vocabulary/issuance/mono"
    const formData = [
      { id: "http://id.loc.gov/ontologies/bibframe/issuance",
        rtId: "resourceTemplate:bf2:Monograph:Instance",
        items: [{
          id: monograph,
          uri: monograph,
          label: "single unit"
        }]}
    ]
    const subject = blankNode()
    const graph = N3.Store()
    addTriples(subject,
      formData,
      "resourceTemplate:bf2:Monograph:Instance",
      'uri',
      graph)
    const object = graph.getObjects(subject, null, null)[0]
    expect(graph.size).toBe(1)
    expect(object.id).toMatch(monograph)
  })


})
