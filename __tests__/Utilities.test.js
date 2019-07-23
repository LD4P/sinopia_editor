// Copyright 2019 Stanford University see LICENSE for license

import {
  defaultValuesFromPropertyTemplate,
  isResourceWithValueTemplateRef,
  resourceToName,
  getLookupConfigItems,
} from '../src/Utilities'
import shortid from 'shortid'

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

  describe('defaultValuesFromPropertyTemplate()', () => {
    shortid.generate = jest.fn().mockReturnValue('abc123')

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

    it('returns an empty array if the defaults are blank', () => {
      const propertyTemplate = {
        valueConstraint: {
          defaults: [{
            defaultLiteral: '',
            defaultURI: '',
          }],
        },
      }

      expect(defaultValuesFromPropertyTemplate(propertyTemplate)).toEqual([])
    })

    it('returns an array with an object otherwise', () => {
      const propertyTemplateWithDefaultsAndLabel = {
        valueConstraint: {
          defaults: [
            {
              defaultURI: 'http://id.loc.gov/vocabulary/mcolor/mul',
              defaultLiteral: 'color',
            },
            {
              defaultURI: 'http://id.loc.gov/vocabulary/xmcolor/xmul',
              defaultLiteral: 'xcolor',
            },
          ],
        },
      }

      expect(defaultValuesFromPropertyTemplate(propertyTemplateWithDefaultsAndLabel)).toEqual([{
        id: 'abc123',
        label: 'color',
        uri: 'http://id.loc.gov/vocabulary/mcolor/mul',
      },
      {
        id: 'abc123',
        label: 'xcolor',
        uri: 'http://id.loc.gov/vocabulary/xmcolor/xmul',
      }])
    })

    it('returns the uri in place of the label if the label is undefined', () => {
      const propertyTemplateWithDefaultsNoLabel = {
        valueConstraint: {
          defaults: [
            {
              defaultURI: 'http://id.loc.gov/vocabulary/mcolor/mul',
            },
          ],
        },
      }

      expect(defaultValuesFromPropertyTemplate(propertyTemplateWithDefaultsNoLabel)).toEqual([{
        id: 'abc123',
        label: 'http://id.loc.gov/vocabulary/mcolor/mul',
        uri: 'http://id.loc.gov/vocabulary/mcolor/mul',
      }])
    })
  })
  describe('getLookupConfigItems()', () => {
    it('returns an empty array if passed any value that fails to define a `valueConstraint.useValuesFrom` array', () => {
      expect(getLookupConfigItems({})).toEqual([])
    })

    it('returns an empty array if passed a value with an empty `valueConstraint.useValuesFrom` array', () => {
      const template = {
        valueConstraint: {
          useValuesFrom: [],
        },
      }

      expect(getLookupConfigItems(template)).toEqual([])
    })

    it('returns an array with lookupConfig objects matching URIs in useValuesFrom array', () => {
      const template = {
        valueConstraint: {
          useValuesFrom: [
            'http://does.not.match/1',
            'http://does.not.match/2',
            'urn:ld4p:qa:agrovoc',
            'https://id.loc.gov/vocabulary/mrectype',
          ],
        },
      }

      expect(getLookupConfigItems(template)).toEqual([
        {
          label: 'AGROVOC (QA)',
          uri: 'urn:ld4p:qa:agrovoc',
          authority: 'agrovoc_ld4l_cache',
          subauthority: '',
          language: 'en',
          component: 'lookup',
        },
        {
          label: 'type of recording',
          uri: 'https://id.loc.gov/vocabulary/mrectype',
          component: 'list',
        },
      ])
    })
  })
})
