// Copyright 2019 Stanford University see LICENSE for license

import {
  update, existingResource, retrieveResource, newResource,
  stubResourceProperties, publishResource,
} from 'actionCreators/resources'
/* eslint import/namespace: 'off' */
import * as sinopiaServer from 'sinopiaServer'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import shortid from 'shortid'
import { createBlankState } from 'testUtils'

jest.mock('sinopiaServer')

beforeEach(() => {
  shortid.generate = jest.fn().mockReturnValueOnce('abc123').mockReturnValueOnce('def456')
    .mockReturnValue('ghi789')
})

const createInitialState = () => {
  const state = createBlankState()
  state.selectorReducer.entities.resourceTemplates = {
    'sinopia:profile:bf2:Place': {
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/place',
    },
  }
  state.selectorReducer.resource = {
    'sinopia:profile:bf2:Place': {
      resourceURI: 'http://example.com/repository/stanford/12345',
    },
  }
  return state
}

const currentUser = {
  getSession: jest.fn(),
}

describe('update', () => {
  it('dispatches actions when successful', async () => {
    sinopiaServer.updateRDFResource = jest.fn().mockResolvedValue(true)

    const mockStore = configureMockStore([thunk])
    const store = mockStore(createInitialState())
    await store.dispatch(update(currentUser, 'testerrorkey'))

    expect(store.getActions()).toEqual([{ type: 'SAVE_RESOURCE_FINISHED', payload: '5e30bd59d0186c5307065436240ba108' }])
  })
  it('dispatches actions when error occurs', async () => {
    sinopiaServer.updateRDFResource = jest.fn().mockRejectedValue(new Error('Ooops'))

    const mockStore = configureMockStore([thunk])
    const store = mockStore(createInitialState())
    await store.dispatch(update(currentUser, 'testerrorkey'))

    expect(store.getActions()).toEqual([{ type: 'APPEND_ERROR', payload: { errorKey: 'testerrorkey', error: 'Error saving http://example.com/repository/stanford/12345: Error: Ooops' } }])
  })
})

describe('retrieveResource', () => {
  const uri = 'http://sinopia.io/repository/stanford/123'
  const received = `<> <http://www.w3.org/2000/01/rdf-schema#label> "splendid"@en .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Note" .`

  sinopiaServer.loadRDFResource = jest.fn().mockResolvedValue({ response: { text: received } })
  let store
  beforeEach(() => {
    const mockStore = configureMockStore([thunk])
    store = mockStore(createBlankState())
  })

  describe('when dispatch to existing resource raises exception', () => {
    it('it does not dispatch setLastSaveChecksum', async () => {
      sinopiaServer.getResourceTemplate.mockRejectedValue(new Error('not found'))

      expect(await store.dispatch(retrieveResource(currentUser, uri, 'testerrorkey'))).toBe(false)

      expect(store.getActions()).toEqual([
        { type: 'CLEAR_ERRORS', payload: 'testerrorkey' },
        {
          type: 'APPEND_ERROR',
          payload: {
            errorKey: 'testerrorkey',
            error: 'Error retrieving http://sinopia.io/repository/stanford/123: Error getting resourceTemplate:bf2:Note: Error: not found',
          },
        },
      ])
    })
  })

  describe('when dispatch to existing resource returns a result', () => {
    it('it dispatches actions', async () => {
      const resourceTemplateId = 'resourceTemplate:bf2:Note'
      const templateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      const resourceTemplate = templateResponse.response.body

      sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)

      expect(await store.dispatch(retrieveResource(currentUser, uri, 'testerrorkey'))).toBe(true)

      const actions = store.getActions()
      const expectedResource = {
        'resourceTemplate:bf2:Note': {
          'http://www.w3.org/2000/01/rdf-schema#label': {
            items: {
              abc123: {
                content: 'splendid',
                label: 'splendid',
                lang: 'en',
              },
            },
          },
          resourceURI: 'http://sinopia.io/repository/stanford/123',
        },
      }
      const reduxPath = ['resource', 'resourceTemplate:bf2:Note', 'http://www.w3.org/2000/01/rdf-schema#label']

      expect(actions).toEqual([
        { type: 'CLEAR_ERRORS', payload: 'testerrorkey' },
        { type: 'RESOURCE_TEMPLATE_LOADED', payload: resourceTemplate },
        { type: 'ADD_TEMPLATE_HISTORY', payload: resourceTemplate },
        { type: 'TOGGLE_COLLAPSE', payload: { reduxPath } },
        { type: 'RESOURCE_LOADED', payload: { resource: expectedResource, resourceTemplates: { [resourceTemplateId]: resourceTemplate } } },
        { type: 'SET_LAST_SAVE_CHECKSUM', payload: undefined },
        { type: 'SET_LAST_SAVE_CHECKSUM', payload: 'f767b63c3e1d1af6f8c136b15a31a1e0' },
        { type: 'SET_UNUSED_RDF', payload: '' },
      ])
    })
  })

  describe('when an error is raised', () => {
    it('it dispatches retrieve resource error', async () => {
      sinopiaServer.getResourceTemplate.mockRejectedValue(new Error('Ooops'))

      expect(await store.dispatch(retrieveResource(currentUser, uri, 'testerrorkey'))).toBe(false)

      expect(store.getActions()).toEqual([
        { type: 'CLEAR_ERRORS', payload: 'testerrorkey' },
        {
          type: 'APPEND_ERROR',
          payload: {
            error: 'Error retrieving http://sinopia.io/repository/stanford/123: Error getting resourceTemplate:bf2:Note: Error: Ooops',
            errorKey: 'testerrorkey',
          },
        },
      ])
    })
  })
})

