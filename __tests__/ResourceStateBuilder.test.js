// Copyright 2019 Stanford University see LICENSE for license

import ResourceStateBuilder from 'ResourceStateBuilder'
import shortid from 'shortid'
import * as sinopiaServer from 'sinopiaServer'
import * as resourceTemplateValidator from 'ResourceTemplateValidator'
import { rdfDatasetFromN3 } from 'Utilities'
import { getFixtureResourceTemplate, resourceTemplateIds } from './fixtureLoaderHelper'

jest.mock('sinopiaServer')

describe('ResourceStateBuilder', () => {
  beforeEach(() => {
    sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
    sinopiaServer.foundResourceTemplate.mockImplementation((templateId) => resourceTemplateIds.includes(templateId))
  })

  it('builds the state for literal properties', async () => {
    const resource = `<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
  <http://example/123> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Note" .
  <http://example/123> <http://www.w3.org/2000/01/rdf-schema#label> "foo"@eng .
  <http://example/123> <http://www.w3.org/2000/01/rdf-schema#label> "bar"@eng .`

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValueOnce('abc123').mockReturnValueOnce('def456').mockReturnValueOnce('ghi789')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const [state, unusedDataset, resourceTemplates] = await builder.buildState()
    expect(state).toEqual({
      'resourceTemplate:bf2:Note': {
        'http://www.w3.org/2000/01/rdf-schema#label': {
          items: {
            abc123: {
              content: 'foo',
              label: 'foo',
              lang: 'eng',
            },
            def456: {
              content: 'bar',
              label: 'bar',
              lang: 'eng',
            },
          },
        },
      },
    })
    expect(unusedDataset.toArray()).toEqual([])
    const noteResourceTemplateResponse = await getFixtureResourceTemplate('resourceTemplate:bf2:Note')
    const noteResourceTemplate = noteResourceTemplateResponse.response.body
    expect(resourceTemplates).toEqual({
      'resourceTemplate:bf2:Note': noteResourceTemplate,
    })
  })

  it('builds the state when null root node', async () => {
    const resource = `<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
  <> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Note" .
  <> <http://www.w3.org/2000/01/rdf-schema#label> "foo"@eng .`

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValueOnce('abc123')

    const builder = new ResourceStateBuilder(dataset, '')
    const [state] = await builder.buildState()
    expect(state).toEqual({
      'resourceTemplate:bf2:Note': {
        'http://www.w3.org/2000/01/rdf-schema#label': {
          items: {
            abc123: {
              content: 'foo',
              label: 'foo',
              lang: 'eng',
            },
          },
        },
      },
    })
  })

  it('uses provided resource template id', async () => {
    const resource = `<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
  <> <http://www.w3.org/2000/01/rdf-schema#label> "foo"@eng .`

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValueOnce('abc123')

    const builder = new ResourceStateBuilder(dataset, '', 'resourceTemplate:bf2:Note')
    const [state] = await builder.buildState()
    expect(state).toEqual({
      'resourceTemplate:bf2:Note': {
        'http://www.w3.org/2000/01/rdf-schema#label': {
          items: {
            abc123: {
              content: 'foo',
              label: 'foo',
              lang: 'eng',
            },
          },
        },
      },
    })
  })

  it('raises when 0 resource templates', async () => {
    const resource = `<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
  <http://example/123> <http://www.w3.org/2000/01/rdf-schema#label> "bar"@eng .`

    const dataset = await rdfDatasetFromN3(resource)

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    await expect(builder.buildState()).rejects.toMatch(/A single resource template must be included/)
  })

  it('raises when more than 1 resource templates', async () => {
    const resource = `<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
    <http://example/123> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Note" .
    <http://example/123> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Note2" .
    <http://example/123> <http://www.w3.org/2000/01/rdf-schema#label> "bar"@eng .`

    const dataset = await rdfDatasetFromN3(resource)

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    await expect(builder.buildState()).rejects.toMatch(/A single resource template must be included/)
  })

  it('raises when error loading resource templates', async () => {
    const resource = `<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
    <http://example/123> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Note" .
    <http://example/123> <http://www.w3.org/2000/01/rdf-schema#label> "bar"@eng .`

    sinopiaServer.getResourceTemplate.mockRejectedValue(new Error('404'))

    const dataset = await rdfDatasetFromN3(resource)

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')

    await expect(builder.buildState()).rejects.toHaveProperty('message', 'Unable to load resourceTemplate:bf2:Note: Error: 404')
  })

  it('raises when error when resource template validation errors', async () => {
    const resource = `<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
    <http://example/123> <http://sinopia.io/vocabulary/hasResourceTemplate> "rt:repeated:propertyURI:propertyLabel" .
    <http://example/123> <http://www.w3.org/2000/01/rdf-schema#label> "bar"@eng .`

    const dataset = await rdfDatasetFromN3(resource)

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    await expect(builder.buildState()).rejects.toHaveProperty('message', 'Error validating rt:repeated:propertyURI:propertyLabel: Validation error for http://id.loc.gov/ontologies/bibframe/Work: Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.')
    await expect(builder.buildState()).rejects.toHaveProperty('validationErrors', ['Validation error for http://id.loc.gov/ontologies/bibframe/Work: Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.'])
  })

  it('builds the state for URI resource properties', async () => {
    const resource = `<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Work> .
  <http://example/123> <http://sinopia.io/vocabulary/hasResourceTemplate> "test:RT:genreform" .
  <http://example/123> <http://id.loc.gov/ontologies/bibframe/genreForm> <http://id.loc.gov/authorities/genreForms/gf2014026879> .`

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValueOnce('abc123').mockReturnValueOnce('def456').mockReturnValueOnce('ghi789')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const [state] = await builder.buildState()

    expect(state).toEqual({
      'test:RT:genreform': {
        'http://id.loc.gov/ontologies/bibframe/genreForm': {
          items: {
            abc123: {
              uri: 'http://id.loc.gov/authorities/genreForms/gf2014026879',
              label: 'http://id.loc.gov/authorities/genreForms/gf2014026879',
            },
          },
        },
      },
    })
  })

  // See https://github.com/LD4P/sinopia_editor/issues/1516
  it('builds the state for URI resource properties with extra triples', async () => {
    const resource = `<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Work> .
  <http://example/123> <http://sinopia.io/vocabulary/hasResourceTemplate> "test:RT:genreform" .
  <http://example/123> <http://id.loc.gov/ontologies/bibframe/genreForm> <http://id.loc.gov/authorities/genreForms/gf2014026879> .
  <http://id.loc.gov/authorities/genreForms/gf2014026879> <http://www.w3.org/2000/01/rdf-schema#label> "Jazz"@eng .
  <https://example/1234> <http://schema.org/name> "Jazz Genre"@eng .`

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValueOnce('abc123').mockReturnValueOnce('def456').mockReturnValueOnce('ghi789')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const [state, unusedDataset] = await builder.buildState()

    expect(state).toEqual({
      'test:RT:genreform': {
        'http://id.loc.gov/ontologies/bibframe/genreForm': {
          items: {
            abc123: {
              uri: 'http://id.loc.gov/authorities/genreForms/gf2014026879',
              label: 'Jazz',
            },
          },
        },
      },
    })

    const unmatched = `<https://example/1234> <http://schema.org/name> "Jazz Genre"@eng .
`
    expect(unusedDataset.toCanonical()).toEqual(unmatched)
  })

  it('builds the state for embedded resource property', async () => {
    const resource = `<http://example/123> <http://id.loc.gov/ontologies/bibframe/carrier> <http://id.loc.gov/vocabulary/carriers/nc> .
<http://example/123> <http://id.loc.gov/ontologies/bibframe/heldBy> "DLC"@eng .
<http://example/123> <http://id.loc.gov/ontologies/bibframe/instanceOf> _:c14n0 .
<http://example/123> <http://id.loc.gov/ontologies/bibframe/issuance> <http://id.loc.gov/vocabulary/issuance/mono> .
<http://example/123> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Monograph:Instance" .
<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Instance> .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/content> <http://id.loc.gov/vocabulary/contentTypes/txt> .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/title> _:c14n1 .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Work> .
_:c14n1 <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@eng .
_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .`

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValueOnce('abc123')
      .mockReturnValueOnce('abc124')
      .mockReturnValueOnce('abc125')
      .mockReturnValueOnce('abc126')
      .mockReturnValueOnce('abc127')
      .mockReturnValueOnce('abc128')
      .mockReturnValueOnce('abc129')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const [state, , resourceTemplates] = await builder.buildState()

    expect(state).toEqual({
      'resourceTemplate:bf2:Monograph:Instance': {
        'http://id.loc.gov/ontologies/bibframe/issuance': {
          items: {
            abc123: {
              uri: 'http://id.loc.gov/vocabulary/issuance/mono',
              label: 'http://id.loc.gov/vocabulary/issuance/mono',
            },
          },
        },
        'http://id.loc.gov/ontologies/bibframe/carrier': {
          items: {
            abc124: {
              uri: 'http://id.loc.gov/vocabulary/carriers/nc',
              label: 'http://id.loc.gov/vocabulary/carriers/nc',
            },
          },
        },
        'http://id.loc.gov/ontologies/bibframe/heldBy': {
          items: {
            abc125: {
              content: 'DLC',
              label: 'DLC',
              lang: 'eng',
            },
          },
        },
        'http://id.loc.gov/ontologies/bibframe/instanceOf': {
          abc129: {
            'resourceTemplate:bf2:Monograph:Work': {
              'http://id.loc.gov/ontologies/bibframe/content': {
                items: {
                  abc126: {
                    uri: 'http://id.loc.gov/vocabulary/contentTypes/txt',
                    label: 'http://id.loc.gov/vocabulary/contentTypes/txt',
                  },
                },
              },
              'http://id.loc.gov/ontologies/bibframe/title': {
                abc128: {
                  'resourceTemplate:bf2:WorkTitle': {
                    'http://id.loc.gov/ontologies/bibframe/mainTitle': {
                      items: {
                        abc127: {
                          content: 'foo',
                          label: 'foo',
                          lang: 'eng',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    expect(Object.keys(resourceTemplates).length).toEqual(5)
  })

  it('builds the state for embedded resource property with multiple types', async () => {
    // Note that _:c14n1 has multiple types.
    const resource = `<http://example/123> <http://id.loc.gov/ontologies/bibframe/instanceOf> _:c14n0 .
<http://example/123> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Monograph:Instance" .
<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Instance> .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/title> _:c14n1 .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Work> .
_:c14n1 <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@eng .
_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .
_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Foo> .`

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValueOnce('abc123')
      .mockReturnValueOnce('abc124')
      .mockReturnValueOnce('abc125')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const [state, unusedDataset] = await builder.buildState()

    expect(state).toEqual({
      'resourceTemplate:bf2:Monograph:Instance': {
        'http://id.loc.gov/ontologies/bibframe/instanceOf': {
          abc125: {
            'resourceTemplate:bf2:Monograph:Work': {
              'http://id.loc.gov/ontologies/bibframe/title': {
                abc124: {
                  'resourceTemplate:bf2:WorkTitle': {
                    'http://id.loc.gov/ontologies/bibframe/mainTitle': {
                      items: {
                        abc123: {
                          content: 'foo',
                          label: 'foo',
                          lang: 'eng',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    // Don't report extra type as unused.
    expect(unusedDataset.toArray()).toEqual([])
  })

  it('raises when more than 1 possible resource templates for an embedded resource', async () => {
    const resource = `<http://example/123> <http://id.loc.gov/ontologies/bibframe/instanceOf> _:c14n0 .
<http://example/123> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Monograph:Instance" .
<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Instance> .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/title> _:c14n1 .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Work> .
_:c14n1 <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@eng .
_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .`

    sinopiaServer.getResourceTemplate.mockImplementation(async (rtId) => {
      if (rtId === 'resourceTemplate:bf2:WorkVariantTitle') {
        return getFixtureResourceTemplate('resourceTemplate:bf2:WorkTitle')
      }
      return getFixtureResourceTemplate(rtId)
    })
    const validateResourceTemplateSpy = jest.spyOn(resourceTemplateValidator, 'validateResourceTemplate').mockResolvedValue([])

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValue('abc123')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    await expect(builder.buildState()).rejects.toMatch(/More than one resource template matches/)

    validateResourceTemplateSpy.mockRestore()
  })

  it('ignores when 0 possible resource templates for an embedded resource', async () => {
    // Note that type for _:c14n1 was changed to not match.
    const resource = `<http://example/123> <http://id.loc.gov/ontologies/bibframe/instanceOf> _:c14n0 .
<http://example/123> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Monograph:Instance" .
<http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Instance> .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/title> _:c14n1 .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Work> .
_:c14n1 <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@eng .
_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Titlex> .`

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValueOnce('abc123')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const [state, unusedDataset] = await builder.buildState()

    expect(state).toEqual({
      'resourceTemplate:bf2:Monograph:Instance': {
        'http://id.loc.gov/ontologies/bibframe/instanceOf': {
          abc123: {
            'resourceTemplate:bf2:Monograph:Work': {},
          },
        },
      },
    })
    const unmatched = `_:c14n0 <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@eng .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Titlex> .
_:c14n1 <http://id.loc.gov/ontologies/bibframe/title> _:c14n0 .
`
    expect(unusedDataset.toCanonical()).toEqual(unmatched)
  })

  it('returns unused triples', async () => {
    const resource = `<http://example/123> <http://id.loc.gov/ontologies/bibframe/instanceOf> _:c14n0 .
  <http://example/123> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Monograph:Instance" .
  <http://example/123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Instance> .
  _:c14n0 <http://id.loc.gov/ontologies/bibframe/title> _:c14n1 .
  _:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Work> .
  _:c14n1 <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@eng .
  _:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .
  <http://example/124> <http://id.loc.gov/ontologies/bibframe/instanceOf> _:c14n0 .
  <http://example/123> <http://id.loc.gov/ontologies/bibframe/instanceOfx> _:c14n0 .
  _:c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .
  `

    const dataset = await rdfDatasetFromN3(resource)

    shortid.generate = jest.fn().mockReturnValueOnce('abc123')
      .mockReturnValueOnce('abc124')
      .mockReturnValueOnce('abc125')

    const builder = new ResourceStateBuilder(dataset, 'http://example/123')
    const [, unusedDataset] = await builder.buildState()

    const unmatched = `<http://example/123> <http://id.loc.gov/ontologies/bibframe/instanceOfx> _:c14n0 .
<http://example/124> <http://id.loc.gov/ontologies/bibframe/instanceOf> _:c14n0 .
_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .
`
    expect(unusedDataset.toCanonical()).toEqual(unmatched)
  })
})
