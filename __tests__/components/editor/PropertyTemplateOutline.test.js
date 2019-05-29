// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import 'jsdom-global/register'
import { shallow, mount } from 'enzyme'
import { addResourceTemplate, PropertyTemplateOutline } from '../../../src/components/editor/PropertyTemplateOutline'
import RequiredSuperscript from '../../../src/components/editor/RequiredSuperscript'

describe('<PropertyTemplateOutline />', () => {

  const propertyRtProps = {
    propertyTemplate: {
      "propertyLabel": "Notes about the Instance",
      "remark": "This is a great note",
      "propertyURI": "http://id.loc.gov/ontologies/bibframe/note",
      "mandatory": "true",
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

  const responseBody = {
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
  }

  const mockResponse = (status, statusText, response) => {
    return new Response(response, {
      status: status,
      statusText: statusText,
      headers: {
        'Content-type': 'application/json'
      }
    }).body
  }

  const mockAsyncCall = () => {
    return mockResponse(200, null, responseBody)
  }

  const mockPromise = Promise.all([mockAsyncCall(0)])

  const wrapper = mount(<PropertyTemplateOutline {...propertyRtProps} />)

  it('has an outline header labeled with the property template propertyLabel', () => {
    expect(wrapper.find('OutlineHeader div').text().trim()).toEqual("Notes about the Instance")
  })

  it('outline header anchor has an ID based on the property template propertyURI', () => {
    expect(wrapper.find('OutlineHeader').prop('id')).toEqual("note")
  })

  it('the outline header has a clickable icon', () => {
    expect(wrapper.find('div.rOutline-property')).toBeTruthy()
    expect(wrapper.find('OutlineHeader a FontAwesomeIcon').length).toEqual(1)
  })

  it('checks if the property is required', () => {
    expect(wrapper.instance().isRequired(propertyRtProps.propertyTemplate)).toEqual(<RequiredSuperscript />)
    propertyRtProps.propertyTemplate['mandatory'] = "false"
    expect(wrapper.instance().isRequired(propertyRtProps.propertyTemplate)).toBeUndefined()
  })

  describe('Nested property components', () => {

    const wrapper = shallow(<PropertyTemplateOutline {...propertyRtProps} />)

    it('sets the state with a collection of nested resource templates', async () => {
      expect.assertions(2)
      return await wrapper.instance().fulfillRTPromises(mockPromise).then(() => {
        const nestedResourceTemplates = wrapper.state('nestedResourceTemplates')
        expect(nestedResourceTemplates[0].id).toEqual("resourceTemplate:bf2:Note")
        expect(nestedResourceTemplates[0].propertyTemplates.length).toEqual(1)
      })

    })

    it('adds a ResourceProperty div for a row with the nested template', () => {
      wrapper.setState({collapsed: false})
      wrapper.instance().outlineRowClass()
      wrapper.instance().addPropertyTypeRows(propertyRtProps.propertyTemplate)
      expect(wrapper.find('div PropertyTypeRow').length).toEqual(1)
      expect(wrapper.find('div Connect(ResourceProperty)').length).toEqual(1)
    })

    it('adds a PropertyComponent div for a row with the nested template', () => {

      const propertyRtPropsLiteral = {
        propertyTemplate: {
          "propertyLabel": "Holdings",
          "propertyURI": "http://id.loc.gov/ontologies/bibframe/heldBy",
          "type": "literal",
          "valueConstraint": {
            "defaults": [{
              "defaultURI": "http://id.loc.gov/vocabulary/organizations/dlc",
              "defaultLiteral": "DLC"
            }]
          }
        }
      }

      const wrapper = shallow(<PropertyTemplateOutline {...propertyRtPropsLiteral}
                               reduxPath={["http://id.loc.gov/ontologies/bibframe/heldBy"]} />)

      wrapper.setState({collapsed: false})
      wrapper.instance().outlineRowClass()
      wrapper.instance().addPropertyTypeRows(propertyRtPropsLiteral.propertyTemplate)
      expect(wrapper.find('div PropertyTypeRow').length).toEqual(1)
      expect(wrapper.find('div PropertyComponent').length).toEqual(1)
    })
  })
})

describe('addResourceTemplate function', () => {
  const noteResourceTemplate = {
    "id": "resourceTemplate:bf2:Note",
    "resourceURI": "http://id.loc.gov/ontologies/bibframe/Note",
    "resourceLabel": "A Resource Template Note",
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
  const propertyTemplate = addResourceTemplate(noteResourceTemplate, ['resourceTemplate:bf2:Note'])

  it("contains the Resource Template's resourceLabel as the first element", () => {
    const firstElement = shallow(<h5>{noteResourceTemplate["resourceLabel"]}</h5>)
    expect(firstElement.matchesElement(propertyTemplate[0])).toBeTruthy()
  })

  it('contains a <PropertyTemplateOutline /> as the second element', () => {
    expect(propertyTemplate[1].type).toBe(PropertyTemplateOutline)
  })
})