describe('publishResource', () => {
  const group = 'myGroup'
  const received = `<http://sinopia.io/repository/myGroup/myResource> <http://www.w3.org/2000/01/rdf-schema#label> "splendid"@en .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "profile:bf2:Note" .`

  let store
  beforeEach(() => {
    const mockStore = configureMockStore([thunk])
    store = mockStore(createInitialState())
  })

  it('dispatches actions for happy path', async () => {
    sinopiaServer.publishRDFResource = jest.fn().mockResolvedValue({
      response: {
        headers: { location: 'http://sinopia.io/repository/myGroup/myResource' },
        text: received,
      },
    })

    await store.dispatch(publishResource(currentUser, group, 'testerrorkey'))
    expect(store.getActions()).toEqual([
      { type: 'SET_BASE_URL', payload: 'http://sinopia.io/repository/myGroup/myResource' },
      { type: 'SAVE_RESOURCE_FINISHED', payload: '5e30bd59d0186c5307065436240ba108' },
    ])
  })

  it('dispatches actions for error path', async () => {
    // const store = mockStore(state)
    sinopiaServer.publishRDFResource = jest.fn().mockRejectedValue(new Error('publish error'))

    await store.dispatch(publishResource(currentUser, group, 'testerrorkey'))
    expect(store.getActions()).toEqual([
      { type: 'APPEND_ERROR', payload: { errorKey: 'testerrorkey', error: 'Error saving: Error: publish error' } },
    ])
  })
})

describe('newResource', () => {
  const resourceTemplateId = 'resourceTemplate:bf2:Note'

  let store
  beforeEach(() => {
    const mockStore = configureMockStore([thunk])
    const state = createBlankState()
    state.selectorReducer.resource['resourceTemplate:bf2:Note'] = {}
    store = mockStore(state)
  })

  describe('when dispatch to stubResource raises exception', () => {
    it('dispatches no actions', async () => {
      sinopiaServer.getResourceTemplate.mockRejectedValue(new Error('Ooops'))
      await store.dispatch(newResource(resourceTemplateId, 'testerrorkey'))

      expect(store.getActions()).toEqual([
        { type: 'CLEAR_ERRORS', payload: 'testerrorkey' },
        { type: 'APPEND_ERROR', payload: { errorKey: 'testerrorkey', error: 'Error retrieving resourceTemplate:bf2:Note: Error: Ooops' } },
      ])
    })
  })

  describe('when dispatch to stubResource returns a result', () => {
    it('dispatches actions', async () => {
      const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      const resourceTemplate = resourceTemplateResponse.response.body
      sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)

      await store.dispatch(newResource(resourceTemplateId, 'testerrorkey'))
      const expectedResource = { [resourceTemplateId]: { 'http://www.w3.org/2000/01/rdf-schema#label': {} } }
      expect(store.getActions()).toEqual([
        { type: 'CLEAR_ERRORS', payload: 'testerrorkey' },
        { type: 'RESOURCE_TEMPLATE_LOADED', payload: resourceTemplate },
        { type: 'ADD_TEMPLATE_HISTORY', payload: resourceTemplate },
        { type: 'RESOURCE_LOADED', payload: { resource: expectedResource, resourceTemplates: { [resourceTemplateId]: resourceTemplate } } },
        { type: 'SET_LAST_SAVE_CHECKSUM', payload: 'baf92a33bf689d599a41bb4563db42fc' },
        { type: 'SET_UNUSED_RDF', payload: null }])
    })
  })
})

