// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import selectorReducer, {
  populatePropertyDefaults,
  refreshResourceTemplate,
  resourceTemplateLoaded,
  getDisplayValidations,
  getResourceTemplate,
  getPropertyTemplate,
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
    },
  }
})

describe('getDisplayValidations()', () => {
  it('returns false when missing', () => {
    expect(getDisplayValidations(initialState)).toBeFalsy()
  })

  it('returns value when present', () => {
    const state = {
      selectorReducer: {
        editor: {
          displayValidations: true,
        },
      },
    }

    expect(getDisplayValidations(state)).toBeTruthy()
  })
})

describe('getResourceTemplate()', () => {
  it('returns undefined when missing', () => {
    expect(getResourceTemplate(initialState, 'resourceTemplate:bf2:Monograph:Work')).toBeFalsy()
  })

  it('returns resource template when present', () => {
    const state = {
      selectorReducer: {
        entities: {
          resourceTemplates: {
            'resourceTemplate:bf2:Monograph:Work': {
              resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
            },
          },
        },
      },
    }

    expect(getResourceTemplate(state, 'resourceTemplate:bf2:Monograph:Work')).toEqual({
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
    })
  })
})

describe('getPropertyTemplate()', () => {
  it('returns undefined when missing', () => {
    expect(getPropertyTemplate(initialState, 'resourceTemplate:bf2:Monograph:Work', 'http://id.loc.gov/ontologies/bibframe/title')).toBeFalsy()
  })

  it('returns property template when present', () => {
    const state = {
      selectorReducer: {
        entities: {
          resourceTemplates: {
            'resourceTemplate:bf2:Monograph:Work': {
              resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
              propertyTemplates: [{
                propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
              }],
            },
          },
        },
      },
    }

    expect(getPropertyTemplate(state, 'resourceTemplate:bf2:Monograph:Work', 'http://id.loc.gov/ontologies/bibframe/title')).toEqual({
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
    })
  })
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

  it('handles SET_RESOURCE_TEMPLATE', () => {
    shortid.generate = jest.fn().mockReturnValue(0)
    const result = selectorReducer(initialState,
      {
        type: 'SET_RESOURCE_TEMPLATE',
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
    })
  })

  it('allows SET_RESOURCE_TEMPLATE on templates without valueConstraint', () => {
    shortid.generate = jest.fn().mockReturnValue(0)
    const result = selectorReducer(initialState,
      {
        type: 'SET_RESOURCE_TEMPLATE',
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

  it('passing a payload to an empty state', () => {
    const emptyStateResult = refreshResourceTemplate(initialState.selectorReducer, {
      type: 'REFRESH_RESOURCE_TEMPLATE',
      payload: {
        reduxPath: ['resource', 'resourceTemplate:bf2:Monograph:Work', 'http://sinopia.io/example'],
      },
    })

    expect(emptyStateResult).toEqual({
      entities: {
        resourceTemplates: {},
      },
      resource: {
        'resourceTemplate:bf2:Monograph:Work': {
          'http://sinopia.io/example': {},
        },
      },
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
      type: 'SET_RESOURCE_TEMPLATE',
      payload: {
        id: 'resourceTemplate:bf2:Note',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
        propertyTemplates: samplePropertyTemplate,
      },
    })

    const overwiteStateResult = refreshResourceTemplate(initialState.selectorReducer, {
      type: 'REFRESH_RESOURCE_TEMPLATE',
      payload: {
        reduxPath: ['resource', 'resourceTemplate:bf2:Monograph:Work', 'http://sinopia.io/next_example'],
      },
    })

    expect(overwiteStateResult).toEqual({
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

    expect(defaultStateResult.resource).toEqual({
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
  it('empty and undefined properties return empty array', () => {
    const undefinedResult = populatePropertyDefaults()

    expect(undefinedResult).toEqual([])
    const nullResult = populatePropertyDefaults(null)

    expect(nullResult).toEqual([])
    const emptyObjectResult = populatePropertyDefaults({})

    expect(emptyObjectResult).toEqual([])
  })

  it('propertyTemplate without defaults returns empty array', () => {
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

    expect(simpleProperty).toEqual([])
  })

  it('tests propertyTemplate with defaults returns array with object containing default values', () => {
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

    expect(propertyWithDefaults).toEqual([{
      content: 'DLC',
      id: 0,
      lang: {
        items: [{
          id: 'en',
          label: 'English',
        }],
      },
      uri: 'http://id.loc.gov/vocabulary/organizations/dlc',
    }])
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

    expect(newState).toEqual({
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
