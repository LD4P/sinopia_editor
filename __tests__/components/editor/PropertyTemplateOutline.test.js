// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import 'jsdom-global/register'
import { shallow, mount } from 'enzyme'
import InputLiteral from '../../../src/components/editor/InputLiteral'
import OutlineHeader from '../../../src/components/editor/OutlineHeader'
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

describe('<PropertyTemplateOutline /> with propertyTemplate Refs', () => {
  const mockHandleCollapsed = jest.fn()
  const propertyRtProps = {
    resourceTemplate: {
      resourceLabel: "Test Schema Thing CreativeWork",
      propertyTemplates: [
        {
          "propertyLabel": "Notes about the CreativeWork",
          "remark": "This is a great note",
          "propertyURI": "http://id.loc.gov/ontologies/bibframe/note",
          "mandatory": "false",
          "repeatable": "true",
          "type": "resource",
          "resourceTemplates": [],
          "valueConstraint": {
            "valueTemplateRefs": [
              "resourceTemplate:bf2:Note"
            ],
            "useValuesFrom": [],
            "valueDataType": {},
            "defaults": []
          }
        }
      ]
    }
  }
  const wrapper = mount(<PropertyTemplateOutline {...propertyRtProps}
    handleCollapsed={mockHandleCollapsed} />)
  const childOutlineHeader = wrapper.find(OutlineHeader)

  it('displays a collapsed OutlineHeader of the propertyTemplate label', () => {
    expect(childOutlineHeader.props().label).toEqual(propertyRtProps.resourceTemplate.propertyTemplates[0].propertyLabel)
    expect(childOutlineHeader.props().collapsed).toBeTruthy()
  })

  it('clicking removes collapsed state', () => {
    childOutlineHeader.find('a').simulate('click')
    expect(wrapper.state().collapsed).toBeFalsy()
  })
})
