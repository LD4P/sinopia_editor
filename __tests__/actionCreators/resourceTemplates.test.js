// Copyright 2019 Stanford University see LICENSE for license

import {
  fetchResourceTemplate, setResourceTemplates, handleUpdateResource,
} from 'actionCreators/resourceTemplates'
/* eslint import/namespace: 'off' */
import * as server from 'sinopiaServer'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'
import Config from 'Config'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

const mockStore = configureMockStore([thunk])

describe('fetchResourceTemplate', () => {
  describe('a valid template', () => {
    const resourceTemplateId = 'resourceTemplate:bf2:Title'
    it('dispatches actions when started and finished', async () => {
      const store = mockStore({ selectorReducer: { entities: { resourceTemplates: {} } } })

      const templateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      server.getResourceTemplate = jest.fn().mockResolvedValue(templateResponse)

      const resourceTemplate = await store.dispatch(fetchResourceTemplate(resourceTemplateId))

      expect(resourceTemplate).toEqual(templateResponse.response.body)
      expect(store.getActions()).toEqual([
        { type: 'RESOURCE_TEMPLATE_LOADED', payload: templateResponse.response.body },
      ])
    })
  })
  describe('a template already in state', () => {
    const resourceTemplateId = 'resourceTemplate:bf2:Title'
    it('dispatches actions when started and finished', async () => {
      const store = mockStore({ selectorReducer: { entities: { resourceTemplates: { 'resourceTemplate:bf2:Title': 'notatemplate' } } } })

      const resourceTemplate = await store.dispatch(fetchResourceTemplate(resourceTemplateId))

      expect(resourceTemplate).toEqual('notatemplate')
      expect(store.getActions()).toEqual([])
    })
  })
  describe('an invalid template', () => {
    const resourceTemplateId = 'rt:repeated:propertyURI:propertyLabel'
    it('dispatches actions when started and on error', async () => {
      const store = mockStore({ selectorReducer: { entities: { resourceTemplates: {} } } })

      const templateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      server.getResourceTemplate = jest.fn().mockResolvedValue(templateResponse)

      const resourceTemplate = await store.dispatch(fetchResourceTemplate(resourceTemplateId, 'testerrorkey'))
      expect(resourceTemplate).toBeFalsy()
      expect(store.getActions()).toEqual([
        {
          type: 'APPEND_ERROR',
          payload: {
            errorKey: 'testerrorkey',
            error: 'Validation error for http://id.loc.gov/ontologies/bibframe/Work: Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.',
          },
        },
      ])
    })
  })
})


describe('setResourceTemplates()', () => {
  const profileContent = {
    Profile: {
      resourceTemplates: [
        {
          id: 'template1',
        },
        {
          id: 'template2',
        },
      ],
    },
  }

  it('opens the modal if there is a conflict', async () => {
    const store = mockStore({
      authenticate: { authenticationState: {} },
    })
    server.createResourceTemplate = jest.fn().mockResolvedValue({ response: { status: 409 } })

    await store.dispatch(setResourceTemplates(profileContent, 'ld4p'))

    expect(store.getActions()).toEqual([
      {
        type: 'CLEAR_FLASH_MESSAGES',
      },
      {
        type: 'CLEAR_MODAL_MESSAGES',
      },
      {
        type: 'SHOW_MODAL',
        payload: 'UpdateResourceModal',
      },
    ])
  })

  it('updates the flash messages if they were created', async () => {
    const store = mockStore({
      authenticate: { authenticationState: {} },
    })
    server.createResourceTemplate = jest.fn()
      .mockResolvedValue({ response: { status: 201, headers: { location: 'http://resource1' } } })

    await store.dispatch(setResourceTemplates(profileContent, 'ld4p'))

    expect(store.getActions()).toEqual([
      {
        type: 'CLEAR_FLASH_MESSAGES',
      },
      {
        type: 'CLEAR_MODAL_MESSAGES',
      },
      {
        type: 'SET_FLASH_MESSAGES',
        messages: ['Created http://resource1', 'Created http://resource1'],
      },
    ])
  })
})

describe('handleUpdateResource()', () => {
  const templates = [
    {
      id: 'template1',
    },
    {
      id: 'template2',
    },
  ]

  it('updates every template and sets the flash', async () => {
    const store = mockStore({
      authenticate: { authenticationState: {} },
    })
    server.updateResourceTemplate = jest.fn()
      .mockResolvedValue({ response: { status: 204, headers: { location: 'http://resource1' } } })

    await store.dispatch(handleUpdateResource(templates, 'ld4p'))


    expect(store.getActions()).toEqual([
      {
        type: 'SET_FLASH_MESSAGES',
        messages: ['Updated http://resource1', 'Updated http://resource1'],
      },
    ])
  })
})
