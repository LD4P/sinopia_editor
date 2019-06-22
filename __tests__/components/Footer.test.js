// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Footer from 'components/Footer'

describe('<Footer />', () => {
  const wrapper = shallow(<Footer />)

  it('renders the creative common license image', () => {
    expect(wrapper.find('img[alt=\'CC0\'][src^=\'https://i.creativecommons.org\']')).toBeDefined()
  })
  it('contains the ld4p link', () => {
    expect(wrapper.find('a[href="http://www.ld4p.org"]')).toBeDefined()
  })
  it('checks if links with target="_blank" also have "noopener noreferrer" in rel attribute', () => {
    wrapper.find('a[target="_blank"]').forEach((node) => {
      expect(node.prop('rel')).toMatch(/noopener noreferrer/)
    })
  })
})
