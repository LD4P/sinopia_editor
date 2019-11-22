// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import { Link } from 'react-router-dom'
import Header from 'components/home/Header'
import SinopiaLogo from 'styles/sinopia-logo.png'
import Config from 'Config'
import CognitoUtils from 'CognitoUtils'
import {
  CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, CognitoUserSession,
} from 'amazon-cognito-identity-js'

describe('<Header />', () => {
  const wrapper = shallow(<Header.WrappedComponent currentUser={ null } />)

  it('renders the Sinopia image', () => {
    expect(wrapper.find('img').prop('src')).toEqual(SinopiaLogo)
  })

  it('has alt text for the image', () => {
    expect(wrapper.find('img').prop('alt')).toEqual('Sinopia logo')
  })

  it('renders a ".navbar"', () => {
    expect(wrapper.find('.navbar').length).toBe(1)
  })

  it('mock renders an offcanvas menu', () => {
    const mockCB = jest.fn()
    const wrapper = shallow(<Header.WrappedComponent triggerHomePageMenu={mockCB} />)

    wrapper.find('.help-resources').simulate('click')
    expect(mockCB.mock.calls.length).toEqual(1)
  })

  it('renders dropdown menu links', () => {
    expect(wrapper.find('a[href="https://ld4.slack.com/messages/#sinopia"]')).toBeDefined()
  })

  it('links to Sinopia Profile Editor', () => {
    expect(wrapper.find(`a[href="https://profile-editor.${Config.sinopiaDomainName}/"]`).text()).toBe('Profile Editor')
  })

  it('links to Linked Data Editor', () => {
    expect(wrapper.find(Link).props().to).toBe('/templates')
    expect(wrapper.find(Link).children(0).text()).toBe('Linked Data Editor')
  })

  describe('when user is not logged in', () => {
    it('does not show username', () => {
      expect(wrapper.find('.editor-header-user')).toHaveLength(0)
    })

    it('does not show logout', () => {
      expect(wrapper.find('.editor-header-logout')).toHaveLength(0)
    })
  })

  describe('when user is logged in', () => {
    const username = 't.mctesterson'
    const currentUser = CognitoUtils.cognitoUser(username)
    const currentSession = new CognitoUserSession({
      IdToken: new CognitoIdToken(), RefreshToken: new CognitoRefreshToken(), AccessToken: new CognitoAccessToken(),
    })

    currentUser.setSignInUserSession(currentSession)

    const wrapper = shallow(<Header.WrappedComponent currentUser={ currentUser } />)

    it('shows username', () => {
      expect(wrapper.find('.editor-header-user').text()).toBe(username)
    })

    it('shows logout', () => {
      expect(wrapper.find('.editor-header-logout').text()).toBe('Logout')
    })
  })
})
