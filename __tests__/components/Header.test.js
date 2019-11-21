// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Header from 'components/Header'
import {
  CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, CognitoUserSession,
} from 'amazon-cognito-identity-js'
import CognitoUtils from 'CognitoUtils'

const props = {
  version: '1.0', // hardcode a version number for the test, in the actual app it will be set from the package.json file
}

describe('<Header />', () => {
  const wrapper = shallow(<Header.WrappedComponent {...props}/>)

  it('displays the Sinopia text with the environment name', () => {
    process.env = {
      SINOPIA_ENV: 'TEST',
    }
    const wrapper = shallow(<Header.WrappedComponent {...props}/>) // needed to ensure our env change gets picked up
    expect(wrapper.find('h1.editor-logo').text()).toBe('LINKED DATA EDITOR - TEST')
  })

  it('displays the Sinopia subtitle', () => {
    expect(wrapper.find('.editor-subtitle').text()).toBe('SINOPIA')
  })

  it('displays the Sinopia version number', () => {
    expect(wrapper.find('.editor-version').text()).toBe('v1.0')
  })

  describe('nav tabs', () => {
    describe('when no resource in state', () => {
      it('displays 4 header tabs', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink').length).toBe(4)
      })
      it('has search URL', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink[to=\'/search\']').length).toBe(1)
      })
      it('has load URL', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink[to=\'/load\']').length).toBe(1)
      })
      it('has Import Resource Template URL', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink[to=\'/templates\']').length).toBe(1)
      })
      it('has Export URL', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink[to=\'/exports\']').length).toBe(1)
      })
    })
    describe('when a resource in state', () => {
      const wrapper = shallow(<Header.WrappedComponent hasResource={true} {...props}/>)

      it('displays 5 header tabs', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink').length).toBe(5)
      })
      it('has editor URL', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink[to=\'/editor\']').length).toBe(1)
      })
    })
  })
  describe('user related', () => {
    global.alert = jest.fn().mockImplementationOnce(() => {})

    const username = 't.mctesterson'
    const currentUser = CognitoUtils.cognitoUser(username)
    const currentSession = new CognitoUserSession({
      IdToken: new CognitoIdToken(), RefreshToken: new CognitoRefreshToken(), AccessToken: new CognitoAccessToken(),
    })

    currentUser.setSignInUserSession(currentSession)

    const signout = jest.fn()
    const wrapper = shallow(<Header.WrappedComponent hasResource={true} {...props}
                                                     currentUser={currentUser} signedOut={signout} />)

    it('shows username', () => {
      expect(wrapper.find('.editor-header-user').text()).toBe(username)
    })

    it('shows logout', () => {
      expect(wrapper.find('.editor-header-logout').text()).toBe('Logout')
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
        wrapper.find('a.editor-header-logout').simulate('click')
        expect(signout).toHaveBeenCalled()
        expect(signoutSpy).toHaveBeenCalled()
      })

      it('signout fails', () => {
        signoutSpy.mockImplementation((resultHandler) => { resultHandler.onFailure('must have already signed out or something') })
        wrapper.find('a.editor-header-logout').simulate('click')
        expect(signout).not.toHaveBeenCalled()
        expect(signoutSpy).toHaveBeenCalled()
        expect(global.alert).toHaveBeenCalled()
      })
    })
  })
  describe('<Header /> with no environment set', () => {
    const wrapper = shallow(<Header.WrappedComponent {...props}/>)

    it('displays the Sinopia text without any environment name when not set', () => {
      expect(wrapper.find('h1.editor-logo').text()).toBe('LINKED DATA EDITOR')
    })
  })
})
