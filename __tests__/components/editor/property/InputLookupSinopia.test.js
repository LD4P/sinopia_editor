// Copyright 2019 Stanford University see LICENSE for license

import 'isomorphic-fetch'
import React from 'react'
import { shallow } from 'enzyme'
import InputLookupSinopia from 'components/editor/property/InputLookupSinopia'
import { renderMenuFunc, renderTokenFunc } from 'components/editor/property/renderTypeaheadFunctions'

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

const multipleResults = [
  { uri: 'https://sinopia.io/repository/test/abcdefg', label: 'Blue hat, green hat' },
  { customOption: true, id: 'new-id-18', label: 'blue' },
]

const validNewURIResults = [{
  customOption: true,
  label: 'https://sinopia.io/repository/test/hijklmnop',
}]

const validNewLiteralResults = [{
  customOption: true,
  label: 'Some non URI string',
}]

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

    it('links the tokens when there is a URI', () => {
      const option = {
        uri: 'http://sinopia.example/abcdefg',
        id: 'sinopia:uri',
        label: 'example with uri',
      }

      const tokenWrapper = shallow(renderTokenFunc(option, { labelKey: 'label' }, 0))
      expect(tokenWrapper.exists('a[href="http://sinopia.example/abcdefg"]')).toEqual(true)
    })

    it('does not link the tokens when there is no URI', () => {
      const option = {
        id: 'no1',
        label: 'example no uri',
      }

      const tokenWrapper = shallow(renderTokenFunc(option, { labelKey: 'label' }, 0))
      expect(tokenWrapper.exists('a')).toEqual(false)
    })

    it('shows menu headers with sinopia source label and literal value in the dropdown when provided results', () => {
      const menuWrapper = shallow(renderMenuFunc(multipleResults, plProps))
      const menuChildrenNumber = menuWrapper.children().length
      // One top level menu component

      expect(menuWrapper.find('ul').length).toEqual(1)
      // Four children, with two headings and two items
      expect(menuChildrenNumber).toEqual(4)
      expect(menuWrapper.childAt(0).html()).toEqual('<li class="dropdown-header">Sinopia Entity</li>')
      expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('Blue hat, green hat')
      expect(menuWrapper.childAt(2).html()).toEqual('<li class="dropdown-header">New Literal</li>')
      expect(menuWrapper.childAt(3).childAt(0).text()).toEqual('blue')
    })

    it('shows a single new valid URI value with the correct header when no other matches are found', () => {
      const menuWrapper = shallow(renderMenuFunc(validNewURIResults, plProps))
      const menuChildrenNumber = menuWrapper.children().length
      // One top level menu component

      expect(menuWrapper.find('ul').length).toEqual(1)
      // Two children, with one headings and one custom item
      expect(menuChildrenNumber).toEqual(2)
      expect(menuWrapper.childAt(0).html()).toEqual('<li class="dropdown-header">New URI</li>')
      expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('https://sinopia.io/repository/test/hijklmnop')
    })

    it('does show a single new literal value when no other matches are found', () => {
      const menuWrapper = shallow(renderMenuFunc(validNewLiteralResults, plProps))
      const menuChildrenNumber = menuWrapper.children().length
      // One top level menu component

      expect(menuWrapper.find('ul').length).toEqual(1)
      // Nothing shown because the entered URI is not valid
      expect(menuChildrenNumber).toEqual(2)
      expect(menuWrapper.childAt(0).html()).toEqual('<li class="dropdown-header">New Literal</li>')
      expect(menuWrapper.childAt(1).childAt(0).text()).toEqual('Some non URI string')
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
