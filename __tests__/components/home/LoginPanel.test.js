// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import LoginPanel from 'components/home/LoginPanel'
import Config from 'Config'
import CognitoUtils from 'CognitoUtils'
import {
  CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, CognitoUserSession,
} from 'amazon-cognito-identity-js'

global.alert = jest.fn().mockImplementationOnce(() => {})

describe('<LoginPanel /> when the user is not authenticated', () => {
  const wrapper = shallow(<LoginPanel.WrappedComponent />)

  it('renders a username field', () => {
    expect(wrapper.find('label input#username[type="text"]')).toHaveLength(1)
  })

  it('renders a password field', () => {
    expect(wrapper.find('label input#password[type="password"]')).toHaveLength(1)
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

describe('<LoginPanel /> when the user is authenticated', () => {
  const username = 't.mctesterson'
  const currentUser = CognitoUtils.cognitoUser(username)
  const currentSession = new CognitoUserSession({
    IdToken: new CognitoIdToken(), RefreshToken: new CognitoRefreshToken(), AccessToken: new CognitoAccessToken(),
  })
  currentUser.setSignInUserSession(currentSession)

  const wrapper = shallow(<LoginPanel.WrappedComponent currentSession={ currentSession } currentUser={ currentUser } />)

  it('does not render a username field', () => {
    expect(wrapper.find('label input#username[type="text"]')).toHaveLength(0)
  })

  it('does not render a password field', () => {
    expect(wrapper.find('label input#password[type="password"]')).toHaveLength(0)
  })

  it('does not render a login button', () => {
    expect(wrapper.find('.login-form button.btn-primary[type="submit"]')).toHaveLength(0)
  })

  it('does not renders forgot password link, with URL from config', () => {
    const forgotPasswordLinkElts = wrapper.find(`.login-form a[href^="${Config.awsCognitoForgotPasswordUrl}"]`)

    expect(forgotPasswordLinkElts).toHaveLength(0)
  })

  it('does not render request account link, with URL from config', () => {
    const requestAccountLinkElts = wrapper.find(`.login-form a[href^="${Config.awsCognitoResetPasswordUrl}"]`)

    expect(requestAccountLinkElts).toHaveLength(0)
  })
})

describe('<LoginPanel /> when there is an authentication failure', () => {
  const authenticationError = { message: 'borked!' }
  const wrapper = shallow(<LoginPanel.WrappedComponent authenticationError={authenticationError}/>)

  it('renders the failure message', () => {
    expect(wrapper.find('.login-form .error-message').text()).toMatch('borked!')
  })
})
