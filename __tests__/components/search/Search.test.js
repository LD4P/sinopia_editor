// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Search from 'components/search/Search'

describe('<Search />', () => {
  const wrapper = shallow(<Search.WrappedComponent />)

  it('contains the main div', () => {
    expect(wrapper.find('div#search').length).toBe(1)
  })
})
