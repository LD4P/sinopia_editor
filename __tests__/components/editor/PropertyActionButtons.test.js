// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'

import PropertyActionButtons from '../../../src/components/editor/PropertyActionButtons'

describe('<PropertyActionButtons />', () => {
  const props = {
    handleAddClick: jest.fn(),
    handleMintUri: jest.fn()
  }
  const wrapper = shallow(<PropertyActionButtons {...props} />)
  const buttons = wrapper.find('button')

  it('has two buttons', () => {
    expect(buttons.length).toEqual(2)
  })

  it('calls handleAddClick', () => {
    console.log(`buttons `)
    console.log(buttons.debug())
    buttons.find('.btn-default').simulate('click', { target: {}})
    //.simulate('click', { target: {}})
    expect(props.handleAddClick.mock.calls.length).toEqual(1)
  })
})
