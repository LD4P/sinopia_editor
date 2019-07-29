// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import { shallow } from 'enzyme'
import RDFModal from 'components/editor/RDFModal'
import SaveAndPublishButton from 'components/editor/SaveAndPublishButton'

describe('<RDFModal />', () => {
  const closeFunc = jest.fn()
  const rdfFunc = jest.fn()
  const saveFunc = jest.fn()

  const wrapper = shallow(<RDFModal.WrappedComponent show={true} rdf={rdfFunc} close={closeFunc} save={saveFunc} />)

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
      expect(wrapper.find(SaveAndPublishButton).length).toBe(1)
    })

    it('has a Modal.Body', () => {
      expect(wrapper.find(Modal.Body).length).toBe(1)
    })
  })
})
