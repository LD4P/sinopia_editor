/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
import React from 'react'
import { shallow } from 'enzyme'
import Header from '../../src/components/Header'
import SinopiaLogo from '../../styles/sinopia-logo.png'

describe('<Header />', () => {
  const wrapper = shallow(<Header />)
  it ('renders the Sinopia image', () => {
    expect(wrapper.find("img").prop('src')).toEqual(SinopiaLogo)
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
    expect(wrapper.find('a[href="https://profile-editor.sinopia.io/"]').text()).toBe('Profile Editor')
  })
})
