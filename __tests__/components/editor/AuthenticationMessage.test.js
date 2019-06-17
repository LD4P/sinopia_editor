// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import AuthenticationMessage from 'components/editor/AuthenticationMessage'

describe('<AuthenticationMessage />', () => {
  describe('unauthenticated user', () => {
    const wrapper = shallow(<AuthenticationMessage.WrappedComponent currentSession={null}/>)

    it('displays an login warning message', () => {
      expect(wrapper.find('div.alert-warning').text()).toMatch('Alert! No data can be saved unless you are logged in with group permissions.')
    })
  })

  describe('authenticated user', () => {
    const session = { dummy: 'should be CognitoUserSession instance, but just checked for presence at present' }
    const wrapper = shallow(<AuthenticationMessage.WrappedComponent currentSession={session}/>)

    it('does not displays a login warning message', () => {
      expect(wrapper.exists('div.alert-warning')).toBe(false)
    })
  })
})
