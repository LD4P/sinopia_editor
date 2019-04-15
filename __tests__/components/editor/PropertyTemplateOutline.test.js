// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import 'jsdom-global/register'
import { shallow, mount } from 'enzyme'
import InputLiteral from '../../../src/components/editor/InputLiteral'
import InputListLOC from '../../../src/components/editor/InputListLOC'
import InputLookupQA from '../../../src/components/editor/InputLookupQA'
import OutlineHeader from '../../../src/components/editor/OutlineHeader'
import PropertyActionButtons from '../../../src/components/editor/PropertyActionButtons'
import { getLookupConfigItem, getLookupConfigItems, getLookupConfigForTemplateUri, PropertyTemplateOutline } from '../../../src/components/editor/PropertyTemplateOutline'
import PropertyTypeRow from '../../../src/components/editor/PropertyTypeRow'

describe('getLookupConfigItem module function', () => {

  const property = {
    "mandatory": "true",
    "repeatable": "true",
    "type": "lookup",
    "resourceTemplates": [],
    "valueConstraint": {
      "valueTemplateRefs": [],
      "useValuesFrom": [
        "urn:ld4p:qa:sharevde_stanford_instance_ld4l_cache"
      ],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Instance"
      },
      "defaults": []
    },
    "propertyURI": "http://id.loc.gov/ontologies/bibframe/hasInstance",
    "propertyLabel": "ShareVDE Stanford Instances"
  }

 it('returns a JSON array based on useValuesForm', () => {
   const shareVdeStanfordInstancesConfig = getLookupConfigItem(property)
 })

})

describe('<PropertyTemplateOutline />', () => {
  const mockInitNewResourceTemplate = jest.fn()
  let propertyRtProps = {
    propertyTemplate:
        {
          propertyLabel: "Test Schema name as a literal",
          propertyURI: "http://schema.org/name"
        }
  }
  const wrapper = shallow(<PropertyTemplateOutline {...propertyRtProps}
    initNewResourceTemplate={mockInitNewResourceTemplate} />)
  const childPropertyTemplateOutline = wrapper.find(PropertyTemplateOutline)

  it('Contains a <PropertyTypeRow />', () => {
    expect(wrapper.find(PropertyTypeRow)).toBeTruthy()
  })

  it('has an <PropertyTemplateOutline /> as a child', () => {
     expect(wrapper.find(PropertyTemplateOutline)).toBeTruthy()
  })

  it('child PropertyTemplateOutline has an InputLiteral', () => {
    expect(childPropertyTemplateOutline.find(InputLiteral)).toBeTruthy()
  })

})

describe('<PropertyTemplateOutline /> with InputListLOC component', () => {
  const property = {
    propertyTemplate: {
      "mandatory": "true",
        "repeatable": "true",
        "type": "lookup",
        "resourceTemplates": [],
        "valueConstraint": {
          "valueTemplateRefs": [],
          "useValuesFrom": [
            "urn:ld4p:qa:sharevde_stanford_instance_ld4l_cache"
          ],
          "valueDataType": {
            "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Instance"
          },
          "defaults": []
        },
        "propertyURI": "http://id.loc.gov/ontologies/bibframe/hasInstance",
        "propertyLabel": "ShareVDE Stanford Instances"
     }
  }
  const wrapper = mount(<PropertyTemplateOutline {...property} />)
  const childPropertyTemplateOutline = wrapper.find(PropertyTemplateOutline)

  it('child PropertyTemplateOutline has an InputListLOC component', () => {
    expect(childPropertyTemplateOutline.find(InputListLOC)).toBeTruthy()
  })
})

