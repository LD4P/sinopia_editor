// Copyright 2019 Stanford University see LICENSE for license

import {
  defaultValuesFromPropertyTemplate,
  isResourceWithValueTemplateRef,
  resourceToName,
  templateBoolean,
} from '../src/Utilities'


describe('Utilities', () => {
  describe('isResourceWithValueTemplateRef()', () => {
    it('returns true when there is a valueTemplateRef', () => {
      const templateWithValueTemplateRefs = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/note',
        type: 'resource',
        valueConstraint: {
          valueTemplateRefs: [
            'resourceTemplate:bf2:Note',
          ],
        },
      }

      expect(isResourceWithValueTemplateRef(templateWithValueTemplateRefs)).toBeTruthy()
    })

    it('returns true when there are multiple valueTemplateRefs', () => {
      const templateWithTwoValueTemplateRefs = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/note',
        type: 'resource',
        valueConstraint: {
          valueTemplateRefs: [
            'resourceTemplate:bf2:Note',
            'resourceTemplate:bf2:Note2',
          ],
        },
      }

      expect(isResourceWithValueTemplateRef(templateWithTwoValueTemplateRefs)).toBeTruthy()
    })

    it('returns false when valueTemplateRefs is empty', () => {
      const emptyValueTemplateRefs = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/issuance',
        type: 'resource',
        valueConstraint: {
          valueTemplateRefs: [],
        },
      }

      expect(isResourceWithValueTemplateRef(emptyValueTemplateRefs)).toBeFalsy()
    })

    it('returns false when there is no valueConstraint', () => {
      const noValueConstraint = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/issuance',
        type: 'resource',
      }

      expect(isResourceWithValueTemplateRef(noValueConstraint)).toBeFalsy()
    })

    it('returns false when valueConstraint is empty (there are no valueTemplateRefs)', () => {
      const emptyValueConstraint = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/issuance',
        type: 'resource',
        valueConstraint: {},
      }

      expect(isResourceWithValueTemplateRef(emptyValueConstraint)).toBeFalsy()
    })

    it('returns false when the type is other than resource', () => {
      const notTypeResource = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
        type: 'literal',
        valueConstraint: {
          valueTemplateRefs: [
            'resourceTemplate:bf2:TitleNote',
          ],
        },
      }

      expect(isResourceWithValueTemplateRef(notTypeResource)).toBeFalsy()
    })

    it('returns false when there is no type at all', () => {
      const noTypeAtAll = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/note',
        valueConstraint: {
          valueTemplateRefs: [
            'resourceTemplate:bf2:Note',
          ],
        },
      }

      expect(isResourceWithValueTemplateRef(noTypeAtAll)).toBeFalsy()
    })
  })

  describe('resourceToName()', () => {
    it('returns resource name from last path part of URI', () => {
      const uri = 'https://trellis.sinopia.io/resources/ld4p/resourceTemplate:bf2:Note'

      expect(resourceToName(uri)).toEqual('resourceTemplate:bf2:Note')
    })

    it('returns the whole string when there is no last path part of the URI', () => {
      const urn = 'urn:trellis_sinopia_io'

      expect(resourceToName(urn)).toEqual('urn:trellis_sinopia_io')
    })

    it('returns an empty string when the URI is an empty string', () => {
      expect(resourceToName('')).toEqual('')
    })

    it('returns undefined when there is no URI', () => {
      expect(resourceToName()).toEqual(undefined)
    })
  })

  describe('templateBoolean()', () => {
    it('returns true when "true" is passed in as a string', () => {
      expect(templateBoolean('true')).toBe(true)
    })

    it('returns true when a boolean true is passed into the function', () => {
      expect(templateBoolean(true)).toBe(true)
    })

    it('returns true as the default if the parameter is null, undefined, or a random string', () => {
      expect(templateBoolean(null)).toBe(true)
      expect(templateBoolean(undefined)).toBe(true)
      expect(templateBoolean('asdfdsafds')).toBe(true)
    })

    it('return false when "false" is passed in as a string', () => {
      expect(templateBoolean('false')).toBe(false)
    })

    it('returns false when a boolean false is passed into the function', () => {
      expect(templateBoolean(false)).toBe(false)
    })
  })

  describe('defaultValuesFromPropertyTemplate()', () => {
    it('returns an empty array if passed any value that fails to define a `valueConstraint.defaults` array', () => {
      const propertyTemplate = null

      expect(defaultValuesFromPropertyTemplate(propertyTemplate)).toEqual([])
    })

    it('returns an empty array if passed a value with an empty `valueConstraint.defaults` array', () => {
      const propertyTemplate = {
        valueConstraint: {
          defaults: [],
        },
      }

      expect(defaultValuesFromPropertyTemplate(propertyTemplate)).toEqual([])
    })

    it('returns an array with an object otherwise', () => {
      const propertyTemplate = {
        valueConstraint: {
          defaults: [
            {
              defaultURI: 'http://id.loc.gov/vocabulary/mcolor/mul',
              defaultLiteral: 'color',
            },
          ],
        },
      }

      expect(defaultValuesFromPropertyTemplate(propertyTemplate)).toEqual([{
        id: 'http://id.loc.gov/vocabulary/mcolor/mul',
        label: 'color',
        uri: 'http://id.loc.gov/vocabulary/mcolor/mul',
      }])
    })
  })
})
