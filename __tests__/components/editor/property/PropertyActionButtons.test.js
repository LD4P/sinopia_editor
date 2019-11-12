// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyActionButtons from 'components/editor/property/PropertyActionButtons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

describe('<PropertyActionButtons />', () => {
  let propertyActionWrapper
  beforeEach(() => {
    propertyActionWrapper = shallow(<PropertyActionButtons.WrappedComponent resourceLabel="Note"/>)
  })

  describe('Add Button', () => {
    let button
    beforeEach(() => {
      button = propertyActionWrapper.find('button.btn-add-another')
    })

    it('has label "Add"', () => {
      expect(button.text()).toEqual('+ Add another')
    })

    it('is not hidden by default', () => {
      expect(button.prop('hidden')).toBeUndefined()
    })

    describe('when addButtonHidden is true', () => {
      beforeEach(() => {
        propertyActionWrapper = shallow(<PropertyActionButtons.WrappedComponent addButtonHidden={true}/>)
        button = propertyActionWrapper.find('button.btn-add-another')
      })

      it('is is not shown', () => {
        expect(button).toEqual({})
      })
    })

    describe('when add button is clicked', () => {
      const reduxPath = ['resources', 'abc123', 'myOrg:myRT']
      const mockAddResource = jest.fn()
      const mockEvent = { preventDefault: () => {} }
      beforeEach(() => {
        propertyActionWrapper = shallow(<PropertyActionButtons.WrappedComponent
          reduxPath={reduxPath}
          addResource={mockAddResource}
          resourceKey="abc123" />)
        button = propertyActionWrapper.find('button.btn-add-another')
      })

      it('calls addResource', () => {
        button.simulate('click', mockEvent)
        expect(mockAddResource).toHaveBeenCalledTimes(1)
        expect(mockAddResource).toHaveBeenCalledWith(['resources', 'abc123', 'myOrg:myRT'], 'resourceedit-abc123')
      })
    })
  })

  describe('Remove Button', () => {
    let button
    beforeEach(() => {
      button = propertyActionWrapper.find('button.btn-remove-another')
    })

    it('has remove trash icon', () => {
      expect(button.find('FontAwesomeIcon').props().icon).toEqual(faTrashAlt)
    })

    it('is not disabled by default', () => {
      expect(button.prop('disabled')).toBeUndefined()
    })

    describe('when removeButtonHidden is true', () => {
      beforeEach(() => {
        propertyActionWrapper = shallow(<PropertyActionButtons.WrappedComponent removeButtonHidden={true}/>)
        button = propertyActionWrapper.find('button.btn-remove-another')
      })

      it('is is not shown', () => {
        expect(button).toEqual({})
      })
    })

    describe('when remove button is clicked', () => {
      const reduxPath = ['resources', 'abc123', 'myOrg:myRT']
      const mockRemoveResource = jest.fn()
      const mockEvent = { preventDefault: () => {} }
      beforeEach(() => {
        propertyActionWrapper = shallow(<PropertyActionButtons.WrappedComponent reduxPath={reduxPath} removeResource={mockRemoveResource} />)
        button = propertyActionWrapper.find('button.btn-remove-another')
      })

      it('calls removeResource', () => {
        button.simulate('click', mockEvent)
        expect(mockRemoveResource).toHaveBeenCalledTimes(1)
      })
    })
  })
})
