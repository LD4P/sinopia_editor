// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import OutlineHeader from '../../../src/components/editor/OutlineHeader'

describe('<OutlineHeader />', () => {
  let headerProps = {
    spacer: 0,
    label: "Schema Thing",
    collapsed: true,
    isRequired: false
  }
  const wrapper = shallow(<OutlineHeader {...headerProps} />)

  it('Contains a FontAwesomeIcon and label of "Schema Thing"', () => {
    expect(wrapper.find("div").text()).toBe(" <FontAwesomeIcon /> Schema Thing")
  })
})
