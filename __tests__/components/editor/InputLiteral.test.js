// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import { InputLiteral } from '../../../src/components/editor/InputLiteral'

const plProps = {
  "propertyTemplate": 
    {
      "propertyLabel": "Instance of",
      "type": "literal",
      "mandatory": "",
      "repeatable": ""
    }
}

describe('<InputLiteral />', () => {
  const wrapper = shallow(<InputLiteral {...plProps} />)
  
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
  })
  it('contains required="false" attribute on input tag when mandatory is false', () => {
    wrapper.instance().props.propertyTemplate.mandatory = "false"
    wrapper.instance().forceUpdate()    
    expect(wrapper.find('input').prop('required')).toBeFalsy()
  })
})




// Need to implement in ticket #245
  // it('required turns from false to true when user deletes all items', () => {
  //   wrapper.instance().props.propertyTemplate.mandatory = "true"
  //   wrapper.instance().props.propertyTemplate.repeatable = "true"
  //   wrapper.instance().forceUpdate()

  //   wrapper.find('input').simulate("change", { target: { value: "foo" }})
  //   expect(wrapper.state('content_add')).toEqual('foo')
  //   wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})
  //   expect(wrapper.find('button#displayedItem').length).toEqual(1)
  //   expect(wrapper.find('input').prop('required')).toBeFalsy()
  //   wrapper.find('button#displayedItem').first().simulate('click', { target: { "dataset": {"item": 4 }}});
  //   expect(wrapper.find('input').prop('required')).toBeTruthy()
  // })
  // it('remove item when user clicks on it', () => {
  //   wrapper.setState({content_add : '', myItems: [ {content: 'foo', id: 0}, {content: 'bar', id: 1}]})
  //   expect(wrapper.find('button#displayedItem').length).toEqual(2)
  //   wrapper.find('button#displayedItem').first().simulate('click', { target: { "dataset": {"item": 0 }}});
  //   expect(wrapper.find('button#displayedItem').length).toEqual(1)
  //   wrapper.setState({content_add : '', myItems: []}) /** reset state **/
  // })






describe('When the user enters input into field', ()=>{
  let mock_wrapper;
  // our mock formData function to replace the one provided by mapDispatchToProps
  const mockFormDataFn = jest.fn()
  mock_wrapper = shallow(<InputLiteral {...plProps} handleMyItemsChange={mockFormDataFn} />)

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
      {id: "Instance of", items:[{content: 'foo', id: 0}]}
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
      {id: "Instance of", items:[{content: 'fooby', id: 1}]}
    )
    expect(mockFormDataFn.mock.calls[1][0]).toEqual(
      {id: "Instance of", items:[{content: 'bar', id: 2}]}
    )
    mockFormDataFn.mock.calls = [] // reset the redux store to empty    
  })
  it('property template contains repeatable "false", only allowed to add one item to redux', () => {
    mock_wrapper.instance().props.propertyTemplate.repeatable = "false"
    mock_wrapper.instance().forceUpdate()

    mock_wrapper.find('input').simulate("change", { target: { value: "fooby" }})
    mock_wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})
    
    mock_wrapper.setProps({formData: { id: "Instance of", items: [{content: "fooby", id: 0}]} })
  
    mock_wrapper.find('input').simulate("change", { target: { value: "bar" }})
    mock_wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})    

    expect(mockFormDataFn.mock.calls[0][0]).toEqual(
      {id: "Instance of", items:[{content: 'fooby', id: 3}]}
    )
    expect(mockFormDataFn.mock.calls[1][0]).toEqual(
      {id: "Instance of", items:[]}
    )
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
    mock_wrapper.setProps({formData: { id: "Instance of", items: [{content: "foo", id: 4}]} })
    expect(mock_wrapper.find('input').prop('required')).toBeFalsy()
    mock_wrapper.setProps({formData: undefined }) // reset props for next test

  })
})

  