// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import { InputLiteral } from '../../../src/components/editor/InputLiteral'

let plProps = {
  "propertyTemplate":
    {
      "propertyLabel": "Instance of",
      "propertyURI": "http://id.loc.gov/ontologies/bibframe/instanceOf",
      "type": "literal",
      "mandatory": "",
      "repeatable": ""
    }
}

const valConstraintProps = {
  "valueTemplateRefs": [],
  "useValuesFrom": [],
  "valueDataType": {},
  "defaults": [
    {
      "defaultURI": "http://id.loc.gov/vocabulary/organizations/dlc",
      "defaultLiteral": "DLC"
    }
  ]
}

describe('<InputLiteral />', () => {
  const wrapper = shallow(<InputLiteral {...plProps} id={10} rtId={'resourceTemplate:bf2:Monograph:Instance'}/>)

  it('contains a label with "Instance of"', () => {
    expect(wrapper.find('label').text()).toBe('Instance of')
  })

  it('<input> element should have a placeholder attribute with value propertyLabel', () => {
    expect(wrapper.find('input').props().placeholder).toBe('Instance of')
  })

  it('contains required="true" attribute on input tag when mandatory is true', () => {
    wrapper.instance().props.propertyTemplate.mandatory = "true"
    wrapper.instance().forceUpdate() /** update plProps with mandatory: "true" **/
    expect(wrapper.find('input').prop('required')).toBeTruthy()
    expect(wrapper.find('label > RequiredSuperscript')).toBeTruthy()
  })

  it('contains required="false" attribute on input tag when mandatory is false', () => {
    wrapper.instance().props.propertyTemplate.mandatory = "false"
    wrapper.instance().forceUpdate()
    expect(wrapper.find('input').prop('required')).toBeFalsy()
  })

  it('label contains a PropertyRemark when a remark is added', () => {
    wrapper.instance().props.propertyTemplate.remark = "http://rda.test.org/1.1"
    wrapper.instance().forceUpdate()
    const propertyRemark = wrapper.find('label > PropertyRemark')
    expect(propertyRemark).toBeTruthy()
  })

})

