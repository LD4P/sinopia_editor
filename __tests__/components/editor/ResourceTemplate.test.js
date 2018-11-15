// Copyright 2018 Stanford University see Apache2.txt for license
import React from 'react'
import { shallow } from 'enzyme'
import ResourceTemplate from '../../../src/components/editor/ResourceTemplate'
import PropertyTemplate from '../../../src/components/editor/PropertyTemplate'

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

  describe('<PropertiesWrapper />', () => {
    it('renders the PropertiesWrapper text nodes', () => {
      wrapper.find('PropertiesWrapper').dive().find('div.PropertiesWrapper > p').forEach((node) => {
        expect(node.containsAnyMatchingElements([
          'BEGIN PropertiesWrapper',
          'END PropertiesWrapper'
        ]))
      })
    })
    it('renders PropertiesWrapper nested component', () => {
      expect(wrapper.find('PropertiesWrapper')
        .dive()
        .find('div.PropertiesWrapper > div > PropertyTemplate'))
        .toHaveLength(3)
    })
  })

  // TODO: if we have more than one resourceTemplate form, they need to have unique ids (see #130)
  it('contains <form> with id resourceTemplate', () => {
    expect(wrapper.find('form#resourceTemplate').length).toEqual(1)
  })

})


// TODO: see #132 - testing PropertiesWrapper
// describe('<PropertiesWrapper />', () => {
//   const wrapper = shallow(<PropertiesWrapper {...rtProps} />)
//
//   it('contains div with class PropertiesWrapper', () => {
//     expect(wrapper.find('div.PropertiesWrapper').length).toBe(1)
//   })
//
//   // it('renders <PropertyTemplate /> component for each property', () => {
//   //   expect(wrapper.find(PropertyTemplate)).toHaveLength(3)
//   //   expect(wrapper.find('.propertyTemplate')).toHaveLength(3)
//   //   // expect(wrapper.find(PropertyTemplate).length).toBe(1)
//   // })
//
// })
