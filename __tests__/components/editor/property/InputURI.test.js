// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import shortid from 'shortid'
import InputURI from 'components/editor/property/InputURI'

const plProps = {
  propertyTemplate: {
    propertyLabel: 'Has Equivalent',
    propertyURI: 'http://id.loc.gov/ontologies/bibframe/hasEquivalent',
    type: 'resource',
    mandatory: '',
    repeatable: '',
  },
  reduxPath: [
    'resourceTemplate:bf2:Monograph:Instance',
    'http://id.loc.gov/ontologies/bibframe/hasEquivalent',
  ],
  formData: {
    items: [],
    errors: [],
  },
}


describe('<InputURI />', () => {
  const wrapper = shallow(<InputURI.WrappedComponent {...plProps} id={10} />)

  it('contains a placeholder', () => {
    expect(wrapper.find('input').props().placeholder).toBe('Has Equivalent')
  })

  it('contains required="true" attribute on input tag when mandatory is true', () => {
    const propertyTemplate = { propertyTemplate: { ...plProps.propertyTemplate, mandatory: 'true' } }
    const formData = { formData: { errors: [{ id: 'Required' }] } }
    wrapper.setProps({ ...plProps, ...propertyTemplate, ...formData })
    expect(wrapper.find('input').prop('required')).toBeTruthy()
  })

  it('contains required="false" attribute on input tag when mandatory is false', () => {
    const propertyTemplate = { propertyTemplate: { ...plProps.propertyTemplate, mandatory: 'false' } }
    wrapper.setProps({ ...plProps, ...propertyTemplate })
    expect(wrapper.find('input').prop('required')).toBeFalsy()
  })
})

