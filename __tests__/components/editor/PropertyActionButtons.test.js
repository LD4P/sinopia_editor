// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'

import { AddButton, MintButton, PropertyActionButtons } from '../../../src/components/editor/PropertyActionButtons'

describe('<AddButton />', () => {
  const add_btn_wrapper = shallow(<AddButton />)

  it('renders an active button with a label', () => {
    expect(add_btn_wrapper.instance().state.disabled).toBeFalsy()
  })
})

describe('<MintButton />', () => {

  const mint_btn_wrapper = shallow(<MintButton />)

  it('renders an disabled button with a label', () => {
    console.log(mint_btn_wrapper.debug())
    expect(mint_btn_wrapper.instance().state.disabled).toBeTruthy()
  })

})

describe('<PropertyActionButtons />', () => {

  const wrapper = shallow(<PropertyActionButtons />)

  it('has two buttons', () => {
    expect(wrapper.find(AddButton)).toBeTruthy()
    expect(wrapper.find(MintButton)).toBeTruthy()
  })

  describe('when propertyTemplate.repeatable is false', () => {
      // const disabled_wrapper = shallow(<)
  })
})
