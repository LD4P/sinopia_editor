// Copyright 2019 Stanford University see LICENSE for license

import { fetchResourceTemplate, fetchResourceTemplateSummaries } from 'actionCreators/resourceTemplates'
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
        { type: 'RETRIEVE_RESOURCE_TEMPLATE_STARTED', payload: resourceTemplateId },
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

      const resourceTemplate = await store.dispatch(fetchResourceTemplate(resourceTemplateId))
      expect(resourceTemplate).toBeFalsy()
      expect(store.getActions()).toEqual([
        { type: 'RETRIEVE_RESOURCE_TEMPLATE_STARTED', payload: resourceTemplateId },
        {
          type: 'RETRIEVE_RESOURCE_TEMPLATE_ERROR',
          payload: {
            resourceTemplateId,
            reason: [
              'Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.',
            ],
          },
        },
      ])
    })
  })
})

describe('fetchResourceTemplateSummaries', () => {
  it('populates resource template summaries', async () => {
    const noteId = 'resourceTemplate:bf2:Note'
    const barcodeId = 'resourceTemplate:bf2:Identifiers:Barcode'
    const resourceTemplatesResponse = {
      response: {
        body: {
          contains: [`http://platform:8080/repository/ld4p/${noteId}`, `http://platform:8080/repository/ld4p/${barcodeId}`],
        },
      },
    }
    const noteTemplateResponse = await getFixtureResourceTemplate(noteId)
    const barcodeTemplateResponse = await getFixtureResourceTemplate(barcodeId)

    server.listResourcesInGroupContainer = jest.fn().mockResolvedValue(resourceTemplatesResponse)
    server.getResourceTemplate = jest.fn().mockResolvedValue(barcodeTemplateResponse).mockResolvedValueOnce(noteTemplateResponse)
    const dispatch = jest.fn()

    await fetchResourceTemplateSummaries()(dispatch)
    expect(server.listResourcesInGroupContainer).toHaveBeenCalledTimes(1)
    expect(server.listResourcesInGroupContainer).toHaveBeenCalledWith('ld4p')

    expect(server.getResourceTemplate).toHaveBeenCalledTimes(2)
    expect(server.getResourceTemplate).toHaveBeenCalledWith(noteId, 'ld4p')
    expect(server.getResourceTemplate).toHaveBeenCalledWith(barcodeId, 'ld4p')

    expect(dispatch).toHaveBeenCalledTimes(4)
    expect(dispatch).toBeCalledWith({
      type: 'RESOURCE_TEMPLATE_SUMMARY_LOADED',
      payload: {
        key: noteId,
        name: 'Note',
        id: noteId,
        group: 'ld4p',
        author: undefined,
        remark: undefined,
      },
    })
  })
  it('handles no templates', async () => {
    const resourceTemplatesResponse = {
      response: {
        body: {
          contains: [],
        },
      },
    }

    server.listResourcesInGroupContainer = jest.fn().mockResolvedValue(resourceTemplatesResponse)
    const dispatch = jest.fn()

    await fetchResourceTemplateSummaries()(dispatch)
    expect(server.listResourcesInGroupContainer).toHaveBeenCalledTimes(1)
    expect(server.listResourcesInGroupContainer).toHaveBeenCalledWith('ld4p')
    expect(dispatch).toHaveBeenCalledTimes(0)
  })
  it('handles a connection error', async () => {
    const resourceTemplateId = 'list of resource templates'

    server.listResourcesInGroupContainer = jest.fn().mockRejectedValue('Error: Request has been terminated..., etc.')
    const dispatch = jest.fn()

    await fetchResourceTemplateSummaries()(dispatch)

    expect(dispatch).toBeCalledWith({
      type: 'RETRIEVE_RESOURCE_TEMPLATE_ERROR',
      payload: {
        resourceTemplateId,
        reason: 'Error: Request has been terminated..., etc.',
      },
    })
  })
})
