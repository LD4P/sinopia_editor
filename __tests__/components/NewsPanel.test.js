// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import NewsPanel from '../../src/components/NewsPanel'
import NewsItem from '../../src/components/NewsItem'
import LoginPanel from '../../src/components/LoginPanel'

describe('<NewsPanel />', () => {
  const wrapper = shallow(<NewsPanel />)

  it('renders <NewsItem /> component', () => {
    expect(wrapper.find(NewsItem)).toBeDefined()
  })

  it('renders <LoginPanel /> component', () => {
    expect(wrapper.find(LoginPanel)).toBeDefined()
  })
})
