// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import { shallow } from 'enzyme'
import ResourceTemplateForm from '../../../src/components/editor/ResourceTemplateForm'
import ResourceTemplateModal from '../../../src/components/editor/ResourceTemplateModal'

describe('<ResourceTemplateModal />', () => {
  const propTemplates = [{key: 'value'}]
  const rTemplate = {key: 'value'}
  const tvFunc = () => {}
  const wrapper = shallow(<ResourceTemplateModal.WrappedComponent
                            rtId='a'
                            modalId='a'
                            visible={true}
                            toggleVisibility={tvFunc}
                            propertyTemplates={propTemplates}
                            resourceTemplate={rTemplate}
                          />)

  describe('header', () => {
    it('has a Modal.Header', () => {
      expect(wrapper.find(Modal.Header).length).toBe(1)
    })
    it('has a Modal.Title inside the Modal.Header', () => {
      expect(wrapper.find(Modal.Header).find(Modal.Title).length).toBe(1)
    })
  })

  describe('body', () => {
    it('has a Modal.Body', () => {
      expect(wrapper.find(Modal.Body).length).toBe(1)
    })
    describe('ResourceTemplateForm', () => {
      it('renders <ResourceTemplateForm /> component', () => {
        expect(wrapper.find(ResourceTemplateForm).length).toBe(1)
      })
      it('passes props.propertyTemplates to <ResourceTemplateForm />', () => {
        const rtForm = wrapper.find(ResourceTemplateForm)
        expect(rtForm.props().propertyTemplates).toEqual(propTemplates)
      })
    })
  })

  describe('footer', () => {
    it('has a Modal.Footer', () => {
      expect(wrapper.find(Modal.Footer).length).toBe(1)
    })
    it('has two Buttons (Cancel and Save)', () => {
      expect(wrapper.find(Modal.Footer).find(Button).length).toBe(1)
    })
  })
})
