// Copyright 2019 Stanford University see LICENSE for license

import fetchResourceTemplate from 'actionCreators/resourceTemplates'
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
