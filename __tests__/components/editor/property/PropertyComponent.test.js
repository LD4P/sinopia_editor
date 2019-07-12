// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyComponent from 'components/editor/property/PropertyComponent'

describe('<PropertyComponent />', () => {
  describe('for property templates configured as list', () => {
    const template = {
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/issuance',
      type: 'resource',
      valueConstraint: {
        useValuesFrom: [
          'https://id.loc.gov/vocabulary/issuance',
        ],
      },
    }

    const wrapper = shallow(<PropertyComponent propertyTemplate={template} reduxPath={['http://id.loc.gov/ontologies/bibframe/issuance']} />)
    it('it renders the list component', () => {
      expect(wrapper.find('Connect(InputListLOC)').length).toEqual(1)
    })
  })

  describe('for templates configured as lookup', () => {
    const template = {
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/contribution',
      type: 'lookup',
      valueConstraint: {
        useValuesFrom: [
          'urn:ld4p:qa:names:person',
          'urn:ld4p:qa:subjects:person',
        ],
      },
    }

    const wrapper = shallow(<PropertyComponent propertyTemplate={template} reduxPath={['http://id.loc.gov/ontologies/bibframe/contribution']}/>)

    it('renders the lookup component', () => {
      expect(wrapper.find('Connect(InputLookupQA)').length).toEqual(1)
    })
  })

  describe('for templates configured as resource', () => {
    const template = {
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/hasEquivalent',
      type: 'resource',
    }

    const wrapper = shallow(<PropertyComponent propertyTemplate={template} reduxPath={['http://id.loc.gov/ontologies/bibframe/hasEquivalent']}/>)

    it('renders the uri component', () => {
      expect(wrapper.find('Connect(InputURI)').length).toEqual(1)
    })
  })

  describe('when there are no configuration values from the property template', () => {
    describe('for type:literal', () => {
      const template = {
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/heldBy',
        type: 'literal',
      }

      const wrapper = shallow(<PropertyComponent propertyTemplate={template}
                                                 reduxPath={['http://id.loc.gov/ontologies/bibframe/heldBy']} />)

      it('renders an InputLiteral component', () => {
        expect(wrapper.find('Connect(InputLiteral)').length).toEqual(1)
      })
    })
  })

  it('logs an error if <PropertyComponent /> is missing reduxPath props', () => {
    const template = {
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/note',
      type: 'resource',
      valueConstraint: {
        valueTemplateRefs: [
          'resourceTemplate:bf2:Note',
        ],
        useValuesFrom: [],
      },
    }
    const originalError = console.error

    console.error = jest.fn()
    shallow(<PropertyComponent index={1}
                               propertyTemplate={template} />)
    expect(console.error).toHaveBeenCalledTimes(1)
    console.error = originalError
  })
})
