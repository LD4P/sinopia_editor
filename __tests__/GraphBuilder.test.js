// Copyright 2019 Stanford University see LICENSE for license

import GraphBuilder from '../src/GraphBuilder'

const rdf = require('rdf-ext')

describe('GraphBuilder', () => {
  const state = {
    'resourceTemplate:bf2:Monograph:Work': {
      rdfClass: 'http://id.loc.gov/ontologies/bibframe/Work',
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
            '67Bm64T0p2s': {
              'http://www.w3.org/2000/01/rdf-schema#label': {
                items: [
                  {
                    content: 'Very colorful',
                    id: '3TzRpgv65',
                  },
                ],
              },
            },
            '88Bm64T0p2s': {
              'http://www.w3.org/2000/01/rdf-schema#label': {
                items: [
                  {
                    content: 'Sparkly',
                    id: '3TzRpgv65',
                  },
                ],
              },
            },
          },
        },
      },
      'http://id.loc.gov/ontologies/bibframe/hasInstance': {},
      'http://www.w3.org/2000/01/rdf-schema#label': {},
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

    let result = graph.filter(quad => quad.object.equals(rdf.literal('Very colorful')))

    expect(result.toArray().length).toEqual(1)

    result = graph.filter(quad => quad.object.equals(rdf.literal('Sparkly')))
    expect(result.toArray().length).toEqual(1)
  })
})
