// Copyright 2018, 2019 Stanford University see LICENSE for license

import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import shortid from 'shortid'
import { InputLiteral } from 'components/editor/property/InputLiteral'

const plProps = {
  propertyTemplate: {
    propertyLabel: 'Instance of',
    propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
    type: 'literal',
    mandatory: '',
    repeatable: '',
  },
  reduxPath: [],
  formData: {
    items: [],
    errors: [],
  },
}

const valConstraintProps = {
  valueTemplateRefs: [],
  useValuesFrom: [],
  valueDataType: {},
  defaults: [{
    defaultURI: 'http://id.loc.gov/vocabulary/organizations/dlc',
    defaultLiteral: 'DLC',
  },
  ],
}

describe('<InputLiteral />', () => {
  const wrapper = shallow(<InputLiteral {...plProps} id={10} />)

  it('contains a placeholder of "Instance of"', () => {
    expect(wrapper.find('input').props().placeholder).toBe('Instance of')
  })

  it('<input> element should have a placeholder attribute with value propertyLabel', () => {
    expect(wrapper.find('input').props().placeholder).toBe('Instance of')
  })

  it('contains required="true" attribute on input tag when mandatory is true', () => {
    wrapper.instance().props.propertyTemplate.mandatory = 'true'
    wrapper.instance().props.formData.errors = [{ id: 'problem' }]
    wrapper.instance().forceUpdate() /** Update plProps with mandatory: "true" * */
    expect(wrapper.find('input').prop('required')).toBeTruthy()
    expect(wrapper.find('label > RequiredSuperscript')).toBeTruthy()
  })

  it('contains required="false" attribute on input tag when mandatory is false', () => {
    wrapper.instance().props.propertyTemplate.mandatory = 'false'
    wrapper.instance().forceUpdate()
    expect(wrapper.find('input').prop('required')).toBeFalsy()
  })
})

