// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import ResourceProperty from '../../../src/components/editor/ResourceProperty'
import PropertyActionButtons from '../../../src/components/editor/PropertyActionButtons'
import PropertyTemplateOutline from '../../../src/components/editor/PropertyTemplateOutline'

describe('<ResourceProperty />', () => {
  const mockInitNewResourceTemplate = jest.fn()

  const property = {
    propertyLabel: 'Notes about the Instance',
    remark: 'This is a great note',
    propertyURI: 'http://id.loc.gov/ontologies/bibframe/note',
    type: 'resource',
    valueConstraint: {
      valueTemplateRefs: [
        'resourceTemplate:bf2:Note',
      ],
    },
  }

  const nestedRTs = [{
    id: 'resourceTemplate:bf2:Note',
    resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
    resourceLabel: 'Note',
    propertyTemplates: [
      {
        propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
        propertyLabel: 'Note',
        type: 'literal',
      },
    ],
  }]

  const wrapper = shallow(<ResourceProperty.WrappedComponent
                              propertyTemplate={property}
                              reduxPath={[]}
                              nestedResourceTemplates={nestedRTs}
                              initNewResourceTemplate={mockInitNewResourceTemplate}
                              handleAddClick={jest.fn()} />)

  it('creates a header section with the resource label', () => {
    expect(wrapper.find('section h5').text()).toEqual('Note')
  })

  it('creates a section with the <PropertyActionButtons /> for the resource', () => {
    expect(wrapper.find(PropertyActionButtons).length).toEqual(1)
  })

  it('creates a <PropertyTemplateOutline /> for the resource', () => {
    const propertyTemplateOutline = wrapper.find(PropertyTemplateOutline)

    expect(propertyTemplateOutline.length).toEqual(1)
    expect(propertyTemplateOutline.props().propertyTemplate).toEqual(nestedRTs[0].propertyTemplates[0])
    expect(propertyTemplateOutline.props().reduxPath).toEqual(['resourceTemplate:bf2:Note', 'http://www.w3.org/2000/01/rdf-schema#label'])
    expect(propertyTemplateOutline.props().resourceTemplate).toEqual(nestedRTs[0])
  })

  it('calls redux to initialize the state with the nested resource', () => {
    expect(mockInitNewResourceTemplate).toHaveBeenCalledTimes(1)
  })
})
