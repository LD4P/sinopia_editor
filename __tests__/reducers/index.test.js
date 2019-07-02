// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import selectorReducer, {
  populatePropertyDefaults,
  refreshResourceTemplate,
  resourceTemplateLoaded,
  rootResourceTemplateLoaded,
} from 'reducers/index'
/* eslint import/namespace: 'off' */
import * as inputs from 'reducers/inputs'

let initialState

beforeEach(() => {
  initialState = {
    selectorReducer: {
      entities: {
        // The stuff we've retrieved from the server
        resourceTemplates: { },
      },
      resource: { // The state we're displaying in the editor
      },
      editor: {
      },
    },
  }
})

describe('selectorReducer', () => {
  const samplePropertyTemplate = [
    {
      propertyLabel: 'Instance of',
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
      resourceTemplates: [],
      type: 'resource',
      valueConstraint: {
        valueTemplateRefs: [
          'resourceTemplate:bf2:Monograph:Work',
        ],
        useValuesFrom: [],
        valueDataType: {},
        defaults: [],
      },
      mandatory: 'true',
      repeatable: 'true',
    },
    {
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/issuance',
      propertyLabel: 'Mode of Issuance (RDA 2.13)',
      remark: 'http://access.rdatoolkit.org/2.13.html',
      mandatory: 'true',
      repeatable: 'true',
      type: 'resource',
      resourceTemplates: [],
      valueConstraint: {
        valueTemplateRefs: [],
        useValuesFrom: [
          'https://id.loc.gov/vocabulary/issuance',
        ],
        valueDataType: {
          dataTypeURI: 'http://id.loc.gov/ontologies/bibframe/Issuance',
        },
        editable: 'false',
        repeatable: 'true',
        defaults: [
          {
            defaultURI: 'http://id.loc.gov/vocabulary/issuance/mono',
            defaultLiteral: 'single unit',
          },
        ],
      },
    },
    {
      propertyLabel: 'LITERAL WITH DEFAULT',
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/heldBy',
      resourceTemplates: [],
      type: 'literal',
      valueConstraint: {
        valueTemplateRefs: [],
        useValuesFrom: [],
        valueDataType: {
          dataTypeURI: 'http://id.loc.gov/ontologies/bibframe/Agent',
        },
        defaults: [
          {
            defaultURI: 'http://id.loc.gov/vocabulary/organizations/dlc',
            defaultLiteral: 'DLC',
          },
        ],
      },
      mandatory: 'false',
      repeatable: 'true',
    },
  ]

  const propertyTemplateWithoutConstraint = [
    {
      propertyLabel: 'LITERAL WITH DEFAULT',
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/heldBy',
      resourceTemplates: [],
      type: 'literal',
      mandatory: 'false',
      repeatable: 'true',
    },
  ]

  // Make sure spies/mocks don't leak between tests
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('handles the initial state', () => {
    expect(
      selectorReducer(initialState, {}),
    ).toMatchObject(
      {
        authenticate: { authenticationState: { currentUser: null, currentSession: null, authenticationError: null } },
        selectorReducer: {
          entities: {
            resourceTemplates: {},
          },
          resource: {},
        },
      },
    )
  })

  it('handles SET_BASE_URL', () => {
    inputs.setBaseURL = jest.fn().mockReturnValue({})
    const oldState = {
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Instance': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
          },
        },
      },
      resource: {
        'resourceTemplate:bf2:Monograph:Instance': {
        },
      },
    }

    const action = {
      type: 'SET_BASE_URL',
      payload: 'http://example.com/base/123',
    }

    selectorReducer({ selectorReducer: oldState }, action)
    expect(inputs.setBaseURL).toBeCalledWith(oldState, action)
  })

  it('handles ROOT_RESOURCE_TEMPLATE_LOADED', () => {
    shortid.generate = jest.fn().mockReturnValue(0)
    const result = selectorReducer(initialState,
      {
        type: 'ROOT_RESOURCE_TEMPLATE_LOADED',
        payload: {
          id: 'resourceTemplate:bf2:Monograph:Instance',
          resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
          propertyTemplates: samplePropertyTemplate,
        },
      })

    expect(result.authenticate).toMatchObject({ authenticationState: { currentUser: null, currentSession: null, authenticationError: null } })
    expect(result.selectorReducer).toMatchObject({
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Instance': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
          },
        },
      },
      resource: {
        'resourceTemplate:bf2:Monograph:Instance': {
          'http://id.loc.gov/ontologies/bibframe/instanceOf': {},
          'http://id.loc.gov/ontologies/bibframe/issuance': {
            items:
              [{
                id: 0,
                content: 'single unit',
                uri: 'http://id.loc.gov/vocabulary/issuance/mono',
              }],
          },
          'http://id.loc.gov/ontologies/bibframe/heldBy': {
            items:
              [{
                id: 0,
                content: 'DLC',
                uri: 'http://id.loc.gov/vocabulary/organizations/dlc',
              }],
          },
        },
      },
      editor: {
        errors: [],
        displayValidations: false,
      },
    })
  })

  it('allows ROOT_RESOURCE_TEMPLATE_LOADED on templates without valueConstraint', () => {
    shortid.generate = jest.fn().mockReturnValue(0)
    const result = selectorReducer(initialState,
      {
        type: 'ROOT_RESOURCE_TEMPLATE_LOADED',
        payload: {
          id: 'resourceTemplate:bf2:Monograph:Instance',
          propertyTemplates: propertyTemplateWithoutConstraint,
        },
      })

    expect(result.selectorReducer).toMatchObject({
      resource: {
        'resourceTemplate:bf2:Monograph:Instance': {
          'http://id.loc.gov/ontologies/bibframe/heldBy':
            {},
        },
      },
    })
  })
})

