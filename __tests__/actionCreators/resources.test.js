// Copyright 2019 Stanford University see LICENSE for license

import {
  update, existingResource, retrieveResource, newResource,
  stubResourceProperties,
} from 'actionCreators/resources'
/* eslint import/namespace: 'off' */
import * as server from 'sinopiaServer'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import shortid from 'shortid'

const mockStore = configureMockStore([thunk])

describe('update', () => {
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

  it('dispatches actions when started and finished', async () => {
    server.updateRDFResource = jest.fn().mockResolvedValue(true)
    const dispatch = jest.fn()
    const getState = jest.fn().mockReturnValue(state)
    await update(currentUser)(dispatch, getState)
    expect(dispatch).toBeCalledWith({ type: 'UPDATE_STARTED' })
    expect(dispatch).toBeCalledWith({ type: 'UPDATE_FINISHED' })
  })
})

describe('retrieveResource', () => {
  const currentUser = {
    getSession: jest.fn(),
  }
  const uri = 'http://sinopia.io/repository/stanford/123'
  const received = `<> <http://www.w3.org/2000/01/rdf-schema#label> "splendid"@en .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> .
<> <http://www.w3.org/ns/prov#wasGeneratedBy> "profile:bf2:Note" .`

  it('dispatches actions', async () => {
    server.loadRDFResource = jest.fn().mockResolvedValue({ response: { text: received } })
    const dispatch = jest.fn()

    await retrieveResource(currentUser, uri)(dispatch)
    expect(dispatch).toHaveBeenCalledTimes(3)
    expect(dispatch).toBeCalledWith({ type: 'RETRIEVE_STARTED' })
    expect(dispatch).toBeCalledWith({ type: 'CLEAR_RESOURCE_TEMPLATES' })
  })
})

describe('newResource', () => {
  const resourceTemplateId = 'resourceTemplate:bf2:Note'

  it('dispatches actions', async () => {
    const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
    server.getResourceTemplate = jest.fn().mockResolvedValue(resourceTemplateResponse)

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

    await store.dispatch(newResource(resourceTemplateId))
    const actions = store.getActions()
    expect(actions[0]).toEqual({ type: 'CLEAR_RESOURCE_TEMPLATES' })
    expect(actions[1]).toEqual({ type: 'SET_RESOURCE', payload: { [resourceTemplateId]: {} } })
    expect(actions[2]).toEqual({ type: 'RETRIEVE_RESOURCE_TEMPLATE_STARTED', payload: resourceTemplateId })
    expect(actions[3]).toEqual({ type: 'SET_RESOURCE_TEMPLATE', payload: resourceTemplateResponse.response.body })
  })
})

describe('existingResource', () => {
  const resourceTemplateId = 'resourceTemplate:bf2:Note'

  // NOTE: This test causes an unhandled promise rejection.  See: https://github.com/LD4P/sinopia_editor/issues/983
  it('dispatches actions', async () => {
    const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
    server.getResourceTemplate = jest.fn().mockResolvedValue(resourceTemplateResponse)

    const store = mockStore({
      selectorReducer: {
        entities: {
          resourceTemplates: { [resourceTemplateId]: {} },
        },
        resource: {},
      },
    })

    const resource = {
      'resourceTemplate:bf2:Note': {},
    }

    await store.dispatch(existingResource(resource, 'http://localhost:8080/repository/stanford/888ea64d-f471-41bf-9d33-c9426ab83b5c'))
    const actions = store.getActions()
    expect(actions[0]).toEqual({ type: 'SET_RESOURCE', payload: { [resourceTemplateId]: {} } })
    expect(actions[1]).toEqual({ type: 'SET_BASE_URL', payload: 'http://localhost:8080/repository/stanford/888ea64d-f471-41bf-9d33-c9426ab83b5c' })
    expect(actions[2]).toEqual({ type: 'RETRIEVE_RESOURCE_TEMPLATE_STARTED', payload: undefined })
    expect(actions[3]).toEqual({ type: 'SET_RESOURCE_TEMPLATE', payload: resourceTemplateResponse.response.body })
  })
})

describe('stubResourceProperties', () => {
  beforeEach(() => {
    server.getResourceTemplate = (resourceTemplateId) => {
      return getFixtureResourceTemplate(resourceTemplateId)
    }
    shortid.generate = () => {
      return 'abc123'
    }
  })
  describe('resource using defaults', () => {
    let dispatch
    let resource
    beforeEach(async () => {
      dispatch = jest.fn()
      resource = await stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', undefined, {}, ['resource'], true, false, false, dispatch)
    })
    it('stubs mandatory properties that are value refs', () => {
      // Instance of
      // console.log('resource', JSON.stringify(resource, null, 2))
      // console.log('dispatch', JSON.stringify(dispatch.mock.calls, null, 2))
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
      expect(resource['http://id.loc.gov/ontologies/bibframe/contribution'].items).toEqual([])
      expect(findToggleCollapse(dispatch.mock.calls, [
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/contribution',
      ]).length).toEqual(1)
    })
    it('stubs properties with defaults', () => {
      // Carrier type
      const item = resource['http://id.loc.gov/ontologies/bibframe/carrier'].items[0]
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
                  lang: {
                    id: 'en',
                    label: 'English',
                  },
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
      resource = await stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', undefined, existingResource, ['resource'], true, false, false, dispatch)
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
      resource = await stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', undefined, existingResource, ['resource'], true, false, 'http://id.loc.gov/ontologies/bibframe/itemPortion', dispatch)
    })
    it('stubs that property', () => {
      // Item portion
      // console.log('resource', JSON.stringify(resource, null, 2))
      // console.log('dispatch', JSON.stringify(dispatch.mock.calls, null, 2))
      expect(resource['http://id.loc.gov/ontologies/bibframe/itemPortion']).toEqual({
        abc123: {
          'resourceTemplate:bf2:Identifiers:Barcode': {
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
              items: [
                {
                  id: 'abc123',
                  content: '12345',
                  lang: {
                    id: 'en',
                    label: 'English',
                  },
                },
              ],
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

// const findNestedResources = (property, resourceTemplateId) => {
//   const matchingKeys = Object.keys(property).filter((key) => {
//     const keyItem = property[key]
//     return Object.keys(keyItem)[0] === resourceTemplateId
//   })
//   return matchingKeys.map((key) => {
//     const keyItem = property[key]
//     return keyItem[resourceTemplateId]
//   })
// }

const findToggleCollapse = (actions, reduxPath) => {
  return actions.filter((action) => {
    return action[0].type === 'TOGGLE_COLLAPSE' && action[0].payload.reduxPath.join(' > ') === reduxPath.join(' > ')
  })
}
