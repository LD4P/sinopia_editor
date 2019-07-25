// Copyright 2019 Stanford University see LICENSE for license

import {
  update, existingResource, retrieveResource, stubProperty, newResource,
  stubResourceProperties,
} from 'actionCreators/resources'
/* eslint import/namespace: 'off' */
import * as server from 'sinopiaServer'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import _ from 'lodash'
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
    expect(actions[1]).toEqual({ type: 'CLEAR_RESOURCE_URI_MESSAGE' })
    expect(actions[2]).toEqual({ type: 'SET_RESOURCE', payload: { [resourceTemplateId]: {} } })
    expect(actions[3]).toEqual({ type: 'RETRIEVE_RESOURCE_TEMPLATE_STARTED', payload: resourceTemplateId })
    expect(actions[4]).toEqual({ type: 'SET_RESOURCE_TEMPLATE', payload: resourceTemplateResponse.response.body })
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
    expect(actions[0]).toEqual({ type: 'CLEAR_RESOURCE_URI_MESSAGE' })
    expect(actions[1]).toEqual({ type: 'SET_RESOURCE', payload: { [resourceTemplateId]: {} } })
    expect(actions[2]).toEqual({ type: 'SET_BASE_URL', payload: 'http://localhost:8080/repository/stanford/888ea64d-f471-41bf-9d33-c9426ab83b5c' })
    expect(actions[3]).toEqual({ type: 'RETRIEVE_RESOURCE_TEMPLATE_STARTED', payload: undefined })
    expect(actions[4]).toEqual({ type: 'SET_RESOURCE_TEMPLATE', payload: resourceTemplateResponse.response.body })
  })
})

describe('stubProperty', () => {
  describe('property is a resource property', () => {
    it('stubs out the property', async () => {
      const resourceTemplateId = 'resourceTemplate:bf2:Monograph:Work'
      const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      const resourceTemplate = resourceTemplateResponse.response.body
      const dispatch = jest.fn()
      const noteResourceTemplateId = 'resourceTemplate:bf2:Note'
      const noteResourceTemplateResponse = await getFixtureResourceTemplate(noteResourceTemplateId)
      server.getResourceTemplate = jest.fn().mockResolvedValue(noteResourceTemplateResponse)
      const newResource = await stubProperty(resourceTemplateId, resourceTemplate, {}, 'http://id.loc.gov/ontologies/bibframe/colorContent', dispatch)
      // Expecting {<key>: {'resourceTemplate:bf2:Note': {}}}
      const key = _.first(Object.keys(newResource))
      expect(newResource[key]).toEqual({ [noteResourceTemplateId]: {} })
      expect(server.getResourceTemplate).toBeCalledWith(noteResourceTemplateId, 'ld4p')
      expect(dispatch).toHaveBeenCalledTimes(2)
    })
  })
  describe('property is a resource property and has existing value', () => {
    it('returns unchanged', async () => {
      const resourceTemplateId = 'resourceTemplate:bf2:Monograph:Work'
      const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      const resourceTemplate = resourceTemplateResponse.response.body
      const dispatch = jest.fn()
      const noteResourceTemplateId = 'resourceTemplate:bf2:Note'
      const noteResourceTemplateResponse = await getFixtureResourceTemplate(noteResourceTemplateId)
      const existingResource = { abc123: { [noteResourceTemplateId]: {} } }
      server.getResourceTemplate = jest.fn().mockResolvedValue(noteResourceTemplateResponse)
      const newResource = await stubProperty(resourceTemplateId, resourceTemplate, existingResource, 'http://id.loc.gov/ontologies/bibframe/colorContent', dispatch)
      expect(newResource).toEqual(existingResource)
      expect(server.getResourceTemplate).toBeCalledWith(noteResourceTemplateId, 'ld4p')
      expect(dispatch).toHaveBeenCalledTimes(2)
    })
  })

  describe('property is not a resource property and has defaults', () => {
    shortid.generate = jest.fn().mockReturnValue('abc123')
    it('stubs out the property with defaults', async () => {
      const resourceTemplateId = 'resourceTemplate:bf2:Monograph:Instance'
      const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      const resourceTemplate = resourceTemplateResponse.response.body
      const dispatch = jest.fn()
      const newResource = await stubProperty(resourceTemplateId, resourceTemplate, {}, 'http://id.loc.gov/ontologies/bibframe/heldBy', dispatch)
      expect(newResource).toEqual({ items: [{ content: 'DLC', id: 'abc123', lang: { id: 'en', label: 'English' } }] })
      expect(dispatch).toHaveBeenCalledTimes(0)
    })
  })

  describe('property is not a resource property and has no defaults', () => {
    it('stubs out the property', async () => {
      const resourceTemplateId = 'resourceTemplate:bf2:Monograph:Work'
      const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      const resourceTemplate = resourceTemplateResponse.response.body
      const dispatch = jest.fn()
      const newResource = await stubProperty(resourceTemplateId, resourceTemplate, {}, 'http://www.w3.org/2000/01/rdf-schema#label', dispatch)
      expect(newResource).toEqual({ items: [] })
      expect(dispatch).toHaveBeenCalledTimes(0)
    })
  })
  describe('property is not a resource property and has existing value', () => {
    it('returns unchanged', async () => {
      const resourceTemplateId = 'resourceTemplate:bf2:Monograph:Work'
      const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      const resourceTemplate = resourceTemplateResponse.response.body
      const dispatch = jest.fn()
      const existingResource = { items: [{ content: 'foo', lang: { items: [{ id: 'en', label: 'English' }] } }] }
      const newResource = await stubProperty(resourceTemplateId, resourceTemplate, existingResource, 'http://www.w3.org/2000/01/rdf-schema#label', dispatch)
      expect(newResource).toEqual(existingResource)
      expect(dispatch).toHaveBeenCalledTimes(0)
    })
  })
})

