// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyPanel from '../../../src/components/editor/PropertyPanel'

describe('<PropertyPanel />', () => {
  let panelProps = { pt: {}
  }
  const wrapper = shallow(<PropertyPanel {...panelProps} />)

  it('Contains a panel-header and panel-body divs', () => {
    expect(wrapper.find(".panel-header")).toBeTruthy()
    expect(wrapper.find(".panel-body")).toBeTruthy()
  })
})
