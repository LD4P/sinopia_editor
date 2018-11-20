// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import ResourceTemplate from '../../../src/components/editor/ResourceTemplate'
import PropertyTemplate from '../../../src/components/editor/PropertyTemplate'
import FormWrapper from '../../../src/components/editor/FormWrapper'

const rtProps = {
  resourceTemplates: [
    {
      "id": "profile:bf2:Monograph:Instance",
      "resourceLabel": "BIBFRAME Instance",
      "resourceURI": "http://id.loc.gov/ontologies/bibframe/Instance",
      "remark": "Can you believe we're doing this!?",
      "propertyTemplates": [
        {
          "propertyLabel": "Instance of"
        },
        {
          "propertyLabel": "foo"
        },
        {
          "propertyLabel": "bar"
        }
      ]
    }
  ]
}

describe('<ResourceTemplate />', () => {
  const wrapper = shallow(<ResourceTemplate {...rtProps} />)
  it('has div with class "ResourceTemplate"', () => {
    expect(wrapper.find('div.ResourceTemplate').length).toEqual(1)
  })

  // TODO: if we have more than one resourceTemplate form, they need to have unique ids (see #130)
  it('contains <div> with id resourceTemplate', () => {
    expect(wrapper.find('div#resourceTemplate').length).toEqual(1)
  })

})
