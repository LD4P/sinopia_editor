// Copyright 2018, 2019 Stanford University see LICENSE for license
import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import shortid from 'shortid'
import { InputLiteral } from '../../../src/components/editor/InputLiteral'

const plProps = {
  propertyTemplate:
    {
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
  defaults: [
    {
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
    wrapper.instance().forceUpdate() /** update plProps with mandatory: "true" * */
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

describe('When the user enters input into field', () => {
  // our mock formData function to replace the one provided by mapDispatchToProps
  const mockFormDataFn = jest.fn()
  const removeMockDataFn = jest.fn()

  shortid.generate = jest.fn().mockReturnValue(0)
  const mock_wrapper = shallow(<InputLiteral {...plProps} id={'11'}
                                             rtId={'resourceTemplate:bf2:Monograph:Instance'}
                                             reduxPath={
                                               [
                                                 'resourceTemplate:bf2:Monograph:Instance',
                                                 'http://id.loc.gov/ontologies/bibframe/instanceOf',
                                               ]
                                             }
                                             handleMyItemsChange={mockFormDataFn}
                                             handleRemoveItem={removeMockDataFn} />)

  // Make sure spies/mocks don't leak between tests
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('has an id value as a unique property', () => {
    expect(mock_wrapper.find('input').prop('id')).toEqual('11')
  })

  it('calls handleMyItemsChange function', () => {
    mock_wrapper.find('input').simulate('change', { target: { value: 'foo' } })
    expect(mock_wrapper.state('content_add')).toEqual('foo') /* expect state to have value onChange */
    mock_wrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    expect(mockFormDataFn.mock.calls.length).toBe(1)
  })

  it('should be called with the users input as arguments', () => {
    mock_wrapper.instance().props.propertyTemplate.repeatable = 'false'
    mock_wrapper.instance().forceUpdate()
    mock_wrapper.find('input').simulate('change', { target: { value: 'foo' } })
    mock_wrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    // test to see arguments used after its been submitted
    expect(mockFormDataFn.mock.calls[1][0]).toEqual(
      {
        uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
        items: [{ content: 'foo', id: 0 }],
        reduxPath: ['resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
      },
    )
    mockFormDataFn.mock.calls = [] // reset the redux store to empty
  })

  it('property template contains repeatable "true", allowed to add more than one item into myItems array', () => {
    mock_wrapper.instance().props.propertyTemplate.repeatable = 'true'
    mock_wrapper.instance().forceUpdate()
    mock_wrapper.find('input').simulate('change', { target: { value: 'fooby' } })
    mock_wrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    mock_wrapper.find('input').simulate('change', { target: { value: 'bar' } })
    mock_wrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })

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
    mockFormDataFn.mock.calls = [] // reset the redux store to empty
  })

  it('property template contains repeatable "false", only allowed to add one item to redux', () => {
    mock_wrapper.instance().props.propertyTemplate.repeatable = 'false'
    mock_wrapper.instance().forceUpdate()

    mock_wrapper.find('input').simulate('change', { target: { value: 'fooby' } })
    mock_wrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })

    mock_wrapper.setProps({
      formData: {
        uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
        items: [{ content: 'fooby', id: 0 }],
      },
    })

    mock_wrapper.find('input').simulate('change', { target: { value: 'bar' } })
    mock_wrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })

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
    mockFormDataFn.mock.calls = [] // reset the redux store to empty

    mock_wrapper.setProps({ formData: undefined }) // reset props for next test
  })

  it('required is only true for first item in myItems array', () => {
    mock_wrapper.instance().props.propertyTemplate.mandatory = 'true'
    mock_wrapper.instance().props.propertyTemplate.repeatable = 'true'
    mock_wrapper.instance().forceUpdate()
    expect(mock_wrapper.find('input').prop('required')).toBeTruthy()
    mock_wrapper.find('input').simulate('change', { target: { value: 'foo' } })
    expect(mock_wrapper.state('content_add')).toEqual('foo')
    mock_wrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    mock_wrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'foo', id: 4 }] } })
    expect(mock_wrapper.find('input').prop('required')).toBeFalsy()
    mock_wrapper.setProps({ formData: undefined }) // reset props for next test
  })

  it('item appears when user inputs text into the field', () => {
    mock_wrapper.instance().props.propertyTemplate.repeatable = 'false'
    mock_wrapper.instance().forceUpdate()
    mock_wrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'foo', id: 4 }] } })
    expect(mock_wrapper.find('div#userInput').text()).toEqual('fooXEdit<Button /><Modal />') // contains X and Edit as buttons
    mock_wrapper.setProps({ formData: undefined }) // reset props for next test
    mockFormDataFn.mock.calls = [] // reset the redux store to empty
  })

  it('should call the removeMockDataFn when X is clicked', () => {
    mock_wrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'test', id: 5 }] } })
    expect(removeMockDataFn.mock.calls.length).toEqual(0)
    mock_wrapper.find('button#deleteItem').first().simulate('click', { target: { dataset: { item: 5 } } })
    expect(removeMockDataFn.mock.calls.length).toEqual(1)
    mockFormDataFn.mock.calls = []
  })

  it('should call the removeMockDataFn and mockFormDataFn when Edit is clicked', () => {
    removeMockDataFn.mock.calls = []
    expect(mock_wrapper.instance().inputLiteralRef).toEqual({ current: null })
    const mockFocusFn = jest.fn()

    mock_wrapper.instance().inputLiteralRef.current = { focus: mockFocusFn }

    mock_wrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'test', id: 5 }] } })
    expect(removeMockDataFn.mock.calls.length).toEqual(0)
    mock_wrapper.find('button#editItem').first().simulate('click', { target: { dataset: { item: 5 } } })
    expect(mock_wrapper.state('content_add')).toEqual('test')
    expect(removeMockDataFn.mock.calls.length).toEqual(1)
    expect(mockFocusFn.mock.calls.length).toEqual(1)
  })


  it('shows the <InputLang> modal when the <Button/> is clicked', () => {
    mock_wrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'test', id: 6 }] } })
    mock_wrapper.find('Button').first().simulate('click')
    expect(mock_wrapper.find('ModalTitle').render().text()).toEqual('Languages')
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
                                          rtId={'resourceTemplate:bf2:Monograph:Instance'} />)
    // Mocking a call to the Redux store
    const items = [{
      uri: 'http://id.loc.gov/vocabulary/organizations/dlc',
      content: 'DLC',
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

    const nonrepeat_wrapper = shallow(
      <InputLiteral {...nrProps}
                    id={'11tydg'}
                    rtId={'resourceTemplate:bf2:Monograph:Instance'}
                    handleMyItemsChange={mockMyItemsChange}
                    handleRemoveItem={mockRemoveItem} />,
    )

    it('input has disabled attribute set to "true" when repeatable is "false" and an item is added', () => {
      nonrepeat_wrapper.find('input').simulate('change', { target: { value: 'fooby' } })
      nonrepeat_wrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
      nonrepeat_wrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf', items: [{ content: 'fooby', id: 0 }] } })
      expect(nonrepeat_wrapper.find('input').props('disabled')).toBeTruthy()
    })

    it('input no longer disabled if item is removed when repeatable="false"', () => {
      nonrepeat_wrapper.find('button#deleteItem').first().simulate('click', { target: { dataset: { item: 0 } } })
      expect(nonrepeat_wrapper.find('input').props().disabled).toBeFalsy()
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

  const default_wrapper = shallow(
    <InputLiteral {...defaultProps}
                  id={'234abcd'}
                  rtId={'resourceTemplate:bf2:Monograph:Item'}
                  formData={{ items: [{ id: 'iop12', content: 'DLC' }] }} />,
  )

  it('in the initial display, the input field is disabled ', () => {
    expect(default_wrapper.find('input').props().disabled).toBeTruthy()
  })
})

describe('When a user enters non-roman text in a work title', () => {
  const art_of_war = '战争的艺术' // Chinese characters for Sun Tzu's Art of War
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
                  rtId={'resourceTemplate:bflc:WorkTitle'} />,
  )

  it('allows user to enter Chinese characters', () => {
    workTitleWrapper.find('input').simulate('change', { target: { value: art_of_war } })
    workTitleWrapper.find('input').simulate('keypress', { key: 'Enter', preventDefault: () => {} })
    workTitleWrapper.setProps({ formData: { id: 1, uri: 'http://id.loc.gov/ontologies/bibframe/title', items: [{ content: art_of_war, id: 1 }] } })
    expect(workTitleWrapper.find('div#userInput').text().includes(art_of_war)).toBeTruthy()
  })
})
