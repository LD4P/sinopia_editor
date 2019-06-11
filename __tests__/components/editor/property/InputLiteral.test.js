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
  const wrapper = shallow(<InputLiteral {...plProps} id={10} rtId={'resourceTemplate:bf2:Monograph:Instance'}/>)

  it('contains a placeholder of "Instance of"', () => {
    expect(wrapper.find('input').props().placeholder).toBe('Instance of')
  })

  it('<input> element should have a placeholder attribute with value propertyLabel', () => {
    expect(wrapper.find('input').props().placeholder).toBe('Instance of')
  })

  it('contains required="true" attribute on input tag when mandatory is true', () => {
    wrapper.instance().props.propertyTemplate.mandatory = 'true'
    wrapper.instance().forceUpdate() /** Update plProps with mandatory: "true" * */
    expect(wrapper.find('input').prop('required')).toBeTruthy()
    expect(wrapper.find('label > RequiredSuperscript')).toBeTruthy()
  })

  it('contains required="false" attribute on input tag when mandatory is false', () => {
    wrapper.instance().props.propertyTemplate.mandatory = 'false'
    wrapper.instance().forceUpdate()
    expect(wrapper.find('input').prop('required')).toBeFalsy()
  })

  it('label contains a PropertyRemark when a remark is added', () => {
    wrapper.instance().props.propertyTemplate.remark = 'http://rda.test.org/1.1'
    wrapper.instance().forceUpdate()
    const propertyRemark = wrapper.find('label > PropertyRemark')

    expect(propertyRemark).toBeTruthy()
  })
})

describe('checkMandatoryRepeatable', () => {
  const wrapper = shallow(<InputLiteral {...plProps} id={10} rtId={'resourceTemplate:bf2:Monograph:Instance'}/>)

  it('is true when the field is mandatory and nothing has been filled in', () => {
    wrapper.instance().props.propertyTemplate.mandatory = 'true'
    wrapper.instance().forceUpdate()
    expect(wrapper.find('input').prop('required')).toBeTruthy()
  })
})

