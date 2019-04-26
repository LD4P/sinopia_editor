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
      // TODO: This only works with spoofed resource templates. prefix w/
      // `await` when `sinopiaServer.getSpoofedResourceTemplate()` returns a
      // promise.
      //
      // See https://github.com/LD4P/sinopia_editor/issues/473
      const template = sinopiaServer.getResourceTemplate('resourceTemplate:bf2:Title')
      expect(template.id).toEqual('resourceTemplate:bf2:Title')
      expect(template.resourceLabel).toEqual('Instance Title')
    })
    it('unknown id: returns empty resource template and logs error', () => {
      let output = ''
      let storeErr = inputs => (output += inputs)
      console["log"] = jest.fn(storeErr)
      expect(sinopiaServer.getResourceTemplate('not:there')).toEqual({"propertyTemplates": [{}]})
      expect(output).toEqual('ERROR: un-spoofed resourceTemplate: not:there')
    })
    it('null id: returns empty resource template and logs error', () => {
      let output = ''
      let storeErr = inputs => (output += inputs)
      console["log"] = jest.fn(storeErr)
      expect(sinopiaServer.getResourceTemplate()).toEqual({"propertyTemplates": [{}]})
      expect(output).toEqual('ERROR: asked for resourceTemplate with null/undefined id')
      output = ''
      expect(sinopiaServer.getResourceTemplate(null)).toEqual({"propertyTemplates": [{}]})
      expect(output).toEqual('ERROR: asked for resourceTemplate with null/undefined id')
      output = ''
      expect(sinopiaServer.getResourceTemplate(undefined)).toEqual({"propertyTemplates": [{}]})
      expect(output).toEqual('ERROR: asked for resourceTemplate with null/undefined id')
      expect(sinopiaServer.getResourceTemplate('')).toEqual({"propertyTemplates": [{}]})
    })

  })
})
