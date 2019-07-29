// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import { shallow } from 'enzyme'
import Config from 'Config'
import GroupChoiceModal from 'components/editor/GroupChoiceModal'
/* eslint import/namespace: 'off' */
import * as server from 'sinopiaServer'

describe('<GroupChoiceModal />', () => {
  server.publishRDFResource = jest.fn().mockResolvedValue({
    response: {
      headers: {
        location: 'http://example.com/resource/123',
      },
    },
  })
  const rdfFunc = jest.fn().mockReturnValue('some triples')
  const closeFunc = jest.fn()
  const closeRdfPreview = jest.fn()
  const currentUser = { name: 'Alfred E. Neuman' }
  const mockSaveStarted = jest.fn()
  const wrapper = shallow(<GroupChoiceModal.WrappedComponent show={true}
                                                             rdf={rdfFunc}
                                                             close={closeFunc}
                                                             closeRdfPreview={closeRdfPreview}
                                                             currentUser={currentUser}
                                                             saveStarted={mockSaveStarted} />)

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

    it('has the first select option as "Cornell University"', () => {
      const firstOpt = wrapper.find(Modal.Body).find('form select option').first()
      expect(firstOpt.text()).toEqual('Cornell University')
      expect(firstOpt.prop('value')).toEqual('cornell')
    })

    it('has the last select option as "Yale University"', () => {
      const lastOpt = wrapper.find(Modal.Body).find('form select option').last()
      expect(lastOpt.text()).toEqual('Yale University')
      expect(lastOpt.prop('value')).toEqual('yale')
    })

    it('displays the groups from the config in alphabetical order, with ld4p omitted', () => {
      const expectedGroups = Object.entries(Config.groupsInSinopia)
        .filter(([groupSlug]) => groupSlug !== 'ld4p')
        .sort(([, groupLabelA], [, groupLabelB]) => groupLabelA.localeCompare(groupLabelB))

      const actualGroups = wrapper.find(Modal.Body)
        .find('form.group-select-options select option')
        .map(node => [node.prop('value'), node.text()])

      expect(actualGroups).toEqual(expectedGroups)
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
    it('attempts to save the RDF content with group choice when save is clicked and closes the modal', () => {
      wrapper.find('[bsStyle="primary"]').simulate('click')
      expect(server.publishRDFResource).toHaveBeenCalledWith(currentUser, 'some triples', 'cornell')
      expect(mockSaveStarted).toHaveBeenCalled()
    })

    it('closes the modal when the Cancel link is clicked', () => {
      wrapper.find('[bsStyle="link"]').simulate('click')
      expect(closeFunc).toHaveBeenCalled()
    })
  })
})