describe('When the user enters input into field', () => {
  // Our mockItemsChange function to replace the one provided by mapDispatchToProps
  let mockItemsChange
  let removeMockDataFn
  let mockWrapper

  shortid.generate = jest.fn().mockReturnValue(0)

  beforeEach(() => {
    mockItemsChange = jest.fn()
    removeMockDataFn = jest.fn()

    mockWrapper = shallow(<InputURI.WrappedComponent {...plProps} id={'11'}
                                                     handleMyItemsChange={mockItemsChange}
                                                     handleRemoveItem={removeMockDataFn}/>)
  })

  it('has an id value as a unique property', () => {
    expect(mockWrapper.find('input').prop('id')).toEqual('11')
  })

  it('calls handleMyItemsChange function', () => {
    mockWrapper.find('input').simulate('change', { target: { value: 'http://example.com/thing/1' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    expect(mockItemsChange).toHaveBeenCalled()
  })

  it('doesn\'t accept invalid URIs', () => {
    mockWrapper.find('input').simulate('change', { target: { value: 'Not a URI' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    expect(mockItemsChange).not.toHaveBeenCalled()
    expect(mockWrapper.find('span.help-block').text()).toEqual('Not a valid URI.')
    expect(mockWrapper.exists('div.has-error')).toEqual(true)
  })

  it('is called with the users input as arguments', () => {
    const propertyTemplate = { propertyTemplate: { ...plProps.propertyTemplate, repeatable: 'false' } }
    mockWrapper.setProps({ ...plProps, ...propertyTemplate })
    mockWrapper.find('input').simulate('change', { target: { value: 'http://example.com/thing/1' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    // Test to see arguments used after it's been submitted

    expect(mockItemsChange.mock.calls[0][0]).toEqual(
      {
        items: [{ uri: 'http://example.com/thing/1', id: 0 }],
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/hasEquivalent'],
      },
    )
  })

  it('property template contains repeatable "true", allowed to add more than one item into myItems array', () => {
    const propertyTemplate = { propertyTemplate: { ...plProps.propertyTemplate, repeatable: 'true' } }
    mockWrapper.setProps({ ...plProps, ...propertyTemplate })
    mockWrapper.find('input').simulate('change', { target: { value: 'http://example.com/thing/1' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    mockWrapper.find('input').simulate('change', { target: { value: 'http://example.com/thing/2' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })

    expect(mockItemsChange.mock.calls[0][0]).toEqual(
      {
        items: [{ uri: 'http://example.com/thing/1', id: 0 }],
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/hasEquivalent'],
      },
    )
    expect(mockItemsChange.mock.calls[1][0]).toEqual(
      {
        items: [{ uri: 'http://example.com/thing/2', id: 0 }],
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/hasEquivalent'],
      },
    )
    mockItemsChange.mock.calls = [] // Reset the redux store to empty
  })

  it('item appears when user inputs text into the field', () => {
    const propertyTemplate = { propertyTemplate: { ...plProps.propertyTemplate, repeatable: 'false' } }
    mockWrapper.setProps({
      ...plProps,
      ...propertyTemplate,
      formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/hasEquivalent' },
      items: [{ uri: 'http://example.com/thing/1', id: 4 }],
    })
    expect(mockWrapper.find('div#userInput').text()).toEqual('http://example.com/thing/1XEdit') // Contains X and Edit as buttons
  })

  it('calls the removeMockDataFn when X is clicked', () => {
    mockWrapper.setProps({
      formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/hasEquivalent' },
      items: [{ uri: 'test' }],
    })
    expect(removeMockDataFn.mock.calls.length).toEqual(0)
    mockWrapper.find('button#deleteItem').first().simulate('click', { target: { dataset: { item: 5 } } })
    expect(removeMockDataFn.mock.calls.length).toEqual(1)
  })
})

describe('when there is a default literal value in the property template', () => {
  const mockMyItemsChange = jest.fn()
  const mockRemoveItem = jest.fn()

  it('sets the default values according to the property template if they exist', () => {
    const plProps = {
      propertyTemplate: {
        propertyLabel: 'Instance of',
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/hasEquivalent',
        type: 'literal',
        mandatory: '',
        repeatable: '',
        valueConstraint: {
          valueTemplateRefs: [],
          useValuesFrom: [],
          valueDataType: {},
          defaults: [{
            defaultURI: 'http://id.loc.gov/vocabulary/organizations/dlc',
            defaultLiteral: 'DLC',
          },
          ],
        },
      },
      formData: {
        errors: [],
      },
      items: [
        {
          uri: 'http://id.loc.gov/vocabulary/organizations/dlc',
        },
      ],
    }
    const wrapper = shallow(<InputURI.WrappedComponent {...plProps} id={12}
                                                       handleMyItemsChange={mockMyItemsChange} />)

    expect(wrapper.find('#userInput').text()).toMatch('http://id.loc.gov/vocabulary/organizations/dlc')
  })

  describe('when repeatable="false"', () => {
    const nrProps = {
      propertyTemplate:
      {
        propertyLabel: 'Instance of',
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/hasEquivalent',
        type: 'literal',
        mandatory: '',
        repeatable: 'false',
      },
      formData: {},
    }

    it('input has disabled attribute when there are items', () => {
      const nonrepeatWrapper = shallow(
        <InputURI.WrappedComponent {...nrProps}
                                   id={'11tydg'}
                                   handleMyItemsChange={mockMyItemsChange}
                                   handleRemoveItem={mockRemoveItem}
                                   items={[{ uri: 'http://foo.by', id: 0 }]}/>,
      )

      expect(nonrepeatWrapper.exists('input', { disabled: true })).toBe(true)
    })

    it('input does not have disabled attribute when there are no items', () => {
      const nonrepeatWrapper = shallow(
        <InputURI.WrappedComponent {...nrProps}
                                   id={'11tydg'}
                                   handleMyItemsChange={mockMyItemsChange}
                                   handleRemoveItem={mockRemoveItem}
                                   items={[]}/>,
      )
      expect(nonrepeatWrapper.exists('input', { disabled: false })).toBe(true)
    })
  })
})

describe('Errors', () => {
  const errors = ['Required']
  const wrapper = shallow(<InputURI.WrappedComponent displayValidations={true} errors={errors} {...plProps}/>)

  it('displays the errors', () => {
    expect(wrapper.find('span.help-block').text()).toEqual('Required')
  })

  it('sets the has-error class', () => {
    expect(wrapper.exists('div.has-error')).toEqual(true)
  })
})
