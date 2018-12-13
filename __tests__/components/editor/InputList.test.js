// Copyright 2018 Stanford University see Apache2.txt for license
import React from 'react'
import { shallow } from 'enzyme'
import InputList from '../../../src/components/editor/InputList'

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

describe('<InputList />', () => {
  const wrapper = shallow(<InputResource {...plProps} />)

  it('contains a label with the value of propertyLabel', () => {
    expect(wrapper.find('label').text()).toMatch('Frequency (RDA 2.14)')
  })

  it('typeahead component should have a placeholder attribute with value propertyLabel', () => {
    expect(wrapper.find('#targetComponent').props().placeholder).toBe('Frequency (RDA 2.14)')
  })

  it('sets the typeahead component required attribute according to the mandatory value from the template', () => {
    expect(wrapper.find('#targetComponent').props().required).toBe(false)
  })

  it('sets the typeahead component multiple attribute according to the repeatable value from the template', () => {
    expect(wrapper.find('#targetComponent').props().multiple).toBe(true)
  })

  it('sets the typeahead component placeholder attribute', () => {
    expect(wrapper.find('#targetComponent').props().placeholder).toMatch('Frequency (RDA 2.14)')
  })

  it('should call the onChange event and set the state with the selected option', () => {
    const event = (wrap) => {
      wrap.setState({options: ["{uri: 'URI', label: 'LABEL'}"]})
    }
    wrapper.find('#targetComponent').simulate('change', event(wrapper))
    expect(wrapper.state().options[0]).toBe("{uri: 'URI', label: 'LABEL'}")
  })
})
