// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import { shallow } from 'enzyme'
import RDFModal from "../../../src/components/editor/RDFModal"

describe('<RDFModal />', () => {
  const closeFunc = jest.fn()
  const data = '{"@context": {"bf": "http://id.loc.gov/ontologies/bibframe/"}, "@graph": [{"@id": "n3-0", "@type": "http://id.loc.gov/ontologies/bibframe/Instance"}]}'

  const wrapper = shallow(<RDFModal show={true}
                                    close={closeFunc}
                                    rtId='a:b:c'
                                    linkedData={ data } />)

  it('renders the <RDFModal /> component as a Modal', () => {
    expect(wrapper.find(Modal).length).toBe(1)
  })

  describe('header', () => {
    it('has a Modal.Header', () => {
      expect(wrapper.find(Modal.Header).length).toBe(1)
    })
    it('has a Modal.Title inside the Modal.Header', () => {
      expect(wrapper.find(Modal.Header).find(Modal.Title).length).toBe(1)
    })

    it('shows the RDF Preview title with the resource template id', () => {
      const title = wrapper.find(Modal.Header).find(Modal.Title)
      expect(title.childAt(0).text()).toMatch(/RDF Preview/)
      expect(title.childAt(1).text()).toMatch(/a:b:c/)
    })
  })

  describe('body', () => {
    it('has a Modal.Body', () => {
      expect(wrapper.find(Modal.Body).length).toBe(1)
    })
  })

  describe('footer', () => {
    it('has a Modal.Footer', () => {
      expect(wrapper.find(Modal.Footer).length).toBe(1)
    })
    it('has a Close Button', () => {
      expect(wrapper.find(Modal.Footer).find(Button).childAt(0).text()).toBe('Close')
    })
  })

})