describe('existingResource', () => {
  const uri = 'http://localhost:8080/repository/stanford/888ea64d-f471-41bf-9d33-c9426ab83b5c'

  const resource = {
    'resourceTemplate:bf2:Note': {},
  }

  const resourceTemplateId = 'resourceTemplate:bf2:Note'

  let store
  beforeEach(() => {
    const mockStore = configureMockStore([thunk])
    store = mockStore(createBlankState())
  })

  describe('when stubResource raises an exception', () => {
    it('dispatches no actions', async () => {
      sinopiaServer.getResourceTemplate.mockRejectedValue(new Error('Ooops'))

      expect(await store.dispatch(existingResource(resource, null, uri, 'testerrorkey'))).toBe(false)
      expect(store.getActions()).toEqual([
        { type: 'APPEND_ERROR', payload: { errorKey: 'testerrorkey', error: 'Error retrieving resourceTemplate:bf2:Note: Error: Ooops' } },
      ])
    })
  })

  describe('when stubResource returns a result', () => {
    let store
    beforeEach(() => {
      const mockStore = configureMockStore([thunk])
      store = mockStore(createBlankState())
    })

    it('dispatches actions', async () => {
      const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      const resourceTemplate = resourceTemplateResponse.response.body
      sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)

      const unusedRDF = '<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@en .'

      expect(await store.dispatch(existingResource(resource, unusedRDF, uri, 'testerrorkey'))).toBe(true)
      const expectedResource = {
        'resourceTemplate:bf2:Note': {
          resourceURI: 'http://localhost:8080/repository/stanford/888ea64d-f471-41bf-9d33-c9426ab83b5c',
          'http://www.w3.org/2000/01/rdf-schema#label': {},
        },
      }
      expect(store.getActions()).toEqual([
        { type: 'RESOURCE_TEMPLATE_LOADED', payload: resourceTemplate },
        { type: 'ADD_TEMPLATE_HISTORY', payload: resourceTemplate },
        { type: 'RESOURCE_LOADED', payload: { resource: expectedResource, resourceTemplates: { [resourceTemplateId]: resourceTemplate } } },
        { type: 'SET_LAST_SAVE_CHECKSUM', payload: undefined },
        { type: 'SET_UNUSED_RDF', payload: unusedRDF }])
    })
  })
})

