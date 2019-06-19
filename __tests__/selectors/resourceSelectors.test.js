// Copyright 2019 Stanford University see LICENSE for license

import {
  rootResourceId, getDisplayValidations, getResourceTemplate, getPropertyTemplate,
} from 'selectors/resourceSelectors'

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

describe('rootResourceId', () => {
  it('returns the uri', () => {
    initialState.selectorReducer.resource = {
      'profile:bf2:Work': {
        resourceURI: 'http://platform:8080/repository/stanford/1f14d358-a0c9-4e66-b7e8-7c6ae5475036',
      },
    }

    expect(rootResourceId(initialState)).toEqual('http://platform:8080/repository/stanford/1f14d358-a0c9-4e66-b7e8-7c6ae5475036')
  })
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
