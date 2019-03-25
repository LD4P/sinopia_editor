// Copyright 2018 Stanford University see Apache2.txt for license

import 'jsdom-global/register'
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from "react-router"
import LoginPanel from '../../src/components/LoginPanel'
import Config from '../../src/Config'

describe('<LoginPanel /> when the user is not authenticated', () => {

  let wrapper = mount(
    <MemoryRouter>
      <LoginPanel />
    </MemoryRouter>
  )

  it('renders text You are not logged in', () => {
    expect(wrapper.find('form').text()).toMatch('You are not logged in.')
  })

  it ('renders a login button', () => {
    expect(wrapper.find('a.nav-link[type="button"]').text()).toEqual("Login")
  })

})

describe('<LoginPanel /> when the user is authenticated', () => {

  const mockLogOut = jest.fn()
  const wrapper = mount(
    <MemoryRouter>
      <LoginPanel logOut={mockLogOut} />
    </MemoryRouter>
  )

  wrapper.find(LoginPanel).instance().setState({userAuthenticated: true, userName: 'some-user'})
  wrapper.update()

  it('renders the welcome text with username', () => {
    expect(wrapper.find('form').text()).toMatch('Welcome some-user!')
  })

  it ('renders a sign-out button', () => {
    expect(wrapper.find('button').text()).toEqual("Sign out")
  })

  it('does a cognito aws logout', () => {
    wrapper.find('button').simulate('click')
    expect(mockLogOut).toHaveBeenCalled()
  })

  it ('renders forgot password link', () => {
    expect(wrapper.find('.login-form').text()).toMatch("Forgot Password")
  })

  it ('renders request account link', () => {
    expect(wrapper.find('.login-form').text()).toMatch("Request Account")
  })

  it('renders both links with AWS client id and domain name', () => {
    expect(wrapper.find(`a[href^="${Config.awsCognitoForgotPasswordUrl}"]`)).toHaveLength(1)
    expect(wrapper.find(`a[href^="${Config.awsCognitoResetPasswordUrl}"]`)).toHaveLength(1)
  })

})
