// Copyright 2018 Stanford University see Apache2.txt for license
import React from 'react'
import { shallow } from 'enzyme'
import InputLookup from '../../../src/components/editor/InputLookupQA'

const plProps = {
  "propertyTemplate":
    {
      "mandatory": "false",
      "repeatable": "true",
      "type": "lookup",
      "resourceTemplates": [],
      "valueConstraint": {
        "valueTemplateRefs": [],
        "useValuesFrom": [
          'lookupQaLocNames'
        ],
        "valueDataType": {
          "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Agent"
        },
        "defaults": []
      },
      "propertyURI": "http://id.loc.gov/ontologies/bflc/target",
      "propertyLabel": "Name Lookup"
    }
}

describe('<InputLookup />', () => {
  // our mock formData function to replace the one provided by mapDispatchToProps
  const mockFormDataFn = jest.fn()
  const wrapper = shallow(<InputLookup.WrappedComponent {...plProps} handleSelectedChange={mockFormDataFn} />)

  it('uses the propertyLabel from the template as the form control label', () => {
    expect(wrapper.find('label').text()).toMatch('Name Lookup')
  })

  it('sets the typeahead component required attribute according to the mandatory property from the template', () => {
    expect(wrapper.find('#lookupComponent').props().required).toBeFalsy()
  })

  it('displays RequiredSuperscript if mandatory from template is true', () => {
    wrapper.instance().props.propertyTemplate.mandatory = "true"
    wrapper.instance().forceUpdate()
    expect(wrapper.find('label > RequiredSuperscript')).toBeTruthy()
  })

  it('sets the typeahead component multiple attribute according to the repeatable property from the template', () => {
    expect(wrapper.find('#lookupComponent').props().multiple).toBeTruthy()
  })

  it('sets the typeahead component placeholder attribute to be the propertyLabel', () => {
    expect(wrapper.find('#lookupComponent').props().placeholder).toBe('Name Lookup')
  })

  it('should call the onChange event and set the state with the selected option', () => {
    const event = (wrap) => {
      wrap.setState({options: ["{uri: 'URI', label: 'LABEL'}"]})
    }
    wrapper.find('#lookupComponent').simulate('change', event(wrapper))
    expect(wrapper.state().options[0]).toBe("{uri: 'URI', label: 'LABEL'}")
  })

  it('should call the Search and Change events and set the state with the returned json', () => {
    const json = "{uri: 'URI', label: 'LABEL'}"
    const event = (wrap) => {
      wrap.setState({options: [json]})
      wrap.setState({selected: [json]})
    }
    wrapper.find('#lookupComponent').simulate('search', event(wrapper))
    expect(wrapper.state().options[0]).toEqual(json)

    wrapper.find('#lookupComponent').simulate('change', event(wrapper))
    expect(wrapper.state().selected[0]).toEqual(json)

    expect(mockFormDataFn.mock.calls.length).toBe(2)
  })

  it('should have a PropertyRemark when a remark is present', () => {
    wrapper.instance().props.propertyTemplate.remark = "http://rda.test.org/1.1"
    wrapper.instance().forceUpdate()
    const propertyRemark = wrapper.find('label > PropertyRemark')
    expect(propertyRemark).toBeTruthy()
  })
})
