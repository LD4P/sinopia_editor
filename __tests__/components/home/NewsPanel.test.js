// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import NewsPanel from 'components/home/NewsPanel'
import NewsItem from 'components/home/NewsItem'
import LoginPanel from 'components/LoginPanel'

describe('<NewsPanel />', () => {
  const wrapper = shallow(<NewsPanel />)

  it('renders <NewsItem /> component', () => {
    expect(wrapper.find(NewsItem)).toBeDefined()
  })

  it('renders <LoginPanel /> component', () => {
    expect(wrapper.find(LoginPanel)).toBeDefined()
  })
})
