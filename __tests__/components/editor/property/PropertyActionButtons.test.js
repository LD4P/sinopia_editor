// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyActionButtons from 'components/editor/property/PropertyActionButtons'

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
      expect(button.text()).toEqual('Add another Note')
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
      const reduxPath = ['resource', 'myOrg:myRT']
      const mockAddResource = jest.fn()
      const mockEvent = { preventDefault: () => {} }
      beforeEach(() => {
        propertyActionWrapper = shallow(<PropertyActionButtons.WrappedComponent reduxPath={reduxPath} addResource={mockAddResource} />)
        button = propertyActionWrapper.find('button.btn-add-another')
      })

      it('calls addResource', () => {
        button.simulate('click', mockEvent)
        expect(mockAddResource).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Remove Button', () => {
    let button
    beforeEach(() => {
      button = propertyActionWrapper.find('button.btn-remove-another')
    })

    it('has label "Remove"', () => {
      expect(button.text()).toEqual('Remove Note')
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
      const reduxPath = ['resource', 'myOrg:myRT']
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
