// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import 'jsdom-global/register'
import { mount, shallow } from 'enzyme'
import shortid from 'shortid'
import { PropertyActionButtons } from '../../../src/components/editor/PropertyActionButtons'
import PropertyResourceTemplate from '../../../src/components/editor/PropertyResourceTemplate'
import PropertyTemplateOutline from '../../../src/components/editor/PropertyTemplateOutline'

describe('<PropertyResourceTemplate />', () => {
  const propertyRtProps = {
    resourceTemplate: {
      resourceLabel: 'Test Schema Thing Template',
      propertyTemplates: [
        {
          propertyLabel: 'Description',
          propertyURI: 'http://schema.org/description',
        },
      ],
    },
    reduxPath: ['resourceTemplate:test'],
  }

  shortid.generate = jest.fn().mockReturnValue('abcd45')
  const wrapper = shallow(<PropertyResourceTemplate {...propertyRtProps} />)
  const propTemplateOutline = wrapper.find(PropertyTemplateOutline)

  // Make sure spies/mocks don't leak between tests
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('Contains label of from the props', () => {
    expect(wrapper.find('h4').text()).toBe(`${propertyRtProps.resourceTemplate.resourceLabel}`)
  })

  it('Contains a <PropertyTemplateOutline />', () => {
    expect(wrapper.find(PropertyTemplateOutline)).toBeTruthy()
  })

  it('<PropertyTemplateOutline /> contains a propertyTemplate', () => {
    expect(propTemplateOutline.props().propertyTemplate).toBeTruthy()
  })

  it('<PropertyTemplateOutline /> has the expected Redux path', () => {
    expect(propTemplateOutline.props().reduxPath).toEqual(
      ['resourceTemplate:test', 'abcd45'],
    )
  })

  describe('<PropertyResourceTemplate /> has the "Add Click" button', () => {
    const wrapper = shallow(<PropertyResourceTemplate {...propertyRtProps} />)
    const actionButtons = wrapper.find(PropertyActionButtons)

    it('Contains a PropertyActionButtons component', () => {
      expect(actionButtons).toBeTruthy()
    })

    it('handles "Add" button click', () => {
      const addEvent = { preventDefault: jest.fn() }

      actionButtons.props().handleAddClick(addEvent)
      expect(addEvent.preventDefault.mock.calls.length).toBe(1)
    })
  })

  describe('<PropertyResourceTemplate /> isRepeatable is false', () => {
    const wrapper = mount(<PropertyResourceTemplate isRepeatable={'false'} {...propertyRtProps} />)

    it('<PropertyActionButtons /> addButtonDisabled prop is true', () => {
      const actionButtons = wrapper.find(PropertyActionButtons)

      expect(actionButtons.props().addButtonDisabled).toBeTruthy()
    })
  })
})
