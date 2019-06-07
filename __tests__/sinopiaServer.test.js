// Copyright 2019 Stanford University see LICENSE for license

import Config from '../src/Config'

const sinopiaServer = require('../src/sinopiaServer')

// Stub `Config.spoofSinopiaServer` static getter to force RT to come from spoofs
jest.spyOn(Config, 'spoofSinopiaServer', 'get').mockReturnValue(true)
describe('sinopiaServer', () => {
  describe('getResourceTemplate', () => {
    it('known id: returns JSON for resource template', async () => {
      const template = await sinopiaServer.getResourceTemplate('resourceTemplate:bf2:Title')

      expect(template.response.body.id).toEqual('resourceTemplate:bf2:Title')
      expect(template.response.body.resourceLabel).toEqual('Instance Title')
    })
    it('unknown id: returns empty resource template and logs error', () => {
      expect(sinopiaServer.getResourceTemplate('not:there')).toEqual(
        {
          error: 'ERROR: un-spoofed resourceTemplate: not:there',
          propertyTemplates: [{}],
        },
      )
    })
    it('null id: returns empty resource template and logs error', () => {
      expect(sinopiaServer.getResourceTemplate()).toEqual(
        {
          error: 'ERROR: asked for resourceTemplate with null/undefined id',
          propertyTemplates: [{}],
        },
      )
      expect(sinopiaServer.getResourceTemplate(null)).toEqual({
        error: 'ERROR: asked for resourceTemplate with null/undefined id',
        propertyTemplates: [{}],
      })
      expect(sinopiaServer.getResourceTemplate(undefined)).toEqual({
        error: 'ERROR: asked for resourceTemplate with null/undefined id',
        propertyTemplates: [{}],
      })
      expect(sinopiaServer.getResourceTemplate('')).toEqual({
        error: 'ERROR: asked for resourceTemplate with null/undefined id',
        propertyTemplates: [{}],
      })
    })
  })
})
