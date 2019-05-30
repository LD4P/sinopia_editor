// Copyright 2019 Stanford University see LICENSE for license
import shortid from 'shortid'
import selectorReducer, { populatePropertyDefaults, refreshResourceTemplate } from '../../src/reducers/index'

describe('Takes a resource template ID and populates the global state', () => {
  // Make sure spies/mocks don't leak between tests
  afterAll(() => {
    jest.restoreAllMocks()
  })

  const pt = [
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

  it('should handle the initial state', () => {
    expect(
      selectorReducer(undefined, {}),
    ).toMatchObject(
      {
        authenticate: { authenticationState: { currentUser: null, currentSession: null, authenticationError: null } },
        lang: { formData: [] },
        selectorReducer: {},
      },
    )
  })

  it('handles SET_RESOURCE_TEMPLATE', () => {
    shortid.generate = jest.fn().mockReturnValue(0)
    expect(
      selectorReducer({ selectorReducer: {} }, {
        type: 'SET_RESOURCE_TEMPLATE',
        payload: {
          id: 'resourceTemplate:bf2:Monograph:Instance',
          propertyTemplates: pt,
        },
      }),
    ).toMatchObject(
      {
        authenticate: { authenticationState: { currentUser: null, currentSession: null, authenticationError: null } },
        lang: { formData: [] },
        selectorReducer: {
          'resourceTemplate:bf2:Monograph:Instance':
          {
            'http://id.loc.gov/ontologies/bibframe/instanceOf': {},
            'http://id.loc.gov/ontologies/bibframe/issuance':
              {
                items:
                [{
                  id: 0,
                  content: 'single unit',
                  uri: 'http://id.loc.gov/vocabulary/issuance/mono',
                }],
              },
            'http://id.loc.gov/ontologies/bibframe/heldBy':
              {
                items:
                [{
                  id: 0,
                  content: 'DLC',
                  uri: 'http://id.loc.gov/vocabulary/organizations/dlc',
                }],
              },
          },
        },
      },
    )
  })

  it('passing a payload to an empty state', () => {
    const emptyStateResult = refreshResourceTemplate({}, {
      type: 'REFRESH_RESOURCE_TEMPLATE',
      payload: {
        reduxPath: ['http://sinopia.io/example'],
      },
    })

    expect(emptyStateResult).toEqual({
      'http://sinopia.io/example': {},
    })
  })

  it('missing reduxPath in payload should return the state', () => {
    const missingPayload = refreshResourceTemplate({}, {
      type: 'REFRESH_RESOURCE_TEMPLATE',
      payload: {},
    })

    expect(missingPayload).toEqual({})
  })

  it('tests with a more realistic payload with defaults', () => {
    shortid.generate = jest.fn().mockReturnValue(0)
    const defaultStateResult = refreshResourceTemplate({}, {
      type: 'REFRESH_RESOURCE_TEMPLATE',
      payload: {
        reduxPath: ['resourceTemplate:bf2:Item', 'http://schema.org/name'],
        property: { valueConstraint: { defaults: [{ defaultLiteral: 'Sinopia Name' }] } },
      },
    })

    expect(defaultStateResult).toEqual({
      'resourceTemplate:bf2:Item': {
        'http://schema.org/name': {
          items: [{ content: 'Sinopia Name', id: 0, uri: undefined }],
        },
      },
    })
  })
})

describe('Takes a property and returns an empty or a populated array from populatePropertyDefaults()', () => {
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
      uri: 'http://id.loc.gov/vocabulary/organizations/dlc',
    }])
  })
})
