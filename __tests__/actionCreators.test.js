// Copyright 2019 Stanford University see LICENSE for license

import {
  authenticationFailed, authenticationSucceeded, signedOut, update, retrieveResource,
  fetchResourceTemplate, stubProperty,
} from 'actionCreators'
/* eslint import/namespace: 'off' */
import * as server from 'sinopiaServer'
import { getFixtureResourceTemplate } from './fixtureLoaderHelper'
import _ from 'lodash'

describe('authenticationFailed', () => {
  const currentUser = { hello: 'world' }
  const errInfoauthenticate = { foo: 'bar' }

  const authResult = {
    currentUser,
    authenticationError: errInfoauthenticate,
  }

  it('returns the failure action', () => {
    expect(authenticationFailed(authResult).type).toEqual('AUTHENTICATION_FAILURE')
  })
})

describe('authenticationSucceeded', () => {
  const currentUser = { hello: 'world' }
  const sessionData = { foo: 'bar' }

  const authResult = {
    currentUser,
    currentSession: sessionData,
  }

  it('returns the success action', () => {
    expect(authenticationSucceeded(authResult).type).toEqual('AUTHENTICATION_SUCCESS')
  })
})

describe('signedOut', () => {
  it('returns the signed out action', () => {
    expect(signedOut().type).toEqual('SIGN_OUT_SUCCESS')
  })
})

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
  const received = 'some triples'

  it('dispatches actions when started and finished', async () => {
    server.loadRDFResource = jest.fn().mockResolvedValue({ response: { text: received } })
    const dispatch = jest.fn()
    await retrieveResource(currentUser, uri)(dispatch)
    expect(dispatch).toBeCalledWith({ type: 'RETRIEVE_STARTED' })
    expect(dispatch).toBeCalledWith({ type: 'RETRIEVE_FINISHED', payload: { uri, data: received } })
  })
})

describe('fetchResourceTemplate', () => {
  describe('a valid template', () => {
    const resourceTemplateId = 'resourceTemplate:bf2:Title'
    it('dispatches actions when started and finished', async () => {
      const templateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      server.getResourceTemplate = jest.fn().mockResolvedValue(templateResponse)
      const dispatch = jest.fn()
      await fetchResourceTemplate(resourceTemplateId, dispatch)
      expect(dispatch).toBeCalledWith({ type: 'RETRIEVE_RESOURCE_TEMPLATE_STARTED', payload: resourceTemplateId })
      expect(dispatch).toBeCalledWith({ type: 'SET_RESOURCE_TEMPLATE', payload: templateResponse.response.body })
    })
  })
  describe('an invalid template', () => {
    const resourceTemplateId = 'rt:repeated:propertyURI:propertyLabel'
    it('dispatches actions when started and on error', async () => {
      const templateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      server.getResourceTemplate = jest.fn().mockResolvedValue(templateResponse)
      const dispatch = jest.fn()
      await fetchResourceTemplate(resourceTemplateId, dispatch)
      expect(dispatch).toBeCalledWith({ type: 'RETRIEVE_RESOURCE_TEMPLATE_STARTED', payload: resourceTemplateId })
      expect(dispatch).toBeCalledWith({
        type: 'RETRIEVE_ERROR',
        payload: {
          resourceTemplateId,
          reason: [
            'Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.',
          ],
        },
      })
    })
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
    it('stubs out the property with defaults', async () => {
      const resourceTemplateId = 'resourceTemplate:bf2:Monograph:Instance'
      const resourceTemplateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      const resourceTemplate = resourceTemplateResponse.response.body
      const dispatch = jest.fn()
      const newResource = await stubProperty(resourceTemplateId, resourceTemplate, {}, 'http://id.loc.gov/ontologies/bibframe/heldBy', dispatch)
      expect(newResource).toEqual({ items: [{ content: 'DLC', lang: { items: [{ id: 'en', label: 'English' }] } }] })
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
