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
    const fromImport = {state: {from: { pathname: '/import'}}}
    const wrapper = mount(<Login location={fromImport} test={true}/>)
    expect(wrapper.find('div.alert-warning').text()).toMatch('You must be logged in to access the "import" path')
  })

  it('displays', () => {
    const fromEditor = {state: {from: { pathname: '/editor'}}}
    const wrapper = mount(<Login location={fromEditor} test={true}/>)
    expect(wrapper.find('div.alert-warning').exists()).toBeFalsy()
  })

})