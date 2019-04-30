import Config from '../src/Config'

// Stub `Config.spoofSinopiaServer` static getter to force RT to come from spoofs
jest.spyOn(Config, 'spoofSinopiaServer', 'get').mockReturnValue(true)

describe('sinopiaServerSpoof', () => {
  let sinopiaServer = require('../src/sinopiaServer')

  describe('resourceTemplateIds', () => {
    it('array of length 19', () => {
      expect(sinopiaServer.resourceTemplateIds).toHaveLength(19)
    })
    it('resourceTemplateId is in expected format', () => {
      sinopiaServer.resourceTemplateIds.forEach(id => {
        expect(id).toMatch(/^resourceTemplate:((bf2)|(bflc)):.*/)
      })
    })
  })

  describe('resourceTemplateId2Json', () => {
    it('array of length 19', () => {
      expect(sinopiaServer.resourceTemplateId2Json).toHaveLength(19)
    })
    it('mapping has id', () => {
      expect(sinopiaServer.resourceTemplateId2Json[0]['id']).toBe('resourceTemplate:bf2:Monograph:Instance')
      expect(sinopiaServer.resourceTemplateId2Json[10]['id']).toBe('resourceTemplate:bf2:WorkVariantTitle')
    })
    it('mapping has json', () => {
      expect(sinopiaServer.resourceTemplateId2Json[0]['json']).toBeDefined()
      expect(sinopiaServer.resourceTemplateId2Json[10]['json']).toBeDefined()
    })
  })

  describe('getResourceTemplate', () => {
    it('known id: returns JSON for resource template', async () => {
      const template = await sinopiaServer.getResourceTemplate('resourceTemplate:bf2:Title')
      expect(template.response.body.id).toEqual('resourceTemplate:bf2:Title')
      expect(template.response.body.resourceLabel).toEqual('Instance Title')
    })
    it('unknown id: returns empty resource template and logs error', () => {
      expect(sinopiaServer.getResourceTemplate('not:there')).toEqual(
        {"error":'ERROR: un-spoofed resourceTemplate: not:there',
         "propertyTemplates": [{}]})
    })
    it('null id: returns empty resource template and logs error', () => {
      expect(sinopiaServer.getResourceTemplate()).toEqual(
        {"error": "ERROR: asked for resourceTemplate with null/undefined id",
         "propertyTemplates": [{}]})
      expect(sinopiaServer.getResourceTemplate(null)).toEqual({
        "error": "ERROR: asked for resourceTemplate with null/undefined id",
        "propertyTemplates": [{}]})
      expect(sinopiaServer.getResourceTemplate(undefined)).toEqual({
        "error": "ERROR: asked for resourceTemplate with null/undefined id",
        "propertyTemplates": [{}]})
      expect(sinopiaServer.getResourceTemplate('')).toEqual({
        "error": "ERROR: asked for resourceTemplate with null/undefined id",
        "propertyTemplates": [{}]})
    })

  })
})
