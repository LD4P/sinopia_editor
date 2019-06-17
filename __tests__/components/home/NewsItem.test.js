// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import NewsItem from 'components/home/NewsItem'

describe('<NewsItem />', () => {
  const wrapper = shallow(<NewsItem />)

  it('renders the latest news', () => {
    expect(wrapper.find('div.news-item')).toBeDefined()
  })

  it('checks if links with target="_blank" also have rel="noopener noreferrer"', () => {
    wrapper.find('a[target="_blank"]').forEach((node) => {
      expect(node.prop('rel')).toEqual('noopener noreferrer')
    })
  })
})
