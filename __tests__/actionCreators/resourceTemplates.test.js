// Copyright 2019 Stanford University see LICENSE for license

import { fetchResourceTemplate, fetchResourceTemplateSummaries } from 'actionCreators/resourceTemplates'
/* eslint import/namespace: 'off' */
import * as server from 'sinopiaServer'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'

describe('fetchResourceTemplate', () => {
  describe('a valid template', () => {
    const resourceTemplateId = 'resourceTemplate:bf2:Title'
    it('dispatches actions when started and finished', async () => {
      const templateResponse = await getFixtureResourceTemplate(resourceTemplateId)
      server.getResourceTemplate = jest.fn().mockResolvedValue(templateResponse)
      const dispatch = jest.fn()
      await fetchResourceTemplate(resourceTemplateId, dispatch)
      expect(dispatch).toBeCalledWith({ type: 'RETRIEVE_RESOURCE_TEMPLATE_STARTED', payload: resourceTemplateId })
      expect(dispatch).toBeCalledWith({ type: 'RESOURCE_TEMPLATE_LOADED', payload: templateResponse.response.body })
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
        type: 'RETRIEVE_RESOURCE_TEMPLATE_ERROR',
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
})
