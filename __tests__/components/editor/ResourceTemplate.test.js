// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Config from '../../../src/Config'
import ResourceTemplate from '../../../src/components/editor/ResourceTemplate'
import ResourceTemplateForm from '../../../src/components/editor/ResourceTemplateForm'

describe('<ResourceTemplate />', () => {
  const mockResponse = (status, statusText, response) => new Response(response, {
    status,
    statusText,
    headers: {
      'Content-type': 'application/json',
    },
  }).body

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

  // Stub `Config.spoofSinopiaServer` static getter to force RT to come from server
  jest.spyOn(Config, 'spoofSinopiaServer', 'get').mockReturnValue(false)
  const wrapper = shallow(<ResourceTemplate.WrappedComponent resourceTemplateId="resourceTemplate:bf2:Note" />)
  const promise = Promise.resolve(mockResponse(200, null, responseBody))

  wrapper.instance().resolveResourceTemplatePromise(promise)

  it('has div with class "ResourceTemplate"', () => {
    expect(wrapper.find('div.ResourceTemplate').length).toEqual(1)
  })

  it('displays the resource label of the resource template', () => {
    expect(wrapper.find('h1').text()).toEqual(responseBody.response.body.resourceLabel)
  })

  // TODO: if we have more than one resourceTemplate form, they need to have unique ids (see #130)
  it('contains <div> with id resourceTemplate', () => {
    expect(wrapper.find('div#resourceTemplate').length).toEqual(1)
  })

  it('renders ResourceTemplateForm', () => {
    expect(wrapper.find(ResourceTemplateForm).length).toEqual(1)
  })
})
