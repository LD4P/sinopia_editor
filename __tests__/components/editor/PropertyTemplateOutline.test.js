// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import InputLiteral from '../../../src/components/editor/InputLiteral'
import PropertyTemplateOutline from '../../../src/components/editor/PropertyResourceTemplate'
import PropertyTypeRow from '../../../src/components/editor/PropertyTypeRow'

describe('<PropertyTemplateOutline />', () => {
  let propertyRtProps = {
    resourceTemplate: {
      resourceLabel: "Test Schema Thing Template",
      propertyTemplates: [
        {
          propertyLabel: "Test Schema name as a literal",
          propertyURI: "http://schema.org/name"
        }
      ]
    }
  }
  const wrapper = shallow(<PropertyTemplateOutline {...propertyRtProps} />)

  it('Contains label from props', () => {
    expect(wrapper.find("h4").text()).toBe(`${propertyRtProps.resourceTemplate.resourceLabel}`)
  })

  it('Contains a <PropertyTypeRow />', () => {
    expect(wrapper.find(PropertyTypeRow)).toBeTruthy()
  })

  it('has an <PropertyTemplateOutline /> as a child', () => {
     expect(wrapper.find(PropertyTemplateOutline)).toBeTruthy()
  })

  it('child PropertyTemplateOutline has an InputLiteral', () => {
    const childPropertyTemplateOutline = wrapper.find(PropertyTemplateOutline)
    expect(childPropertyTemplateOutline.find(InputLiteral)).toBeTruthy()
  })
  
})
