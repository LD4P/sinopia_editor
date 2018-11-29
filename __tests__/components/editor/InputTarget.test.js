// Copyright 2018 Stanford University see Apache2.txt for license
import React from 'react'
import { shallow } from 'enzyme'
import InputTarget from '../../../src/components/editor/InputTarget'

const plProps = {
  "propertyTemplate":
    {
      "propertyURI": "http://id.loc.gov/ontologies/bflc/target",
      "propertyLabel": "Frequency (RDA 2.14)",
      "remark": "http://access.rdatoolkit.org/2.14.html",
      "mandatory": "false",
      "repeatable": "true",
      "type": "target",
      "resourceTemplates": [],
      "valueConstraint": {
        "valueTemplateRefs": [],
        "useValuesFrom": [
          "vocabulary:bf2:frequencies"
        ],
        "valueDataType": {
          "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Frequency"
        }
      }
    }
}

describe('<InputTarget />', () => {
  const wrapper = shallow(<InputTarget {...plProps} />)

  it('contains a label with "Instance of"', () => {
    expect(wrapper.find('label').text()).toMatch('Frequency (RDA 2.14)')
  })

  it('typeahead component should have a placeholder attribute with value propertyLabel', () => {
    expect(wrapper.find('#targetComponent').props().placeholder).toBe('Frequency (RDA 2.14)')
  })

  it('sets the typeahead component required attribute', () => {
    expect(wrapper.find('#targetComponent').props().required).toBe(false)
  })

  it('sets the typeahead component multiple attribute', () => {
    expect(wrapper.find('#targetComponent').props().multiple).toBe(true)
  })

  it('sets the typeahead component placeholder attribute', () => {
    expect(wrapper.find('#targetComponent').props().placeholder).toMatch('Frequency (RDA 2.14)')
  })
})