describe('refreshResourceTemplate', () => {
  // Make sure spies/mocks don't leak between tests
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('passing a payload to an empty resource state', () => {
    const emptyStateResult = refreshResourceTemplate(initialState.selectorReducer, {
      type: 'REFRESH_RESOURCE_TEMPLATE',
      payload: {
        reduxPath: ['resource', 'resourceTemplate:bf2:Monograph:Work', 'http://sinopia.io/example'],
        property: {},
      },
    })

    expect(emptyStateResult).toStrictEqual({
      entities: {
        resourceTemplates: {},
      },
      resource: {
        'resourceTemplate:bf2:Monograph:Work': {
          'http://sinopia.io/example': {},
        },
      },
      editor: {},
    })
  })

  it('overwrites the exiting resource with the new chosen resource', () => {
    const samplePropertyTemplate = [
      {
        propertyLabel: 'Note',
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/note',
      },
    ]

    selectorReducer(initialState, {
      type: 'ROOT_RESOURCE_TEMPLATE_LOADED',
      payload: {
        id: 'resourceTemplate:bf2:Note',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
        propertyTemplates: samplePropertyTemplate,
      },
    })

    const overwriteStateResult = refreshResourceTemplate(initialState.selectorReducer, {
      type: 'REFRESH_RESOURCE_TEMPLATE',
      payload: {
        reduxPath: ['resource', 'resourceTemplate:bf2:Monograph:Work', 'http://sinopia.io/next_example'],
        property: {},
      },
    })

    expect(overwriteStateResult).toStrictEqual({
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Note': {
            id: 'resourceTemplate:bf2:Note',
            propertyTemplates: [{
              propertyLabel: 'Note',
              propertyURI: 'http://id.loc.gov/ontologies/bibframe/note',
            }],
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
          },
        },
      },
      resource: {
        'resourceTemplate:bf2:Monograph:Work': {
          'http://sinopia.io/next_example': {},
        },
      },
      editor: {
        errors: [],
        displayValidations: false,
      },
    })
  })

  it('tests with a more realistic payload with defaults', () => {
    shortid.generate = jest.fn().mockReturnValue(0)
    const defaultStateResult = refreshResourceTemplate(initialState.selectorReducer, {
      type: 'REFRESH_RESOURCE_TEMPLATE',
      payload: {
        reduxPath: ['resource', 'resourceTemplate:bf2:Item', 'http://schema.org/name'],
        property: { valueConstraint: { defaults: [{ defaultLiteral: 'Sinopia Name' }] } },
      },
    })

    expect(defaultStateResult.resource).toStrictEqual({
      'resourceTemplate:bf2:Item': {
        'http://schema.org/name': {
          items: [
            {
              content: 'Sinopia Name',
              id: 0,
              lang: {
                items: [{
                  id: 'en',
                  label: 'English',
                }],
              },
              uri: undefined,
            }],
        },
      },
    })
  })
})

