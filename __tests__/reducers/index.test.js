// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import selectorReducer, {
  setRetrieveError,
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

describe('setRetrieveError', () => {
  it('adds error to editor state', () => {
    const newState = setRetrieveError(initialState.selectorReducer, {
      type: 'RETRIEVE_ERROR',
      payload: { resourceTemplateId: 'abc123' },
    })

    expect(newState.editor.serverError).toEqual('There was a problem retrieving abc123.')
  })
  it('adds error with reason to editor state', () => {
    const newState = setRetrieveError(initialState.selectorReducer, {
      type: 'RETRIEVE_ERROR',
      payload: { resourceTemplateId: 'abc123', reason: 'Because it is broken.' },
    })

    expect(newState.editor.serverError).toEqual('There was a problem retrieving abc123: Because it is broken.')
  })
})
