// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Header from 'components/Header'

const props = {
  version: '1.0', // hardcode a version number for the test, in the actual app it will be set from the package.json file
}

describe('<Header />', () => {
  const wrapper = shallow(<Header.WrappedComponent {...props}/>)

  it('displays the Sinopia text', () => {
    expect(wrapper.find('h1.editor-logo').text()).toBe('LINKED DATA EDITOR')
  })

  it('displays the Sinopia version number', () => {
    expect(wrapper.find('h2.editor-subtitle').text()).toBe('SINOPIA v1.0')
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
