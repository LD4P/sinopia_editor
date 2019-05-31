// Copyright 2019 Stanford University see LICENSE for license

import GraphBuilder from '../src/GraphBuilder'

const rdf = require('rdf-ext')

describe('GraphBuilder', () => {
  const state = {
    'rt:rda:work:monograph': {
      'http://id.loc.gov/ontologies/bibframe/adminMetadata': {
        WkIyKrneI: {
          'rt:bf2:AdminMetadata': {
            '8dB06xFbpU': {
              'rt:bf2:AdminMetadata:Status': {
                'http://id.loc.gov/ontologies/bibframe/code': {
                  items: [
                    {
                      id: 'tIHStJ7DPW',
                      content: 'n',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  }

  const builder = new GraphBuilder(state)


  it('returns the graph', () => {
    const typeTriple = rdf.quad(rdf.namedNode(''),
      rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
      rdf.literal('rt:rda:work:monograph'))

    expect(builder.graph.has(typeTriple)).toBeTruthy()
  })
})
