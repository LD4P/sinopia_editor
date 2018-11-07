import React from 'react'
import { shallow, render } from 'enzyme'
import Header from '../../src/components/Header'
import SinopiaLogo from '../../styles/sinopia-logo.png'

describe('<Header />', () => {
  const wrapper = shallow(<Header />)
  it ('renders the Sinopia image', () => {
    expect(wrapper.find("img").prop('src')).toEqual(SinopiaLogo)
  })

  it ('renders a ".navbar" w/ 4 dropdown menu options', () => {
    expect(wrapper.find('.navbar').length).toBe(1)
    expect(wrapper.find('.divider').length).toBe(4)
  })

  it ('renders a dropdown menu sections', () => {
    expect(wrapper.find('strong').at(0).text()).toEqual("Sinopia User Dashboard")
    expect(wrapper.find('strong').at(1).text()).toEqual("Contact Us")
    expect(wrapper.find('strong').at(2).text()).toEqual("Training Resources")
    expect(wrapper.find('strong').at(3).text()).toEqual("Website Usage")
    expect(wrapper.find('strong').at(4).text()).toEqual("External Resources")
  })

  it ('renders dropdown menu links', () => {
    expect(wrapper.find('a[href="https://ld4.slack.com/messages/#sinopia"]')).toBeDefined()
  })
})

