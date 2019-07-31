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
  items: {},
}


describe('<InputURI />', () => {
  const wrapper = shallow(<InputURI.WrappedComponent {...plProps} />)

  it('contains a placeholder', () => {
    expect(wrapper.find('input').props().placeholder).toBe('Has Equivalent')
  })

  it('contains required="true" attribute on input tag when mandatory is true', () => {
    const propertyTemplate = { propertyTemplate: { ...plProps.propertyTemplate, mandatory: 'true' } }
    wrapper.setProps({ ...plProps, ...propertyTemplate })
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
  let mockWrapper

  shortid.generate = jest.fn().mockReturnValue(0)

  beforeEach(() => {
    mockItemsChange = jest.fn()
    mockWrapper = shallow(<InputURI.WrappedComponent {...plProps}
                                                     handleMyItemsChange={mockItemsChange} />)
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
        items: {
          0: { uri: 'http://example.com/thing/1' },
        },
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
        items: {
          0: { uri: 'http://example.com/thing/1' },
        },
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/hasEquivalent'],
      },
    )
    expect(mockItemsChange.mock.calls[1][0]).toEqual(
      {
        items: {
          0: { uri: 'http://example.com/thing/2' },
        },
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/hasEquivalent'],
      },
    )
    mockItemsChange.mock.calls = [] // Reset the redux store to empty
  })

  it('item appears when there are items', () => {
    const propertyTemplate = { propertyTemplate: { ...plProps.propertyTemplate, repeatable: 'false' } }
    mockWrapper.setProps({
      ...plProps,
      ...propertyTemplate,
      items: {
        abc123: { uri: 'http://example.com/thing/1' },
      },
    })
    expect(mockWrapper.find('Connect(InputValue)').prop('reduxPath')).toEqual([
      'resourceTemplate:bf2:Monograph:Instance',
      'http://id.loc.gov/ontologies/bibframe/hasEquivalent',
      'items',
      'abc123',
    ])
  })
})

describe('when there is a default literal value in the property template', () => {
  const mockMyItemsChange = jest.fn()

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
      reduxPath: [],
    }

    it('input has disabled attribute when there are items', () => {
      const nonrepeatWrapper = shallow(
        <InputURI.WrappedComponent {...nrProps}
                                   handleMyItemsChange={mockMyItemsChange}
                                   items={{ 0: { uri: 'http://foo.by', id: 0 } }}/>,
      )

      expect(nonrepeatWrapper.exists('input', { disabled: true })).toBe(true)
    })

    it('input does not have disabled attribute when there are no items', () => {
      const nonrepeatWrapper = shallow(
        <InputURI.WrappedComponent {...nrProps}
                                   handleMyItemsChange={mockMyItemsChange}
                                   items={{}}/>,
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