describe('When the user enters input into field', ()=>{
  let mock_wrapper;
  // our mock formData function to replace the one provided by mapDispatchToProps
  const mockFormDataFn = jest.fn()
  const removeMockDataFn = jest.fn()
  mock_wrapper = shallow(<InputLiteral {...plProps} id={11}
                                       rtId={'resourceTemplate:bf2:Monograph:Instance'}
                                       handleMyItemsChange={mockFormDataFn}
                                       handleRemoveItem={removeMockDataFn}/>)

  it('has an id value as a unique property', () => {
    expect(mock_wrapper.find('input').prop('id')).toEqual("typeLiteral11")
  })

  it('calls the mockFormDataFn', () => {
    mock_wrapper.find('input').simulate("change", { target: { value: "foo" }})
    expect(mock_wrapper.state('content_add')).toEqual('foo') /** expect state to have value onChange **/
    mock_wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})
    expect(mockFormDataFn.mock.calls.length).toBe(1)
  })

  it('should be called with the users input as arguments', () => {
    mock_wrapper.instance().props.propertyTemplate.repeatable = "false"
    mock_wrapper.instance().forceUpdate()
    mock_wrapper.find('input').simulate("change", { target: { value: "foo" }})
    mock_wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})
    // test to see arguments used after its been submitted
    expect(mockFormDataFn.mock.calls[1][0]).toEqual(
      {id: "http://id.loc.gov/ontologies/bibframe/instanceOf", items:[{content: 'foo', id: 0}], "rtId": "resourceTemplate:bf2:Monograph:Instance"}
    )
    mockFormDataFn.mock.calls = [] // reset the redux store to empty
  })

  it('property template contains repeatable "true", allowed to add more than one item into myItems array', () => {
    mock_wrapper.instance().props.propertyTemplate.repeatable = "true"
    mock_wrapper.instance().forceUpdate()
    mock_wrapper.find('input').simulate("change", { target: { value: "fooby" }})
    mock_wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})
    mock_wrapper.find('input').simulate("change", { target: { value: "bar" }})
    mock_wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})

    expect(mockFormDataFn.mock.calls[0][0]).toEqual(
      {id: "http://id.loc.gov/ontologies/bibframe/instanceOf", items:[{content: 'fooby', id: 1}], "rtId": "resourceTemplate:bf2:Monograph:Instance"}
    )
    expect(mockFormDataFn.mock.calls[1][0]).toEqual(
      {id: "http://id.loc.gov/ontologies/bibframe/instanceOf", items:[{content: 'bar', id: 2}], "rtId": "resourceTemplate:bf2:Monograph:Instance"}
    )
    mockFormDataFn.mock.calls = [] // reset the redux store to empty
  })

  it('property template contains repeatable "false", only allowed to add one item to redux', () => {
    mock_wrapper.instance().props.propertyTemplate.repeatable = "false"
    mock_wrapper.instance().forceUpdate()

    mock_wrapper.find('input').simulate("change", { target: { value: "fooby" }})
    mock_wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})

    mock_wrapper.setProps({formData: { id: "http://id.loc.gov/ontologies/bibframe/instanceOf", items: [{content: "fooby", id: 0}]} })

    mock_wrapper.find('input').simulate("change", { target: { value: "bar" }})
    mock_wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})

    expect(mockFormDataFn.mock.calls[0][0]).toEqual(
      {id: "http://id.loc.gov/ontologies/bibframe/instanceOf", items:[{content: 'fooby', id: 3}], "rtId": "resourceTemplate:bf2:Monograph:Instance"}
    )
    expect(mockFormDataFn.mock.calls[1][0]).toEqual(
      {id: "http://id.loc.gov/ontologies/bibframe/instanceOf", items:[], "rtId": "resourceTemplate:bf2:Monograph:Instance"}
    )
    mockFormDataFn.mock.calls = [] // reset the redux store to empty

    mock_wrapper.setProps({formData: undefined }) // reset props for next test
  })

  it('required is only true for first item in myItems array', () => {
    mock_wrapper.instance().props.propertyTemplate.mandatory = "true"
    mock_wrapper.instance().props.propertyTemplate.repeatable = "true"
    mock_wrapper.instance().forceUpdate()
    expect(mock_wrapper.find('input').prop('required')).toBeTruthy()
    mock_wrapper.find('input').simulate("change", { target: { value: "foo" }})
    expect(mock_wrapper.state('content_add')).toEqual('foo')
    mock_wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})
    mock_wrapper.setProps({formData: { id: "http://id.loc.gov/ontologies/bibframe/instanceOf", items: [{content: "foo", id: 4}]} })
    expect(mock_wrapper.find('input').prop('required')).toBeFalsy()
    mock_wrapper.setProps({formData: undefined }) // reset props for next test
  })

  it('item appears when user inputs text into the field', () => {
    mock_wrapper.instance().props.propertyTemplate.repeatable = "false"
    mock_wrapper.instance().forceUpdate()
    mock_wrapper.setProps({formData: { id: "http://id.loc.gov/ontologies/bibframe/instanceOf", items: [{content: "foo", id: 4}]} })
    expect(mock_wrapper.find('div#userInput').text()).toEqual('fooX<Button /><Modal />') // contains X as a button to delete the input
    mock_wrapper.setProps({formData: undefined }) // reset props for next test
    mockFormDataFn.mock.calls = [] // reset the redux store to empty
  })

  it('should call the removeMockDataFn when X is clicked', () => {
    mock_wrapper.setProps({formData: { id: "http://id.loc.gov/ontologies/bibframe/instanceOf", items: [{content: "test", id: 5}]} })
    expect(removeMockDataFn.mock.calls.length).toEqual(0);
    mock_wrapper.find('button#displayedItem').first().simulate('click', { target: { "dataset": {"item": 5 }}})
    expect(removeMockDataFn.mock.calls.length).toEqual(1);
  })

  it('shows the <InputLang> modal when the <Button/> is clicked', () => {
    mock_wrapper.find('Button').first().simulate('click')
    expect(mock_wrapper.find('ModalTitle').render().text()).toEqual('Languages')
  })

})

describe('when there is a default literal value in the property template', () => {
  plProps.propertyTemplate['valueConstraint'] = valConstraintProps
  const mockFormDataFn = jest.fn()
  const wrapper = shallow(<InputLiteral {...plProps} id={12}
                                        blankNodeForLiteral={{ termType: 'BlankNode', value: 'n3-0'}}
                                        rtId={'resourceTemplate:bf2:Monograph:Instance'}
                                        handleMyItemsChange={mockFormDataFn} />)

  it('sets the default values according to the property template if they exist', () => {
    const defaults = [{
      content: 'DLC',
      id: 0,
      bnode: { termType: 'BlankNode', value: 'n3-0'}
    }]
    expect(wrapper.state('defaults')).toEqual(defaults)
    expect(mockFormDataFn.mock.calls[0][0]).toEqual(
      {
        id: "http://id.loc.gov/ontologies/bibframe/instanceOf",
        items:[{ content: 'DLC', id: 0, bnode: { termType: 'BlankNode', value: 'n3-0' }, propPredicate: undefined }],
        rtId: "resourceTemplate:bf2:Monograph:Instance"
      }
    )
  })
})

