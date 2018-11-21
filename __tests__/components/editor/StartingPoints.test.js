// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import StartingPoints from '../../../src/components/editor/StartingPoints'

describe('<StartingPoints />', () => {
  const wrapper = shallow(<StartingPoints />)

  it('Has a div with headings', () => {
    expect(wrapper.find('div > h3').text()).toEqual('Create Resource')
    expect(wrapper.find('div > h4').text()).toEqual('Starting points:')
  })
})
