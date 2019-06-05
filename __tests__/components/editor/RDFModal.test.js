// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import { shallow } from 'enzyme'
import RDFModal from '../../../src/components/editor/RDFModal'

describe('<RDFModal />', () => {
  const closeFunc = jest.fn()

  const saveFunc = jest.fn()

  const wrapper = shallow(<RDFModal show={true} rdf="<>" close={closeFunc} save={saveFunc} />)

  it('renders the <RDFModal /> component as a Modal', () => {
    expect(wrapper.find(Modal).length).toBe(1)
  })
  describe('header', () => {
    it('has a Modal.Header', () => {
      expect(wrapper.find(Modal.Header).length).toBe(1)
    })
    it('has a Cancel link', () => {
      expect(wrapper.find(Modal.Header).find(Button)
        .first()
        .childAt(0)
        .text()).toEqual('Cancel')
    })
    it('has some instructions', () => {
      expect(wrapper.find(Modal.Header).find('div').first().childAt(0)
        .text()).toEqual('If this looks good, then click Save and Publish')
    })
    it('has a save and publish button', () => {
      expect(wrapper.find(Modal.Header).find(Button)
        .last()
        .childAt(0)
        .text()).toEqual('Save & Publish')
    })
    it('has a Modal.Title inside the Modal.Header', () => {
      expect(wrapper.find(Modal.Header).find(Modal.Title).length).toBe(1)
    })
    it('shows the RDF Preview title with the resource template id', () => {
      const title = wrapper.find(Modal.Header).find(Modal.Title)

      expect(title.childAt(0).text()).toMatch(/RDF Preview/)
    })
  })
  describe('body', () => {
    it('has a Modal.Body', () => {
      expect(wrapper.find(Modal.Body).length).toBe(1)
    })
  })
  describe('save and close buttons', () => {
    it('attenmplts to save the RDF content when save is clicked', () => {
      wrapper.find('.btn-primary', { text: 'Save &amp; Publish' }).simulate('click')
      expect(saveFunc).toHaveBeenCalled()
    })
    it('closes the modal when the Cancel link is clicked', () => {
      wrapper.find('.btn-link', { text: 'Cancel' }).simulate('click')
      expect(closeFunc).toHaveBeenCalled()
    })
  })
})
