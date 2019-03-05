import 'jsdom-global/register'
import Login from '../../src/components/Login'
import React from 'react'
import { mount } from "enzyme"

describe('Login', () => {
  it('should call the cognitoLogin function', () => {
    const context = { state: 'fake' };
    const wrapper = mount(<Login location={context}/>)
    const spy = jest.spyOn(wrapper.instance(), 'cognitoLogin');
    spy.mockImplementation(() => "mock");
    expect(wrapper.instance().cognitoLogin('url')).toEqual('mock')
  })
})