describe('<PropertyTemplateOutline /> with <InputLookupQA /> component', () => {
  const property = {
    propertyTemplate: {
       "propertyLabel": "Carrier Type (RDA 3.3)",
       "propertyURI": "http://id.loc.gov/ontologies/bibframe/carrier",
       "repeatable": "true",
       "resourceTemplates": [],
       "type": "resource",
       "valueConstraint": {
         "valueTemplateRefs": [],
         "useValuesFrom": [
           "https://id.loc.gov/vocabulary/carriers"
         ],
         "valueDataType": {
           "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Carrier"
         },
         "repeatable": "true",
         "editable": "false",
         "defaults": [
           {
             "defaultURI": "http://id.loc.gov/vocabulary/carriers/nc",
             "defaultLiteral": "volume"
           }
         ]
       },
       "mandatory": "false",
       "remark": "http://access.rdatoolkit.org/3.3.html"
     }
  }

  const wrapper = mount(<PropertyTemplateOutline {...property} />)
  const childPropertyTemplateOutline = wrapper.find(PropertyTemplateOutline)

  it('child PropertyTemplateOutline has an InputLookupQA component', () => {
    expect(childPropertyTemplateOutline .find(InputLookupQA)).toBeTruthy()
  })
})

describe('<PropertyTemplateOutline /> with propertyTemplate Refs', () => {
  const mockHandleCollapsed = jest.fn()
  const mockHandleAddClick = jest.fn()
  const mockHandleMintUri = jest.fn()
  const mockInitNewResourceTemplate = jest.fn()
  const property = {
    propertyTemplate: {
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
   }
  const wrapper = mount(<PropertyTemplateOutline {...property}
    handleCollapsed={mockHandleCollapsed}
    handleAddClick={mockHandleAddClick}
    handleMintUri={mockHandleMintUri}
    initNewResourceTemplate={mockInitNewResourceTemplate} />)
  const childOutlineHeader = wrapper.find(OutlineHeader)
  const actionButtons = wrapper.find(PropertyActionButtons)

  it('displays a collapsed OutlineHeader of the propertyTemplate label', () => {
    expect(childOutlineHeader.props().label).toEqual(property.propertyTemplate.propertyLabel)
    expect(childOutlineHeader.props().collapsed).toBeTruthy()
  })

  it('clicking removes collapsed state', () => {
    childOutlineHeader.find('a').simulate('click')
    expect(wrapper.state().collapsed).toBeFalsy()
  })

  it('handles "Add" button click', () => {
    const addButton = wrapper.find('div > section > PropertyActionButtons > div > button.btn-default')
    addButton.handleClick = mockHandleAddClick
    addButton.simulate('click')
    expect(mockHandleAddClick.mock.calls.length).toBe(1)
  })

  it('handles "Mint URI" button click', () => {
    const mintButton = wrapper.find('div > section > PropertyActionButtons > div > button.btn-success')
    mintButton.simulate('click')
    expect(mockHandleMintUri.mock.calls.length).toBe(1)
  })
  //Adding tests for assessing new methods added
  describe('Multiple lookup configs can be retrieved and returned', () => {
	const property = {   
		propertyTemplate : {
			"mandatory": "true",
			"repeatable": "true",
			"type": "lookup",
			"resourceTemplates": [],
			"valueConstraint": {
			  "valueTemplateRefs": [],
			  "useValuesFrom": [
			"urn:ld4p:qa:names:person",
			"urn:ld4p:qa:subjects:person"
			  ],
			  "valueDataType": {
			"dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Agent"
			  },
			  "defaults": []
			},
			"propertyURI": "http://id.loc.gov/ontologies/bibframe/contribution",
			"propertyLabel": "LOC Names: locnames_ld4l_cache/person",
			"remark": "http://id.loc.gov/authorities/names.html" 
		}
	}

  const wrapper = shallow(<PropertyTemplateOutline {...property} />)
  const childPropertyTemplateOutline = wrapper.find(PropertyTemplateOutline)
  //For specific template uri, should return the configuration matching
  const templateUri = "urn:ld4p:qa:names:person";
  it('template uri for person returns appropriate config', () => {
	  expect(getLookupConfigForTemplateUri(templateUri).value.uri).toBe(templateUri)
  })
  
   it('multiple use values from should return the same number of configurations', () => {
	  expect(getLookupConfigItems(property.propertyTemplate).length).toBe(2)
  })
  
})

})