describe('When the user enters input into field', () => {
  // Our mock formData function to replace the one provided by mapDispatchToProps
  const mockFormDataFn = jest.fn()
  const removeMockDataFn = jest.fn()

  shortid.generate = jest.fn().mockReturnValue(0)
  const mockWrapper = shallow(<InputLiteral {...plProps} id={'11'}
                                            rtId={'resourceTemplate:bf2:Monograph:Instance'}
                                            reduxPath={[
                                              'resourceTemplate:bf2:Monograph:Instance',
                                              'http://id.loc.gov/ontologies/bibframe/instanceOf',
                                            ]}
                                            handleMyItemsChange={mockFormDataFn}
                                            handleRemoveItem={removeMockDataFn}
                                            handleMyItemsLangChange={jest.fn()} />)

  // Make sure spies/mocks don't leak between tests
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('has an id value as a unique property', () => {
    expect(mockWrapper.find('input').prop('id')).toEqual('11')
  })

  it('calls handleMyItemsChange function', () => {
    mockWrapper.find('input').simulate('change', { target: { value: 'foo' } })
    expect(mockWrapper.state('content_add')).toEqual('foo') /* Expect state to have value onChange */
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    expect(mockFormDataFn.mock.calls.length).toBe(1)
  })

  it('should be called with the users input as arguments', () => {
    mockWrapper.instance().props.propertyTemplate.repeatable = 'false'
    mockWrapper.instance().forceUpdate()
    mockWrapper.find('input').simulate('change', { target: { value: 'foo' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    // Test to see arguments used after its been submitted
    expect(mockFormDataFn.mock.calls[1][0]).toEqual(
      {
        uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
        items: [{ content: 'foo', id: 0 }],
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
      },
    )
    mockFormDataFn.mock.calls = [] // Reset the redux store to empty
  })

  it('property template contains repeatable "true", allowed to add more than one item into myItems array', () => {
    mockWrapper.instance().props.propertyTemplate.repeatable = 'true'
    mockWrapper.instance().forceUpdate()
    mockWrapper.find('input').simulate('change', { target: { value: 'fooby' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    mockWrapper.find('input').simulate('change', { target: { value: 'bar' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })

    expect(mockFormDataFn.mock.calls[0][0]).toEqual(
      {
        uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
        items: [{ content: 'fooby', id: 0 }],
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
      },
    )
    expect(mockFormDataFn.mock.calls[1][0]).toEqual(
      {
        uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
        items: [{ content: 'bar', id: 0 }],
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
      },
    )
    mockFormDataFn.mock.calls = [] // Reset the redux store to empty
  })

  it('property template contains repeatable "false", only allowed to add one item to redux', () => {
    mockWrapper.instance().props.propertyTemplate.repeatable = 'false'
    mockWrapper.instance().forceUpdate()

    mockWrapper.find('input').simulate('change', { target: { value: 'fooby' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })

    mockWrapper.setProps({
      formData: {
        uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
        items: [{ content: 'fooby', id: 0, lang: { items: [{ label: 'English' }] } }],
      },
    })

    mockWrapper.find('input').simulate('change', { target: { value: 'bar' } })
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })

    expect(mockFormDataFn.mock.calls[0][0]).toEqual(
      {
        uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
        items: [{ content: 'fooby', id: 0 }],
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
      },
    )
    expect(mockFormDataFn.mock.calls[1][0]).toEqual(
      {
        uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
        items: [],
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
      },
    )
    mockFormDataFn.mock.calls = [] // Reset the redux store to empty

    mockWrapper.setProps({ formData: undefined }) // Reset props for next test
  })

  it('required is only true for first item in myItems array', () => {
    mockWrapper.instance().props.propertyTemplate.mandatory = 'true'
    mockWrapper.instance().props.propertyTemplate.repeatable = 'true'
    mockWrapper.instance().forceUpdate()
    expect(mockWrapper.find('input').prop('required')).toBeTruthy()
    mockWrapper.find('input').simulate('change', { target: { value: 'foo' } })
    expect(mockWrapper.state('content_add')).toEqual('foo')
    mockWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    mockWrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'foo', id: 4, lang: { items: [{ label: 'English' }] } }] } })
    expect(mockWrapper.find('input').prop('required')).toBeFalsy()
    mockWrapper.setProps({ formData: undefined }) // Reset props for next test
  })

  it('item appears when user inputs text into the field', () => {
    mockWrapper.instance().props.propertyTemplate.repeatable = 'false'
    mockWrapper.instance().forceUpdate()
    mockWrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'foo', id: 4, lang: { items: [{ label: 'English' }] } }] } })
    expect(mockWrapper.find('div#userInput').text()).toEqual('fooXEdit<Button /><Modal />') // Contains X and Edit as buttons
    expect(mockWrapper.find('Button#language').childAt(1).text()).toEqual('English')
    mockWrapper.setProps({ formData: undefined }) // Reset props for next test
    mockFormDataFn.mock.calls = [] // Reset the redux store to empty
  })

  it('should call the removeMockDataFn when X is clicked', () => {
    mockWrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'test', id: 5, lang: { items: [{ label: 'English' }] } }] } })
    expect(removeMockDataFn.mock.calls.length).toEqual(0)
    mockWrapper.find('button#deleteItem').first().simulate('click', { target: { dataset: { item: 5 } } })
    expect(removeMockDataFn.mock.calls.length).toEqual(1)
    mockFormDataFn.mock.calls = []
  })

  it('should call the removeMockDataFn and mockFormDataFn when Edit is clicked', () => {
    removeMockDataFn.mock.calls = []
    expect(mockWrapper.instance().inputLiteralRef).toEqual({ current: null })
    const mockFocusFn = jest.fn()

    mockWrapper.instance().inputLiteralRef.current = { focus: mockFocusFn }

    mockWrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'test', id: 5, lang: { items: [{ label: 'English' }] } }] } })
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
      propertyTemplate:
        {
          propertyLabel: 'Instance of',
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
          type: 'literal',
          mandatory: '',
          repeatable: '',
          valueConstraint: valConstraintProps,
        },
    }
    const wrapper = shallow(<InputLiteral propertyTemplate={plProps.propertyTemplate} id={12}
                                          blankNodeForLiteral={{ termType: 'BlankNode', value: 'n3-0' }}
                                          handleMyItemsChange={mockMyItemsChange}
                                          rtId={'resourceTemplate:bf2:Monograph:Instance'}
                                          handleMyItemsLangChange={jest.fn()} />)
    // Mocking a call to the Redux store
    const items = [{
      uri: 'http://id.loc.gov/vocabulary/organizations/dlc',
      content: 'DLC',
      lang: { items: [{ label: 'English' }] },
    }]

    wrapper.setProps({
      formData: {
        items,
      },
    })
    wrapper.instance().forceUpdate()
    expect(wrapper.find('#userInput').text()).toMatch(items[0].content)
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
    }

    const nonrepeatWrapper = shallow(
      <InputLiteral {...nrProps}
                    id={'11tydg'}
                    rtId={'resourceTemplate:bf2:Monograph:Instance'}
                    handleMyItemsChange={mockMyItemsChange}
                    handleRemoveItem={mockRemoveItem}
                    handleMyItemsLangChange={jest.fn()} />,
    )

    it('input has disabled attribute set to "true" when repeatable is "false" and an item is added', () => {
      nonrepeatWrapper.find('input').simulate('change', { target: { value: 'fooby' } })
      nonrepeatWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
      nonrepeatWrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'fooby', id: 0, lang: { items: [{ label: 'English' }] } }] } })
      expect(nonrepeatWrapper.find('input').props('disabled')).toBeTruthy()
    })

    it('input no longer disabled if item is removed when repeatable="false"', () => {
      nonrepeatWrapper.find('button#deleteItem').simulate('click', { target: { dataset: { item: 0 } } })
      expect(nonrepeatWrapper.find('input').props().disabled).toBeFalsy()
    })
  })
})

