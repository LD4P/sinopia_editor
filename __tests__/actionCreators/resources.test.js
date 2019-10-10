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
import * as resourceTemplateThunks from 'actionCreators/resourceTemplates'


jest.mock('sinopiaServer')

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  shortid.generate = jest.fn().mockReturnValueOnce('abc123').mockReturnValueOnce('def456')
    .mockReturnValue('ghi789')
})

const state = {
  selectorReducer: {
    entities: {
      resourceTemplates: {
        'sinopia:profile:bf2:Place': {
          resourceURI: 'http://id.loc.gov/ontologies/bibframe/place',
        },
      },
    },
    resource: {
      'sinopia:profile:bf2:Place': {
        resourceURI: 'http://example.com/repository/stanford/12345',
      },
    },
  },
}

const currentUser = {
  getSession: jest.fn(),
}
const store = mockStore(state)

describe('update', () => {
  it('dispatches actions when started and finished', async () => {
    sinopiaServer.updateRDFResource = jest.fn().mockResolvedValue(true)

    await store.dispatch(update(currentUser))

    const actions = store.getActions()
    expect(actions.length).toEqual(2)
    expect(actions[0]).toEqual({ type: 'SAVE_RESOURCE_STARTED' })
    expect(actions[1]).toEqual({ type: 'SAVE_RESOURCE_FINISHED', payload: '5e30bd59d0186c5307065436240ba108' })
  })
})

