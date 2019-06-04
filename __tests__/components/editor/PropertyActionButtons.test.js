// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'

import { AddButton, PropertyActionButtons } from '../../../src/components/editor/PropertyActionButtons'

describe('<AddButton />', () => {
  const addButtonWrapper = shallow(<AddButton />)

  it('has label "Add"', () => {
    expect(addButtonWrapper.text()).toEqual('Add')
  })

  it('is not disabled by default', () => {
    expect(addButtonWrapper.instance().props.isDisabled).toBeFalsy()
  })

  it('is disabled if isDisabled prop is true', () => {
    const disabledAddButtonWrapper = shallow(<AddButton isDisabled={true} />)

    expect(disabledAddButtonWrapper.instance().props.isDisabled).toBeTruthy()
  })
})

describe('<PropertyActionButtons />', () => {
  const mockAddClick = jest.fn()
  const propertyActionWrapper = shallow(<PropertyActionButtons handleAddClick={mockAddClick}/>)

  describe('Add Button', () => {
    const addButton = propertyActionWrapper.find(AddButton)

    it('contains AddButton', () => {
      expect(addButton).toBeTruthy()
    })

    it('Add button responds when clicked', () => {
      addButton.simulate('click')
      expect(mockAddClick).toHaveBeenCalledTimes(1)
    })
  })
})
