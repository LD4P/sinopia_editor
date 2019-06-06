// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import { shallow } from 'enzyme'
import GroupChoiceModal from '../../../src/components/editor/GroupChoiceModal'

describe('<GroupChoiceModal />', () => {
  const saveFunc = jest.fn()
  const rdfFunc = jest.fn()
  const closeFunc = jest.fn()
  const groups = [['pcc', 'PCC'],
    ['wau', 'University of Washington']]

  const wrapper = shallow(<GroupChoiceModal show={true} rdf={rdfFunc} save={saveFunc} close={closeFunc} groups={groups} />)

  it('renders the <GroupChoiceModal /> component as a Modal', () => {
    expect(wrapper.find(Modal).length).toBe(1)
  })
  describe('header', () => {
    it('has a Modal.Header', () => {
      expect(wrapper.find(Modal.Header).length).toBe(1)
    })
    it('has a Modal.Title', () => {
      expect(wrapper.find(Modal.Title)
        .childAt(0)
        .text()).toEqual('Which group do you want to save to?')
    })

    it('has text asking the user to choose a group from the select options', () => {
      expect(wrapper.find(Modal.Body).find('div')
        .first()
        .childAt(0)
        .text()).toEqual('Which group do you want to associate this record to?')
    })

    it('has a select option dropdown', () => {
      expect(wrapper.find(Modal.Body).find('form').find('select').length).toEqual(1)
    })

    it('has the first select option as "PCC"', () => {
      expect(wrapper.find(Modal.Body).find('form').find('select').find('option')
        .first()
        .childAt(0)
        .text()).toEqual('PCC')
      expect(wrapper.find(Modal.Body).find('form').find('select').find('option')
        .first()
        .prop('value')).toEqual('pcc')
    })

    it('has the last select option as "University of Washington"', () => {
      expect(wrapper.find(Modal.Body).find('form').find('select').find('option')
        .last()
        .childAt(0)
        .text()).toEqual('University of Washington')
      expect(wrapper.find(Modal.Body).find('form').find('select').find('option')
        .last()
        .prop('value')).toEqual('wau')
    })

    it('has a Cancel link', () => {
      expect(wrapper.find(Modal.Body).find(Button)
        .first()
        .childAt(0)
        .text()).toEqual('Cancel')
    })
    it('has a save button', () => {
      expect(wrapper.find(Modal.Body).find('form').find(Button)
        .last()
        .childAt(0)
        .text()).toEqual('Save')
    })
  })
  describe('save and close buttons', () => {
    it('attenmplts to save the RDF content with group choice when save is clicked and closes the modal', () => {
      wrapper.find('.btn-primary', { text: 'Save' }).simulate('click')
      expect(saveFunc).toHaveBeenCalled()
    })
    it('closes the modal when the Cancel link is clicked', () => {
      wrapper.find('.btn-link', { text: 'Cancel' }).simulate('click')
      expect(closeFunc).toHaveBeenCalled()
    })
    it('closes the modal when the heade "X" entity is clicked', () => {
      wrapper.find('.btn-primary', { text: '&times;' }).simulate('click')
      expect(closeFunc).toHaveBeenCalled()
    })
  })
})
