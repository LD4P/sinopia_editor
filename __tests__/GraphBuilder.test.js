import GraphBuilder from 'GraphBuilder'

describe('GraphBuilder', () => {
  describe('graph()', () => {
    it('builds a graph for literals', () => {
      const resource = {
        subjectTemplate: {
          id: 'resourceTemplate:testing:uber1',
          class: 'http://id.loc.gov/ontologies/bibframe/Uber1',
        },
        properties: [
          {
            propertyTemplate: {
              uri: 'http://id.loc.gov/ontologies/bibframe/uber/template1/property2',
            },
            values: [
              // With lang
              {
                literal: 'literal1',
                lang: 'eng',
                uri: null,
                // Value references its property.
                property: {
                  propertyTemplate: {
                    type: 'literal',
                  },
                },
              },
              // Without lang
              {
                literal: 'literal2',
                uri: null,
                property: {
                  propertyTemplate: {
                    type: 'literal',
                  },
                },
              },
            ],
          },
        ],
      }

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property2> "literal1"@eng .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property2> "literal2" .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it('builds a graph for uris', () => {
      const resource = {
        subjectTemplate: {
          id: 'resourceTemplate:testing:uber1',
          class: 'http://id.loc.gov/ontologies/bibframe/Uber1',
        },
        properties: [
          {
            propertyTemplate: {
              uri: 'http://id.loc.gov/ontologies/bibframe/uber/template1/property8',
            },
            values: [
              // With label
              {
                uri: 'http://sinopia.io/uri1',
                label: 'URI1',
                // Value references its property.
                property: {
                  propertyTemplate: {
                    type: 'uri',
                  },
                },
              },
              // Without label
              {
                uri: 'http://sinopia.io/uri2',
                label: null,
                property: {
                  propertyTemplate: {
                    type: 'uri',
                  },
                },
              },
            ],
          },
        ],
      }

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property8> <http://sinopia.io/uri1> .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property8> <http://sinopia.io/uri2> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<http://sinopia.io/uri1> <http://www.w3.org/2000/01/rdf-schema#label> "URI1" .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it('builds a graph for nested resources', () => {
      const resource = {
        subjectTemplate: {
          id: 'resourceTemplate:testing:uber1',
          class: 'http://id.loc.gov/ontologies/bibframe/Uber1',
        },
        properties: [
          {
            propertyTemplate: {
              uri: 'http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
            },
            values: [
              {
                uri: null,
                property: {
                  propertyTemplate: {
                    type: 'resource',
                  },
                },
                valueSubject: {
                  subjectTemplate: {
                    class: 'http://id.loc.gov/ontologies/bibframe/Uber2',
                  },
                  properties: [
                    {
                      propertyTemplate: {
                        uri: 'http://id.loc.gov/ontologies/bibframe/uber/template2/property1',
                      },
                      values: [
                        {
                          literal: 'literal3',
                          lang: 'eng',
                          uri: null,
                          property: {
                            propertyTemplate: {
                              type: 'literal',
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      }
      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:c14n0 .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "literal3"@eng .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it('builds a graph ignoring null values', () => {
      const resource = {
        subjectTemplate: {
          id: 'resourceTemplate:testing:uber1',
          class: 'http://id.loc.gov/ontologies/bibframe/Uber1',
        },
        properties: [
          {
            values: null,
          },
        ],
      }
      const rdf = `<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it('builds a graph ignoring empty nested resources', () => {
      const resource = {
        subjectTemplate: {
          id: 'resourceTemplate:testing:uber1',
          class: 'http://id.loc.gov/ontologies/bibframe/Uber1',
        },
        properties: [
          {
            propertyTemplate: {
              uri: 'http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
            },
            values: [
              {
                uri: null,
                property: {
                  propertyTemplate: {
                    type: 'resource',
                  },
                },
                valueSubject: {
                  subjectTemplate: {
                    class: 'http://id.loc.gov/ontologies/bibframe/Uber2',
                  },
                  properties: [
                    {
                      propertyTemplate: {
                        uri: 'http://id.loc.gov/ontologies/bibframe/uber/template2/property1',
                      },
                      values: [],
                    },
                  ],
                },
              },
            ],
          },
        ],
      }
      const rdf = `<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })
  })
})
