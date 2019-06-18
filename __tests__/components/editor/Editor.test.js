// Copyright 2018, 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Editor from 'components/editor/Editor'
import ResourceTemplate from 'components/editor/ResourceTemplate'
import Header from 'components/Header'
import AuthenticationMessage from 'components/editor/AuthenticationMessage'

const props = {
  location: { state: { resourceTemplateId: 'resourceTemplate:bf:Note' } },
  userWantsToSave: jest.fn(),
}

// See https://github.com/nodesecurity/eslint-plugin-security/issues/26
/* eslint security/detect-non-literal-fs-filename: 'off' */

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
    it('renders <AuthenticationMessage />', () => {
      expect(wrapper.exists(AuthenticationMessage)).toBe(true)
    })
  })
  describe('authenticated user', () => {
    props.currentSession = { dummy: 'should be CognitoUserSession instance, but just checked for presence at present' }
    const wrapper = shallow(<Editor.WrappedComponent {...props}/>)

    it('does not displays a login warning message', () => {
      expect(wrapper.find('div.alert-warning').exists()).toBeFalsy()
    })
  })

  describe('RDFModal button', () => {
    const wrapper = shallow(<Editor.WrappedComponent {...props}/>)

    it('has preview RDF button', () => {
      expect(wrapper.findWhere(n => n.type() === 'button' && n.contains('Preview RDF')).exists()).toBeTruthy()
    })
  })

  describe('Save & Publish button', () => {
    const mockOpenHandler = jest.fn()
    const wrapperHandler = () => mockOpenHandler
    const wrapper = shallow(<Editor.WrappedComponent {...props} userWantsToSave={wrapperHandler}/>)

    it('attempts to save the RDF content when save is clicked', () => {
      wrapper.findWhere(n => n.type() === 'button' && n.contains('Save & Publish')).simulate('click')
      expect(mockOpenHandler).toHaveBeenCalled()
    })
  })
})
