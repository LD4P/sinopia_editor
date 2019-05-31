// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import HomePage from '../../src/components/HomePage'
import Header from '../../src/components/Header'
import NewsPanel from '../../src/components/NewsPanel'
import DescPanel from '../../src/components/DescPanel'

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
