// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'

import PropertyActionButtons from '../../../src/components/editor/PropertyActionButtons'

describe('<PropertyActionButtons />', () => {

  const wrapper = shallow(<PropertyActionButtons />)
  const buttons = wrapper.find('button')

  it('has two buttons', () => {
    expect(buttons.length).toEqual(2)
    expect(buttons.find('.btn-default')).toBeTruthy()
    expect(buttons.find('.btn-success')).toBeTruthy()
  })

})