describe('when repeatable="false" and defaults exist', () => {
  const defaultProps = {
    propertyTemplate:
    {
      propertyLabel: 'Instance of',
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
      type: 'literal',
      mandatory: '',
      repeatable: 'false',
      valueConstraint: {
        defaults: [
          {
            defaultURI: 'http://id.loc.gov/vocabulary/organizations/dlc',
            defaultLiteral: 'DLC',
          },
        ],
      },
    },
  }

  const defaultWrapper = shallow(
    <InputLiteral {...defaultProps}
                  id={'234abcd'}
                  rtId={'resourceTemplate:bf2:Monograph:Item'}
                  formData={{ items: [{ id: 'iop12', content: 'DLC', lang: { items: [{ label: 'English' }] } }] }} />,
  )

  it('in the initial display, the input field is disabled ', () => {
    expect(defaultWrapper.find('input').props().disabled).toBeTruthy()
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
                  handleMyItemsLangChange={jest.fn()}
                  rtId={'resourceTemplate:bflc:WorkTitle'} />,
  )

  it('allows user to enter Chinese characters', () => {
    workTitleWrapper.find('input').simulate('change', { target: { value: artOfWar } })
    workTitleWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    workTitleWrapper.setProps({
      formData: {
        id: 1,
        uri: 'http://id.loc.gov/ontologies/bibframe/title',
        items: [{ content: artOfWar, id: 1, lang: { items: [{ label: 'Mandarin' }] } }],
      },
    })
    expect(workTitleWrapper.find('div#userInput').text().includes(artOfWar)).toBeTruthy()
    expect(workTitleWrapper.find('Button#language').childAt(1).text()).toEqual('Mandarin')
  })
})

describe('When the user enters input into language modal', () => {
  const mockMyItemsLangChange = jest.fn()

  shortid.generate = jest.fn().mockReturnValue(0)
  const mockWrapper = shallow(<InputLiteral {...plProps} id={'11'}
                                            rtId={'resourceTemplate:bf2:Monograph:Instance'}
                                            reduxPath={[
                                              'resourceTemplate:bf2:Monograph:Instance',
                                              'http://id.loc.gov/ontologies/bibframe/instanceOf',
                                            ]}
                                            handleMyItemsChange={jest.fn()}
                                            handleRemoveItem={jest.fn()}
                                            handleMyItemsLangChange={mockMyItemsLangChange} />)

  it('shows the <InputLang> modal when the <Button/> is clicked', () => {
    mockWrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'test', id: 6, lang: { items: [{ label: 'English' }] } }] } })
    mockWrapper.find('Button').first().simulate('click')
    expect(mockWrapper.find('Modal').prop('show')).toEqual(true)
    expect(mockWrapper.find('ModalTitle').render().text()).toEqual('Languages')
  })

  it('calls handleLangSubmit when submit is clicked', () => {
    mockWrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'test', id: 6, lang: { items: [{ label: 'English' }] } }] } })
    mockWrapper.find('Button').first().simulate('click')
    expect(mockWrapper.find('Modal').prop('show')).toEqual(true)
    mockWrapper.find('ModalFooter').find('Button').first().simulate('click')
    expect(mockMyItemsLangChange.mock.calls.length).toEqual(1)
    expect(mockWrapper.find('Modal').prop('show')).toEqual(false)

    mockMyItemsLangChange.mock.calls = []
  })

  it('closes modal when close is clicked', () => {
    mockWrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'test', id: 6, lang: { items: [{ label: 'English' }] } }] } })
    mockWrapper.find('Button').first().simulate('click')
    expect(mockWrapper.find('Modal').prop('show')).toEqual(true)
    mockWrapper.find('ModalFooter').find('Button').last().simulate('click')
    expect(mockMyItemsLangChange.mock.calls.length).toEqual(0)
    expect(mockWrapper.find('Modal').prop('show')).toEqual(false)

    mockMyItemsLangChange.mock.calls = []
  })
})
