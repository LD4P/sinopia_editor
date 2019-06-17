// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Header from 'components/Header'

describe('<Header />', () => {
  const wrapper = shallow(<Header />)

  it('displays the Sinopia text', () => {
    expect(wrapper.find('h1.editor-logo').text()).toBe('LINKED DATA EDITOR')
  })

  describe('nav tabs', () => {
    it('displays 3 header tabs', () => {
      expect(wrapper.find('ul.editor-navtabs NavLink').length).toBe(3)
    })
    it('has browse URL', () => {
      expect(wrapper.find('ul.editor-navtabs NavLink[to=\'/browse\']').length).toBe(1)
    })
    it('has editor URL', () => {
      expect(wrapper.find('ul.editor-navtabs NavLink[to=\'/editor\']').length).toBe(1)
    })
    it('has Import Resource Template URL', () => {
      expect(wrapper.find('ul.editor-navtabs NavLink[to=\'/templates\']').length).toBe(1)
    })
  })
})
