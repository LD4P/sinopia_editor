// Copyright 2018 Stanford University see Apache2.txt for license

describe('spoofed verso', () => {
  let versoSpoof  = require('../src/versoSpoof.js')

  describe('profiles', () => {
    it('array of length 30', () => {
      expect(versoSpoof.profiles).toHaveLength(30)
    })
    it('profile has id', () => {
      expect(versoSpoof.profiles[0]['id']).toBe('sinopia:profile:bf2:AdminMetadata')
    })
    it('profile has name', () => {
      expect(versoSpoof.profiles[0]['name']).toBe('Metadata for BIBFRAME Resources')
    })
    it('profile has type', () => {
      versoSpoof.profiles.forEach(p => {
        expect(p['configType']).toBe('profile')
      })
    })
  })

  describe('ontologies', () => {
    it('array of length 5', () => {
      expect(versoSpoof.ontologies).toHaveLength(5)
    })
    it('ontology has id', () => {
      expect(versoSpoof.ontologies[0]['id']).toBe('Bibframe-ontology')
    })
    it('ontology has name', () => {
      expect(versoSpoof.ontologies[0]['name']).toBe('Bibframe-ontology')
    })
    it('ontology has type', () => {
      versoSpoof.ontologies.forEach(ont => {
        expect(ont['configType']).toBe('ontology')
      })
    })
  })

  describe('ontologyUrls', () => {
    it('array of length 7', () => {
      expect(versoSpoof.ontologyUrls).toHaveLength(7)
    })
    it('ontologyUrl is Url', () => {
      versoSpoof.ontologyUrls.forEach(url => {
        expect(url).toMatch(/^http/)
      })
    })
  })

  describe('owlOntUrl2JsonMappings', () => {
    it('array of length 7', () => {
      expect(versoSpoof.owlOntUrl2JsonMappings).toHaveLength(7)
    })
    it('mapping has url', () => {
      expect(versoSpoof.owlOntUrl2JsonMappings[0]['url']).toBe('http://id.loc.gov/ontologies/bibframe.rdf')
      expect(versoSpoof.owlOntUrl2JsonMappings[6]['url']).toBe('http://id.loc.gov/ontologies/bibframe/Work.json')
    })
    it('mapping has json', () => {
      expect(versoSpoof.owlOntUrl2JsonMappings[0]['json']).toBeDefined()
      expect(versoSpoof.owlOntUrl2JsonMappings[6]['json']).toBeDefined()
    })
  })

})
