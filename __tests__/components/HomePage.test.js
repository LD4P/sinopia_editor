// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import HomePage from '../../src/components/HomePage'
import Header from '../../src/components/Header'
import NewsPanel from '../../src/components/NewsPanel'
import DescPanel from '../../src/components/DescPanel'

const mockJWTString = require('../../__mocks__/mockAWSData')

describe('<HomePage />', () =>{
  let location = { hash: `id_token=abcd1234&access_token=${mockJWTString}`}

  const mockJwtAuth = {
    isAuthenticated: false,
    authenticate() {
      this.isAuthenticated = true;
    }
  }

  const mockAuthenticate = jest.fn()
  const mockLoginData = jest.fn()
  const mockLogout = jest.fn()
  const wrapper = shallow(<HomePage.WrappedComponent location={location}
                                                     jwtAuth={{mockJwtAuth}}
                                                     loginData={mockLoginData}
                                                     authenticate={mockAuthenticate}
                                                     signout={mockLogout}
  />)

  it('selectable by id "home-page"', () => {
    expect(wrapper.is('#home-page')).toBe(true)
  })

  it('renders four <HomePage /> components', () => {
    expect(wrapper.find(Header).length).toBe(1)
    expect(wrapper.find(NewsPanel).length).toBe(1)
    expect(wrapper.find(DescPanel).length).toBe(1)
  })

  it('has a logout function', () => {
    const spy = jest.spyOn(wrapper.instance(), 'logOut').mockReturnValue('done')
    wrapper.instance().logOut()
    expect(spy).toHaveBeenCalled()
  })

})
