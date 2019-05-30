// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyPanel from '../../../src/components/editor/PropertyPanel'
import PropertyLabel from "../../../src/components/editor/PropertyLabel";

describe('<PropertyPanel />', () => {
  const panelProps = {
    pt: {
      propertyLabel: 'Instance of',
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
      resourceTemplates: [],
      type: 'resource',
      valueConstraint: {
        valueTemplateRefs: [
          'resourceTemplate:bf2:Monograph:Work',
        ],
        useValuesFrom: [],
        valueDataType: {},
        defaults: [],
      },
      mandatory: 'true',
      repeatable: 'true',
    },
  }

  const wrapper = shallow(<PropertyPanel {...panelProps} />)

  it('Contains a panel-header and panel-body divs', () => {
    expect(wrapper.find('.panel-header')).toBeTruthy()
    expect(wrapper.find('.panel-body')).toBeTruthy()
  })

  it('generates a <PropertyLabel />', () => {
    expect(wrapper.find(PropertyLabel)).toBeTruthy()
  })
})
