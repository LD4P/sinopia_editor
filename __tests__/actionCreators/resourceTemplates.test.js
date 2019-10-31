// Copyright 2019 Stanford University see LICENSE for license

import { fetchResourceTemplate } from 'actionCreators/resourceTemplates'
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
