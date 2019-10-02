// Copyright 2019 Stanford University see LICENSE for license

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
