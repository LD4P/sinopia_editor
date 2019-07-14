// Copyright 2019 Stanford University see LICENSE for license

import GraphBuilder from '../src/GraphBuilder'

const rdf = require('rdf-ext')

describe('GraphBuilder', () => {
  describe('when the state does not have a resourceURI', () => {
    const state = {
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Work': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
          },
          'resourceTemplate:bf2:Note': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
          },
        },
      },
      resource: {
        'resourceTemplate:bf2:Monograph:Work': {
          'http://id.loc.gov/ontologies/bibframe/title': {},
          'http://id.loc.gov/ontologies/bibframe/temporalCoverage': {},
          'http://id.loc.gov/ontologies/bibframe/note': {},
          'http://id.loc.gov/ontologies/bibframe/content': {
            items: [
              {
                id: 'http://id.loc.gov/vocabulary/contentTypes/txt',
                label: 'text',
                uri: 'http://id.loc.gov/vocabulary/contentTypes/txt',
              },
            ],
          },
          'http://id.loc.gov/ontologies/bibframe/illustrativeContent': {
            items: [
              {
                id: '2_RmnVrDkk9',
                label: 'Genealogical tables',
                uri: 'http://id.loc.gov/vocabulary/millus/gnt',
              },
            ],
          },
          'http://id.loc.gov/ontologies/bibframe/colorContent': {
            '-KACHlqQ4A': {
              'resourceTemplate:bf2:Note': {
                'http://www.w3.org/2000/01/rdf-schema#label': {
                  items: [
                    {
                      content: 'Very colorful',
                      id: '3TzRpgv65',
                      lang: {
                        items: [{
                          id: 'en',
                          label: 'English',
                        }],
                      },
                    },
                    {
                      content: 'Sparkly',
                      id: '5TzRpgv72',
                    },
                  ],
                },
              },
            },
            gdndfCHlqQ4z: {
              'resourceTemplate:bf2:Note': {
                'http://www.w3.org/2000/01/rdf-schema#label': {
                  items: [
                    {
                      content: 'Shiney',
                      id: '4dzRpgv42',
                    },
                  ],
                },
              },
            },
          },
          'http://id.loc.gov/ontologies/bibframe/hasInstance': {},
          'http://www.w3.org/2000/01/rdf-schema#label': {},
        },
      },
    }

    const builder = new GraphBuilder(state)


    it('returns the graph', () => {
      const graph = builder.graph

      const typeTriple = rdf.quad(rdf.namedNode(''),
        rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        rdf.namedNode('http://id.loc.gov/ontologies/bibframe/Work'))

      expect(graph.has(typeTriple)).toBeTruthy()

      const propertyTriple = rdf.quad(rdf.namedNode(''),
        rdf.namedNode('http://id.loc.gov/ontologies/bibframe/illustrativeContent'),
        rdf.namedNode('http://id.loc.gov/vocabulary/millus/gnt'))

      expect(graph.has(propertyTriple)).toBeTruthy()

      // An triple with a lang tag
      const result1 = graph.filter(quad => quad.object.equals(rdf.literal('Very colorful', 'en'))).toArray()
      // An triple without a lang tag
      const result2 = graph.filter(quad => quad.object.equals(rdf.literal('Sparkly'))).toArray()
      // A triple on a separate resource (bf:Note)
      const result3 = graph.filter(quad => quad.object.equals(rdf.literal('Shiney'))).toArray()

      expect(result1.length).toEqual(1)
      expect(result2.length).toEqual(1)
      expect(result3.length).toEqual(1)

      // Literals from the same note share blank node.
      expect(result1[0].subject).toEqual(result2[0].subject)

      // Literals from different notes have different blank node.
      expect(result1[0].subject).not.toEqual(result3[0].subject)
    })
  })

  describe('when the state has a resourceURI', () => {
    const state = {
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Work': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
          },
          'resourceTemplate:bf2:Note': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
          },
        },
      },
      resource: {
        'resourceTemplate:bf2:Monograph:Work': {
          resourceURI: 'http://example.com/base/123',
          'http://id.loc.gov/ontologies/bibframe/title': {},
          'http://id.loc.gov/ontologies/bibframe/temporalCoverage': {},
          'http://id.loc.gov/ontologies/bibframe/note': {},
          'http://id.loc.gov/ontologies/bibframe/content': {
            items: [
              {
                id: 'http://id.loc.gov/vocabulary/contentTypes/txt',
                label: 'text',
                uri: 'http://id.loc.gov/vocabulary/contentTypes/txt',
              },
            ],
          },
          'http://id.loc.gov/ontologies/bibframe/illustrativeContent': {
            items: [
              {
                id: '2_RmnVrDkk9',
                label: 'Genealogical tables',
                uri: 'http://id.loc.gov/vocabulary/millus/gnt',
              },
            ],
          },
          'http://id.loc.gov/ontologies/bibframe/colorContent': {
            '-KACHlqQ4A': {
              'resourceTemplate:bf2:Note': {
                'http://www.w3.org/2000/01/rdf-schema#label': {
                  items: [
                    {
                      content: 'Very colorful',
                      id: '3TzRpgv65',
                    },
                    {
                      content: 'Sparkly',
                      id: '3TzRpgv65',
                    },
                  ],
                },
              },
            },
          },
          'http://id.loc.gov/ontologies/bibframe/hasInstance': {},
          'http://www.w3.org/2000/01/rdf-schema#label': {},
        },
      },
    }

    const builder = new GraphBuilder(state)


    it('returns the graph', () => {
      const graph = builder.graph
      const typeTriple = rdf.quad(rdf.namedNode('http://example.com/base/123'),
        rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        rdf.namedNode('http://id.loc.gov/ontologies/bibframe/Work'))
      const propertyTriple = rdf.quad(rdf.namedNode('http://example.com/base/123'),
        rdf.namedNode('http://id.loc.gov/ontologies/bibframe/illustrativeContent'),
        rdf.namedNode('http://id.loc.gov/vocabulary/millus/gnt'))
      const generatedByTriple = rdf.quad(rdf.namedNode('http://example.com/base/123'),
        rdf.namedNode('http://www.w3.org/ns/prov#wasGeneratedBy'),
        rdf.literal('resourceTemplate:bf2:Monograph:Work'))

      expect(graph.has(typeTriple)).toBeTruthy()
      expect(graph.has(propertyTriple)).toBeTruthy()
      expect(graph.has(generatedByTriple)).toBeTruthy()

      let result = graph.filter(quad => quad.object.equals(rdf.literal('Very colorful')))

      expect(result.toArray().length).toEqual(1)

      result = graph.filter(quad => quad.object.equals(rdf.literal('Sparkly')))
      expect(result.toArray().length).toEqual(1)

      // _:b1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
      result = graph.filter(quad => quad.object.equals(rdf.namedNode('http://id.loc.gov/ontologies/bibframe/Note'))
        && quad.predicate.equals(rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')))
      expect(result.toArray().length).toEqual(1)

      const bnode = result.toArray()[0].subject

      // _:b1 <http://www.w3.org/ns/prov#wasGeneratedBy> "resourceTemplate:bf2:Note" .
      result = graph.filter(quad => quad.subject.equals(bnode)
        && quad.object.equals(rdf.literal('resourceTemplate:bf2:Note'))
        && quad.predicate.equals(rdf.namedNode('http://www.w3.org/ns/prov#wasGeneratedBy')))
      expect(result.toArray().length).toEqual(1)
    })
  })

  describe('when the state has errors', () => {
    const state = {
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Work': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
          },
        },
      },
      resource: {
        'resourceTemplate:bf2:Monograph:Work': {
          resourceURI: 'http://example.com/base/123',
          'http://id.loc.gov/ontologies/bibframe/title': {
            errors: [{ label: 'Required' }],
          },
        },
      },
    }

    const builder = new GraphBuilder(state)


    it('returns the graph and ignores the errors', () => {
      const graph = builder.graph

      const typeTriple = rdf.quad(rdf.namedNode('http://example.com/base/123'),
        rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        rdf.namedNode('http://id.loc.gov/ontologies/bibframe/Work'))

      expect(graph.has(typeTriple)).toBeTruthy()
    })
  })

  describe('when the state has empty items', () => {
    const state = {
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Work': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
          },
          'resourceTemplate:bf2:Note': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
          },
        },
      },
      resource: {
        'resourceTemplate:bf2:Monograph:Work': {
          'http://id.loc.gov/ontologies/bibframe/title': {},
          'http://id.loc.gov/ontologies/bibframe/temporalCoverage': {},
          'http://id.loc.gov/ontologies/bibframe/note': {},
          'http://id.loc.gov/ontologies/bibframe/content': {},
          'http://id.loc.gov/ontologies/bibframe/illustrativeContent': {},
          'http://id.loc.gov/ontologies/bibframe/colorContent': {
            '-KACHlqQ4A': {
              'resourceTemplate:bf2:Note': {
                'http://www.w3.org/2000/01/rdf-schema#label': {
                  items: [],
                },
              },
            },
          },
          'http://id.loc.gov/ontologies/bibframe/hasInstance': {},
          'http://www.w3.org/2000/01/rdf-schema#label': {},
        },
      },
    }

    const builder = new GraphBuilder(state)


    it('returns the graph without blank node', () => {
      const graph = builder.graph

      const result = graph.filter(quad => quad.object.equals(rdf.namedNode('http://id.loc.gov/ontologies/bibframe/Note'))).toArray()
      expect(result.length).toEqual(0)
    })
  })
})
