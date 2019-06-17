// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import HomePage from 'components/home/HomePage'
import Header from 'components/home/Header'
import NewsPanel from 'components/home/NewsPanel'
import DescPanel from 'components/home/DescPanel'

describe('<HomePage />', () => {
  const wrapper = shallow(<HomePage triggerHandleOffsetMenu={jest.fn()}/>)

  it('selectable by id "home-page"', () => {
    expect(wrapper.is('#home-page')).toBe(true)
  })

  it('renders three <HomePage /> components', () => {
    expect(wrapper.find(Header).length).toBe(1)
    expect(wrapper.find(NewsPanel).length).toBe(1)
    expect(wrapper.find(DescPanel).length).toBe(1)
  })
})
