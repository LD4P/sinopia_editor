// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import { shallow } from 'enzyme'
import RDFModal from '../../../src/components/editor/RDFModal'

describe('<RDFModal />', () => {
  const closeFunc = jest.fn()
  const rdfFunc = jest.fn()
  const saveFunc = jest.fn()

  const wrapper = shallow(<RDFModal show={true} rdf={rdfFunc} close={closeFunc} save={saveFunc} />)

  it('renders the <RDFModal /> component as a Modal', () => {
    expect(wrapper.find(Modal).length).toBe(1)
  })

  describe('header', () => {
    it('has a Modal.Header', () => {
      expect(wrapper.find(Modal.Header).length).toBe(1)
    })

    it('has a close button', () => {
      expect(wrapper.find(Modal.Header).prop('closeButton')).toBe(true)
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
    it('has a save and publish button', () => {
      expect(wrapper.find(Modal.Body).find(Button)
        .last()
        .childAt(0)
        .text()).toEqual('Save & Publish')
    })

    it('has a Modal.Body', () => {
      expect(wrapper.find(Modal.Body).length).toBe(1)
    })
  })

  describe('save and close buttons', () => {
    it('attempts to save the RDF content when save is clicked', () => {
      wrapper.find('.btn-primary', { text: 'Save &amp; Publish' }).simulate('click')
      expect(saveFunc).toHaveBeenCalled()
    })
  })
})
