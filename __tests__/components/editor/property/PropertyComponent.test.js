// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyComponent from 'components/editor/property/PropertyComponent'
import InputListLOC from 'components/editor/property/InputListLOC'

describe('<PropertyComponent />', () => {
  describe('with a valid property template', () => {
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

    const wrapper = shallow(<PropertyComponent propertyTemplate={template} reduxPath={['http://id.loc.gov/ontologies/bibframe/issuance']} />)
    it('it renders the component', () => {
      expect(wrapper.find(InputListLOC).length).toEqual(1)
    })
  })

  describe('with missing reduxPath props', () => {
    const template = {
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/note',
      propertyLabel: 'Note',
      type: 'resource',
      valueConstraint: {
        valueTemplateRefs: [
          'resourceTemplate:bf2:Note',
        ],
        useValuesFrom: [],
      },
    }
    it('logs an error', () => {
      const originalError = console.error

      console.error = jest.fn()
      shallow(<PropertyComponent propertyTemplate={template} />)
      expect(console.error).toHaveBeenCalledTimes(1)
      console.error = originalError
    })
  })
})
