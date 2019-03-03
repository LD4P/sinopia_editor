// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyResourceTemplate from '../../../src/components/editor/PropertyResourceTemplate'

describe('<PropertyPanel />', () => {
  let propertyRtProps = {
    resourceTemplate: {
      resourceLabel: "Test Schema Thing Template",
      propertyTemplates: []
    }
  }
  const wrapper = shallow(<PropertyResourceTemplate {...propertyRtProps} />)

  it('Contains label of "Test Schema Thing Template"', () => {
    expect(wrapper.find("h4").text()).toBe("Test Schema Thing Template")
  })
})
