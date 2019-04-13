// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import 'jsdom-global/register'
import { shallow } from 'enzyme'
import PropertyActionButtons from '../../../src/components/editor/PropertyActionButtons'
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
    },
    reduxPath: ''
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

  describe('<PropertyResourceTemplate /> has the "Add Click" and "Mint URI" buttons', () => {

    const wrapper = shallow(<PropertyResourceTemplate {...propertyRtProps} />)
    const actionButtons = wrapper.find(PropertyActionButtons)

    it("Contains a PropertyActionButtons component", () => {
      expect(actionButtons).toBeTruthy()
    })

    it('handles "Add" button click', () => {
      const addEvent = { preventDefault: jest.fn() }
      actionButtons.props().handleAddClick(addEvent)
      expect(addEvent.preventDefault.mock.calls.length).toBe(1)
    })

    it('handles "Mint URI" button click', () => {
      const mintEvent = { preventDefault: jest.fn() }
      actionButtons.props().handleMintUri(mintEvent)
      expect(mintEvent.preventDefault.mock.calls.length).toBe(1)
    })
  })


})
