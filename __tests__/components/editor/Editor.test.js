// Copyright 2018 Stanford University see Apache2.txt for license
import React from 'react'
import { shallow } from 'enzyme'
import Editor from '../../../src/components/editor/Editor'
import ResourceTemplate from '../../../src/components/editor/ResourceTemplate'
import Header from '../../../src/components/editor/Header'

const props = {
  location: { state: {rtId: 'resourceTemplate:bf:Note'}}
}

describe('<Editor />', () => {
  const handleGenerateLDFn = jest.fn()
  describe('any user', () => {
    const wrapper = shallow(<Editor.WrappedComponent {...props}
                                                     handleGenerateLD={handleGenerateLDFn}
                                                     jwtAuth={{isAuthenticated: false}} />)

    it('has div with id "editor"', () => {
      expect(wrapper.find('div#editor').length).toBe(1)
    })

    it('renders <ResourceTemplate /> component', () => {
      expect(wrapper.find(ResourceTemplate).length).toBe(1)
    })

    it('renders <Header />', () => {
      expect(wrapper.find(Header).length).toBe(1)
    })

    it('shows resource title', () => {
      expect(wrapper.find('div#editor > h1').text()).toMatch('[Clone|Edit] title.of.resource')
    })

    it('displays an login warning message', () => {
      expect(wrapper.find('div.alert-warning').text()).toMatch('Alert! No data can be saved unless you are logged in with group permissions.')
    })

  })

    it('renders <Header />', () => {
      expect(wrapper.find(Header).length).toBe(1)
    })

    it('displays an login warning message', () => {
      expect(wrapper.find('div.alert-warning').text()).toMatch('Alert! No data can be saved unless you are logged in with group permissions.')
    })


    it('shows resource title', () => {
      expect(wrapper.find('div#editor > div > section > h1').text()).toMatch('[Clone|Edit] Name of Resource')
    })

    it('renders a Preview RDF button', () =>{
        expect(wrapper
          .find('div > div > section > button.btn-primary').length)
          .toEqual(1)
      })

  it('displays a pop-up alert when clicked', () => {
    wrapper.find('div > div > section > button.btn-primary').simulate('click')
    expect(handleGenerateLDFn.mock.calls.length).toBe(0)
   })
  })
  describe('authenticated user', () => {
    const wrapper = shallow(<Editor.WrappedComponent {...props}
                                handleGenerateLD={handleGenerateLDFn}
                                jwtAuth={{isAuthenticated: true}} />)

    it('displays a pop-up alert when clicked', () => {
      wrapper.find('div > div > section > button.btn-primary').simulate('click')
      expect(handleGenerateLDFn.mock.calls.length).toBe(0)
    })
  })
})
