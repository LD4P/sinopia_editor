import { generateRDF } from '../../src/reducers/rdf'

describe('generateRDF reducer', () => {
  it('should handle initial state', () => {
    expect(
      generateRDF(null, {})
    ).toEqual( null )
  })

  it('should generate a triple that has a blank-node subject with a BIBFRAME Instance Type', () => {
    let action = { type: 'GENERATE_RDF',
      payload: {
        parentRt: 'resourceTemplate:bf2:Monograph:Instance',
        rtId: 'resourceTemplate:bf2:Monograph:Instance',
        literals: { formData: []},
        lookups: { formData: []},
        type: 'http://id.loc.gov/ontologies/bibframe/Instance'
      }
    }
    let graph = generateRDF(null, action)['rdf']
    const triple = `@prefix bf: <http://id.loc.gov/ontologies/bibframe/>. _:n3-0 a bf:Instance.`
    expect(equalsIgnoreWhitespace(graph)).toEqual(equalsIgnoreWhitespace(triple))
  })

  it('does not add triple from lookup field if uri is not present', () => {
    let action = { type: 'GENERATE_RDF',
      payload: {
        parentRt: 'resourceTemplate:bf2:Monograph:Instance',
        rtId: 'resourceTemplate:bf2:Monograph:Instance',
        literals: { formData: []},
        lookups: { formData: [
          {
            id: "http://id.loc.gov/ontologies/bibframe/issuance",
            rtId: "resourceTemplate:bf2:Monograph:Instance",
            items: [
              {
                "id": "http://id.loc.gov/vocabulary/issuance/mono",
                "label": "single unit"
              }
            ]
          }
        ]},
        type: 'http://id.loc.gov/ontologies/bibframe/Instance'
      }
    }
    let graph = generateRDF(null, action)['rdf']
    const triple = `@prefix bf: <http://id.loc.gov/ontologies/bibframe/>. _:n3-0 a bf:Instance.`
    expect(equalsIgnoreWhitespace(graph)).toEqual(equalsIgnoreWhitespace(triple))
  })

  it('adds a triple with a URI for the object in case of a lookup', () => {
    let action = { type: 'GENERATE_RDF',
      payload: {
        parentRt: 'resourceTemplate:bf2:Monograph:Instance',
        rtId: 'resourceTemplate:bf2:Monograph:Instance',
        literals: { formData: []},
        lookups: { formData: [
          {
            id: "http://id.loc.gov/ontologies/bibframe/issuance",
            rtId: "resourceTemplate:bf2:Monograph:Instance",
            items: [
              {
                "uri": "http://id.loc.gov/vocabulary/issuance/mono",
                "id": "http://id.loc.gov/vocabulary/issuance/mono",
                "label": "single unit"
              }
            ]
          }
        ]},
        type: 'http://id.loc.gov/ontologies/bibframe/Instance'
      }
    }
    let graph = generateRDF(null, action)['rdf']
    const triple = `@prefix bf: <http://id.loc.gov/ontologies/bibframe/>. _:n3-0 a bf:Instance;
                    bf:issuance <http://id.loc.gov/vocabulary/issuance/mono>.`
    expect(equalsIgnoreWhitespace(graph)).toEqual(equalsIgnoreWhitespace(triple))
  })

  it('adds triple with a literal for the object', () => {
    let action = { type: 'GENERATE_RDF',
      payload: {
        parentRt: 'resourceTemplate:bf2:Monograph:Instance',
        rtId: 'resourceTemplate:bf2:Monograph:Instance',
        literals: { formData: [
          {
            id: "http://id.loc.gov/ontologies/bibframe/responsibilityStatement",
            rtId: "resourceTemplate:bf2:Monograph:Instance",
            items: [
              {
                "id": 0,
                "content": "Psych papers"
              }
            ]
          }
        ]},
        lookups: { formData: []},
        type: 'http://id.loc.gov/ontologies/bibframe/Instance'
      }
    }
    let graph = generateRDF(null, action)['rdf']
    const triple = `@prefix bf: <http://id.loc.gov/ontologies/bibframe/>. _:n3-0 a bf:Instance; 
                    bf:issuance <http://id.loc.gov/vocabulary/issuance/mono>; bf:responsibilityStatement \"Psychpapers\".`
    expect(equalsIgnoreWhitespace(graph)).toEqual(equalsIgnoreWhitespace(triple))
  })

  it('generates the scoped rdf for a modal', () => {
    let action = { type: 'GENERATE_RDF',
      payload: {
        parentRt: 'resourceTemplate:bf2:Monograph:Instance',
        rtId: 'resourceTemplate:bf2:Note',
        literals: { formData: [
          {
            id: "http://id.loc.gov/ontologies/bibframe/note",
            rtId: "resourceTemplate:bf2:Note",
            items: [
              {
                "id": 0,
                "content": "noted"
              }
            ]
          }
        ]},
        lookups: { formData: []},
        type: 'http://id.loc.gov/ontologies/bibframe/Note'
      }
    }
    let graph = generateRDF(null, action)['rdf']
    const triple = `@prefix bf: <http://id.loc.gov/ontologies/bibframe/>. _:n3-0 a bf:Instance; 
                    bf:issuance <http://id.loc.gov/vocabulary/issuance/mono>; bf:responsibilityStatement \"Psychpapers\". 
                    _:n3-1 a bf:Note; bf:note \"noted\".`
    expect(equalsIgnoreWhitespace(graph)).toEqual(equalsIgnoreWhitespace(triple))
  })
})

function equalsIgnoreWhitespace(str){
  return str.replace(/\s/g, '')
}