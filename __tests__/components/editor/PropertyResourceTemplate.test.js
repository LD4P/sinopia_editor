// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyResourceTemplate from '../../../src/components/editor/PropertyResourceTemplate'
import PropertyTemplateOutline from '../../../src/components/editor/PropertyTemplateOutline'

describe('<PropertyResourceTemplate />', () => {
  let propertyRtProps = {
    resourceTemplate: {
      resourceLabel: "Test Schema Thing Template",
      propertyTemplates: [
        {
          propertyLabel: "Description",
          propertyURI: "http://schema.org/"
        }
      ]
    }
  }
  const wrapper = shallow(<PropertyResourceTemplate {...propertyRtProps} />)

  it('Contains label of from the props', () => {
    expect(wrapper.find("h4").text()).toBe(`${propertyRtProps.resourceTemplate.resourceLabel}`)
  })

  it('Contains a <PropertyTemplateOutline />', () => {
      expect(wrapper.find(PropertyTemplateOutline)).toBeTruthy()
    })

  it('<PropertyTemplateOutline /> contains a propertyTemplate', () => {
      const propTemplateOutline = wrapper.find(PropertyTemplateOutline)
      expect(propTemplateOutline.props().propertyTemplate).toBeTruthy()
  })

})
