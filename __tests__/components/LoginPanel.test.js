// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import {
  CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, CognitoUserSession,
} from 'amazon-cognito-identity-js'
import LoginPanel from '../../src/components/LoginPanel'
import Config from '../../src/Config'
import CognitoUtils from '../../src/CognitoUtils'

global.alert = jest.fn().mockImplementationOnce(() => {});

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

describe('<LoginPanel /> when the user is authenticated', () => {
  const username = 't.mctesterson'
  const currentUser = CognitoUtils.cognitoUser(username)
  const currentSession = new CognitoUserSession({
    IdToken: new CognitoIdToken(), RefreshToken: new CognitoRefreshToken(), AccessToken: new CognitoAccessToken(),
  })

  currentUser.setSignInUserSession(currentSession)

  const failToAuthenticate = jest.fn()
  const authenticate = jest.fn()
  const signout = jest.fn()

  const wrapper = shallow(<LoginPanel.WrappedComponent currentUser={currentUser}
                                                       currentSession={currentSession}
                                                       failToAuthenticate={failToAuthenticate}
                                                       authenticate={authenticate}
                                                       signout={signout}/>)

  it('renders the welcome text with the logged in user\'s username', () => {
    expect(wrapper.find('div.logged-in-user-info').text()).toMatch(`current cognito user: ${username}`)
  })

  it('renders a sign-out button', () => {
    expect(wrapper.find('button').text()).toEqual('Sign out')
  })

  describe('user tries to sign out of cognito', () => {
    const signoutSpy = jest.spyOn(wrapper.instance().props.currentUser, 'globalSignOut')

    afterEach(() => {
      signoutSpy.mockReset()
      signout.mockReset()
    })

    afterAll(() => {
      signoutSpy.mockRestore()
    })

    it('signout succeeds', () => {
      signoutSpy.mockImplementation((resultHandler) => { resultHandler.onSuccess('all signed out!') })
      wrapper.find('button.signout-btn').simulate('click')
      expect(signout).toHaveBeenCalled()
      expect(signoutSpy).toHaveBeenCalled()
    })

    it('signout fails', () => {
      signoutSpy.mockImplementation((resultHandler) => { resultHandler.onFailure('must have already signed out or something') })
      wrapper.find('button.signout-btn').simulate('click')
      expect(signout).not.toHaveBeenCalled()
      expect(signoutSpy).toHaveBeenCalled()
      expect(global.alert).toHaveBeenCalled()
    })
  })
})
