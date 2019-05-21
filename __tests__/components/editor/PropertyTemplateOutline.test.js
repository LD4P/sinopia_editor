// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import 'jsdom-global/register'
import { shallow, mount } from 'enzyme'
import InputLiteral from '../../../src/components/editor/InputLiteral'
import InputListLOC from '../../../src/components/editor/InputListLOC'
import InputLookupQA from '../../../src/components/editor/InputLookupQA'
import OutlineHeader from '../../../src/components/editor/OutlineHeader'
// FIXME: from tests giving false positive - see github issue #496
// import { PropertyActionButtons, AddButton } from '../../../src/components/editor/PropertyActionButtons'
import Config from '../../../src/Config'
import { getLookupConfigItem, PropertyTemplateOutline, hasValueTemplateRef, getLookupConfigItems } from '../../../src/components/editor/PropertyTemplateOutline'
import PropertyTypeRow from '../../../src/components/editor/PropertyTypeRow'

const responseBody = [{
  response: {
    body: {
      "id": "resourceTemplate:bf2:Note",
      "resourceURI": "http://id.loc.gov/ontologies/bibframe/Note",
      "resourceLabel": "Note",
      "propertyTemplates": [
        {
          "propertyURI": "http://www.w3.org/2000/01/rdf-schema#label",
          "propertyLabel": "Note",
          "mandatory": "false",
          "repeatable": "false",
          "type": "literal",
          "resourceTemplates": [],
          "valueConstraint": {
            "valueTemplateRefs": [],
            "useValuesFrom": [],
            "valueDataType": {},
            "editable": "true",
            "repeatable": "false",
            "defaults": []
          }
        }
      ]
    }
  }
}]

const mockHandleCollapsed = jest.fn()
const mockHandleAddClick = jest.fn()
const mockHandleMintUri = jest.fn()
const mockInitNewResourceTemplate = jest.fn()

describe('getLookupConfigItem module function', () => {
  const authority = 'sharevde_stanford_instance_ld4l_cache'
  const lookupUri = `urn:ld4p:qa:${authority}`
  const property = {
    "mandatory": "true",
    "repeatable": "true",
    "type": "lookup",
    "resourceTemplates": [],
    "valueConstraint": {
      "valueTemplateRefs": [],
      "useValuesFrom": [
        lookupUri
      ],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Instance"
      },
      "defaults": []
    },
    "propertyURI": "http://id.loc.gov/ontologies/bibframe/hasInstance",
    "propertyLabel": "ShareVDE Stanford Instances"
  }

  it('returns a JSON object based on useValuesFrom', () => {
    const shareVdeStanfordInstancesConfig = getLookupConfigItem(property)
    expect(shareVdeStanfordInstancesConfig.value.authority).toEqual(authority)
    expect(shareVdeStanfordInstancesConfig.value.uri).toEqual(lookupUri)
  })
})

it('getLookupConfigItems() retrieves info from the lookup config', () => {
  const pt = {
    valueConstraint: {
      useValuesFrom: [ "https://id.loc.gov/vocabulary/frequencies" ]
    }
  }
  expect(getLookupConfigItems(pt)).toEqual(
    [ { "value": {"component": "list",
    "label": "frequency",
    "uri": "https://id.loc.gov/vocabulary/frequencies"} } ]
  )
})

describe('hasValueTemplateRef()', () => {
  it('returns true if propertyTemplate has a valueTemplateRef', () => {
    const propertyTemplate = {
      valueConstraint: {
        valueTemplateRefs: ["resourceTemplate:bf2:Note"]
      }
    }
    expect(hasValueTemplateRef(propertyTemplate)).toBeTruthy()
  })
  it('returns false if propertyTemplate has no valueTemplateRef', () => {
    const propertyTemplate = {
      propertyLabel: "Test Schema name as a literal",
      propertyURI: "http://schema.org/name"
    }

    expect(hasValueTemplateRef(propertyTemplate)).toBeFalsy()
  })
  it('returns false if propertyTemplate has valueTemplateRefs as empty array', () => {
    const propertyTemplate = {
      valueConstraint: {
        valueTemplateRefs: []
      }
    }
    expect(hasValueTemplateRef(propertyTemplate)).toBeFalsy()
  })
})

describe('<PropertyTemplateOutline />', () => {
  const propertyRtProps = {
    propertyTemplate:
      {
        propertyLabel: "Test Schema name as a literal",
        propertyURI: "http://schema.org/name"
      }
  }
  const wrapper = shallow(<PropertyTemplateOutline {...propertyRtProps}
                            initNewResourceTemplate={mockInitNewResourceTemplate}/>)

  it('Contains a <PropertyTypeRow />', () => {
    expect(wrapper.find(PropertyTypeRow)).toBeTruthy()
  })

  it('has an <PropertyTemplateOutline /> as a child (of connect(PropertyTemplateOutline)', () => {
    expect(wrapper.find(PropertyTemplateOutline)).toBeTruthy()
  })
})

