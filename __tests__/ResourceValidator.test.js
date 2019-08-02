// Copyright 2019 Stanford University see LICENSE for license

import Validator from 'ResourceValidator'
import { findNode } from 'selectors/resourceSelectors'

let resource
let resourceTemplates

beforeEach(() => {
  resource = {
    'resourceTemplate:Monograph:Instance': {
      'http://id.loc.gov/ontologies/bibframe/title': {
      },
      'http://id.loc.gov/ontologies/bibframe/itemPortion': {
      },
    },
  }

  resourceTemplates = {
    'resourceTemplate:Monograph:Instance': {
      resourceLabel: 'Instance',
      propertyTemplates: [
        {
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
          propertyLabel: 'Title',
        },
        {
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/itemPortion',
          propertyLabel: 'Barcode',
          valueConstraint: {
            valueTemplateRefs: [
              'resourceTemplate:bf2:Identifiers:Barcode',
            ],
          },
        },
      ],
    },
    'resourceTemplate:bf2:Identifiers:Barcode': {
      resourceLabel: 'Barcode',
      propertyTemplates: [
        {
          mandatory: 'true',
          propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
          propertyLabel: 'Barcode',
        },
      ],
    },
  }
})

describe('validate()', () => {
  it('when no properties are mandatory', () => {
    const results = new Validator({ resource, entities: { resourceTemplates } }, findNode).validate()

    expect(results[0]).toEqual({})
    expect(results[1]).toEqual([])
  })

  it('when a property is mandatory and provided', () => {
    resourceTemplates['resourceTemplate:Monograph:Instance'].propertyTemplates[0].mandatory = 'true'
    resource['resourceTemplate:Monograph:Instance']['http://id.loc.gov/ontologies/bibframe/title'].items = [{ content: 'bar' }]
    const results = new Validator({ resource, entities: { resourceTemplates } }, findNode).validate()

    expect(results[0]).toEqual({})
    expect(results[1]).toEqual([])
  })

  it('when a property is mandatory and not provided', () => {
    resourceTemplates['resourceTemplate:Monograph:Instance'].propertyTemplates[0].mandatory = 'true'
    const results = new Validator({ resource, entities: { resourceTemplates } }, findNode).validate()

    expect(results[0]).toEqual({
      resource: {
        'resourceTemplate:Monograph:Instance': {
          'http://id.loc.gov/ontologies/bibframe/title': {
            errors: [
              'Required',
            ],
          },
        },
      },
    })

    expect(results[1]).toEqual([{
      message: 'Required',
      path: ['Instance', 'Title'],
      reduxPath: ['resource', 'resourceTemplate:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/title'],
    }])
  })

  it('when a nested resource is mandatory and provided', () => {
    resourceTemplates['resourceTemplate:Monograph:Instance'].propertyTemplates[0].mandatory = 'true'
    resource['resourceTemplate:Monograph:Instance']['http://id.loc.gov/ontologies/bibframe/title'].abcdCode = { 'resourceTemplate:bf2:Title': {} }
    const results = new Validator({ resource, entities: { resourceTemplates } }, findNode).validate()

    expect(results[0]).toEqual({})
    expect(results[1]).toEqual([])
  })

  it('when a nested resource has a mandatory property and is not provided', () => {
    // Make barcode mandatory
    resourceTemplates['resourceTemplate:Monograph:Instance'].propertyTemplates[1].mandatory = 'true'
    resource['resourceTemplate:Monograph:Instance']['http://id.loc.gov/ontologies/bibframe/itemPortion'].abcdCode = { 'resourceTemplate:bf2:Identifiers:Barcode': {} }
    const results = new Validator({ resource, entities: { resourceTemplates } }, findNode).validate()

    expect(results[0]).toEqual({
      resource: {
        'resourceTemplate:Monograph:Instance': {
          'http://id.loc.gov/ontologies/bibframe/itemPortion': {
            abcdCode: {
              'resourceTemplate:bf2:Identifiers:Barcode': {
                'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
                  errors: [
                    'Required',
                  ],
                },
              },
            },
          },
        },
      },
    })

    expect(results[1]).toEqual([{ message: 'Required', path: ['Instance', 'Barcode', 'Barcode', 'Barcode'], reduxPath: ['resource', 'resourceTemplate:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/itemPortion', 'abcdCode', 'resourceTemplate:bf2:Identifiers:Barcode', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value'] }])
  })
})
