import { generateLD } from '../../src/reducers/linkedData'

describe('should handle initial state', () => {
  it('should handle initial state', () => {
    expect(
      generateLD(null, {})
    ).toBe( null )
  })

  const context = '{"@context": ' +
    '{"bf": "http://id.loc.gov/ontologies/bibframe/", ' +
    '"bflc": "http://id.loc.gov/ontologies/bflc/", ' +
    '"madsrdf": "http://www.loc.gov/mads/rdf/v1#", ' +
    '"pmo": "http://performedmusicontology.org/ontology/", ' +
    '"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#", ' +
    '"rdfs": "http://www.w3.org/2000/01/rdf-schema#", ' +
    '"xsd": "http://www.w3.org/2001/XMLSchema#"}, '

  it('should generate the base json-ld that has a blank-node subject with a BIBFRAME Instance Type', () => {
    const action = { type: 'GENERATE_LD',
      payload: {
        parentRt: 'resourceTemplate:bf2:Monograph:Instance',
        rtId: 'resourceTemplate:bf2:Monograph:Instance',
        literals: { formData: [] },
        lookups: { formData: [] },
        type: 'http://id.loc.gov/ontologies/bibframe/Instance',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
        linkedNode: { value: 'n3-0' }
      }
    }
    const receivedGraph = generateLD(null, action)['jsonld']
    const expectedJsonld = context +
      '"@graph": [' +
      '{"@id": "_:n3-0", "@type": "http://id.loc.gov/ontologies/bibframe/Instance"}]}'
    expect(receivedGraph).toEqual(JSON.parse(expectedJsonld))
  })

  it('should clear out the graph', () => {
    clearTestGraph()
  })

  it('should generate the base json-ld that has default lookup values', () => {
    const action = { type: "GENERATE_LD",
      payload: {
        parentRt: 'resourceTemplate:bf2:Monograph:Instance',
        literals: { formData: [] },
        lookups: { formData: [
          {
            "id":"http://id.loc.gov/ontologies/bibframe/issuance",
            "items":[
              {
                "id":"http://id.loc.gov/vocabulary/issuance/mono",
                "uri":"http://id.loc.gov/vocabulary/issuance/mono",
                "label":"single unit"
              }
            ],
            "rtId":"resourceTemplate:bf2:Monograph:Instance"
          },
          {
            "id":"http://id.loc.gov/ontologies/bibframe/carrier",
            "items":[
              {
                "id":"http://id.loc.gov/vocabulary/carriers/nc",
                "uri":"http://id.loc.gov/vocabulary/carriers/nc",
                "label":"volume"
              }
            ],
            "rtId":"resourceTemplate:bf2:Monograph:Instance"
          }
        ]},
        type: 'http://id.loc.gov/ontologies/bibframe/Instance',
        rtId: "resourceTemplate:bf2:Monograph:Instance",
        resourceURI: "http://id.loc.gov/ontologies/bibframe/Instance",
        linkedNode: { "termType":"BlankNode","value":"n3-0" }
      }
    }
    const receivedGraph = generateLD(null, action)['jsonld']
    const expectedJsonld = context +
      '"@graph": [' +
      '{"@id": "_:n3-0", ' +
      '"@type": "http://id.loc.gov/ontologies/bibframe/Instance", ' +
      '"http://id.loc.gov/ontologies/bibframe/carrier": {"@id": "http://id.loc.gov/vocabulary/carriers/nc"}, ' +
      '"http://id.loc.gov/ontologies/bibframe/issuance": {"@id": "http://id.loc.gov/vocabulary/issuance/mono"}}, ' +
      '{"@id": "http://id.loc.gov/vocabulary/issuance/mono", "@type": "http://id.loc.gov/ontologies/bibframe/issuance", "rdfs:label": "single unit"}, ' +
      '{"@id": "http://id.loc.gov/vocabulary/carriers/nc", "@type": "http://id.loc.gov/ontologies/bibframe/carrier", "rdfs:label": "volume"}]}'
    expect(receivedGraph).toEqual(JSON.parse(expectedJsonld))
  })

  it('should clear out the graph', () => {
    clearTestGraph()
  })

  it('should generate linked rdf for forms with literals, lookups, and modals', () => {
    const action = {type: "GENERATE_LD",
      payload: {
        literals:{ formData: [
          {
            "id":"http://id.loc.gov/ontologies/bibframe/responsibilityStatement",
            "rtId":"resourceTemplate:bf2:Monograph:Instance",
            "items":[
              {"content":"STATEMENT","id":0,"bnode":{"termType":"BlankNode","value":"n3-7"}}
            ]
          },
          {
            "id":"http://id.loc.gov/ontologies/bibframe/heldBy",
            "rtId":"resourceTemplate:bf2:Monograph:Instance",
            "items":[
              {"content":"STF","id":0,"bnode":{"termType":"BlankNode","value":"n3-10"}}
            ]
          },
          {
            "id":"http://www.w3.org/2000/01/rdf-schema#label",
            "rtId":"resourceTemplate:bf2:Note",
            "items":[
              {
                "content": "NOTE",
                "id": 0,
                "type": "http://id.loc.gov/ontologies/bibframe/note",
                "bnode": { "termType":"BlankNode","value":"n3-14" },
                "propPredicate": "http://id.loc.gov/ontologies/bibframe/note"
              }
            ]
          }
        ]},
        lookups:{ formData: [
          {
            "id":"http://id.loc.gov/ontologies/bibframe/issuance",
            "items":[
              {
                "id":"http://id.loc.gov/vocabulary/issuance/mono",
                "uri":"http://id.loc.gov/vocabulary/issuance/mono",
                "label":"single unit"
              }
            ],
            "rtId":"resourceTemplate:bf2:Monograph:Instance"
          },
          {
            "id":"http://id.loc.gov/ontologies/bibframe/carrier",
            "items":[
              {
                "id":"http://id.loc.gov/vocabulary/carriers/nc",
                "uri":"http://id.loc.gov/vocabulary/carriers/nc",
                "label":"volume"
              }
            ],
            "rtId":"resourceTemplate:bf2:Monograph:Instance"
          }
        ]},
        rtId: "resourceTemplate:bf2:Monograph:Instance",
        resourceURI: "http://id.loc.gov/ontologies/bibframe/Instance",
        linkedNode: {"termType":"BlankNode","value":"n3-0"}
      }
    }
    const receivedGraph = generateLD(null, action)['jsonld']
    const expectedJsonld = context +
      '"@graph": [' +
      '{"@id": "_:n3-0", ' +
      '"@type": "http://id.loc.gov/ontologies/bibframe/Instance", ' +
      '"http://id.loc.gov/ontologies/bibframe/carrier": {"@id": "http://id.loc.gov/vocabulary/carriers/nc"}, ' +
      '"http://id.loc.gov/ontologies/bibframe/heldBy": "STF", ' +
      '"http://id.loc.gov/ontologies/bibframe/issuance": {"@id": "http://id.loc.gov/vocabulary/issuance/mono"}, ' +
      '"http://id.loc.gov/ontologies/bibframe/note": {"@id": "_:n3-14"}, ' +
      '"http://id.loc.gov/ontologies/bibframe/responsibilityStatement": "STATEMENT"}, ' +
      '{"@id": "http://id.loc.gov/vocabulary/issuance/mono", "@type": "http://id.loc.gov/ontologies/bibframe/issuance", "rdfs:label": "single unit"}, ' +
      '{"@id": "http://id.loc.gov/vocabulary/carriers/nc", "@type": "http://id.loc.gov/ontologies/bibframe/carrier", "rdfs:label": "volume"}, ' +
      '{"@id": "_:n3-14", "@type": "http://id.loc.gov/ontologies/bibframe/Note", "http://www.w3.org/2000/01/rdf-schema#label": "NOTE"}]}'
    expect(receivedGraph).toEqual(JSON.parse(expectedJsonld))
  })

  it('should clear out the graph', () => {
    clearTestGraph()
  })

  it('should generate an array of literals when there are repeatable values', () => {
    const action = {type: "GENERATE_LD",
      payload: {
        literals:{ formData: [
          {
            "id":"http://id.loc.gov/ontologies/bibframe/responsibilityStatement",
            "rtId":"resourceTemplate:bf2:Monograph:Instance",
            "items":[
              {"content":"STMT1","id":0,"bnode":{"termType":"BlankNode","value":"n3-3"}},
              {"content":"STMT2","id":1,"bnode":{"termType":"BlankNode","value":"n3-5"}},
              {"content":"STMT3","id":2,"bnode":{"termType":"BlankNode","value":"n3-7"}}
            ]
          },
          {
            "id":"http://id.loc.gov/ontologies/bibframe/heldBy",
            "rtId":"resourceTemplate:bf2:Monograph:Instance",
            "items":[
              {
                "content": "STF",
                "id": 0,
                "bnode": { "termType":"BlankNode", "value":"n3-10" }
              }
            ]
          },
          {
            "id":"http://www.w3.org/2000/01/rdf-schema#label",
            "rtId":"resourceTemplate:bf2:Note",
            "items":[
              {
                "content": "NOTE",
                "id": 0,
                "type": "http://id.loc.gov/ontologies/bibframe/note",
                "bnode": { "termType":"BlankNode","value":"n3-14" },
                "propPredicate": "http://id.loc.gov/ontologies/bibframe/note"
              }
            ]
          }
        ]},
        lookups:{ formData: [
          {
            "id":"http://id.loc.gov/ontologies/bibframe/issuance",
            "items":[
              {
                "id":"http://id.loc.gov/vocabulary/issuance/mono",
                "uri":"http://id.loc.gov/vocabulary/issuance/mono",
                "label":"single unit"
              }
            ],
            "rtId":"resourceTemplate:bf2:Monograph:Instance"
          },
          {
            "id":"http://id.loc.gov/ontologies/bibframe/carrier",
            "items":[
              {
                "id":"http://id.loc.gov/vocabulary/carriers/nc",
                "uri":"http://id.loc.gov/vocabulary/carriers/nc",
                "label":"volume"
              }
            ],
            "rtId":"resourceTemplate:bf2:Monograph:Instance"
          }
        ]},
        rtId: "resourceTemplate:bf2:Monograph:Instance",
        resourceURI: "http://id.loc.gov/ontologies/bibframe/Instance",
        linkedNode: {"termType":"BlankNode","value":"n3-0"}
      }
    }
    const receivedGraph = generateLD(null, action)['jsonld']
    const expectedJsonld = context +
      '"@graph": [' +
      '{"@id": "_:n3-0", ' +
      '"@type": "http://id.loc.gov/ontologies/bibframe/Instance", ' +
      '"http://id.loc.gov/ontologies/bibframe/carrier": {"@id": "http://id.loc.gov/vocabulary/carriers/nc"}, ' +
      '"http://id.loc.gov/ontologies/bibframe/heldBy": "STF", ' +
      '"http://id.loc.gov/ontologies/bibframe/issuance": {"@id": "http://id.loc.gov/vocabulary/issuance/mono"}, ' +
      '"http://id.loc.gov/ontologies/bibframe/note": {"@id": "_:n3-14"}, ' +
      '"http://id.loc.gov/ontologies/bibframe/responsibilityStatement": [' +
      '   "STMT1", ' +
      '   "STMT2", ' +
      '   "STMT3"' +
      ']}, ' +
      '{"@id": "http://id.loc.gov/vocabulary/issuance/mono", "@type": "http://id.loc.gov/ontologies/bibframe/issuance", "rdfs:label": "single unit"}, ' +
      '{"@id": "http://id.loc.gov/vocabulary/carriers/nc", "@type": "http://id.loc.gov/ontologies/bibframe/carrier", "rdfs:label": "volume"}, ' +
      '{"@id": "_:n3-14", "@type": "http://id.loc.gov/ontologies/bibframe/Note", "http://www.w3.org/2000/01/rdf-schema#label": "NOTE"}]}'
    expect(receivedGraph).toEqual(JSON.parse(expectedJsonld))
  })

  function clearTestGraph(){
    const action = { type: 'REMOVE_ALL'}
    const emptyGraph = generateLD(null, action)['jsonld']
    const jsonld = context +
      '"@graph": []}'
    expect(emptyGraph).toEqual(JSON.parse(jsonld))
  }
})

