// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyTemplate from '../../../src/components/editor/PropertyTemplate'

describe('<PropertyTemplate />', () => {
  const ptProps = {
    propertyTemplates: [
      {
        "propertyLabel": "Instance of",
        "propertyURI": "http://id.loc.gov/ontologies/bibframe/instanceOf",
        "resourceTemplates": [],
        "type": "resource",
        "valueConstraint": {
          "valueTemplateRefs": [
            "profile:bf2:Monograph:Work"
          ],
          "useValuesFrom": [],
          "valueDataType": {},
          "defaults": []
        },
        "mandatory": "false",
        "repeatable": "true"
      }
    ]
  }
  const wrapper = shallow(<PropertyTemplate {...ptProps} />)

  it('has div with class "PropertyTemplate"', () => {
    expect(wrapper.find('div.PropertyTemplate').length).toEqual(1)
  })
})
