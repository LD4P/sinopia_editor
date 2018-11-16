describe('sinopiaServerSpoof', () => {
  let sinopiaServerSpoof  = require('../src/sinopiaServerSpoof.js')

  describe('resourceTemplateIds', () => {
    it('array of length 10', () => {
      expect(sinopiaServerSpoof.resourceTemplateIds).toHaveLength(10)
    })
    it('resourceTemplateId is in expected format', () => {
      sinopiaServerSpoof.resourceTemplateIds.forEach(id => {
        expect(id).toMatch(/^resourceTemplate:((bf2)|(bflc)):.*/)
      })
    })
  })

  describe('resourceTemplateId2Json', () => {
    it('array of length 10', () => {
      expect(sinopiaServerSpoof.resourceTemplateId2Json).toHaveLength(10)
    })
    it('mapping has id', () => {
      expect(sinopiaServerSpoof.resourceTemplateId2Json[0]['id']).toBe('resourceTemplate:bf2:Monograph:Instance')
      expect(sinopiaServerSpoof.resourceTemplateId2Json[9]['id']).toBe('resourceTemplate:bf2:WorkVariantTitle')
    })
    it('mapping has json', () => {
      expect(sinopiaServerSpoof.resourceTemplateId2Json[0]['json']).toBeDefined()
      expect(sinopiaServerSpoof.resourceTemplateId2Json[9]['json']).toBeDefined()
    })
  })
})
