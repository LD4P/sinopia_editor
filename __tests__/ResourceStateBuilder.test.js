// Copyright 2019 Stanford University see LICENSE for license

import ResourceStateBuilder from 'ResourceStateBuilder'
import shortid from 'shortid'
import { rdfDatasetFromN3 } from 'Utilities'

describe('ResourceStateBuilder', () => {
  it('builds the state for literal properties', async () => {
    const resource = `<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
  <http://example/123> <http://www.w3.org/ns/prov#wasGeneratedBy> "resourceTemplate:bf2:Note" .
  <http://example/123> <http://www.w3.org/2000/01/rdf-schema#label> "foo"@en .
  <http://example/123> <http://www.w3.org/2000/01/rdf-schema#label> "bar"@en .`

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValue('abc123')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const resourceState = builder.state
    expect(resourceState).toEqual({
      'resourceTemplate:bf2:Note': {
        'http://www.w3.org/2000/01/rdf-schema#label': {
          items: [
            {
              id: 'abc123',
              content: 'foo',
              lang: {
                items: [
                  {
                    id: 'en',
                  },
                ],
              },
            },
            {
              id: 'abc123',
              content: 'bar',
              lang: {
                items: [
                  {
                    id: 'en',
                  },
                ],
              },
            },
          ],
        },
      },
    })
  })

  it('builds the state for URI resource properties', async () => {
    const resource = `<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
  <http://example/123> <http://www.w3.org/ns/prov#wasGeneratedBy> "resourceTemplate:bf2:Note" .
  <http://example/123> <http://rdaregistry.info/Elements/i/P40021> <http://id.loc.gov/vocabulary/organizations/wauar> .`

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValue('abc123')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const resourceState = builder.state

    expect(resourceState).toEqual({
      'resourceTemplate:bf2:Note': {
        'http://rdaregistry.info/Elements/i/P40021': {
          items: [
            {
              id: 'abc123',
              uri: 'http://id.loc.gov/vocabulary/organizations/wauar',
            },
          ],
        },
      },
    })
  })

  it('builds the state for embedded resource property', async () => {
    const resource = `<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
  <http://example/123> <http://www.w3.org/ns/prov#wasGeneratedBy> "resourceTemplate:bf2:Note" .
  <http://example/123> <http://id.loc.gov/ontologies/bibframe/note> _:b1 .
  _:b1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
  _:b1 <http://www.w3.org/ns/prov#wasGeneratedBy> "resourceTemplate:bf2:Note" .
  _:b1 <http://www.w3.org/2000/01/rdf-schema#label> "foobar"@en .`

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValue('abc123')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const resourceState = builder.state

    expect(resourceState).toEqual({
      'resourceTemplate:bf2:Note': {
        'http://id.loc.gov/ontologies/bibframe/note': {
          abc123: {
            'resourceTemplate:bf2:Note': {
              'http://www.w3.org/2000/01/rdf-schema#label': {
                items: [
                  {
                    id: 'abc123',
                    content: 'foobar',
                    lang: {
                      items: [
                        {
                          id: 'en',
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    })
  })
})
