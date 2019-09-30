// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { mount } from 'enzyme'
/* eslint import/no-unresolved: 'off' */
import { setupModal } from 'testUtils'
import Config from 'Config'
import GroupChoiceModal from 'components/editor/GroupChoiceModal'
/* eslint import/namespace: 'off' */
import * as server from 'sinopiaServer'

describe('<GroupChoiceModal />', () => {
  setupModal()

  const rdfFunc = jest.fn().mockReturnValue('some triples')
  const mockCloseGroupChooser = jest.fn()
  const mockCloseRdfPreview = jest.fn()
  const mockHideModal = jest.fn()
  const currentUser = { name: 'Alfred E. Neuman' }
  const mockPublishMyResource = jest.fn()
  const wrapper = mount(<GroupChoiceModal.WrappedComponent show={true}
                                                           rdf={rdfFunc}
                                                           hideModal = {mockHideModal}
                                                           closeGroupChooser={mockCloseGroupChooser}
                                                           showRdfPreview={mockCloseRdfPreview}
                                                           currentUser={currentUser}
                                                           publishResource={mockPublishMyResource} />)

  it('renders the <GroupChoiceModal /> component as a modal', () => {
    expect(wrapper.find('.modal').length).toBe(1)
  })
  describe('header', () => {
    it('has a modal header', () => {
      expect(wrapper.find('.modal-header').length).toBe(1)
    })
    it('has a modal title', () => {
      expect(wrapper.find('h4.modal-title')
        .text()).toEqual('Which group do you want to save to?')
    })

    it('has text asking the user to choose a group from the select options', () => {
      expect(wrapper.find('.modal-body').find('div')
        .first()
        .childAt(0)
        .text()).toEqual('Which group do you want to associate this record to?')
    })

    it('has a select option dropdown', () => {
      expect(wrapper.find('.modal-body').find('form').find('select').length).toEqual(1)
    })

    it('has the first select option as "Cornell University"', () => {
      const firstOpt = wrapper.find('.modal-body').find('form select option').first()
      expect(firstOpt.text()).toEqual('Cornell University')
      expect(firstOpt.prop('value')).toEqual('cornell')
    })

    it('has the last select option as "Yale University"', () => {
      const lastOpt = wrapper.find('.modal-body').find('form select option').last()
      expect(lastOpt.text()).toEqual('Yale University')
      expect(lastOpt.prop('value')).toEqual('yale')
    })

    it('displays the groups from the config in alphabetical order, with ld4p omitted', () => {
      const expectedGroups = Object.entries(Config.groupsInSinopia)
        .filter(([groupSlug]) => groupSlug !== 'ld4p')
        .sort(([, groupLabelA], [, groupLabelB]) => groupLabelA.localeCompare(groupLabelB))

      const actualGroups = wrapper.find('.modal-body')
        .find('form.group-select-options select option')
        .map(node => [node.prop('value'), node.text()])

      expect(actualGroups).toEqual(expectedGroups)
    })

    it('has a Cancel link', () => {
      expect(wrapper.find('.modal-body').find('.btn')
        .first()
        .text()).toEqual('Cancel')
    })
    it('has a save button', () => {
      expect(wrapper.find('button.btn-primary')
        .text()).toEqual('Save')
    })
  })

  describe('save button', () => {
    describe('success', () => {
      server.publishRDFResource = jest.fn().mockResolvedValue({
        response: {
          headers: {
            location: 'http://example.com/resource/123',
          },
        },
      })
      it('saves the RDF content with group choice when save is clicked and then closes the modals', () => {
        const selectedGroup = 'cornell' // default is first choice, which is cornell
        wrapper.find('button.btn-primary').simulate('click')
        expect(mockPublishMyResource).toHaveBeenCalledWith(currentUser, selectedGroup)
      })
    })
    describe('error', () => {
      server.publishRDFResource = jest.fn().mockRejectedValue(new Error('publish error'))
      it('attempts to save the RDF content with group choice when save is clicked and then closes the modals', () => {
        const selectedGroup = 'cornell' // default is first choice, which is cornell
        wrapper.find('button.btn-primary').simulate('click')
        expect(mockPublishMyResource).toHaveBeenCalledWith(currentUser, selectedGroup)
      })
    })
  })
})
