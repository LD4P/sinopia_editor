// Copyright 2018 Stanford University see Apache2.txt for license
import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import InputLookup from '../../../src/components/editor/InputLookupQA'

const plProps = {
  "id": "lookupComponent",
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
};
const p2Props = {
  "id": "lookupComponent",
  "propertyTemplate":
    {
      "mandatory": "false",
      "repeatable": "true",
      "type": "lookup",
      "resourceTemplates": [],
      "valueConstraint": {
        "valueTemplateRefs": [],
        "useValuesFrom": [
          'lookupQaLocNames',
          'lookupQaLocSubjects'
        ],
        "valueDataType": {
          "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Agent"
        },
        "defaults": []
      },
      "propertyURI": "http://id.loc.gov/ontologies/bflc/target",
      "propertyLabel": "Name Lookup"
    }
};

const multipleResults = [{
    "authLabel":"Person",
    "authURI":"PersonURI",
    "body":[{ "uri":"puri","label":"plabel" }]
  },
  {
    "authLabel":"Subject",
    "authURI":"SubjectURI",
    "body":[{ "uri":"suri","label":"slabel" }]
  }];

describe('<InputLookupQA />', () => {
  // our mock formData function to replace the one provided by mapDispatchToProps
  const mockFormDataFn = jest.fn()
  const wrapper = shallow(<InputLookup.WrappedComponent {...plProps} handleSelectedChange={mockFormDataFn} />)

  it('uses the propertyLabel from the template as the form control label', () => {
    expect(wrapper.find('#lookupComponent').props().placeholder).toMatch('Name Lookup')
  })

  it('sets the typeahead component required attribute according to the mandatory property from the template', () => {
    expect(wrapper.find('#lookupComponent').props().required).toBeFalsy()
  })

  it('displays RequiredSuperscript if mandatory from template is true', () => {
    wrapper.instance().props.propertyTemplate.mandatory = "true"
    expect(wrapper.find('label > RequiredSuperscript')).toBeTruthy()
  })

  it('sets the typeahead component multiple attribute according to the repeatable property from the template', () => {
    expect(wrapper.find('#lookupComponent').props().multiple).toBeTruthy()
  })

  it('should call the onChange event and set the state with the selected option', () => {
    const event = (wrap) => {
      wrap.setState({options: ["{uri: 'URI', label: 'LABEL'}"]})
    }
    wrapper.find('#lookupComponent').simulate('change', event(wrapper))
    expect(wrapper.state().options[0]).toBe("{uri: 'URI', label: 'LABEL'}")
  })

  it('calls the Search and Change events and set the state with the returned json', () => {
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

  it('has a PropertyRemark when a remark is present', () => {
    wrapper.instance().props.propertyTemplate.remark = "http://rda.test.org/1.1"
    wrapper.instance().forceUpdate()
    const propertyRemark = wrapper.find('label > PropertyRemark')
    expect(propertyRemark).toBeTruthy()
  })

  //Institute wrapper with multiple lookup options
  const multipleWrapper = shallow(<InputLookup.WrappedComponent {...p2Props} handleSelectedChange={mockFormDataFn} />)
  it('passes multiple lookup results in state with search event', () => {
   const event = (wrap) => {
     wrap.setState({options: multipleResults})
   }
   multipleWrapper.find('#lookupComponent').simulate('search', event(multipleWrapper))
     expect(multipleWrapper.state().options[0]).toEqual(multipleResults[0])
     expect(multipleWrapper.state().options[1]).toEqual(multipleResults[1])

  })
  //Headers expected

  it('shows menu headers with lookup source labels and values in the dropdown when provided results', () => {
    const instance = multipleWrapper.instance();
    const menuWrapper = shallow(instance.renderMenuFunc(multipleResults, p2Props));
    const menuChildrenNumber = menuWrapper.children().length;
    //One top level menu component
    expect(menuWrapper.find('ul').length).toEqual(1);
    //Four children, with two headings and two items
    expect(menuChildrenNumber).toEqual(4);
    expect(menuWrapper.childAt(0).html()).toEqual("<li class=\"dropdown-header\">Person</li>");
    expect(menuWrapper.childAt(1).childAt(0).text()).toEqual("plabel");
    expect(menuWrapper.childAt(2).html()).toEqual("<li class=\"dropdown-header\">Subject</li>");
    expect(menuWrapper.childAt(3).childAt(0).text()).toEqual("slabel");
  })
})
