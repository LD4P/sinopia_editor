// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyActionButtons from 'components/editor/property/PropertyActionButtons'

describe('<PropertyActionButtons />', () => {
  const mockAddClick = jest.fn()
  let propertyActionWrapper
  beforeEach(() => {
    propertyActionWrapper = shallow(<PropertyActionButtons.WrappedComponent handleAddClick={mockAddClick}/>)
  })

  describe('Add Button', () => {
    let button
    beforeEach(() => {
      button = propertyActionWrapper.find('button')
    })

    it('has label "Add"', () => {
      expect(button.text()).toEqual('Add')
    })

    it('is not disabled by default', () => {
      expect(button.prop('disabled')).toBeUndefined()
    })

    describe('when addButtonDisabled is true', () => {
      beforeEach(() => {
        propertyActionWrapper = shallow(<PropertyActionButtons.WrappedComponent addButtonDisabled={true}/>)
        button = propertyActionWrapper.find('button')
      })

      it('is set to disabled', () => {
        expect(button.prop('disabled')).toBe(true)
      })
    })

    it('Add button responds when clicked', () => {
      button.simulate('click')
      expect(mockAddClick).toHaveBeenCalledTimes(1)
    })
  })
})
