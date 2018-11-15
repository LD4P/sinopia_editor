// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow, render } from 'enzyme'
import NewsItem from '../../src/components/NewsItem'

describe('<NewsItem />', () => {
  it ('renders the latest news', () => {
    const wrapper = shallow(<NewsItem />)
    expect(wrapper.find("div.news-item")).toBeDefined()
  })
})
