// Copyright 2018, 2019 Stanford University see Apache2.txt for license

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
  const wrapper = shallow(<Editor.WrappedComponent {...props} handleGenerateLD={handleGenerateLDFn} />)

  describe('any user', () => {

    it('has div with id "editor"', () => {
      expect(wrapper.find('div#editor').length).toBe(1)
    })

    it('renders <ResourceTemplate /> component', () => {
      expect(wrapper.find(ResourceTemplate).length).toBe(1)
    })

    it('renders <Header />', () => {
      expect(wrapper.find(Header).length).toBe(1)
    })

    it('renders a Preview RDF button', () =>{
            expect(wrapper
              .find('div > div > section > button.btn-primary').length)
              .toEqual(1)
    })

    it('displays an login warning message', () => {
      expect(wrapper.find('div.alert-warning').text()).toMatch('Alert! No data can be saved unless you are logged in with group permissions.')
    })

  })

  describe('authenticated user', () => {

    it('does not displays a login warning message', () => {
      wrapper.setState({userAuthenticated: true})
      expect(wrapper.find('div.alert-warning').exists()).toBeFalsy()
    })

  })

})
