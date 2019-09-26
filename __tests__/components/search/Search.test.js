// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Search from 'components/search/Search'

describe('<Search />', () => {
  const wrapper = shallow(<Search.WrappedComponent />)

  it('contains the main div', () => {
    expect(wrapper.find('div#search').length).toBe(1)
  })

  describe('when there are no search results due to a failed fetch', () => {
    const props = {
      query: '*',
      totalResults: 0,
      error: {
        message: 'error message!',
      },
    }

    const wrapper = shallow(<Search.WrappedComponent {...props} />)

    it('displays a warning message', () => {
      const alert = wrapper.find('Alert')
      expect(alert.length).toBe(1)
      expect(alert.dive().text()).toMatch('error message!')
    })

    it('dismisses the warning message', () => {
      wrapper.find('Alert').find('button').simulate('click')
      expect(wrapper.find('Alert').length).toBe(0)
    })
  })
})
