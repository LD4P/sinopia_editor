// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import NewsItem from 'components/home/NewsItem'
import { version } from '../../../package.json'

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

  it('renders the currently released version', () => {
    /*
      not a concern here, since the input is ours:
      "Detects RegExp(variable), which might allow an attacker to DOS your server with a long-running regular expression"
      - https://github.com/nodesecurity/eslint-plugin-security#detect-non-literal-regexp
     */
    // eslint-disable-next-line security/detect-non-literal-regexp
    expect(wrapper.text()).toMatch(new RegExp(`For complete ${version} release notes`))
  })
})
