// Copyright 2019 Stanford University see LICENSE for license

import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import InputLookupQA from 'components/editor/property/InputLookupQA'

const plProps = {
  id: 'lookupComponent',
  propertyTemplate: {
    mandatory: 'false',
    repeatable: 'false',
    type: 'lookup',
    resourceTemplates: [],
    valueConstraint: {
      valueTemplateRefs: [],
      useValuesFrom: [
        'lookupQaLocNames',
      ],
      valueDataType: {
        dataTypeURI: 'http://id.loc.gov/ontologies/bibframe/Agent',
      },
    },
    propertyURI: 'http://id.loc.gov/ontologies/bflc/target',
    propertyLabel: 'Name Lookup',
  },
  lookupConfig: [
    {
      label: 'LOC person [names] (QA)',
      uri: 'urn:ld4p:qa:names:person',
      authority: 'locnames_ld4l_cache',
      subauthority: 'person',
      language: 'en',
      component: 'lookup',
    },
  ],
  isLoading: false,
  search: jest.fn(),
}

const p2Props = {
  id: 'lookupComponent',
  propertyTemplate: {
    mandatory: 'false',
    repeatable: 'true',
    type: 'lookup',
    resourceTemplates: [],
    valueConstraint: {
      valueTemplateRefs: [],
      useValuesFrom: [
        'lookupQaLocNames',
        'lookupQaLocSubjects',
      ],
      valueDataType: {
        dataTypeURI: 'http://id.loc.gov/ontologies/bibframe/Agent',
      },
      defaults: [],
    },
    propertyURI: 'http://id.loc.gov/ontologies/bflc/target',
    propertyLabel: 'Name Lookup',
  },
  lookupConfig: [
    {
      label: 'LOC person [names] (QA)',
      uri: 'urn:ld4p:qa:names:person',
      authority: 'locnames_ld4l_cache',
      subauthority: 'person',
      language: 'en',
      component: 'lookup',
    },
    {
      label: 'LOC all subjects (QA)',
      uri: 'urn:ld4p:qa:subjects',
      authority: 'locsubjects_ld4l_cache',
      subauthority: '',
      language: 'en',
      component: 'lookup',
    },
  ],
  isLoading: false,
  search: jest.fn(),
}

const multipleResults = [{
  authLabel: 'Person',
  authURI: 'PersonURI',
  body: [{ uri: 'http://id.loc.gov/authorities/names/n860600181234', label: 'Names, Someone' }],
},
{
  authLabel: 'Subject',
  authURI: 'SubjectURI',
  body: [{ uri: 'http://id.loc.gov/authorities/subjects/sh00001861123', label: 'A Specific Place' }],
}]

const validNewURIResults = [{
  customOption: true,
  label: 'http://id.loc.gov/authorities/subjects/123456789',
}]

const validNewLiteralResults = [{
  customOption: true,
  label: 'Some non URI string',
}]

