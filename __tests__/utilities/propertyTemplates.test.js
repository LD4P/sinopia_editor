// Copyright 2019 Stanford University see LICENSE for license

import {
  defaultValuesFromPropertyTemplate,
  getLookupConfigItems,
  getTagNameForPropertyTemplate,
} from '../../src/utilities/propertyTemplates'

import shortid from 'shortid'

describe('Utilities', () => {
  describe('defaultValuesFromPropertyTemplate()', () => {
    beforeEach(() => {
      shortid.generate = jest.fn().mockReturnValueOnce('abc123').mockReturnValueOnce('def456')
    })

    it('returns an empty object if passed any value that fails to define a `valueConstraint.defaults` array', () => {
      const propertyTemplate = null

      expect(defaultValuesFromPropertyTemplate(propertyTemplate)).toEqual({})
    })

    it('returns an empty object if passed a value with an empty `valueConstraint.defaults` array', () => {
      const propertyTemplate = {
        valueConstraint: {
          defaults: [],
        },
      }

      expect(defaultValuesFromPropertyTemplate(propertyTemplate)).toEqual({})
    })

    it('returns an empty object if the defaults are blank', () => {
      const propertyTemplate = {
        valueConstraint: {
          defaults: [
            {
              defaultLiteral: '',
              defaultURI: '',
            },
          ],
        },
      }

      expect(defaultValuesFromPropertyTemplate(propertyTemplate)).toEqual({})
    })

    it('returns an object with an object otherwise', () => {
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

      expect(defaultValuesFromPropertyTemplate(propertyTemplateWithDefaultsAndLabel)).toEqual({
        abc123: {
          label: 'color',
          uri: 'http://id.loc.gov/vocabulary/mcolor/mul',
        },
        def456: {
          label: 'xcolor',
          uri: 'http://id.loc.gov/vocabulary/xmcolor/xmul',
        },
      })
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

      expect(defaultValuesFromPropertyTemplate(propertyTemplateWithDefaultsNoLabel)).toEqual({
        abc123: {
          label: 'http://id.loc.gov/vocabulary/mcolor/mul',
          uri: 'http://id.loc.gov/vocabulary/mcolor/mul',
        },
      })
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

  describe('getTagNameForPropertyTemplate()', () => {
    describe('for property templates configured as list', () => {
      const template = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/issuance',
        propertyLabel: 'Issuance',
        type: 'resource',
        valueConstraint: {
          useValuesFrom: [
            'https://id.loc.gov/vocabulary/issuance',
          ],
        },
      }

      it('it returns the list component', () => {
        expect(getTagNameForPropertyTemplate(template)).toEqual('InputListLOC')
      })
    })

    describe('for templates configured as QA lookup', () => {
      const template = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/contribution',
        propertyLabel: 'Contribution',
        type: 'lookup',
        valueConstraint: {
          useValuesFrom: [
            'urn:ld4p:qa:names:person',
            'urn:ld4p:qa:subjects:person',
          ],
        },
      }

      it('it returns the lookup component', () => {
        expect(getTagNameForPropertyTemplate(template)).toEqual('InputLookupQA')
      })
    })

    describe('for templates configured as a local (Sinopia) lookup', () => {
      const template = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/contribution',
        propertyLabel: 'Contribution',
        type: 'lookup',
        valueConstraint: {
          useValuesFrom: [
            'urn:ld4p:sinopia',
          ],
        },
      }

      it('it returns the lookup component', () => {
        expect(getTagNameForPropertyTemplate(template)).toEqual('InputLookupSinopia')
      })
    })

    describe('for templates configured as resource', () => {
      const template = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/hasEquivalent',
        propertyLabel: 'Equivalent to',
        type: 'resource',
      }

      it('it returns the uri component', () => {
        expect(getTagNameForPropertyTemplate(template)).toEqual('InputURI')
      })
    })

    describe('when there are no configuration values from the property template', () => {
      describe('for type:literal', () => {
        const template = {
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/heldBy',
          propertyLabel: 'Held by',
          type: 'literal',
        }

        it('it returns the InputLiteral component', () => {
          expect(getTagNameForPropertyTemplate(template)).toEqual('InputLiteral')
        })
      })
    })

    describe('when the configuration is an invalid lookup', () => {
      const template = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/contribution',
        propertyLabel: 'Contribution',
        type: 'lookup',
        valueConstraint: {
          useValuesFrom: [
            'urn:ld4p:qa:names:octopus',
          ],
        },
      }

      it('it throws an error', () => {
        expect(() => {
          getTagNameForPropertyTemplate(template)
        }).toThrowError(/Unable to find urn:ld4p:qa:names:octopus in the lookup configuration/)
      })
    })
  })
})
