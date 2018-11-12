/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
import React from 'react'
import { shallow, render } from 'enzyme'
import LoginPanel from '../../src/components/LoginPanel'

describe('<LoginPanel />', () => {
  const wrapper = shallow(<LoginPanel />)
  const formGrpSel = "form.login-form > div.form-group"
  it ('renders the username field', () => {
    expect(wrapper.find(`${formGrpSel} > label`).at(0).text()).toEqual("Username")
    expect(wrapper.find(`${formGrpSel} > input[type="text"]`)).toBeDefined()
  })

  it ('renders the password field', () => {
    expect(wrapper.find(`${formGrpSel} > label`).at(1).text()).toEqual("Password")
    expect(wrapper.find(`${formGrpSel} > input[type="password"]`)).toBeDefined()
  })

  it ('renders a login button', () => {
    expect(wrapper.find('.btn[type="submit"]').text()).toEqual("Login")
  })

  it ('renders forgot password link', () => {
    expect(wrapper.find('.login-form').text()).toMatch("Forgot Password")
  })

  it ('renders request account link', () => {
    expect(wrapper.find('.login-form').text()).toMatch("Request Account")
  })

})