describe('<InputLookupQA />', () => {
  const mockFormDataFn = jest.fn()
  const wrapper = shallow(<InputLookupQA.WrappedComponent {...plProps} changeSelections={mockFormDataFn} />)

  /*
   * Our mock formData function to replace the one provided by
   * mapDispatchToProps
   */

  it('uses the propertyLabel from the template as the form control label', () => {
    expect(wrapper.find('#lookupComponent').props().placeholder).toMatch('Name Lookup')
  })

  it('sets the typeahead component required attribute according to the mandatory property from the template', () => {
    expect(wrapper.find('#lookupComponent').props().required).toBeFalsy()
  })

  describe('when mandatory is true', () => {
    const template = { ...plProps.propertyTemplate, mandatory: 'true' }
    const wrapper2 = shallow(<InputLookupQA.WrappedComponent {...plProps} propertyTemplate={template} />)

    it('passes the "required" property to Typeahead', () => {
      expect(wrapper2.find('#lookupComponent').props().required).toBeTruthy()
    })

    it('displays RequiredSuperscript if mandatory from template is true', () => {
      expect(wrapper2.find('label > RequiredSuperscript')).toBeTruthy()
    })
  })

  it('sets the typeahead component multiple attribute according to the repeatable property from the template', () => {
    expect(wrapper.find('#lookupComponent').props().multiple).toBeFalsy()
  })

  it('the change event fires the changeSelections callback', () => {
    wrapper.find('#lookupComponent').simulate('change')

    expect(mockFormDataFn).toHaveBeenCalled()
  })

  it('links the tokens when there is a URI', () => {
    const option = {
      uri: 'http://id.loc.gov/authorities/names/no2017003958',
      id: 'no2017003958',
      label: 'Ju, Peijian',
    }

    const tokenWrapper = shallow(wrapper.instance().renderTokenFunc(option, { labelKey: 'label' }, 0))
    expect(tokenWrapper.exists('a[href="http://id.loc.gov/authorities/names/no2017003958"]')).toEqual(true)
  })

  it('does not link the tokens when there is no URI', () => {
    const option = {
      id: 'no2017003958',
      label: 'Ju, Peijian',
    }

    const tokenWrapper = shallow(wrapper.instance().renderTokenFunc(option, { labelKey: 'label' }, 0))
    expect(tokenWrapper.exists('a')).toEqual(false)
  })

  it('shows menu headers with lookup source labels and values in the dropdown when provided results', () => {
    const instance = multipleWrapper.instance()
    const menuWrapper = shallow(instance.renderMenuFunc(multipleResults, p2Props))
    const menuChildrenNumber = menuWrapper.children().length
    // One top level menu component

    expect(menuWrapper.find('ul').length).toEqual(1)
    // Four children, with two headings and two items
    expect(menuChildrenNumber).toEqual(4)
    expect(menuWrapper.childAt(0).html()).toEqual('<li class="dropdown-header">Person</li>')
    expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('Names, Someone')
    expect(menuWrapper.childAt(2).html()).toEqual('<li class="dropdown-header">Subject</li>')
    expect(menuWrapper.childAt(3).childAt(0).text()).toEqual('A Specific Place')
  })

  // Institute wrapper with multiple lookup options
  const multipleWrapper = shallow(<InputLookupQA.WrappedComponent {...p2Props} changeSelections={mockFormDataFn} />)

  it('shows a single new valid URI value with the correct header when no other matches are found', () => {
    const instance = multipleWrapper.instance()
    const menuWrapper = shallow(instance.renderMenuFunc(validNewURIResults, p2Props))
    const menuChildrenNumber = menuWrapper.children().length
    // One top level menu component

    expect(menuWrapper.find('ul').length).toEqual(1)
    // Two children, with one headings and one custom item
    expect(menuChildrenNumber).toEqual(2)
    expect(menuWrapper.childAt(0).html()).toEqual('<li class="dropdown-header">New URI</li>')
    expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('http://id.loc.gov/authorities/subjects/123456789')
  })

  it('does show a single new literal value when no other matches are found', () => {
    const instance = multipleWrapper.instance()
    const menuWrapper = shallow(instance.renderMenuFunc(validNewLiteralResults, p2Props))
    const menuChildrenNumber = menuWrapper.children().length
    // One top level menu component

    expect(menuWrapper.find('ul').length).toEqual(1)
    // Nothing shown because the entered URI is not valid
    expect(menuChildrenNumber).toEqual(2)
    expect(menuWrapper.childAt(0).html()).toEqual('<li class="dropdown-header">New Literal</li>')
    expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('Some non URI string')
  })

  it('shows menu headers for both lookups and new valid URI value with the correct headers when matches are found', () => {
    const instance = multipleWrapper.instance()
    const menuWrapper = shallow(instance.renderMenuFunc(multipleResults.concat(validNewURIResults), p2Props))
    const menuChildrenNumber = menuWrapper.children().length
    // One top level menu component

    expect(menuWrapper.find('ul').length).toEqual(1)
    // Five children, with three headings and three items
    expect(menuChildrenNumber).toEqual(6)
    expect(menuWrapper.childAt(0).html()).toEqual('<li class="dropdown-header">Person</li>')
    expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('Names, Someone')
    expect(menuWrapper.childAt(2).html()).toEqual('<li class="dropdown-header">Subject</li>')
    expect(menuWrapper.childAt(3).childAt(0).text()).toEqual('A Specific Place')
    expect(menuWrapper.childAt(4).html()).toEqual('<li class="dropdown-header">New URI</li>')
    expect(menuWrapper.childAt(5).childAt(0).text()).toEqual('http://id.loc.gov/authorities/subjects/123456789')
  })

  describe('Errors', () => {
    const errors = ['Required']
    const wrapper = shallow(<InputLookupQA.WrappedComponent displayValidations={true} errors={errors} {...plProps}/>)

    it('displays the errors', () => {
      expect(wrapper.find('span.help-block').text()).toEqual('Required')
    })

    it('sets the has-error class', () => {
      expect(wrapper.exists('div.has-error')).toEqual(true)
    })
  })
})
