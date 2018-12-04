describe('sinopiaServerSpoof', () => {
  let sinopiaServerSpoof  = require('../src/sinopiaServerSpoof.js')

  describe('resourceTemplateIds', () => {
    it('array of length 19', () => {
      expect(sinopiaServerSpoof.resourceTemplateIds).toHaveLength(19)
    })
    it('resourceTemplateId is in expected format', () => {
      sinopiaServerSpoof.resourceTemplateIds.forEach(id => {
        expect(id).toMatch(/^resourceTemplate:((bf2)|(bflc)):.*/)
      })
    })
  })

  describe('resourceTemplateId2Json', () => {
    it('array of length 19', () => {
      expect(sinopiaServerSpoof.resourceTemplateId2Json).toHaveLength(19)
    })
    it('mapping has id', () => {
      expect(sinopiaServerSpoof.resourceTemplateId2Json[0]['id']).toBe('resourceTemplate:bf2:Monograph:Instance')
      expect(sinopiaServerSpoof.resourceTemplateId2Json[10]['id']).toBe('resourceTemplate:bf2:WorkVariantTitle')
    })
    it('mapping has json', () => {
      expect(sinopiaServerSpoof.resourceTemplateId2Json[0]['json']).toBeDefined()
      expect(sinopiaServerSpoof.resourceTemplateId2Json[10]['json']).toBeDefined()
    })
  })

  describe('getResourceTemplate', () => {
    it('known id: returns JSON for resource template', () => {
      expect(sinopiaServerSpoof.getResourceTemplate('resourceTemplate:bf2:Title').id).toEqual('resourceTemplate:bf2:Title')
      expect(sinopiaServerSpoof.getResourceTemplate('resourceTemplate:bf2:Title').resourceLabel).toEqual('Instance Title')
    })
    it('unknown id: returns empty resource template and logs error', () => {
      let output = ''
      let storeErr = inputs => (output += inputs)
      console["log"] = jest.fn(storeErr)
      expect(sinopiaServerSpoof.getResourceTemplate('not:there')).toEqual({"propertyTemplates": [{}]})
      expect(output).toEqual('ERROR: un-spoofed resourceTemplate: not:there')
    })
    it('null id: returns empty resource template and logs error', () => {
      let output = ''
      let storeErr = inputs => (output += inputs)
      console["log"] = jest.fn(storeErr)
      expect(sinopiaServerSpoof.getResourceTemplate()).toEqual({"propertyTemplates": [{}]})
      expect(output).toEqual('ERROR: asked for resourceTemplate with null id')
      output = ''
      expect(sinopiaServerSpoof.getResourceTemplate(null)).toEqual({"propertyTemplates": [{}]})
      expect(output).toEqual('ERROR: asked for resourceTemplate with null id')
      output = ''
      expect(sinopiaServerSpoof.getResourceTemplate(undefined)).toEqual({"propertyTemplates": [{}]})
      expect(output).toEqual('ERROR: asked for resourceTemplate with null id')
      expect(sinopiaServerSpoof.getResourceTemplate('')).toEqual({"propertyTemplates": [{}]})
    })

  })
})