describe('<PropertyTemplateOutline /> with <InputLiteral> component', () => {
  const literal = {
    propertyTemplate: {
      "type": "literal",
      "propertyURI": "http://id.loc.gov/ontologies/bibframe/hasInstance",
      "propertyLabel": "ShareVDE Stanford Instances"
    }
  }
  const wrapper = shallow(<PropertyTemplateOutline {...literal} />)

  it('<PropertyTemplateOutline> contains <InputLiteral>', () => {
    const inputLiteral = wrapper.find(InputLiteral)
    expect(inputLiteral).toBeTruthy()
  })

  it('renders <InputLiteral> component', () => {
    const jsx = wrapper.instance().propertyComponentJsx(literal.propertyTemplate)
    expect(jsx.props.reduxpath).toEqual(literal.propertyURI)
    expect(jsx.props.propertyTemplate.type).toEqual("literal")
  })
})

describe('<PropertyTemplateOutline /> with <InputListLOC> component', () => {
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

  it('<PropertyTemplateOutline> contains <InputListLOC>', () => {
    const wrapper = mount(<PropertyTemplateOutline {...property} />)
    const childPropertyTemplateOutline = wrapper.find(PropertyTemplateOutline)
    expect(childPropertyTemplateOutline.find(InputListLOC)).toBeTruthy()
  })

  it('renders <InputListLOC> component', async () => {
    const resource = {
      propertyTemplate: {
        "type": "resource",
        "valueConstraint": {
          "useValuesFrom": [
            "https://id.loc.gov/vocabulary/carriers"
          ]
        },
        "propertyURI": "http://id.loc.gov/ontologies/bibframe/hasInstance",
        "propertyLabel": "ShareVDE Stanford Instances"
      }
    }
    const wrapper = shallow(<PropertyTemplateOutline {...resource} />)
    const input = wrapper.instance().propertyComponentJsx(resource.propertyTemplate)
    expect(input.props.lookupConfig.value.component).toEqual("list")
  })
})

describe('<PropertyTemplateOutline /> with <InputLookupQA> component', () => {
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

  it('<PropertyTemplateOutline> contains <InputLookupQA> component', () => {
    expect(childPropertyTemplateOutline .find(InputLookupQA)).toBeTruthy()
  })
})