describe('checkMandatoryRepeatable', () => {
  const wrapper = shallow(<InputLiteral {...plProps} id={10} />)

  it('is true when the field is mandatory and nothing has been filled in', () => {
    wrapper.instance().props.propertyTemplate.mandatory = 'true'
    wrapper.instance().forceUpdate()
    expect(wrapper.find('input').prop('required')).toBeTruthy()
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

    mockWrapper = shallow(<InputLiteral {...plProps} id={'11'}
                                        reduxPath={[
                                          'resourceTemplate:bf2:Monograph:Instance',
                                          'http://id.loc.gov/ontologies/bibframe/instanceOf',
                                        ]}
                                        handleMyItemsChange={mockItemsChange}
                                        handleRemoveItem={removeMockDataFn}
                                        handleMyItemsLangChange={jest.fn()} />)
  })

  it('has an id value as a unique property', () => {
    expect(mockWrapper.find('input').prop('id')).toEqual('11')
  })

  it('calls handleMyItemsChange function', () => {
    mockWrapper.find('input').simulate('change', { target: { value: 'foo' } })
    expect(mockWrapper.state('content_add')).toEqual('foo') /* Expect state to have value onChange */
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    expect(mockItemsChange.mock.calls.length).toBe(1)
  })

  it('should be called with the users input as arguments', () => {
    mockWrapper.instance().props.propertyTemplate.repeatable = 'false'
    mockWrapper.instance().forceUpdate()
    mockWrapper.find('input').simulate('change', { target: { value: 'foo' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    // Test to see arguments used after its been submitted
    expect(mockItemsChange.mock.calls[0][0]).toEqual(
      {
        items: [{ content: 'foo', id: 0, lang: { id: 'en', label: 'English' } }],
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
      },
    )
  })

  it('property template contains repeatable "true", allowed to add more than one item into myItems array', () => {
    mockWrapper.instance().props.propertyTemplate.repeatable = 'true'
    mockWrapper.instance().forceUpdate()
    mockWrapper.find('input').simulate('change', { target: { value: 'fooby' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    mockWrapper.find('input').simulate('change', { target: { value: 'bar' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })

    expect(mockItemsChange.mock.calls[0][0]).toEqual(
      {
        items: [{ content: 'fooby', id: 0, lang: { id: 'en', label: 'English' } }],
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
      },
    )
    expect(mockItemsChange.mock.calls[1][0]).toEqual(
      {
        items: [{ content: 'bar', id: 0, lang: { id: 'en', label: 'English' } }],
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
      },
    )
    mockItemsChange.mock.calls = [] // Reset the redux store to empty
  })

  it('required is only true for first item in myItems array', () => {
    mockWrapper.instance().props.propertyTemplate.mandatory = 'true'
    mockWrapper.instance().props.propertyTemplate.repeatable = 'true'
    mockWrapper.instance().forceUpdate()
    expect(mockWrapper.find('input').prop('required')).toBeTruthy()
    mockWrapper.find('input').simulate('change', { target: { value: 'foo' } })
    expect(mockWrapper.state('content_add')).toEqual('foo')
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    mockWrapper.setProps({
      formData: {
        id: 1,
        uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
      },
      items: [{ content: 'foo', id: 4, lang: { items: [{ label: 'English' }] } }],
    })
    expect(mockWrapper.find('input').prop('required')).toBeFalsy()
  })

  it('item appears when user inputs text into the field', () => {
    mockWrapper.instance().props.propertyTemplate.repeatable = 'false'
    mockWrapper.instance().forceUpdate()
    mockWrapper.setProps({
      formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf' },
      items: [{ content: 'foo', id: 4, lang: { label: 'English' } }],
    })
    expect(mockWrapper.find('div#userInput').text()).toEqual('fooXEdit<Connect(LanguageButton) />') // Contains X and Edit as buttons
  })

  it('should call the removeMockDataFn when X is clicked', () => {
    mockWrapper.setProps({
      formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf' },
      items: [{ content: 'test', id: 5, lang: { items: [{ label: 'English' }] } }],
    })
    expect(removeMockDataFn.mock.calls.length).toEqual(0)
    mockWrapper.find('button#deleteItem').first().simulate('click', { target: { dataset: { item: 5 } } })
    expect(removeMockDataFn.mock.calls.length).toEqual(1)
  })

  it('should call the removeMockDataFn and mockItemsChange when Edit is clicked', () => {
    expect(mockWrapper.instance().inputLiteralRef).toEqual({ current: null })
    const mockFocusFn = jest.fn()

    mockWrapper.instance().inputLiteralRef.current = { focus: mockFocusFn }

    mockWrapper.setProps({
      formData: {
        id: 1,
        uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
        errors: [],
      },
      items: [{ content: 'test', id: 5, lang: { items: [{ label: 'English' }] } }],
    })
    expect(removeMockDataFn.mock.calls.length).toEqual(0)
    mockWrapper.find('button#editItem').first().simulate('click', { target: { dataset: { item: 5 } } })
    expect(mockWrapper.state('content_add')).toEqual('test')
    expect(removeMockDataFn.mock.calls.length).toEqual(1)
    expect(mockFocusFn.mock.calls.length).toEqual(1)
  })
})

describe('when there is a default literal value in the property template', () => {
  const mockMyItemsChange = jest.fn()
  const mockRemoveItem = jest.fn()

  it('sets the default values according to the property template if they exist', () => {
    const plProps = {
      propertyTemplate: {
        propertyLabel: 'Instance of',
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
        type: 'literal',
        mandatory: '',
        repeatable: '',
        valueConstraint: valConstraintProps,
      },
      formData: {
        errors: [],
      },
      items: [
        {
          uri: 'http://id.loc.gov/vocabulary/organizations/dlc',
          content: 'DLC',
          lang: { items: [{ label: 'English' }] },
        },
      ],
    }
    const wrapper = shallow(<InputLiteral {...plProps} id={12}
                                          handleMyItemsChange={mockMyItemsChange}
                                          handleMyItemsLangChange={jest.fn()} />)

    expect(wrapper.find('#userInput').text()).toMatch('DLC')
  })

  describe('when repeatable="false"', () => {
    const nrProps = {
      propertyTemplate:
      {
        propertyLabel: 'Instance of',
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
        type: 'literal',
        mandatory: '',
        repeatable: 'false',
      },
      formData: {},
    }

    it('input has disabled attribute when there are items', () => {
      const nonrepeatWrapper = shallow(
        <InputLiteral {...nrProps}
                      id={'11tydg'}
                      handleMyItemsChange={mockMyItemsChange}
                      handleRemoveItem={mockRemoveItem}
                      handleMyItemsLangChange={jest.fn()}
                      items={[{ content: 'fooby', id: 0, lang: { items: [{ label: 'English' }] } }]}/>,
      )

      expect(nonrepeatWrapper.exists('input', { disabled: true })).toBe(true)
    })

    it('input does not have disabled attribute when there are no items', () => {
      const nonrepeatWrapper = shallow(
        <InputLiteral {...nrProps}
                      id={'11tydg'}
                      handleMyItemsChange={mockMyItemsChange}
                      handleRemoveItem={mockRemoveItem}
                      handleMyItemsLangChange={jest.fn()}
                      items={[]}/>,
      )
      expect(nonrepeatWrapper.exists('input', { disabled: false })).toBe(true)
    })
  })
})

describe('When a user enters non-roman text in a work title', () => {
  const artOfWar = '战争的艺术' // Chinese characters for Sun Tzu's Art of War
  const mockDataFn = jest.fn()

  const workTitleProps = {
    propertyTemplate:
    {
      propertyLabel: 'Work Title',
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
      type: 'literal',
      mandatory: 'false',
      repeatable: 'true',
    },
  }

  const workTitleWrapper = shallow(
    <InputLiteral {...workTitleProps}
                  id={14}
                  handleMyItemsChange={mockDataFn}
                  handleMyItemsLangChange={jest.fn()} />,
  )

  it('allows user to enter Chinese characters', () => {
    workTitleWrapper.find('input').simulate('change', { target: { value: artOfWar } })
    workTitleWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    workTitleWrapper.setProps({
      formData: {
        id: 1,
        uri: 'http://id.loc.gov/ontologies/bibframe/title',
      },
      items: [{ content: artOfWar, id: 1, lang: { label: 'Mandarin' } }],
    })
    expect(workTitleWrapper.find('div#userInput').text().includes(artOfWar)).toBeTruthy()
  })
})
