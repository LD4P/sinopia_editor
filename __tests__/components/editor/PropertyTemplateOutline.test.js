// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import 'jsdom-global/register'
import { shallow, mount } from 'enzyme'
import InputLiteral from '../../../src/components/editor/InputLiteral'
import InputListLOC from '../../../src/components/editor/InputListLOC'
import InputLookupQA from '../../../src/components/editor/InputLookupQA'
import OutlineHeader from '../../../src/components/editor/OutlineHeader'
import Config from '../../../src/Config'
import { getLookupConfigItem, PropertyTemplateOutline, valueTemplateRefTest, getLookupConfigItems } from '../../../src/components/editor/PropertyTemplateOutline'
import PropertyTypeRow from '../../../src/components/editor/PropertyTypeRow'

const mockResponse = (status, statusText, response) => {
  return new Response(response, {
    status: status,
    statusText: statusText,
    headers: {
      'Content-type': 'application/json'
    }
  }).body
}

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

const asyncCall = (index) => {
  const response = mockResponse(200, null, responseBody[index])
  return response
}

const promises = Promise.all([ asyncCall(0) ])
const mockHandleCollapsed = jest.fn()
const mockHandleAddClick = jest.fn()
const mockHandleMintUri = jest.fn()
const mockInitNewResourceTemplate = jest.fn()

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
  const propertyRtProps = {
    propertyTemplate:
      {
        propertyLabel: "Test Schema name as a literal",
        propertyURI: "http://schema.org/name"
      }
  }
  const valConstraint = {
    propertyTemplate: {
      valueConstraint: {
        valueTemplateRefs: ["resourceTemplate:bf2:Note"]
      }
    }
  }

  const useValues = {
    propertyTemplate: {
      valueConstraint: {
        useValuesFrom: [ "https://id.loc.gov/vocabulary/frequencies" ]
      }
    }
  }
  const wrapper = shallow(<PropertyTemplateOutline {...propertyRtProps}
                                                   initNewResourceTemplate={mockInitNewResourceTemplate}/>)
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

  it('checks if a property has a valueTemplateRef', () => {
    expect(valueTemplateRefTest(propertyRtProps.propertyTemplate)).toBeFalsy()
    expect(valueTemplateRefTest(valConstraint.propertyTemplate)).toBeTruthy()
  })

  it('gets the uri for the lookup from the config', () => {
    expect(getLookupConfigItems(useValues.propertyTemplate)).toEqual(
      [ { "value": {"component": "list", "label": "frequency", "uri": "https://id.loc.gov/vocabulary/frequencies"} } ]
    )
  })

  it('renders the case of an InputLiteral component', () => {
    const literal = {
      propertyTemplate: {
        "type": "literal",
        "propertyURI": "http://id.loc.gov/ontologies/bibframe/hasInstance",
        "propertyLabel": "ShareVDE Stanford Instances"
      }
    }
    const wrapper = shallow(<PropertyTemplateOutline {...literal} />)
    const input = wrapper.instance().handleComponentCase(literal.propertyTemplate)
    expect(input.props.reduxpath).toEqual(literal.propertyURI)
    expect(input.props.propertyTemplate.type).toEqual("literal")
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

  it('child PropertyTemplateOutline has an InputListLOC component', () => {
    const wrapper = mount(<PropertyTemplateOutline {...property} />)
    const childPropertyTemplateOutline = wrapper.find(PropertyTemplateOutline)
    expect(childPropertyTemplateOutline.find(InputListLOC)).toBeTruthy()
  })


  it('renders the case of an InputListLOC component with', async () => {
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
    const input = wrapper.instance().handleComponentCase(resource.propertyTemplate)
    expect(input.props.lookupConfig.value.component).toEqual("list")
  })

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
    const input = wrapper.instance().handleComponentCase(resource.propertyTemplate)
    expect(input[1].props.resourceTemplate.id).toEqual("resourceTemplate:bf2:Note")
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
  const event = { preventDefault() {} }

  // Stub `Config.spoofSinopiaServer` static getter to force RT to come from server
  jest.spyOn(Config, 'spoofSinopiaServer', 'get').mockReturnValue(false)

  it('displays a collapsed OutlineHeader of the propertyTemplate label', () => {
    expect(childOutlineHeader.props().label).toEqual(property.propertyTemplate.propertyLabel)
    expect(childOutlineHeader.props().collapsed).toBeTruthy()
  })

  it('clicking removes collapsed state', async () => {
    await wrapper.instance().fullfillRTPromises(promises).then(() => wrapper.update()).then(() => {
      childOutlineHeader.find('a').simulate('click')
      expect(wrapper.state().collapsed).toBeFalsy()
    }).catch(() => {})
  })

  it('handles "Add" button click', async () => {
    await wrapper.instance().fullfillRTPromises(promises).then(() => wrapper.update()).then(() => {
      const addButton = wrapper.find('div > section > PropertyActionButtons > div > button.btn-default')
      addButton.handleClick = mockHandleAddClick
      addButton.simulate('click')
      expect(mockHandleAddClick.mock.calls.length).toBe(1)
    }).catch(() => {})

  })

  it('handles the addClick method callback call', () => {
    wrapper.instance().handleAddClick(event)
    expect(mockHandleAddClick.mock.calls.length).toBe(1)
  })

  it ('handles "Mint URI" button click', async () => {
    await wrapper.instance().fullfillRTPromises(promises).then(() => wrapper.update()).then(() => {
      const mintButton = wrapper.find('div > section > PropertyActionButtons > div > button.btn-success')
      mintButton.simulate('click')
      expect(mockHandleMintUri.mock.calls.length).toBe(1)
    }).catch(() => {})
  })

  it('handles the mintUri method callback call', () => {
    wrapper.instance().handleMintUri(event)
    expect(mockHandleMintUri.mock.calls.length).toBe(1)
  })

})
