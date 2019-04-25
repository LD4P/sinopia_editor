// Copyright 2019 Stanford University see Apache2.txt for license
import { refreshResourceTemplate  } from '../../src/reducers/index'
import selectorReducer from '../../src/reducers/index'

describe(`Takes a resource template ID and populates the global state`, () => {

  const pt = [
    {
      "propertyLabel": "Instance of",
      "propertyURI": "http://id.loc.gov/ontologies/bibframe/instanceOf",
      "resourceTemplates": [],
      "type": "resource",
      "valueConstraint": {
        "valueTemplateRefs": [
          "resourceTemplate:bf2:Monograph:Work"
        ],
        "useValuesFrom": [],
        "valueDataType": {},
        "defaults": []
      },
      "mandatory": "true",
      "repeatable": "true"
    },
    {
      "propertyURI": "http://id.loc.gov/ontologies/bibframe/issuance",
      "propertyLabel": "Mode of Issuance (RDA 2.13)",
      "remark": "http://access.rdatoolkit.org/2.13.html",
      "mandatory": "true",
      "repeatable": "true",
      "type": "resource",
      "resourceTemplates": [],
      "valueConstraint": {
        "valueTemplateRefs": [],
        "useValuesFrom": [
          "https://id.loc.gov/vocabulary/issuance"
        ],
        "valueDataType": {
          "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Issuance"
        },
        "editable": "false",
        "repeatable": "true",
        "defaults": [
          {
            "defaultURI": "http://id.loc.gov/vocabulary/issuance/mono",
            "defaultLiteral": "single unit"
          }
        ]
      }
    },
    {
      "propertyLabel": "LITERAL WITH DEFAULT",
      "propertyURI": "http://id.loc.gov/ontologies/bibframe/heldBy",
      "resourceTemplates": [],
      "type": "literal",
      "valueConstraint": {
        "valueTemplateRefs": [],
        "useValuesFrom": [],
        "valueDataType": {
          "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Agent"
        },
        "defaults": [
          {
            "defaultURI": "http://id.loc.gov/vocabulary/organizations/dlc",
            "defaultLiteral": "DLC"
          }
        ]
      },
      "mandatory": "false",
      "repeatable": "true"
    }
  ]

  it('should handle the initial state', () => {
    expect(
      selectorReducer(undefined, {})
    ).toMatchObject(
      { "authenticate": {"loginJwt": {}},
        "generateLD": {"generateLD": {}},
        "lang": {"formData": []},
        "selectorReducer": {}
      }
    )
  })

  it('handles SET_RESOURCE_TEMPLATE', () => {
    expect(
      selectorReducer({"selectorReducer": {}}, {
        type: 'SET_RESOURCE_TEMPLATE',
        payload: {
          id: 'resourceTemplate:bf2:Monograph:Instance',
          propertyTemplates: pt
        }
      })
    ).toMatchObject(
      { "authenticate": {"loginJwt": {}},
        "generateLD": {"generateLD": {}},
        "lang": {"formData": []},
        "selectorReducer": { 'resourceTemplate:bf2:Monograph:Instance':
          { 'http://id.loc.gov/ontologies/bibframe/instanceOf': { 'resourceTemplate:bf2:Monograph:Work': {} },
            'http://id.loc.gov/ontologies/bibframe/issuance':
              { items:
                [ { id: {},
                  content: 'single unit',
                  uri: 'http://id.loc.gov/vocabulary/issuance/mono' } ] },
            'http://id.loc.gov/ontologies/bibframe/heldBy':
              { items:
                [ { id: {},
                  content: 'DLC',
                  uri: 'http://id.loc.gov/vocabulary/organizations/dlc' } ] } } }}
    )
  })

  it('passing a payload to an empty state', () => {
    const emptyStateResult = refreshResourceTemplate({}, {
      type:  'REFRESH_RESOURCE_TEMPLATE',
      payload: {
        reduxPath: ['http://sinopia.io/example']
      }
    })
    expect(emptyStateResult).toEqual({
      'http://sinopia.io/example': { items: [] }
    })

  })

  it(`missing reduxPath in payload should return the state`, () => {
    const missingPayload = refreshResourceTemplate({}, {
      type:  'REFRESH_RESOURCE_TEMPLATE',
      payload: {}
    })
    expect(missingPayload).toEqual({})
  })

  it('tests with a more realistic payload with defaults', () => {
    const defaultStateResult = refreshResourceTemplate({}, {
      type: 'REFRESH_RESOURCE_TEMPLATE',
      payload: {
        reduxPath: ['resourceTemplate:bf2:Item', 'http://schema.org/name'],
        defaults: ['Sinopia Name']
      }
    })
    expect(defaultStateResult).toEqual({
      'resourceTemplate:bf2:Item': {
        'http://schema.org/name':{
          items: [ "Sinopia Name" ]
        }
      }
    })
  })

})
