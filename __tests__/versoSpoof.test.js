/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
describe('spoofed verso', () => {
  let versoSpoof  = require('../src/versoSpoof.js')

  describe('profiles', () => {
    it('array of length 30', () => {
      expect(versoSpoof.profiles).toHaveLength(30)
    })
    it('profile has id', () => {
      expect(versoSpoof.profiles[0]['id']).toBe('profile:bf2:AdminMetadata')
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
