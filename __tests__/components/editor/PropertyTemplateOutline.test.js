// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyTemplateOutline from '../../../src/components/editor/PropertyResourceTemplate'
import PropertyTypeRow from '../../../src/components/editor/PropertyTypeRow'

describe('<PropertyTemplateOutline />', () => {
  let propertyRtProps = {
    resourceTemplate: {
      resourceLabel: "Test Schema Thing Template",
      propertyTemplates: []
    }
  }
  const wrapper = shallow(<PropertyTemplateOutline {...propertyRtProps} />)

  it('Contains label from props', () => {
    expect(wrapper.find("h4").text()).toBe(`${propertyRtProps.resourceTemplate.resourceLabel}`)
  })

  it('Contains a <PropertyTypeRow />', () => {
    expect(wrapper.find(PropertyTypeRow)).toBeTruthy()
  })
})
