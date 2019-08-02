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

    shortid.generate = jest.fn().mockReturnValueOnce('abc123').mockReturnValueOnce('def456').mockReturnValueOnce('ghi789')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const resourceState = builder.state
    expect(resourceState).toEqual({
      'resourceTemplate:bf2:Note': {
        'http://www.w3.org/2000/01/rdf-schema#label': {
          items: {
            abc123: {
              content: 'foo',
              label: 'foo',
              lang: 'en',
            },
            def456: {
              content: 'bar',
              label: 'bar',
              lang: 'en',
            },
          },
        },
      },
    })
  })

  it('builds the state for URI resource properties', async () => {
    const resource = `<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
  <http://example/123> <http://www.w3.org/ns/prov#wasGeneratedBy> "resourceTemplate:bf2:Note" .
  <http://example/123> <http://rdaregistry.info/Elements/i/P40021> <http://id.loc.gov/vocabulary/organizations/wauar> .`

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValueOnce('abc123').mockReturnValueOnce('def456').mockReturnValueOnce('ghi789')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const resourceState = builder.state

    expect(resourceState).toEqual({
      'resourceTemplate:bf2:Note': {
        'http://rdaregistry.info/Elements/i/P40021': {
          items: {
            abc123: {
              uri: 'http://id.loc.gov/vocabulary/organizations/wauar',
              label: 'http://id.loc.gov/vocabulary/organizations/wauar',
            },
          },
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

    shortid.generate = jest.fn().mockReturnValueOnce('abc123').mockReturnValueOnce('def456')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const resourceState = builder.state

    expect(resourceState).toEqual({
      'resourceTemplate:bf2:Note': {
        'http://id.loc.gov/ontologies/bibframe/note': {
          abc123: {
            'resourceTemplate:bf2:Note': {
              'http://www.w3.org/2000/01/rdf-schema#label': {
                items: {
                  def456: {
                    content: 'foobar',
                    label: 'foobar',
                    lang: 'en',
                  },
                },
              },
            },
          },
        },
      },
    })
  })
})

it('handles null root nodes', async () => {
  const resource = `_:B01cf1817X2Dd2e4X2D485bX2Dbd9aX2Df72c02976ec02895d12a7118e91a94f5a4808a49140a <http://www.w3.org/2000/01/rdf-schema#label> "foo note"@en .
_:B01cf1817X2Dd2e4X2D485bX2Dbd9aX2Df72c02976ec02895d12a7118e91a94f5a4808a49140a <http://www.w3.org/ns/prov#wasGeneratedBy> "sinopia:resourceTemplate:bf2:Identifiers:Note" .
_:B01cf1817X2Dd2e4X2D485bX2Dbd9aX2Df72c02976ec02895d12a7118e91a94f5a4808a49140a <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
<> <http://id.loc.gov/ontologies/bibframe/note> _:B01cf1817X2Dd2e4X2D485bX2Dbd9aX2Df72c02976ec02895d12a7118e91a94f5a4808a49140a .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> "foo"@en .
<> <http://www.w3.org/ns/prov#wasGeneratedBy> "sinopia:resourceTemplate:bf2:Identifiers:ISMN" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Ismn> .`

  const dataset = await rdfDatasetFromN3(resource)

  shortid.generate = jest.fn().mockReturnValueOnce('abc123').mockReturnValueOnce('def456').mockReturnValueOnce('ghi789')

  const builder = new ResourceStateBuilder(dataset, null)
  const resourceState = builder.state

  expect(Object.keys(resourceState)[0]).toEqual('sinopia:resourceTemplate:bf2:Identifiers:ISMN')

  expect(resourceState).toEqual({
    'sinopia:resourceTemplate:bf2:Identifiers:ISMN': {
      'http://id.loc.gov/ontologies/bibframe/note': {
        abc123: {
          'sinopia:resourceTemplate:bf2:Identifiers:Note': {
            'http://www.w3.org/2000/01/rdf-schema#label': {
              items: {
                def456: {
                  content: 'foo note',
                  label: 'foo note',
                  lang: 'en',
                },
              },
            },
          },
        },
      },
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
        items: {
          ghi789: {
            content: 'foo',
            label: 'foo',
            lang: 'en',
          },
        },
      },
    },
  })
})