describe('retrieveResource', () => {
  const uri = 'http://sinopia.io/repository/stanford/123'
  const received = `<> <http://www.w3.org/2000/01/rdf-schema#label> "splendid"@en .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Note" .`

  const state = {
    selectorReducer: {
      entities: {
        resourceTemplates: {},
      },
      resource: {},
    },
  }
  sinopiaServer.loadRDFResource = jest.fn().mockResolvedValue({ response: { text: received } })
  sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
  describe('when dispatch to existing resource returns undefined', () => {
    const store = mockStore(state)
    it('it does not dispatch setLastSaveChecksum', async () => {
      resourceTemplateThunks.fetchResourceTemplate = jest.fn().mockResolvedValue(undefined)

      expect(await store.dispatch(retrieveResource(currentUser, uri))).toBe(false)

      const actions = store.getActions()
      expect(actions.length).toEqual(1)
      expect(actions[0]).toEqual({ type: 'RETRIEVE_RESOURCE_STARTED' })
    })
  })
  describe('when dispatch to existing resource returns a result', () => {
    const store = mockStore(state)
    it('it dispatches actions', async () => {
      const resourceTemplateId = 'resourceTemplate:bf2:Note'
      const templateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      const resourceTemplate = templateResponse.response.body
      resourceTemplateThunks.fetchResourceTemplate = jest.fn().mockResolvedValue(resourceTemplate)

      expect(await store.dispatch(retrieveResource(currentUser, uri))).toBe(true)

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
        { type: 'RETRIEVE_RESOURCE_STARTED', payload: undefined },
        { type: 'TOGGLE_COLLAPSE', payload: { reduxPath } },
        { type: 'RESOURCE_LOADED', payload: { resource: expectedResource, resourceTemplates: { [resourceTemplateId]: resourceTemplate } } },
        { type: 'SET_LAST_SAVE_CHECKSUM', payload: undefined },
        { type: 'SET_LAST_SAVE_CHECKSUM', payload: 'f767b63c3e1d1af6f8c136b15a31a1e0' },
        { type: 'SET_UNUSED_RDF', payload: '' },
      ])
    })
  })
  describe('when an error is raised', () => {
    const store = mockStore(state)
    it('it dispatches retrieve resource error', async () => {
      resourceTemplateThunks.fetchResourceTemplate = jest.fn().mockRejectedValue(new Error('Ooops'))

      expect(await store.dispatch(retrieveResource(currentUser, uri))).toBe(false)

      const actions = store.getActions()
      expect(actions.length).toEqual(2)
      expect(actions).toEqual([
        { type: 'RETRIEVE_RESOURCE_STARTED' },
        {
          type: 'RETRIEVE_RESOURCE_ERROR',
          payload: {
            reason: 'Error: Ooops',
            uri: 'http://sinopia.io/repository/stanford/123',
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

  it('dispatches actions for happy path', async () => {
    const store = mockStore(state)
    sinopiaServer.publishRDFResource = jest.fn().mockResolvedValue({
      response: {
        headers: { location: 'http://sinopia.io/repository/myGroup/myResource' },
        text: received,
      },
    })

    await store.dispatch(publishResource(currentUser, group))
    const actions = store.getActions()
    expect(actions.length).toEqual(3)
    expect(actions[0]).toEqual({ type: 'SAVE_RESOURCE_STARTED' })
    expect(actions[1]).toEqual({ type: 'SET_BASE_URL', payload: 'http://sinopia.io/repository/myGroup/myResource' })
    expect(actions[2]).toEqual({ type: 'SAVE_RESOURCE_FINISHED', payload: '5e30bd59d0186c5307065436240ba108' })
  })
  it('dispatches actions for error path', async () => {
    const store = mockStore(state)
    sinopiaServer.publishRDFResource = jest.fn().mockRejectedValue(new Error('publish error'))

    await store.dispatch(publishResource(currentUser, group))
    const actions = store.getActions()
    expect(actions.length).toEqual(2)
    expect(actions[0]).toEqual({ type: 'SAVE_RESOURCE_STARTED' })
    expect(actions[1]).toEqual({ type: 'SAVE_RESOURCE_ERROR', payload: { uri: null, reason: 'Error: publish error' } })
  })
})

describe('newResource', () => {
  const resourceTemplateId = 'resourceTemplate:bf2:Note'

  const store = mockStore({
    selectorReducer: {
      entities: {
        resourceTemplates: {},
      },
      resource: {
        'resourceTemplate:bf2:Note': {},
      },
    },
  })

  describe('when dispatch to stubResource returns undefined', () => {
    it('dispatches no actions', async () => {
      resourceTemplateThunks.fetchResourceTemplate = jest.fn().mockResolvedValue(undefined)
      await store.dispatch(newResource(resourceTemplateId))
      const actions = store.getActions()
      expect(actions.length).toEqual(0)
    })
  })
  describe('when dispatch to stubResource returns a result', () => {
    it('dispatches actions', async () => {
      const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      const resourceTemplate = resourceTemplateResponse.response.body
      resourceTemplateThunks.fetchResourceTemplate = jest.fn().mockResolvedValue(resourceTemplate)

      await store.dispatch(newResource(resourceTemplateId))
      const actions = store.getActions()
      const expectedResource = { [resourceTemplateId]: { 'http://www.w3.org/2000/01/rdf-schema#label': {} } }
      expect(actions).toEqual([
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

  const store = mockStore({
    selectorReducer: {
      entities: {
        resourceTemplates: { [resourceTemplateId]: {} },
      },
      resource: {},
    },
  })

  describe('when stubResource returns undefined', () => {
    it('dispatches no actions', async () => {
      resourceTemplateThunks.fetchResourceTemplate = jest.fn().mockResolvedValue(undefined)

      await store.dispatch(existingResource(resource, null, uri))
      const actions = store.getActions()
      expect(actions.length).toEqual(0)
    })
  })

  describe('when stubResource returns a result', () => {
    it('dispatches actions', async () => {
      const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      const resourceTemplate = resourceTemplateResponse.response.body
      resourceTemplateThunks.fetchResourceTemplate = jest.fn().mockResolvedValue(resourceTemplate)

      const unusedRDF = '<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@en .'

      await store.dispatch(existingResource(resource, unusedRDF, uri))
      const actions = store.getActions()
      const expectedResource = {
        'resourceTemplate:bf2:Note': {
          resourceURI: 'http://localhost:8080/repository/stanford/888ea64d-f471-41bf-9d33-c9426ab83b5c',
          'http://www.w3.org/2000/01/rdf-schema#label': {},
        },
      }
      expect(actions).toEqual([
        { type: 'RESOURCE_LOADED', payload: { resource: expectedResource, resourceTemplates: { [resourceTemplateId]: resourceTemplate } } },
        { type: 'SET_LAST_SAVE_CHECKSUM' },
        { type: 'SET_UNUSED_RDF', payload: unusedRDF }])
    })
  })
})

describe('stubResourceProperties', () => {
  beforeEach(() => {
    resourceTemplateThunks.fetchResourceTemplate = async (resourceTemplateId) => {
      const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      return resourceTemplateResponse.response.body
    }
  })

  describe('resource using defaults', () => {
    let dispatch
    let resource
    let resourceTemplates
    beforeEach(async () => {
      dispatch = jest.fn()
      const result = await stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', {}, {}, ['resource'], true, false, false, dispatch)
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
      expect(findToggleCollapse(dispatch.mock.calls, [
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/instanceOf',
      ]).length).toEqual(1)
      expect(findToggleCollapse(dispatch.mock.calls, [
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
      expect(findToggleCollapse(dispatch.mock.calls, [
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
      expect(findToggleCollapse(dispatch.mock.calls, [
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
    let dispatch
    beforeEach(async () => {
      dispatch = jest.fn()
    })
    it('stubs each of the values template refs when no existing value', async () => {
      const existingResource = { 'http://id.loc.gov/ontologies/bibframe/Identifier': {} }
      const [resource] = await stubResourceProperties('test:RT:bf2:Identifiers', {}, existingResource, ['resource'], true, false, 'http://id.loc.gov/ontologies/bibframe/Identifier', dispatch)
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
            'ld4p:RT:bf2:Identifiers:ISBN': {
              'http://id.loc.gov/ontologies/bibframe/note': {},
              'http://id.loc.gov/ontologies/bibframe/qualifier': {},
              'http://id.loc.gov/ontologies/bibframe/status': {},
              'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {},
            },
          },
          ghi789: {
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
      const [resource] = await stubResourceProperties('test:RT:bf2:Identifiers', {}, existingResource, ['resource'], false, false, false, dispatch)
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
            'ld4p:RT:bf2:Identifiers:ISBN': {
              'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {},
              'http://id.loc.gov/ontologies/bibframe/qualifier': {},
              'http://id.loc.gov/ontologies/bibframe/note': {},
              'http://id.loc.gov/ontologies/bibframe/status': {},
            },
          },
          ghi789: {
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
    let dispatch
    beforeEach(async () => {
      dispatch = jest.fn()
      const result = await stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', {}, existingResource, ['resource'], true, true, false, dispatch)
      resource = result[0]
    })
    it('stubs properties with existing values', () => {
      expect(resource['http://id.loc.gov/ontologies/bibframe/itemPortion']).toEqual(existingResource['http://id.loc.gov/ontologies/bibframe/itemPortion'])

      expect(findToggleCollapse(dispatch.mock.calls, [
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/itemPortion',
        'M16a_G7Zc',
        'resourceTemplate:bf2:Identifiers:Barcode',
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
      ]).length).toEqual(1)
      expect(findToggleCollapse(dispatch.mock.calls, [
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
    let dispatch
    beforeEach(async () => {
      dispatch = jest.fn()
      const result = await stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', {}, existingResource, ['resource'], true, false, 'http://id.loc.gov/ontologies/bibframe/itemPortion', dispatch)
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

      expect(findToggleCollapse(dispatch.mock.calls, [
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
    return action[0].type === 'TOGGLE_COLLAPSE' && action[0].payload.reduxPath.join(' > ') === reduxPath.join(' > ')
  })
}