describe('populatePropertyDefaults()', () => {
  it('empty properties return empty defaults', () => {
    const emptyObjectResult = populatePropertyDefaults({})

    expect(emptyObjectResult).toStrictEqual({})
  })

  it('propertyTemplate with refs returns a structure', () => {
    shortid.generate = jest.fn()
      .mockReturnValueOnce('BQ7BO4Lho')
      .mockReturnValueOnce('Jarec4Nf4i')
      .mockReturnValueOnce('ozm5S0nlu0')

    const simpleProperty = populatePropertyDefaults(
      {
        mandatory: 'false',
        repeatable: 'true',
        type: 'resource',
        resourceTemplates: [],
        valueConstraint: {
          valueTemplateRefs: [
            'resourceTemplate:bf2:Identifiers:LC',
            'resourceTemplate:bf2:Identifiers:DDC',
            'resourceTemplate:bf2:Identifiers:Shelfmark',
          ],
          useValuesFrom: [],
          valueDataType: {},
        },
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/identifiedBy',
        propertyLabel: 'Call numbers',
      },
    )

    expect(simpleProperty).toStrictEqual({
      BQ7BO4Lho: {
        'resourceTemplate:bf2:Identifiers:LC': {},
      },
      Jarec4Nf4i: {
        'resourceTemplate:bf2:Identifiers:DDC': {},
      },
      ozm5S0nlu0: {
        'resourceTemplate:bf2:Identifiers:Shelfmark': {},
      },
    })
  })

  it('tests propertyTemplate with defaults returns object containing default values', () => {
    shortid.generate = jest.fn().mockReturnValue(0)
    const propertyWithDefaults = populatePropertyDefaults(
      {
        propertyLabel: 'LITERAL WITH DEFAULT',
        propertyURI: 'http://id.loc.gov/ontologies/bibframe/heldBy',
        resourceTemplates: [],
        type: 'literal',
        valueConstraint: {
          valueTemplateRefs: [],
          useValuesFrom: [],
          valueDataType: {
            dataTypeURI: 'http://id.loc.gov/ontologies/bibframe/Agent',
          },
          defaults: [
            {
              defaultURI: 'http://id.loc.gov/vocabulary/organizations/dlc',
              defaultLiteral: 'DLC',
            },
          ],
        },
        mandatory: 'false',
        repeatable: 'true',
      },
    )

    expect(propertyWithDefaults).toStrictEqual({
      items: [{
        content: 'DLC',
        id: 0,
        lang: {
          items: [{
            id: 'en',
            label: 'English',
          }],
        },
        uri: 'http://id.loc.gov/vocabulary/organizations/dlc',
      }],
    })
  })
})

describe('resourceTemplateLoaded()', () => {
  it('adds resource to the resourceTemplates entities state', () => {
    const newState = resourceTemplateLoaded(initialState.selectorReducer, {
      type: 'RESOURCE_TEMPLATE_LOADED',
      payload: {
        id: 'resourceTemplate:bf2:Monograph:Work',
        'http://id.loc.gov/ontologies/bibframe/title': {},
      },
    })

    expect(newState).toStrictEqual({
      editor: {},
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Work': {
            id: 'resourceTemplate:bf2:Monograph:Work',
            'http://id.loc.gov/ontologies/bibframe/title': {},
          },
        },
      },
      resource: {},
    })
  })
})

describe('rootResourceTemplateLoaded()', () => {
  it('adds resource to the resourceTemplates entities state', () => {
    const template = {
      id: 'resourceTemplate:bf2:Monograph:Work',
      propertyTemplates: [
        { propertyURI: 'http://id.loc.gov/ontologies/bibframe/title' },
      ],
    }
    const newState = rootResourceTemplateLoaded(initialState.selectorReducer, {
      type: 'ROOT_RESOURCE_TEMPLATE_LOADED',
      payload: template,
    })

    expect(newState).toStrictEqual({
      editor: {
        errors: [],
        displayValidations: false,
      },
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Work': template,
        },
      },
      resource: {
        'resourceTemplate:bf2:Monograph:Work': {
          'http://id.loc.gov/ontologies/bibframe/title': {},
        },
      },
    })
  })
})
