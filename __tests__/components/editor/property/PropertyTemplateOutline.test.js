// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import 'jsdom-global/register'
import { shallow } from 'enzyme'
import PropertyTemplateOutline from 'components/editor/property/PropertyTemplateOutline'
import ResourceProperty from 'components/editor/property/ResourceProperty'

describe('<PropertyTemplateOutline />', () => {
  const propertyRtProps = {
    property: {
      propertyLabel: 'Notes about the Instance',
      remark: 'This is a great note',
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/note',
      mandatory: 'true',
      repeatable: 'true',
      type: 'resource',
      resourceTemplates: [],
      valueConstraint: {
        valueTemplateRefs: [
          'resourceTemplate:bf2:Note',
        ],
        useValuesFrom: [],
        valueDataType: {},
        defaults: [],
      },
    },
    reduxPath: [],
  }
  const wrapper = shallow(<PropertyTemplateOutline.WrappedComponent {...propertyRtProps} />)

  it('has an outline header', () => {
    expect(wrapper.find('OutlineHeader').length).toEqual(1)
  })

  it('outline header anchor has an ID based on the property template propertyURI', () => {
    expect(wrapper.find('OutlineHeader').prop('id')).toEqual('note')
  })

  describe('Nested property components', () => {
    const wrapper = shallow(<PropertyTemplateOutline.WrappedComponent {...propertyRtProps} />)

    it('adds a ResourceProperty div for a row with the nested resourceTemplate', () => {
      expect(wrapper.find('div Connect(ResourceProperty)').length).toEqual(1)
    })

    it('creates a <ResourceProperty /> for the nested resourceTemplate with "Add" button disabled', () => {
      const resourceProperty = wrapper.find(ResourceProperty)

      expect(resourceProperty.length).toEqual(1)
      expect(resourceProperty.props().propertyTemplate).toEqual(propertyRtProps.property)
      expect(resourceProperty.props().addButtonDisabled).toEqual(false) // repeatable is true in outer propTemp
    })

    it('"Add" button enabled for outer propertyTemplate with repeatable false', () => {
      const resourceTypePropTemp = { ...propertyRtProps }

      resourceTypePropTemp.property.repeatable = 'false'
      const myWrapper = shallow(<PropertyTemplateOutline.WrappedComponent {...resourceTypePropTemp} />)
      const resourceProperty = myWrapper.find(ResourceProperty)

      expect(resourceProperty.props().addButtonDisabled).toEqual(true)
    })
    it('"Add" button enabled for outer propertyTemplate without repeatable indicated', () => {
      const resourceTypePropTemp = { ...propertyRtProps }

      delete resourceTypePropTemp.property.repeatable
      const myWrapper = shallow(<PropertyTemplateOutline.WrappedComponent {...resourceTypePropTemp} />)
      const resourceProperty = myWrapper.find(ResourceProperty)

      expect(resourceProperty.props().addButtonDisabled).toEqual(true)
    })

    it('adds a PropertyComponent div for a row with the nested template', () => {
      const propertyRtPropsLiteral = {
        property: {
          propertyLabel: 'Holdings',
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/heldBy',
          type: 'literal',
          valueConstraint: {
            defaults: [{
              defaultURI: 'http://id.loc.gov/vocabulary/organizations/dlc',
              defaultLiteral: 'DLC',
            }],
          },
        },
      }

      const wrapper = shallow(<PropertyTemplateOutline.WrappedComponent {...propertyRtPropsLiteral}
                                                                        reduxPath={['http://id.loc.gov/ontologies/bibframe/heldBy']} />)

      wrapper.instance().outlineRowClass()
      expect(wrapper.find('div PropertyComponent').length).toEqual(1)
    })
  })
})
