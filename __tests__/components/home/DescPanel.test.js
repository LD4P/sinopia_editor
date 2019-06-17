// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import DescPanel from 'components/home/DescPanel'

describe('<DescPanel />', () => {
  it('renders the grant description', () => {
    const wrapper = shallow(<DescPanel />)

    expect(wrapper.find('div.desc-panel')).toBeDefined()
  })
})
