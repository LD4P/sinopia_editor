import 'jsdom-global/register'
import Login from '../../src/components/Login'
import React from 'react'
import { mount } from "enzyme"

describe('Login', () => {
  it('should call the cognitoLogin function', () => {
    const context = { state: {from: { pathname: '/fake'}}}
    const wrapper = mount(<Login location={context} test={true}/>)
    const spy = jest.spyOn(wrapper.instance(), 'cognitoLogin')
    spy.mockImplementation(() => "mock")
    expect(wrapper.instance().cognitoLogin('url')).toEqual('mock')
  })

  it('displays a message for the import path', () => {
    const fromTemplates = {state: {from: { pathname: '/templates'}}}
    const wrapper = mount(<Login location={fromTemplates} test={true}/>)
    expect(wrapper.find('div.alert-warning').text()).toMatch('You must be logged in to access the "templates" path')
  })

  it('does not display a message when routing from the editor path', () => {
    const fromEditor = {state: {from: { pathname: '/editor'}}}
    const wrapper = mount(<Login location={fromEditor} test={true}/>)
    expect(wrapper.find('div.alert-warning').exists()).toBeFalsy()
  })

})
