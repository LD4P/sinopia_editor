// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import shortid from 'shortid'
import ResourceProperty from 'components/editor/property/ResourceProperty'
import PropertyActionButtons from 'components/editor/property/PropertyActionButtons'
import PropertyTemplateOutline from 'components/editor/property/PropertyTemplateOutline'

describe('<ResourceProperty />', () => {
  shortid.generate = jest.fn().mockReturnValue('abcd45')

  describe('happy path', () => {
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

    const models = {
      'resourceTemplate:bf2:Note': [
        {
          resourceTemplate: nestedRTs[0],
          properties: [
            {
              isAddDisabled: true,
              property: nestedRTs[0].propertyTemplates[0],
              reduxPath: ['http://id.loc.gov/ontologies/bibframe/note',
                'abcd45',
                'resourceTemplate:bf2:Note',
                'http://www.w3.org/2000/01/rdf-schema#label'],
            },
          ],
        },
      ],
    }

    const wrapper = shallow(<ResourceProperty.WrappedComponent
              propertyTemplate={property}
              reduxPath={[]}
              nestedResourceTemplates={nestedRTs}
              handleAddClick={jest.fn()}
              models={models} />)

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
      expect(propertyTemplateOutline.props().reduxPath).toEqual(['http://id.loc.gov/ontologies/bibframe/note', 'abcd45', 'resourceTemplate:bf2:Note', 'http://www.w3.org/2000/01/rdf-schema#label'])
      expect(propertyTemplateOutline.props().resourceTemplate).toEqual(nestedRTs[0])
      expect(propertyTemplateOutline.props().addButtonDisabled).toEqual(true) // repeatable is false by default (nested prop template)
    })
  })

  describe('with a missing nested ref', () => {
    const propertyWithMissingRef = {
      propertyLabel: 'Notes about the Instance',
      remark: 'This is a great note',
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/note',
      type: 'resource',
      valueConstraint: {
        valueTemplateRefs: [
          'resourceTemplate:bf2:Note',
          'resourceTemplate:bf2:Cruft',
        ],
      },
    }

    const nestedRTsWithoutMissingRef = [{
      id: 'resourceTemplate:bf2:Note',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
      resourceLabel: 'Note',
      propertyTemplates: [
        {
          propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
          propertyLabel: 'Note',
          type: 'literal',
          repeatable: 'true',
        },
      ],
    }]

    const models = {
      'resourceTemplate:bf2:Note': [
        {
          resourceTemplate: nestedRTsWithoutMissingRef[0],
          properties: [
            {
              isAddDisabled: false,
              property: nestedRTsWithoutMissingRef[0].propertyTemplates[0],
              reduxPath: ['http://id.loc.gov/ontologies/bibframe/note',
                'abcd45',
                'resourceTemplate:bf2:Note',
                'http://www.w3.org/2000/01/rdf-schema#label'],
            },
          ],
        },
      ],
      'resourceTemplate:bf2:Cruft': [
        {
          resourceTemplate: undefined,
          properties: [],
        },
      ],
    }

    const wrapper = shallow(<ResourceProperty.WrappedComponent
                              propertyTemplate={propertyWithMissingRef}
                              reduxPath={[]}
                              nestedResourceTemplates={nestedRTsWithoutMissingRef}
                              handleAddClick={jest.fn()}
                              models={models} />)

    it('creates a header section with the resource label', () => {
      expect(wrapper.find('section h5').text()).toEqual('Note')
    })

    it('creates a section with the <PropertyActionButtons /> for the resource', () => {
      expect(wrapper.find(PropertyActionButtons).length).toEqual(1)
    })

    it('creates a <PropertyTemplateOutline /> for the one non-missing resource', () => {
      const propertyTemplateOutline = wrapper.find(PropertyTemplateOutline)

      expect(propertyTemplateOutline.length).toEqual(1)
      expect(propertyTemplateOutline.props().propertyTemplate).toEqual(nestedRTsWithoutMissingRef[0].propertyTemplates[0])
      expect(propertyTemplateOutline.props().reduxPath).toEqual(['http://id.loc.gov/ontologies/bibframe/note', 'abcd45', 'resourceTemplate:bf2:Note', 'http://www.w3.org/2000/01/rdf-schema#label'])
      expect(propertyTemplateOutline.props().resourceTemplate).toEqual(nestedRTsWithoutMissingRef[0])
      expect(propertyTemplateOutline.props().addButtonDisabled).toEqual(false) // nested prop template is repeatable
    })

    it('renders a warning for the missing resource', () => {
      expect(wrapper.find('div.alert-warning').text())
        .toEqual('Warning: this property refers to a missing Resource Template. You cannot edit it until a Resource Template with an ID of resourceTemplate:bf2:Cruft has been imported into the Sinopia Linked Data Editor.')
    })
  })
})
