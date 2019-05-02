// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'

import { AddButton, MintButton, PropertyActionButtons } from '../../../src/components/editor/PropertyActionButtons'

describe('<AddButton />', () => {
  const addButtonWrapper = shallow(<AddButton />)

  it('has label "Add"', () => {
    expect(addButtonWrapper.text()).toEqual("Add")
  })

  it('is not disabled by default', () => {
    expect(addButtonWrapper.instance().state.disabled).toBeFalsy()
  })
})

describe('<MintButton />', () => {
  const mintButtonWrapper = shallow(<MintButton />)

  it('has label "Mint URI"', () => {
    expect(mintButtonWrapper.text()).toEqual("Mint URI")
  })

  it('is disabled by default', () => {
    expect(mintButtonWrapper.instance().state.disabled).toBeTruthy()
  })
})

describe('<PropertyActionButtons />', () => {
  const propertyActionWrapper = shallow(<PropertyActionButtons />)

  it('contains AddButton', () => {
    expect(propertyActionWrapper.find(AddButton)).toBeTruthy()
  })
  it('contains MintButton', () => {
    expect(propertyActionWrapper.find(MintButton)).toBeTruthy()
  })
})
