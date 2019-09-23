// Copyright 2019 Stanford University see LICENSE for license

import 'isomorphic-fetch'
import React from 'react'
import { shallow } from 'enzyme'
import InputLookupSinopia from 'components/editor/property/InputLookupSinopia'

const plProps = {
  id: 'sinopia-lookup',
  reduxPath: ['foo', 'bar'],
  propertyTemplate:
    {
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
}

describe('<InputLookupSinopia />', () => {
  const wrapper = shallow(<InputLookupSinopia.WrappedComponent {...plProps} />)

  it('uses the propertyLabel from the template as the form control label', () => {
    expect(wrapper.find('#sinopia-lookup').props().placeholder).toMatch('Name Lookup')
  })

  it('sets the typeahead component required attribute according to the mandatory property from the template', () => {
    expect(wrapper.find('#sinopia-lookup').props().required).toBeFalsy()
  })

  describe('when mandatory is true', () => {
    const template = { ...plProps.propertyTemplate, mandatory: 'true' }
    const wrapper2 = shallow(<InputLookupSinopia.WrappedComponent {...plProps} propertyTemplate={template} />)

    it('is required', () => {
      expect(wrapper2.find('#sinopia-lookup').props().required).toBeTruthy()
    })
  })

  it('sets the typeahead component multiple attribute according to the repeatable property from the template', () => {
    expect(wrapper.find('#sinopia-lookup').props().multiple).toBeFalsy()
  })

  describe('when changing what is selected', () => {
    const mockFormDataFn = jest.fn()
    const wrapper2 = shallow(<InputLookupSinopia.WrappedComponent {...plProps} changeSelections={mockFormDataFn} />)
    const items = [{ label: 'this', uri: 'http://example.com/one' }, { label: 'that', uri: 'http://example.com/two' }]

    it('call the onChange event with the selected option', () => {
      wrapper2.find('#sinopia-lookup').simulate('change', items)
      expect(mockFormDataFn).toHaveBeenCalledWith({
        items,
        reduxPath: ['foo', 'bar'],
        uri: 'http://id.loc.gov/ontologies/bflc/target',
      })
    })
  })

  describe('when searching', () => {
    it('calls the search event', () => {
      const mockSuccessResponse = {
        hits: {
          hits: [
            {
              _source: {
                uri: 'http://example.com/fakeThing',
                label: 'This is a thing',
              },
            },
          ],
        },
      }
      const mockJsonPromise = Promise.resolve(mockSuccessResponse)
      const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
      })

      jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)
      expect(wrapper.find('#sinopia-lookup').props().isLoading).toEqual(false)
      wrapper.find('#sinopia-lookup').simulate('search')
      expect(wrapper.find('#sinopia-lookup').props().isLoading).toEqual(true)
      // Ideally we'd test that the sinopia-lookup props options are set, but I
      // don't know how to do this with enzyme and hooks.
    })
  })
  describe('Errors', () => {
    const errors = ['Required']
    const wrapper = shallow(<InputLookupSinopia.WrappedComponent displayValidations={true} errors={errors} {...plProps}/>)

    it('displays the errors', () => {
      expect(wrapper.find('span.help-block-error').text()).toEqual('Required')
    })

    it('sets the has-error class', () => {
      expect(wrapper.exists('div.has-error')).toEqual(true)
    })
  })
})
