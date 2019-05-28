// Copyright 2018, 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Editor from '../../../src/components/editor/Editor'
import ResourceTemplate from '../../../src/components/editor/ResourceTemplate'
import Header from '../../../src/components/editor/Header'

let props = {
  location: { state: {resourceTemplateId: 'resourceTemplate:bf:Note'}},
  authenticationState: {}
}

describe('<Editor />', () => {
  const handleGenerateLDFn = jest.fn()

  describe('any user', () => {
    const wrapper = shallow(<Editor.WrappedComponent {...props} handleGenerateLD={handleGenerateLDFn} />)

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
    props.authenticationState = { currentSession: 'should be CognitoUserSession instance, but just checked for presence at present' }
    const wrapper = shallow(<Editor.WrappedComponent {...props} handleGenerateLD={handleGenerateLDFn} />)

    it('does not displays a login warning message', () => {
      expect(wrapper.find('div.alert-warning').exists()).toBeFalsy()
    })

  })

  describe('RDFModal button', () => {
    const wrapper = shallow(<Editor.WrappedComponent {...props} handleGenerateLD={handleGenerateLDFn} />)

    it('has preview RDF button', () => {
      expect(wrapper.find('button').text()).toBe('Preview RDF')
    })
    it('does not have RDFModal by default', () => {
      expect(wrapper.find('.modal-dialog').length).toBe(0)
    })
  })

})
