// Copyright 2018, 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Editor from '../../../src/components/editor/Editor'
import ResourceTemplate from '../../../src/components/editor/ResourceTemplate'
import Header from '../../../src/components/editor/Header'

const props = {
  location: { state: { resourceTemplateId: 'resourceTemplate:bf:Note' } },
  currentSession: null,
}

describe('<Editor />', () => {
  describe('any user', () => {
    const wrapper = shallow(<Editor.WrappedComponent {...props}/>)

    it('has div with id "editor"', () => {
      expect(wrapper.find('div#editor').length).toBe(1)
    })
    it('renders <ResourceTemplate /> component', () => {
      expect(wrapper.find(ResourceTemplate).length).toBe(1)
    })
    it('renders <Header />', () => {
      expect(wrapper.find(Header).length).toBe(1)
    })
    it('displays an login warning message', () => {
      expect(wrapper.find('div.alert-warning').text()).toMatch('Alert! No data can be saved unless you are logged in with group permissions.')
    })
  })
  describe('authenticated user', () => {
    props.currentSession = { dummy: 'should be CognitoUserSession instance, but just checked for presence at present' }
    const wrapper = shallow(<Editor.WrappedComponent {...props} />)

    it('does not displays a login warning message', () => {
      expect(wrapper.find('div.alert-warning').exists()).toBeFalsy()
    })
  })
  describe('RDFModal button', () => {
    const wrapper = shallow(<Editor.WrappedComponent {...props} />)

    it('has preview RDF button', () => {
      expect(wrapper.findWhere(n => n.type() === 'button' && n.contains('Preview RDF')).exists()).toBeTruthy()
    })
    it('has a Save & Publish button', () => {
      expect(wrapper.findWhere(n => n.type() === 'button' && n.contains('Save & Publish')).exists()).toBeTruthy()
    })
    it('has a Validate button', () => {
      expect(wrapper.findWhere(n => n.type() === 'button' && n.contains('Validate')).exists()).toBeTruthy()
    })
  })
  describe('save button', () => {
    const wrapper = shallow(<Editor.WrappedComponent {...props} />)

    it('attempts to save the RDF content when save is clicked', () => {
      wrapper.find('button').at(1).simulate('click')
      expect(wrapper.state('showGroupChooser')).toBeTruthy()
    })
  })
})
