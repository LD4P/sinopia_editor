// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import Header from '../../src/components/Header'
import SinopiaLogo from '../../styles/sinopia-logo.png'
import Config from '../../src/Config'
import { Link } from 'react-router-dom'

describe('<Header />', () => {
  const wrapper = shallow(<Header />)
  it ('renders the Sinopia image', () => {
    expect(wrapper.find("img").prop('src')).toEqual(SinopiaLogo)
  })

  it('has alt text for the image', () => {
    expect(wrapper.find("img").prop('alt')).toEqual('Sinopia logo')
  })

  it ('renders a ".navbar"', () => {
    expect(wrapper.find('.navbar').length).toBe(1)
  })

  it ('mock renders an offcanvas menu', () => {
    const mockCB = jest.fn()
    const wrapper = shallow(<Header triggerHomePageMenu={mockCB} />)
    wrapper.find('.help-resources').simulate('click')
    expect(mockCB.mock.calls.length).toEqual(1)
  })

  it ('renders dropdown menu links', () => {
    expect(wrapper.find('a[href="https://ld4.slack.com/messages/#sinopia"]')).toBeDefined()
  })

  it('links to Sinopia Profile Editor', () => {
    expect(wrapper.find(`a[href="https://profile-editor.${Config.sinopiaUri}/"]`).text()).toBe('Profile Editor')
  })

  it('links to Linked Data Editor', () => {
    expect(wrapper.find(Link).props().to).toBe('/editor')
    expect(wrapper.find(Link).children(0).text()).toBe('Linked Data Editor')
  })

})
