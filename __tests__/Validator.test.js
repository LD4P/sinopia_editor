// Copyright 2019 Stanford University see LICENSE for license

import Validator from 'Validator'

let initialState

beforeEach(() => {
  initialState = {
    editor: {
      errors: [],
      displayValidations: false,
    },
    resource: {
      'resourceTemplate:Monograph:Instance': {
        'http://id.loc.gov/ontologies/bibframe/title': {
        },
      },
    },
    entities: {
      resourceTemplates: {
        'resourceTemplate:Monograph:Instance': {
          propertyTemplates: [
            {
              propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
              propertyLabel: 'Title',
            },
          ],
        },
      },
    },
  }
})

describe('validate()', () => {
  it('when no properties are mandatory', () => {
    const result = new Validator(initialState).validate()

    expect(result.editor.errors).toEqual([])
    expect(result.editor.displayValidations).toEqual(false)
  })

  it('when a property is mandatory and provided', () => {
    initialState.entities.resourceTemplates['resourceTemplate:Monograph:Instance'].propertyTemplates[0].mandatory = 'true'
    initialState.resource['resourceTemplate:Monograph:Instance']['http://id.loc.gov/ontologies/bibframe/title'].items = [{ content: 'bar' }]
    const result = new Validator(initialState).validate()

    expect(result.editor.errors).toEqual([])
    expect(result.editor.displayValidations).toEqual(false)
  })

  it('when a property is mandatory and not provided and show is not set', () => {
    initialState.entities.resourceTemplates['resourceTemplate:Monograph:Instance'].propertyTemplates[0].mandatory = 'true'
    const result = new Validator(initialState).validate()

    expect(result.editor.errors).toEqual([
      {
        label: 'Title',
        message: 'Required',
        path: [
          'resourceTemplate:Monograph:Instance',
          'http://id.loc.gov/ontologies/bibframe/title',
        ],
      },
    ])
    expect(result.editor.displayValidations).toEqual(false)
  })

  it('when a property is mandatory and not provided and show is set', () => {
    initialState.entities.resourceTemplates['resourceTemplate:Monograph:Instance'].propertyTemplates[0].mandatory = 'true'
    const result = new Validator(initialState).validate(true)

    expect(result.editor.errors).toEqual([
      {
        label: 'Title',
        message: 'Required',
        path: [
          'resourceTemplate:Monograph:Instance',
          'http://id.loc.gov/ontologies/bibframe/title',
        ],
      },
    ])
    expect(result.editor.displayValidations).toEqual(true)
  })

  it('when a nested resource is mandatory and provided', () => {
    initialState.entities.resourceTemplates['resourceTemplate:Monograph:Instance'].propertyTemplates[0].mandatory = 'true'
    initialState.resource['resourceTemplate:Monograph:Instance']['http://id.loc.gov/ontologies/bibframe/title'].abcdCode = { 'resourceTemplate:bf2:Title': {} }

    const result = new Validator(initialState).validate()

    expect(result.editor.errors).toEqual([])
    expect(result.editor.displayValidations).toEqual(false)
  })
})
