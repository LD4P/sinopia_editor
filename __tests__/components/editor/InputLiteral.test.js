// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import InputLiteral from '../../../src/components/editor/InputLiteral'

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
    expect(wrapper.find('input').prop('required')).toEqual('required')
  })
  it('contains required="false" attribute on input tag when mandatory is false', () => {
    wrapper.instance().props.propertyTemplate.mandatory = "false"
    wrapper.instance().forceUpdate()    
    expect(wrapper.find('input').prop('required')).toBeFalsy()
  })
  it('property template contains repeatable "true", allowed to add more than one item into myItems array', () => {
    wrapper.instance().props.propertyTemplate.repeatable = "true"
    wrapper.instance().forceUpdate()

    wrapper.find('input').simulate("change", { target: { value: "foo" }})
    expect(wrapper.state('content_add')).toEqual('foo') /** expect state to have value onChange **/
    wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})
    wrapper.find('input').simulate("change", { target: { value: "bar" }})
    expect(wrapper.state('content_add')).toEqual('bar')
    wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})
    expect(wrapper.state('myItems').length).toEqual(2)
    wrapper.setState({content_add : '', myItems: []}) /** reset state **/
  })
  it('property template contains repeatable "false", only allowed to add one item into myItems array.', () => {
    wrapper.instance().props.propertyTemplate.repeatable = "false"
    wrapper.instance().forceUpdate()    

    wrapper.find('input').simulate("change", { target: { value: "foo" }})
    expect(wrapper.state('content_add')).toEqual('foo')
    wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})
    wrapper.find('input').simulate("change", { target: { value: "bar" }})
    expect(wrapper.state('content_add')).toEqual('bar')
    wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})
    expect(wrapper.state('myItems').length).toEqual(1)
    wrapper.setState({content_add : '', myItems: []})
  })
  it('after adding one item into myItems array, required turns to false.', () => {
    wrapper.instance().props.propertyTemplate.mandatory = "true"
    wrapper.instance().props.propertyTemplate.repeatable = "true"
    wrapper.instance().forceUpdate()

    expect(wrapper.find('input').prop('required')).toEqual('required')
    wrapper.find('input').simulate("change", { target: { value: "foo" }})
    expect(wrapper.state('content_add')).toEqual('foo')
    wrapper.find('input').simulate('keypress', {key: 'Enter', preventDefault: () => {}})
    expect(wrapper.find('input').prop('required')).toBeFalsy()
  })
  it('click on user added list item to remove that item', () => {
    wrapper.setState({content_add : '', myItems: [ {content: 'foo', id: 0}, {content: 'bar', id: 1}]})
    expect(wrapper.find('button').length).toEqual(2)
    wrapper.find('button').first().simulate('click', { target: { "dataset": {"item": 0 }}});
    expect(wrapper.find('button').length).toEqual(1)
  })
})
