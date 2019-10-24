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

    const store = mockStore({})
    await store.dispatch(fetchResourceTemplateSummaries('testerrorkey'))

    expect(server.listResourcesInGroupContainer).toHaveBeenCalledTimes(1)
    expect(server.listResourcesInGroupContainer).toHaveBeenCalledWith('ld4p')

    expect(server.getResourceTemplate).toHaveBeenCalledTimes(2)
    expect(server.getResourceTemplate).toHaveBeenCalledWith(noteId, 'ld4p')
    expect(server.getResourceTemplate).toHaveBeenCalledWith(barcodeId, 'ld4p')
    expect(store.getActions()).toEqual([
      { type: 'CLEAR_ERRORS', payload: 'testerrorkey' },
      {
        type: 'RESOURCE_TEMPLATE_SUMMARY_LOADED',
        payload: {
          key: 'resourceTemplate:bf2:Note',
          name: 'Note',
          id: 'resourceTemplate:bf2:Note',
          group: 'ld4p',
          author: undefined,
          remark: undefined,
        },
      },
      {
        type: 'RESOURCE_TEMPLATE_SUMMARY_LOADED',
        payload: {
          key: 'resourceTemplate:bf2:Identifiers:Barcode',
          name: 'Barcode',
          id: 'resourceTemplate:bf2:Identifiers:Barcode',
          group: 'ld4p',
          author: undefined,
          remark: undefined,
        },
      },
      { type: 'LOADED_RESOURCE_TEMPLATE_SUMMARIES' },
    ])
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
    const store = mockStore({})
    await store.dispatch(fetchResourceTemplateSummaries('testerrorkey'))
    expect(server.listResourcesInGroupContainer).toHaveBeenCalledTimes(1)
    expect(server.listResourcesInGroupContainer).toHaveBeenCalledWith('ld4p')
    expect(store.getActions()).toEqual([
      { type: 'CLEAR_ERRORS', payload: 'testerrorkey' },
      { type: 'LOADED_RESOURCE_TEMPLATE_SUMMARIES', payload: undefined },
    ])
  })
  it('handles a connection error', async () => {
    const store = mockStore({})

    server.listResourcesInGroupContainer = jest.fn().mockRejectedValue('Error: Request has been terminated..., etc.')
    await store.dispatch(fetchResourceTemplateSummaries('testerrorkey'))
    expect(store.getActions()).toEqual([
      { type: 'CLEAR_ERRORS', payload: 'testerrorkey' },
      {
        type: 'APPEND_ERROR',
        payload: {
          errorKey: 'testerrorkey',
          error: 'Error retrieving list of resource templates: Error: Request has been terminated..., etc.',
        },
      },
    ])
  })
  it('handles error loading a resource template summary', async () => {
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

    server.listResourcesInGroupContainer = jest.fn().mockResolvedValue(resourceTemplatesResponse)
    server.getResourceTemplate = jest.fn().mockResolvedValueOnce(noteTemplateResponse).mockRejectedValue(new Error('Drats'))

    const store = mockStore({})
    await store.dispatch(fetchResourceTemplateSummaries('testerrorkey'))

    expect(server.getResourceTemplate).toHaveBeenCalledTimes(2)
    expect(server.getResourceTemplate).toHaveBeenCalledWith(noteId, 'ld4p')
    expect(server.getResourceTemplate).toHaveBeenCalledWith(barcodeId, 'ld4p')
    expect(store.getActions()).toEqual([
      { type: 'CLEAR_ERRORS', payload: 'testerrorkey' },
      {
        type: 'RESOURCE_TEMPLATE_SUMMARY_LOADED',
        payload: {
          key: 'resourceTemplate:bf2:Note',
          name: 'Note',
          id: 'resourceTemplate:bf2:Note',
          group: 'ld4p',
          author: undefined,
          remark: undefined,
        },
      },
      {
        type: 'APPEND_ERROR',
        payload: {
          errorKey: 'testerrorkey',
          error: 'Error retrieving http://platform:8080/repository/ld4p/resourceTemplate:bf2:Identifiers:Barcode: Error: Drats',
        },
      },
      { type: 'LOADED_RESOURCE_TEMPLATE_SUMMARIES' },
    ])
  })
})
