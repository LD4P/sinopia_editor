// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import LoginPanel from 'components/LoginPanel'
import Config from 'Config'

global.alert = jest.fn().mockImplementationOnce(() => {})

describe('<LoginPanel /> when the user is not authenticated', () => {
  const wrapper = shallow(<LoginPanel.WrappedComponent />)

  it('renders a username field', () => {
    expect(wrapper.find('label.text-uppercase input#username[type="text"]')).toHaveLength(1)
  })

  it('renders a password field', () => {
    expect(wrapper.find('label.text-uppercase input#password[type="password"]')).toHaveLength(1)
  })

  it('renders a login button', () => {
    expect(wrapper.find('.login-form button.btn-primary[type="submit"]').text()).toEqual('Login')
  })

  it('renders forgot password link, with URL from config', () => {
    const forgotPasswordLinkElts = wrapper.find(`.login-form a[href^="${Config.awsCognitoForgotPasswordUrl}"]`)

    expect(forgotPasswordLinkElts).toHaveLength(1)
    expect(forgotPasswordLinkElts.text()).toMatch('Forgot Password')
  })

  it('renders request account link, with URL from config', () => {
    const requestAccountLinkElts = wrapper.find(`.login-form a[href^="${Config.awsCognitoResetPasswordUrl}"]`)

    expect(requestAccountLinkElts).toHaveLength(1)
    expect(requestAccountLinkElts.text()).toMatch('Request Account')
  })
})

describe('<LoginPanel /> when there is an authentication failure', () => {
  const authenticationError = { message: 'borked!' }
  const wrapper = shallow(<LoginPanel.WrappedComponent authenticationError={authenticationError}/>)

  it('renders the failure message', () => {
    expect(wrapper.find('.login-form .error-message').text()).toMatch('borked!')
  })
})
