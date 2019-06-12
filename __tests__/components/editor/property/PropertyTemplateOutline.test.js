// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import 'jsdom-global/register'
import { mount, shallow } from 'enzyme'
import { PropertyTemplateOutline } from 'components/editor/property/PropertyTemplateOutline'

describe('<PropertyTemplateOutline />', () => {
  const propertyRtProps = {
    propertyTemplate: {
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
  }

  const responseBody = {
    response: {
      body: {
        id: 'resourceTemplate:bf2:Note',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
        resourceLabel: 'Note',
        propertyTemplates: [
          {
            propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
            propertyLabel: 'Note',
            mandatory: 'false',
            repeatable: 'false',
            type: 'literal',
            resourceTemplates: [],
            valueConstraint: {
              valueTemplateRefs: [],
              useValuesFrom: [],
              valueDataType: {},
              editable: 'true',
              repeatable: 'false',
              defaults: [],
            },
          },
        ],
      },
    },
  }

  const mockResponse = (status, statusText, response) => new Response(response, {
    status,
    statusText,
    headers: {
      'Content-type': 'application/json',
    },
  }).body

  const mockAsyncCall = () => mockResponse(200, null, responseBody)

  const mockPromise = Promise.all([mockAsyncCall(0)])

  const wrapper = mount(<PropertyTemplateOutline {...propertyRtProps} />)

  it('has an outline header labeled with the property template propertyLabel', () => {
    expect(wrapper.find('OutlineHeader div').text().trim()).toEqual('Notes about the Instance')
  })

  it('outline header anchor has an ID based on the property template propertyURI', () => {
    expect(wrapper.find('OutlineHeader').prop('id')).toEqual('note')
  })

  it('the outline header has a clickable icon', () => {
    expect(wrapper.find('div.rOutline-property')).toBeTruthy()
    expect(wrapper.find('OutlineHeader a FontAwesomeIcon').length).toEqual(1)
  })

  describe('Nested property components', () => {
    const wrapper = shallow(<PropertyTemplateOutline {...propertyRtProps} />)

    it('sets the state with a collection of nested resource templates', async () => {
      expect.assertions(2)

      return await wrapper.instance().fulfillRTPromises(mockPromise).then(() => {
        const nestedResourceTemplates = wrapper.state('nestedResourceTemplates')

        expect(nestedResourceTemplates[0].id).toEqual('resourceTemplate:bf2:Note')
        expect(nestedResourceTemplates[0].propertyTemplates.length).toEqual(1)
      })
    })

    it('adds a ResourceProperty div for a row with the nested template', () => {
      wrapper.setState({ collapsed: false })
      wrapper.instance().outlineRowClass()
      wrapper.instance().addPropertyTypeRows(propertyRtProps.propertyTemplate)
      expect(wrapper.find('div PropertyTypeRow').length).toEqual(1)
      expect(wrapper.find('div Connect(ResourceProperty)').length).toEqual(1)
    })

    it('adds a PropertyComponent div for a row with the nested template', () => {
      const propertyRtPropsLiteral = {
        propertyTemplate: {
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

      const wrapper = shallow(<PropertyTemplateOutline {...propertyRtPropsLiteral}
                                                       reduxPath={['http://id.loc.gov/ontologies/bibframe/heldBy']} />)

      wrapper.setState({ collapsed: false })
      wrapper.instance().outlineRowClass()
      wrapper.instance().addPropertyTypeRows(propertyRtPropsLiteral.propertyTemplate)
      expect(wrapper.find('div PropertyTypeRow').length).toEqual(1)
      expect(wrapper.find('div PropertyComponent').length).toEqual(1)
    })
  })
})
