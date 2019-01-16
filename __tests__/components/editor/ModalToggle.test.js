// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import ResourceTemplateModal from '../../../src/components/editor/ResourceTemplateModal'
import ModalToggle from '../../../src/components/editor/ModalToggle'

describe('<ModalToggle />', () => {
  const propTemplates = [{key: 'value'}]
  const rTemplate = {key: 'value'}
  const wrapper = shallow(<ModalToggle
                            rtId='a:b:c'
                            buttonLabel='alpha'
                            propertyTemplates={propTemplates}
                            resourceTemplate={rTemplate}
                          />)

  describe('button for modal', () => {
    const button = wrapper.find('button')
    it('renders a button with appropriate attributes to open modal', () => {
      expect(button.length).toBe(1)
      expect(button.prop('data-toggle')).toEqual('modal')
      expect(button.prop('data-target')).toEqual('#modal-a:b:c')
      expect(button.prop('onClick')).toEqual(wrapper.instance().toggleModal)
    })
    it('button has correct text', () => {
      expect(button.text()).toEqual('alpha')
    })
  })

  describe('modal', () => {
    it('renders <ResourceTemplateModal /> component', () => {
      expect(wrapper.find(ResourceTemplateModal).length).toBe(1)
    })
    it('passes appropriate props to <ResourceTemplateModal />', () => {
      const rtModal = wrapper.find(ResourceTemplateModal)
      expect(rtModal.prop('rtId')).toEqual('a:b:c')
      expect(rtModal.prop('modalId')).toEqual('#modal-a:b:c')
      expect(rtModal.prop('propertyTemplates')).toEqual(propTemplates)
      expect(rtModal.prop('toggleVisibility')).toEqual(wrapper.instance().toggleModal)
      expect(rtModal.prop('visible')).toBe(false)
    })
  })
})