describe('stubResourceProperties', () => {
  sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
  sinopiaServer.foundResourceTemplate.mockResolvedValue(true)
  let store
  beforeEach(() => {
    const mockStore = configureMockStore([thunk])
    store = mockStore(createBlankState())
  })

  describe('resource using defaults', () => {
    let resource
    let resourceTemplates
    beforeEach(async () => {
      const result = await store.dispatch(stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', {}, {}, ['resource'], true, false, false))
      resource = result[0]
      resourceTemplates = result[1]
    })
    it('returns loaded resource templates', () => {
      expect(Object.keys(resourceTemplates)).toEqual(['resourceTemplate:bf2:Monograph:Instance', 'resourceTemplate:bf2:Monograph:Work'])
    })
    it('stubs mandatory properties that are value refs', () => {
      const property = resource['http://id.loc.gov/ontologies/bibframe/instanceOf']
      expect(property).toBeTruthy()
      const nestedResource = property.abc123['resourceTemplate:bf2:Monograph:Work']
      expect(nestedResource['http://id.loc.gov/ontologies/bibframe/temporalCoverage']).toEqual({})
      expect(nestedResource['http://id.loc.gov/ontologies/bibframe/content'].items).toBeTruthy()
      expect(findToggleCollapse(store.getActions(), [
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/instanceOf',
      ]).length).toEqual(1)
      expect(findToggleCollapse(store.getActions(), [
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/instanceOf',
        'abc123',
        'resourceTemplate:bf2:Monograph:Work',
        'http://id.loc.gov/ontologies/bibframe/content',
      ]).length).toEqual(1)
    })
    it('stubs mandatory properties that are property refs', () => {
      // Agent contribution
      expect(resource['http://id.loc.gov/ontologies/bibframe/contribution'].items).toEqual({})
      expect(findToggleCollapse(store.getActions(), [
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/contribution',
      ]).length).toEqual(1)
    })
    it('stubs properties with defaults', () => {
      // Carrier type
      const item = resource['http://id.loc.gov/ontologies/bibframe/carrier'].items.ghi789
      expect(item.label).toEqual('volume')
      expect(item.uri).toEqual('http://id.loc.gov/vocabulary/carriers/nc')
      expect(findToggleCollapse(store.getActions(), [
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/carrier',
      ]).length).toEqual(1)
    })
    it('does not stub other properties with defaults', () => {
      // Item information
      expect(resource['http://id.loc.gov/ontologies/bibframe/itemPortion']).toEqual({})
    })
  })

  describe('resource with multiple value template refs', () => {
    it('stubs each of the values template refs when no existing value', async () => {
      const existingResource = { 'http://id.loc.gov/ontologies/bibframe/Identifier': {} }
      const [resource] = await store.dispatch(stubResourceProperties('test:RT:bf2:Identifiers', {}, existingResource, ['resource'], true, false, 'http://id.loc.gov/ontologies/bibframe/Identifier'))
      expect(resource).toEqual({
        'http://id.loc.gov/ontologies/bibframe/Identifier': {
          abc123: {
            'ld4p:RT:bf2:Identifiers:Copyright': {
              'http://id.loc.gov/ontologies/bibframe/note': {},
              'http://id.loc.gov/ontologies/bibframe/source': {},
              'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {},
            },
          },
          def456: {
            'ld4p:RT:bf2:Identifiers:EAN': {
              'http://id.loc.gov/ontologies/bibframe/note': {},
              'http://id.loc.gov/ontologies/bibframe/qualifier': {},
              'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {},
            },
          },
        },
      })
    })
    it('stubs each of the values template refs when one has an existing value', async () => {
      const existingResource = {
        'http://id.loc.gov/ontologies/bibframe/Identifier': {
          xViwLfpI7: {
            'ld4p:RT:bf2:Identifiers:Copyright': {
              'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
                items: {
                  'gZHIw-NM': {
                    content: '123456789',
                    label: '123456789',
                    lang: 'en',
                  },
                },
              },
            },
          },
        },
      }
      const [resource] = await store.dispatch(stubResourceProperties('test:RT:bf2:Identifiers', {}, existingResource, ['resource'], false, false, false))
      expect(resource).toEqual({
        'http://id.loc.gov/ontologies/bibframe/Identifier': {
          xViwLfpI7: {
            'ld4p:RT:bf2:Identifiers:Copyright': {
              'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
                items: {
                  'gZHIw-NM': {
                    content: '123456789',
                    label: '123456789',
                    lang: 'en',
                  },
                },
              },
              'http://id.loc.gov/ontologies/bibframe/source': {},
              'http://id.loc.gov/ontologies/bibframe/note': {},
            },
          },
          def456: {
            'ld4p:RT:bf2:Identifiers:EAN': {
              'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {},
              'http://id.loc.gov/ontologies/bibframe/qualifier': {},
              'http://id.loc.gov/ontologies/bibframe/note': {},
            },
          },
        },
      })
    })
  })

  describe('resource with existing values', () => {
    const existingResource = {
      'http://id.loc.gov/ontologies/bibframe/itemPortion': {
        M16a_G7Zc: {
          'resourceTemplate:bf2:Identifiers:Barcode': {
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
              items: [
                {
                  id: 'wORfB8Vnvdw',
                  content: '67890',
                  lang: 'en',
                },
              ],
            },
            'http://id.loc.gov/ontologies/bibframe/enumerationAndChronology': {},
          },
        },
      },
    }

    let resource
    beforeEach(async () => {
      const result = await store.dispatch(stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', {}, existingResource, ['resource'], true, true, false))
      resource = result[0]
    })
    it('stubs properties with existing values', () => {
      expect(resource['http://id.loc.gov/ontologies/bibframe/itemPortion']).toEqual(existingResource['http://id.loc.gov/ontologies/bibframe/itemPortion'])

      expect(findToggleCollapse(store.getActions(), [
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/itemPortion',
        'M16a_G7Zc',
        'resourceTemplate:bf2:Identifiers:Barcode',
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
      ]).length).toEqual(1)
      expect(findToggleCollapse(store.getActions(), [
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/itemPortion',
        'M16a_G7Zc',
        'resourceTemplate:bf2:Identifiers:Barcode',
        'http://id.loc.gov/ontologies/bibframe/enumerationAndChronology',
      ]).length).toEqual(1)
    })
  })

  describe('single property of resource', () => {
    let resource
    beforeEach(async () => {
      const result = await store.dispatch(stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', {}, existingResource, ['resource'], true, false, 'http://id.loc.gov/ontologies/bibframe/itemPortion'))
      resource = result[0]
    })
    it('stubs that property', () => {
      // Item portion
      expect(resource['http://id.loc.gov/ontologies/bibframe/itemPortion']).toEqual({
        abc123: {
          'resourceTemplate:bf2:Identifiers:Barcode': {
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
              items: {
                def456: {
                  content: '12345',
                  lang: 'en',
                },
              },
            },
            'http://id.loc.gov/ontologies/bibframe/enumerationAndChronology': {},
          },
        },
      })

      expect(findToggleCollapse(store.getActions(), [
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/itemPortion',
        'abc123',
        'resourceTemplate:bf2:Identifiers:Barcode',
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
      ]).length).toEqual(1)
    })
    it('does not stub other properties', () => {
      // Instance of
      expect(resource['http://id.loc.gov/ontologies/bibframe/instanceOf']).toEqual(undefined)
    })
  })
})

const findToggleCollapse = (actions, reduxPath) => {
  return actions.filter((action) => {
    return action.type === 'TOGGLE_COLLAPSE' && action.payload.reduxPath.join(' > ') === reduxPath.join(' > ')
  })
}