describe('stubResourceProperties', () => {
  describe('property is a resource property', () => {
    it('stubs properties without defaults', async () => {
      const monographInstanceResourceTemplate = {
        id: 'resourceTemplate:bf2:Monograph:Instance',
        resourceLabel: 'BIBFRAME Instance',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
        propertyTemplates: [{
          propertyLabel: 'Notes about the Instance',
          remark: 'This is a great note',
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/note',
          mandatory: 'false',
          repeatable: 'true',
          type: 'resource',
          resourceTemplates: [],
          valueConstraint: {
            valueTemplateRefs: [
              'resourceTemplate:bf2:Note',
            ],
            useValuesFrom: [],
            valueDataType: {},
            defaults: [],
          },
        }],
      }
      const noteResourceTemplate = {
        id: 'resourceTemplate:bf2:Note',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
        resourceLabel: 'Note',
        propertyTemplates: [
          {
            propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
            propertyLabel: 'Note',
            mandatory: 'false',
            repeatable: 'false',
            type: 'literal',
            resourceTemplates: [],
            valueConstraint: {
              valueTemplateRefs: [],
              useValuesFrom: [],
              valueDataType: {},
              editable: 'true',
              repeatable: 'false',
              defaults: [],
            },
          },
        ],
      }
      server.getResourceTemplate = async (resourceTemplateId) => {
        const resources = {
          'resourceTemplate:bf2:Monograph:Instance': monographInstanceResourceTemplate,
          'resourceTemplate:bf2:Note': noteResourceTemplate,
        }
        return { response: { body: resources[resourceTemplateId] } }
      }
      const resource = await stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', null,
        {}, ['resource'], true, false, jest.fn())
      expect(findNestedResources(resource['http://id.loc.gov/ontologies/bibframe/note'], 'resourceTemplate:bf2:Note')[0]).toEqual({})
    })
    it('stubs properties with defaults', async () => {
      const monographInstanceResourceTemplate = {
        id: 'resourceTemplate:bf2:Monograph:Instance',
        resourceLabel: 'BIBFRAME Instance',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
        propertyTemplates: [
          {
            propertyLabel: 'Item Information',
            propertyURI: 'http://id.loc.gov/ontologies/bibframe/itemPortion',
            repeatable: 'false',
            resourceTemplates: [],
            type: 'resource',
            valueConstraint: {
              defaults: [],
              editable: 'true',
              remark: 'REMARK',
              repeatable: 'false',
              useValuesFrom: [
                'https://VALUES',
              ],
              valueDataType: {
                dataTypeLabel: 'Classification item number',
                dataTypeLabelHint: 'HINT',
                dataTypeURI: 'http://id.loc.gov/ontologies/bibframe/itemPortion',
                remark: 'REMARK',
              },
              valueTemplateRefs: [
                'resourceTemplate:bf2:Identifiers:Barcode',
              ],
            },
            mandatory: 'false',
            remark: 'http://access.rdatoolkit.org/3.3.html',
          }],
      }
      const barcodeResourceTemplate = {
        id: 'resourceTemplate:bf2:Identifiers:Barcode',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Barcode',
        resourceLabel: 'Barcode',
        propertyTemplates: [
          {
            mandatory: 'true',
            repeatable: 'false',
            type: 'literal',
            resourceTemplates: [],
            valueConstraint: {
              valueTemplateRefs: [],
              useValuesFrom: [],
              valueDataType: {},
              defaults: [
                {
                  defaultLiteral: '12345',
                },
              ],
            },
            propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
            propertyLabel: 'Barcode',
          },
        ],
      }
      server.getResourceTemplate = async (resourceTemplateId) => {
        const resources = {
          'resourceTemplate:bf2:Monograph:Instance': monographInstanceResourceTemplate,
          'resourceTemplate:bf2:Identifiers:Barcode': barcodeResourceTemplate,
        }
        return { response: { body: resources[resourceTemplateId] } }
      }
      const resource = await stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', null,
        {}, ['resource'], true, false, jest.fn())
      expect(findNestedResources(resource['http://id.loc.gov/ontologies/bibframe/itemPortion'], 'resourceTemplate:bf2:Identifiers:Barcode')[0]).toEqual({})
    })
  })
  describe('property is a mandatory resource property', () => {
    const monographInstanceResourceTemplate = {
      id: 'resourceTemplate:bf2:Monograph:Instance',
      resourceLabel: 'BIBFRAME Instance',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
      propertyTemplates: [
        {
          propertyLabel: 'Instance of',
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
          resourceTemplates: [],
          type: 'resource',
          valueConstraint: {
            valueTemplateRefs: [
              'resourceTemplate:bf2:Monograph:Work',
            ],
            useValuesFrom: [],
            valueDataType: {},
            defaults: [],
          },
          mandatory: 'true',
          repeatable: 'true',
        }],
    }
    it('stubs properties without defaults', async () => {
      const monographWorkResourceTemplate = {
        id: 'resourceTemplate:bf2:Monograph:Work',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
        resourceLabel: 'BIBFRAME Work',
        propertyTemplates: [
          {
            propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
            propertyLabel: 'Title Information',
            mandatory: 'false',
            repeatable: 'true',
            type: 'resource',
            resourceTemplates: [],
            valueConstraint: {
              valueTemplateRefs: [
                'resourceTemplate:bf2:WorkTitle',
                'resourceTemplate:bf2:WorkVariantTitle',
                'resourceTemplate:bflc:TranscribedTitle',
              ],
              useValuesFrom: [],
              valueDataType: {},
              defaults: [],
            },
          },
        ],
      }
      server.getResourceTemplate = async (resourceTemplateId) => {
        const resources = {
          'resourceTemplate:bf2:Monograph:Instance': monographInstanceResourceTemplate,
          'resourceTemplate:bf2:Monograph:Work': monographWorkResourceTemplate,
        }
        return { response: { body: resources[resourceTemplateId] } }
      }
      const resource = await stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', null,
        {}, ['resource'], true, false, jest.fn())
      expect(findNestedResources(resource['http://id.loc.gov/ontologies/bibframe/instanceOf'], 'resourceTemplate:bf2:Monograph:Work')[0]).toEqual({})
    })
    it('stubs properties with defaults', async () => {
      const monographWorkResourceTemplate = {
        id: 'resourceTemplate:bf2:Monograph:Work',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
        resourceLabel: 'BIBFRAME Work',
        propertyTemplates: [
          {
            propertyURI: 'http://id.loc.gov/ontologies/bibframe/content',
            propertyLabel: 'Content Type (RDA 6.9)',
            remark: 'http://access.rdatoolkit.org/6.9.html',
            mandatory: 'false',
            repeatable: 'true',
            type: 'resource',
            resourceTemplates: [],
            valueConstraint: {
              valueTemplateRefs: [],
              useValuesFrom: [
                'https://id.loc.gov/vocabulary/contentTypes',
              ],
              valueDataType: {
                dataTypeURI: 'http://id.loc.gov/ontologies/bibframe/Content',
              },
              editable: 'false',
              repeatable: 'true',
              defaults: [
                {
                  defaultURI: 'http://id.loc.gov/vocabulary/contentTypes/txt',
                  defaultLiteral: 'text',
                },
              ],
            },
          },
        ],
      }
      server.getResourceTemplate = async (resourceTemplateId) => {
        const resources = {
          'resourceTemplate:bf2:Monograph:Instance': monographInstanceResourceTemplate,
          'resourceTemplate:bf2:Monograph:Work': monographWorkResourceTemplate,
        }
        return { response: { body: resources[resourceTemplateId] } }
      }
      const dispatch = jest.fn()
      const resource = await stubResourceProperties('resourceTemplate:bf2:Monograph:Instance', null,
        {}, ['resource'], true, false, dispatch)
      expect(findNestedResources(resource['http://id.loc.gov/ontologies/bibframe/instanceOf'], 'resourceTemplate:bf2:Monograph:Work')[0]).toEqual(
        {
          'http://id.loc.gov/ontologies/bibframe/content': {
            items: [
              {
                id: 'abc123',
                label: 'text',
                uri: 'http://id.loc.gov/vocabulary/contentTypes/txt',
              },
            ],
          },
        },
      )
      const action = dispatch.mock.calls[4][0]
      expect(action.type).toEqual('TOGGLE_COLLAPSE')
    })
  })
})

const findNestedResources = (property, resourceTemplateId) => {
  const matchingKeys = Object.keys(property).filter((key) => {
    const keyItem = property[key]
    return Object.keys(keyItem)[0] === resourceTemplateId
  })
  return matchingKeys.map((key) => {
    const keyItem = property[key]
    return keyItem[resourceTemplateId]
  })
}
