// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Header from 'components/Header'

const props = {
  version: '1.0', // hardcode a version number for the test, in the actual app it will be set from the package.json file
}

describe('<Header />', () => {
  const wrapper = shallow(<Header.WrappedComponent {...props}/>)

  it('displays the Sinopia text with the environment name', () => {
    process.env = {
      SINOPIA_ENV: 'TEST',
    }
    const wrapper = shallow(<Header.WrappedComponent {...props}/>) // needed to ensure our env change gets picked up
    expect(wrapper.find('h1.editor-logo').text()).toBe('LINKED DATA EDITOR - TEST')
  })

  it('displays the Sinopia subtitle', () => {
    expect(wrapper.find('h2.editor-subtitle').text()).toBe('SINOPIA')
  })

  it('displays the Sinopia version number', () => {
    expect(wrapper.find('h2.editor-version').text()).toBe('v1.0')
  })

  describe('nav tabs', () => {
    describe('when no resource in state', () => {
      it('displays 3 header tabs', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink').length).toBe(3)
      })
      it('has search URL', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink[to=\'/search\']').length).toBe(1)
      })
      it('has load URL', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink[to=\'/load\']').length).toBe(1)
      })
      it('has Import Resource Template URL', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink[to=\'/templates\']').length).toBe(1)
      })
    })
    describe('when a resource in state', () => {
      const wrapper = shallow(<Header.WrappedComponent hasResource={true} {...props}/>)

      it('displays 4 header tabs', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink').length).toBe(4)
      })
      it('has editor URL', () => {
        expect(wrapper.find('ul.editor-navtabs NavLink[to=\'/editor\']').length).toBe(1)
      })
    })
  })
})

describe('<Header /> with no environment set', () => {
  const wrapper = shallow(<Header.WrappedComponent {...props}/>)

  it('displays the Sinopia text without any environment name when not set', () => {
    expect(wrapper.find('h1.editor-logo').text()).toBe('LINKED DATA EDITOR')
  })
})
