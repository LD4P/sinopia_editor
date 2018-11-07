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