describe('<PropertyTemplateOutline /> with propertyTemplate of type resource', () => {
  it('renders the case of a nested outline component', async () => {
    const resource = {
      propertyTemplate: {
        "type": "resource",
        "valueConstraint": {
          "valueTemplateRefs": [ "resourceTemplate:bf2:Note" ]
        },
        "propertyURI": "http://id.loc.gov/ontologies/bibframe/hasInstance",
        "propertyLabel": "ShareVDE Stanford Instances"
      }
    }
    const wrapper = shallow(<PropertyTemplateOutline {...resource} initNewResourceTemplate={mockInitNewResourceTemplate} />)
    wrapper.setState({nestedResourceTemplates: [responseBody[0].response.body]})
    const input = wrapper.instance().propertyComponentJsx(resource.propertyTemplate)
    expect(input[1].props.resourceTemplate.id).toEqual("resourceTemplate:bf2:Note")
    expect(input[1].props.reduxPath).toEqual(['resourceTemplate:bf2:Note', 'http://www.w3.org/2000/01/rdf-schema#label'])
  })

  const property = {
    propertyTemplate:
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
  }
  const wrapper = mount(<PropertyTemplateOutline {...property}
                                                 handleCollapsed={mockHandleCollapsed}
                                                 handleAddClick={mockHandleAddClick}
                                                 handleMintUri={mockHandleMintUri}
                                                 initNewResourceTemplate={mockInitNewResourceTemplate} />)
  const event = { preventDefault() {} }

  // Stub `Config.spoofSinopiaServer` static getter to force RT to come from server
  jest.spyOn(Config, 'spoofSinopiaServer', 'get').mockReturnValue(false)

  it('displays a collapsed OutlineHeader of the propertyTemplate label', () => {
    const childOutlineHeader = wrapper.find(OutlineHeader)
    expect(childOutlineHeader.props().label).toEqual(property.propertyTemplate.propertyLabel)
    expect(childOutlineHeader.props().collapsed).toBeTruthy()
  })


  // FIXME: from tests giving false positive - see github issue #496

  // const mockResponse = (status, statusText, response) => {
  //   return new Response(response, {
  //     status: status,
  //     statusText: statusText,
  //     headers: {
  //       'Content-type': 'application/json'
  //     }
  //   }).body
  // }
  // const asyncCall = (index) => {
  //   const response = mockResponse(200, null, responseBody[index])
  //   return response
  // }
  // const promises = Promise.all([ asyncCall(0) ])

  it.skip('clicking removes collapsed state', async () => {
    // FIXME: this test gives false positive - see github issue #496
    // FIXME:  collapsed isn't a state, it's a prop
    // FIXME:  in order to examine STATE after simulate, you must do a fresh "find" from the root component
    //  https://github.com/airbnb/enzyme/issues/1229#issuecomment-462496246
    // FIXME:  I believe for this to work, mockHandleCollapsed has to mock the implementation ...
    //   which leads me to believe that this should be an integration test
    // FIXME: the approach below is a failed attempted to 'inject' info to an inner method
    // await wrapper.instance().fulfillRTPromises(promises).then(() => wrapper.update()).then(() => {
    //   const childOutlineHeader = wrapper.find(OutlineHeader)
    //   childOutlineHeader.find('a').simulate('click')
    //   expect(wrapper.state().collapsed).toBeFalsy() // correct
    //   expect(wrapper.state().collapsed).toBeTruthy() // incorrect
    // }).catch(() => {})
  })

  it.skip('handles "Add" button click', async () => {
    // FIXME: this test gives false positive - see github issue #496
    // FIXME: wrapper has OutlineHeader but no PropertyActionButtons, no PropertyTypeRow
    // - it needs to be expanded first?  implying an integration test
    // FIXME: the approach below is a failed attempted to 'inject' info to an inner method
    // await wrapper.instance().fulfillRTPromises(promises).then(() => wrapper.update()).then(() => {
    //   const addButton = wrapper.find('div > section > PropertyActionButtons > div > AddButton')
    //   addButton.handleClick = mockHandleAddClick
    //   addButton.simulate('click')
    //   expect(mockHandleAddClick.mock.calls.length).toBe(1) // correct
    //   expect(mockHandleAddClick.mock.calls.length).toBe(0) // incorrect
    // }).catch(() => {})
  })

  it('handles the addClick method callback call', () => {
    wrapper.instance().handleAddClick(event)
    expect(mockHandleAddClick.mock.calls.length).toBe(1)
  })

  it.skip('handles "Mint URI" button click', async () => {
    // FIXME: this test gives false positive - see github issue #496
    // FIXME: wrapper has OutlineHeader but no PropertyActionButtons, no PropertyTypeRow
    // - it needs to be expanded first?  implying an integration test
    // FIXME: the approach below is a failed attempted to 'inject' info to an inner method
    // await wrapper.instance().fulfillRTPromises(promises).then(() => wrapper.update()).then(() => {
    //   const mintButton = wrapper.find('div > section > PropertyActionButtons > div > MintButton')
    //   mintButton.handleClick = mockHandleAddClick
    //   mintButton.simulate('click')
    //   expect(mockHandleMintUri.mock.calls.length).toBe(1) // correct
    //   expect(mockHandleMintUri.mock.calls.length).toBe(1) // incorrect
    // }).catch(() => {})
  })

  // TODO: revisit when MintButton is enabled (see github issue #283)
  it('handles the mintUri method callback call', () => {
    wrapper.instance().handleMintUri(event)
    expect(mockHandleMintUri.mock.calls.length).toBe(1)
  })
})

describe('<PropertyTemplateOutline /> handles propertyTemplate variations', () => {

  it('displays the propertyLabel when missing valueConstraint.valueTemplateRefs', () => {
    const missingValueTemplateRefsProperty = {
      "propertyTemplate": {
        "mandatory": "false",
        "repeatable": "true",
        "type": "lookup",
        "valueConstraint": {
          "useValuesFrom": [
            "http://id.loc.gov/authorities/subjects"
          ]
        },
        "propertyLabel": "Search LCSH",
        "propertyURI": "http://www.loc.gov/mads/rdf/v1#authoritativeLabel"
        }
    }
    const wrapper = shallow(<PropertyTemplateOutline {...missingValueTemplateRefsProperty} />)
    const outlineHeader = wrapper.find(OutlineHeader)
    expect(outlineHeader.props().label).toEqual(
      missingValueTemplateRefsProperty.propertyTemplate.propertyLabel)
 })

 it('displays the propertyLabel when missing valueConstraint', () => {
   const missingValueConstraintProperty = {
     "propertyTemplate": {
       "mandatory": "false",
       "repeatable": "true",
       "type": "literal",
       "propertyLabel": "A Book",
       "propertyURI": "http:///schema.org/Book"
     }
   }
   const wrapper = shallow(<PropertyTemplateOutline {...missingValueConstraintProperty} />)
   const outlineHeader = wrapper.find(OutlineHeader)
   expect(outlineHeader.props().label).toEqual(
     missingValueConstraintProperty.propertyTemplate.propertyLabel)
 })
})
