// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Search from 'components/search/Search'

describe('<Search />', () => {
  const wrapper = shallow(<Search.WrappedComponent />)
  // This test should be expanded when the Browse page is further defined

  it('contains the main div', () => {
    expect(wrapper.find('div#search').length).toBe(1)
  })
})
