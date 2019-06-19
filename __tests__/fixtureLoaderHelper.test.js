// Copyright 2018, 2019 Stanford University see LICENSE for license

import Config from '../src/Config'
import {
  resourceTemplateId2Json, resourceTemplateIds, getFixtureResourceTemplate, fixtureResourcesInGroupContainer,
} from './fixtureLoaderHelper'

// Stub `Config.useResourceTemplateFixtures` static getter to force RT to come from spoofs
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

describe('fixtureLoaderHelper', () => {
  describe('resourceTemplateIds', () => {
    it('resourceTemplateId is in expected format', () => {
      resourceTemplateIds.forEach((id) => {
        expect(id).toMatch(/^.*:.*:.*/)
      })
    })
  })

  describe('resourceTemplateId2Json', () => {
    it('mapping has id', () => {
      expect(resourceTemplateId2Json.map(e => e.id)).toEqual(
        expect.arrayContaining([
          'resourceTemplate:bf2:Monograph:Instance',
          'resourceTemplate:bf2:WorkVariantTitle',
        ]),
      )
    })
    it('mapping has json', () => {
      expect(resourceTemplateId2Json[0].json).toBeDefined()
      expect(resourceTemplateId2Json[10].json).toBeDefined()
    })
  })

  describe('getFixtureResourceTemplate', () => {
    it('known id: returns JSON for resource template', async () => {
      expect.assertions(2)
      const template = await getFixtureResourceTemplate('resourceTemplate:bf2:Title')

      expect(template.response.body.id).toEqual('resourceTemplate:bf2:Title')
      expect(template.response.body.resourceLabel).toEqual('Instance Title')
    })
    it('unknown id: returns empty resource template and logs error', () => {
      expect(getFixtureResourceTemplate('not:there')).toEqual(
        {
          error: 'ERROR: un-spoofed resourceTemplate: not:there',
          propertyTemplates: [{}],
        },
      )
    })
    it('null id: returns empty resource template and logs error', () => {
      expect(getFixtureResourceTemplate()).toEqual(
        {
          error: 'ERROR: asked for resourceTemplate with null/undefined id',
          propertyTemplates: [{}],
        },
      )
      expect(getFixtureResourceTemplate(null)).toEqual({
        error: 'ERROR: asked for resourceTemplate with null/undefined id',
        propertyTemplates: [{}],
      })
      expect(getFixtureResourceTemplate(undefined)).toEqual({
        error: 'ERROR: asked for resourceTemplate with null/undefined id',
        propertyTemplates: [{}],
      })
      expect(getFixtureResourceTemplate('')).toEqual({
        error: 'ERROR: asked for resourceTemplate with null/undefined id',
        propertyTemplates: [{}],
      })
    })
  })

  describe('spoofedResourcesInGroupContainer', () => {
    it('returns a spoofed response object with contained resource template IDs', () => {
      const result = spoofedResourcesInGroupContainer('ld4p')
      expect(result.response.body['@id']).toEqual('http://spoof.trellis.io/ld4p')
      expect(result.response.body.contains).toEqual(
        expect.arrayContaining([
          'http://spoof.trellis.io/ld4p/resourceTemplate:bf2:Monograph:Instance',
          'http://spoof.trellis.io/ld4p/resourceTemplate:bf2:Monograph:Work',
        ]),
      )
    })
  })
})
